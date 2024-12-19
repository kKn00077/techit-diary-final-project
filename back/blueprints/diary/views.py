from flask import Blueprint, request, render_template, jsonify, redirect, url_for, session
from models import db, Diary, Emotion
import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from datetime import datetime, timedelta
from openai import OpenAI


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
MODEL_PATH = os.path.join(ROOT_DIR, "ai_model", "best_model_067")
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

# OpenAI API 키 설정 (실제키는 디스코드 1조 참조)
client = OpenAI(api_key = "YOUR-OPENAI-API-KEY")

# OpenAI API를 사용한 태그 생성 함수
def extract_tags(text):
    try:
        # chat.completion API 호출
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # 지원 가능한 모델 (gpt-4, gpt-4o, gpt-4o-mini, gpt-3.5-turbo)
            messages=[
                {
                    "role": "user", 
                    "content": f"Extract up to 3 concise hashtags that best describe the following text: '{text}'"}
            ],
            max_tokens=50  # 응답의 최대 토큰 수
        )
        # 응답에서 태그 추출
        tags = response.choices[0].message.content.strip().split(", ")
        return [tag.strip() for tag in tags if tag]  # 태그 리스트 반환
    except Exception as e:
        # 에러 발생 시 기본 태그 반환
        return ["#Today", "#I", "#Feel"]

# OpenAI API를 사용한 조언 생성 함수
def generate_advice(text):
    try:
        # chat.completion API 호출
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # 지원 가능한 모델 (gpt-4, gpt-4o, gpt-4o-mini, gpt-3.5-turbo)
            messages=[
                {"role": "system", "content": "당신은 지혜롭고 친절한 심리치료사입니다. 50자 이내로 한국어로 조언을 제공하세요."},
                {"role": "user", "content": f"이 상황에 대한 조언을 짧게 해주세요: '{text}'"}
            ],
            max_tokens=50  # 응답의 최대 토큰 수
        )
        # 조언 추출 및 길이 제한
        advice = response.choices[0].message.content.strip()
        return advice[:100]  # 최대 100자까지 반환
    except Exception as e:
        # 에러 발생 시 기본 조언 반환
        return "Today I Feel."


# 모든 일기 리스트 반환
@diary_bp.route('/list', methods=['GET'])
def get_diary_list():
    diaries = Diary.query.all()
    diary_list = [{"id": diary.id, "title": diary.title, "contents": diary.contents, "created_at": diary.created_at} for diary in diaries]
    return jsonify({"code": 200, "boay":{"diaries": diary_list}}), 200

# 특정 일기 반환 (ID로 조회)
@diary_bp.route('/<int:diary_id>', methods=['GET'])
def get_diary_by_id(diary_id):
    if (diary := Diary.query.get(diary_id)):
        return jsonify({"code": 200, "body": {"id": diary.id, "title": diary.title, "contents": diary.contents, "created_at": diary.created_at}}), 200
    return jsonify({"code": 404, "body":{"error": {"message":"일기를 찾을 수 없습니다."}}}), 404


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
                return jsonify({"code": 400, "body": {"error": {"message": "제목 또는 내용이 없어요"}}}), 400

            # 로그인 정보 없음(Error)
            if 'user_id' not in session:
                return jsonify({"code": 401, "body": {"error": {"message": "로그인 정보가 없어요"}}}), 401

            # 감정 분석
            emotion = classify_emotion(f"{title} {contents}")
            emotion_id = label_to_id.get(emotion, 11)  # 디폴트값 : 중립(Neutral)

            # 태그 추출
            combined_text = f"{title} {contents}"
            tags = extract_tags(combined_text)
            tags_str = ", ".join(tags)  # 리스트를 문자열로 변환

            # 조언 생성(100자 제한)
            advice = generate_advice(combined_text)

            # 데이터베이스 저장
            diary_entry = Diary(user_id=session['user_id'], 
                                emotion_id=emotion_id, 
                                title=title, 
                                contents=contents,
                                tags=tags_str, #변환된 문자열 사용
                                advice=advice)
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
                        "emotion_id": emotion_id,
                        "tags" : tags_str.split(", "),  # 다시 리스트로 변환
                        "advice" : advice
                    }
                }
            }), 201
        
        except Exception as e:
            # 서버 에러(코드 수정으로 대응할 수 없는 에러)
            return jsonify({"code": 500, "body": {"error": {"message": f"예기치못한 에러가 발생했어요: {str(e)}"}}}), 500


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
        return jsonify({"code": 401, "body": {"error": {"message": "로그인 정보가 없어요"}}}), 401

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
        return jsonify({"code": 400, "body": {"error": {"message": "이번 주에 작성한 일기가 없어요"}}}), 400

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

    return jsonify({"code": 200, "body": {"message": "이번주 감정 점수", "data": avg_scores}}), 200


# 감정별 비율 API
@diary_bp.route('/distribution', methods=['GET'])
def get_emotion_distribution():
    # 로그인 정보 없음(Error)
    if 'user_id' not in session:
        return jsonify({"code": 401, "body": {"error": {"message": "로그인 정보가 없어요"}}}), 401
    
    # 감정별 분포 데이터 가져오기
    emotion_counts = (
        db.session.query(Emotion.id, db.func.count(Diary.id))
        .join(Diary, Emotion.id == Diary.emotion_id)
        .filter(Diary.user_id == session['user_id'])
        .group_by(Emotion.id)
        .all()
    )
    
    if not emotion_counts:
        return jsonify({"code": 400, "body": {"error": {"message": "아직 일기가 없어요"}}}), 400
    
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
    
    return jsonify({"code": 200, "body": {"message": "감정별 분포", "data": distribution}}), 200

# 차트 페이지 라우트
@diary_bp.route('/chart', methods=['GET'])
def weekly_chart():
    # 로그인 정보 없음(Error)
    if 'user_id' not in session:
        return jsonify({"code": 401, "body": {"error": {"message": "로그인 정보가 없어요"}}}), 401

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
        return render_template('diary_chart.html', average_score=0)

    # 평균 점수 계산
    total_score = 0
    total_entries = len(diaries_this_week)
    for diary, emotion in diaries_this_week:
        predicted_label = emotion.id - 1
        emotion_name = label_decoding[predicted_label]
        score = emotion_scores.get(emotion_name, 5)
        total_score += score

    average_score = round(total_score / total_entries, 2)

    return render_template('diary_chart.html', average_score=average_score)