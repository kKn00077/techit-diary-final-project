import { defineComponent, onMounted, ref, watch, watchEffect } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default defineComponent({
	props: {
		type: {
			type: String,
			required: true
		},
		labels: {
			type: Array,
			required: true,
			default: () => []
		},
		data: {
			type: Array,
			required: true
		},
		counts: {
			type: Array,
			required: false,
			default: () => []
		},
		options: {
			type: Object,
			required: false,
			default: () => ({})
		}
	},
	setup(props) {
		const chartRef = ref(null)
		let chartInstance = null

		const getEmotionKey = (label) => {
			const match = label.match(/\((.*?)\)/)
			return match ? match[1] : ''
		}

		// 모든 이미지를 사전에 로드
		const preloadedImages = {}
		for (const label of props.labels) {
			const emotionKey = getEmotionKey(label)
			const svgSrc = `/src/assets/emogi/${emotionKey}.svg`

			const img = new Image()
			img.src = svgSrc

			preloadedImages[emotionKey] = img
		}

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			layout: {
				padding: {
					// bar 차트일 경우에만 여백 추가
					bottom: props.type === 'bar' ? 40 : 0
				}
			},
			scales: {
				...props.options.scales,
				x: {
					...props.options.scales?.x,
					ticks: {
						...props.options.scales?.x?.ticks,
						font: {
							family: "'Gowun Dodum', sans-serif",
							size: 16
						},
						color: 'rgba(75, 75, 75, 1)' // 텍스트 색상
					}
				},
				y: {
					...props.options.scales?.y,
					ticks: {
						...props.options.scales?.y?.ticks,
						font: {
							family: "'Gowun Dodum', sans-serif"
						},
						color: 'rgba(75, 75, 75, 1)' // 텍스트 색상
					}
				}
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: (context) => {
							const index = context.dataIndex
							const score = context.raw.toFixed(2)
							const count = props.counts[index] || 0
							return props.type === 'line'
								? `평균 점수: ${score} (일기 ${count}개)`
								: `${score}% (${count}개)`
						}
					},
					titleFont: {
						family: "'Gowun Dodum', sans-serif",
						size: 14,
						weight: 'bold'
					},
					bodyFont: {
						family: "'Gowun Dodum', sans-serif",
						size: 12
					}
				},
				legend: {
					display: props.options.plugins?.legend?.display || false,
					labels: {
						font: {
							family: "'Gowun Dodum', sans-serif",
							size: 16
						},
						color: 'rgba(75, 75, 75, 1)'
					}
				}
			}
		}

		const createChart = () => {
			if (!chartRef.value) {
				console.error('chartRef가 초기화되지 않았습니다.')
				return
			}

			if (chartInstance) {
				chartInstance.destroy() // 기존 차트를 제거
			}
			const ctx = chartRef.value.getContext('2d')
			chartInstance = new Chart(ctx, {
				type: props.type,
				data: {
					labels: props.labels,
					datasets: [
						{
							label: props.type === 'line' ? '감정 점수' : '감정 분포 (%)',
							data: props.data,
							borderColor:
								props.type === 'line'
									? 'rgba(54, 162, 235, 1)'
									: 'rgba(75,192,192,1)',
							backgroundColor:
								props.type === 'line'
									? 'rgba(54, 162, 235, 0.2)'
									: 'rgba(75,192,192,0.5)',
							borderWidth: 2,
							tension: props.type === 'line' ? 0.1 : undefined,
							fill: props.type === 'line',
							pointRadius: props.type === 'line' ? 6 : undefined,
							pointHoverRadius: props.type === 'line' ? 18 : undefined
						}
					]
				},
				options: chartOptions,
				plugins: [
					{
						id: 'xAxisImagePlugin',
						afterDatasetsDraw(chart) {
							if (props.type !== 'bar') {
								return
							}
							const xAxis = chart.scales.x
							const ctx = chart.ctx
							xAxis.ticks.forEach((tick, index) => {
								const label = chart.data.labels[index]
								if (!label) {
									return
								}

								const emotionKey = getEmotionKey(label)
								const img = preloadedImages[emotionKey]
								if (!img) {
									return
								}

								const x = xAxis.getPixelForTick(index)
								const y = xAxis.bottom
								const imgSize = 40

								ctx.save()
								ctx.drawImage(img, x - imgSize / 2, y, imgSize, imgSize)
								ctx.restore()

								img.onerror = () => {
									console.warn(`이미지를 로드할 수 없습니다: ${svgSrc}`)
								}
							})
						}
					}
				]
			})
		}

		watchEffect(() => {
			if (!chartRef.value) {
				// chartRef가 null이면 렌더링이 끝나지 않은 상태
				return
			}

			console.log(
				'Chart creation triggered with labels:',
				props.labels,
				'and data:',
				props.data
			)
			createChart() // chartRef와 props를 감지해 차트를 업데이트
		})

		return () => <canvas ref={chartRef} style="height: 400px; width: 100%;" />
	}
})
