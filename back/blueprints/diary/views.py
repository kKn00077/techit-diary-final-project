from flask import Blueprint, request, render_template, jsonify, redirect, url_for, session
from models import db, Diary, Emotion
import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# 블루프린트 정의 (템플릿 폴더 경로 추가)
diary_bp = Blueprint('diary', __name__, template_folder='templates')

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

# GET: 폼 렌더링 / POST: 데이터 처리
@diary_bp.route('/create', methods=['GET', 'POST'])
def create_diary():
    # 테스트용 로그인 상태 설정
    session['user_id'] = 1  # 테스트용 사용자 ID
    session['email'] = "test@test.com"  # 테스트용 사용자 이메일

    if request.method == 'GET':
        return render_template('diary_form.html'), 200

    elif request.method == 'POST':
        try:
            # 제목과 내용을 폼 데이터에서 가져옴
            title = request.form.get('title', '').strip()
            contents = request.form.get('contents', '').strip()

            # 유효성 불일치(Error)
            if not title or not contents:
                return jsonify({
                    "code": 400,
                    "body": {
                        "message": "제목 또는 내용이 없어요"
                    }
                }), 400

            # 로그인 정보 없음(Error)
            if 'user_id' not in session:
                return jsonify({
                    "code": 401,
                    "body": {
                        "message": "로그인 정보가 없어요"
                    }
                }), 401

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
            return jsonify({
                "code": 500,
                "body": {
                    "message": f"예기치못한 에러가 발생했어요: {str(e)}"
                }
            }), 500