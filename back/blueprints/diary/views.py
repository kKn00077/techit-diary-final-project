from flask import Blueprint, request, render_template, jsonify, redirect, url_for, session
from models import db, Diary, Emotion
import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from datetime import datetime, timedelta


# 블루프린트 정의 (템플릿 폴더 경로 추가)
diary_bp = Blueprint('diary', __name__, 
                    template_folder='templates',
                    static_folder='static',
                    static_url_path='/static')

@diary_bp.before_request
def mock_login():
    # 테스트용 로그인 상태 설정
    session['user_id'] = 1
    session['email'] = "test@test.com"

# 모델 로드
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
MODEL_PATH = os.path.join(ROOT_DIR, "ai_model", "best_model_093")
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model.eval()

# 라벨 디코딩 매핑
label_decoding = {
    0: '기쁨(Joy)', 1: '슬픔(Sadness)', 2: '화남(Anger)', 3: '까칠함(Disgust)',
    4: '두려움(Fear)', 5: '불안함(Anxiety)', 6: '부러움(Envy)', 7: '따분함(Ennui)',
    8: '당황함(Embarrassment)', 9: '추억(Nostalgia)', 10: '중립(Neutral)'
}

# 역매핑 생성: 감정 이름 -> ID
label_to_id = {v: k + 1 for k, v in label_decoding.items()}

def classify_emotion(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=512
    )
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_label = torch.argmax(logits, dim=-1).item()
    return label_decoding[predicted_label]


# 일기 생성 API
# GET: 폼 렌더링 / POST: 데이터 처리
@diary_bp.route('/create', methods=['GET', 'POST'])
def create_diary():
    if request.method == 'GET':
        return render_template('diary_form.html'), 200

    elif request.method == 'POST':
        try:
            # 제목과 내용을 폼 데이터에서 가져옴
            title = request.form.get('title', '').strip()
            contents = request.form.get('contents', '').strip()

            # 유효성 불일치(Error)
            if not title or not contents:
                return jsonify({"code": 400, "body": {"message": "제목 또는 내용이 없어요"}}), 400

            # 로그인 정보 없음(Error)
            if 'user_id' not in session:
                return jsonify({"code": 401, "body": {"message": "로그인 정보가 없어요"}}), 401

            # 감정 분석
            emotion = classify_emotion(f"{title} {contents}")
            emotion_id = label_to_id.get(emotion, 11)  # 디폴트값 : 중립(Neutral)

            # 데이터베이스 저장
            diary_entry = Diary(user_id=session['user_id'], emotion_id=emotion_id, title=title, contents=contents)
            db.session.add(diary_entry)
            db.session.commit()

            # 성공 응답
            return jsonify({
                "code": 201,
                "body": {
                    "message": "일기가 정상적으로 생성되었어요",
                    "diary": {
                        "id": diary_entry.id,
                        "title": diary_entry.title,
                        "contents": diary_entry.contents,
                        "emotion": emotion,
                        "emotion_id": emotion_id
                    }
                }
            }), 201
        
        except Exception as e:
            # 서버 에러(코드 수정으로 대응할 수 없는 에러)
            return jsonify({"code": 500, "body": {"message": f"예기치못한 에러가 발생했어요: {str(e)}"}}), 500


# 감정 점수
emotion_scores = {
    "기쁨(Joy)": 10,
    "추억(Nostalgia)": 7,
    "중립(Neutral)": 5,
    "따분함(Ennui)": 4,
    "당황함(Embarrassment)": 3,
    "부러움(Envy)": 3,
    "슬픔(Sadness)": 2,
    "불안함(Anxiety)": 2,
    "화남(Anger)": 2,
    "두려움(Fear)": 1,
    "까칠함(Disgust)": 1
}

def get_current_week_range():
    # 오늘 날짜
    today = datetime.now()
    # 오늘이 몇 번째 요일인지(월요일=0, 일요일=6)
    weekday = today.weekday()
    # 이번주의 월요일 날짜 계산
    monday = today - timedelta(days=weekday)
    # 이번주의 일요일 날짜 계산 (월요일 + 6일)
    sunday = monday + timedelta(days=6)
    return monday, sunday

# 주간 평균 감정 점수 API
@diary_bp.route('/score', methods=['GET'])
def get_weekly_scores():
    # 로그인 정보 없음(Error)
    if 'user_id' not in session:
        return jsonify({"code": 401, "body": {"message": "로그인 정보가 없어요"}}), 401

    # 이번 주 월~일 날짜 구하기
    monday, sunday = get_current_week_range()
    
    # DB에서 이번 주 해당 기간의 일기 조회
    diaries_this_week = (
        db.session.query(Diary, Emotion)
        .join(Emotion, Emotion.id == Diary.emotion_id)
        .filter(Diary.user_id == session['user_id'])
        .filter(Diary.created_at >= monday)
        .filter(Diary.created_at <= sunday)
        .all()
    )

    if not diaries_this_week:
        return jsonify({"code": 400, "body": {"message": "이번 주에 작성한 일기가 없어요"}}), 400

    scores_by_day = {i: [] for i in range(7)}
    counts_by_day = {i: 0 for i in range(7)}  # 요일별 일기 개수
    for diary, emotion in diaries_this_week:
        # emotion.id는 1부터 시작. label_decoding은 0부터 시작하므로 -1
        predicted_label = emotion.id - 1
        emotion_name = label_decoding[predicted_label]
        score = emotion_scores.get(emotion_name, 5)
        day_index = diary.created_at.weekday()
        scores_by_day[day_index].append(score)
        counts_by_day[day_index] += 1  # 일기 개수 증가
    
    weekday_labels = ["월", "화", "수", "목", "금", "토", "일"]
    avg_scores = []
    
    for i in range(7):
        if scores_by_day[i]:
            avg_score = sum(scores_by_day[i]) / len(scores_by_day[i])
        else:
            avg_score = 0
        avg_scores.append({
            "day": weekday_labels[i],
            "average_score": round(avg_score, 2),  # 소수점 2자리 반올림
            "count": counts_by_day[i]  # 해당 요일의 일기 개수
        })

    return jsonify({"code": 200, "body": {"message": "이번주 감정 점수", "body": avg_scores}}), 200


# 감정별 비율 API
@diary_bp.route('/distribution', methods=['GET'])
def get_emotion_distribution():
    # 로그인 정보 없음(Error)
    if 'user_id' not in session:
        return jsonify({"code": 401, "body": {"message": "로그인 정보가 없어요"}}), 401
    
    # 감정별 분포 데이터 가져오기
    emotion_counts = (
        db.session.query(Emotion.id, db.func.count(Diary.id))
        .join(Diary, Emotion.id == Diary.emotion_id)
        .filter(Diary.user_id == session['user_id'])
        .group_by(Emotion.id)
        .all()
    )
    
    if not emotion_counts:
        return jsonify({"code": 400, "body": {"message": "아직 일기가 없어요"}}), 400
    
    counts_map = {eid: c for eid, c in emotion_counts}
    ordered_emotions = [label_decoding[i] for i in sorted(label_decoding.keys())]
    total = sum(counts_map.values())
    
    distribution = []
    for i in sorted(label_decoding.keys()):
        emotion_id = i + 1  # id는 1부터 시작
        count = counts_map.get(emotion_id, 0)
        percentage = (count / total * 100) if total > 0 else 0
        distribution.append({
            "emotion": label_decoding[i],
            "percentage": round(percentage, 2),
            "count": count  # 해당 감정의 일기 개수
        })
    
    return jsonify({"code": 200, "body": {"message": "감정별 분포", "body": distribution}}), 200

# 차트 페이지 라우트
@diary_bp.route('/chart', methods=['GET'])
def weekly_chart():
    # 차트 표시할 HTML 템플릿 렌더링 (라인 차트 + 바 차트)
    return render_template('diary_chart.html'), 200