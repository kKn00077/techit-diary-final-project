from flask import Blueprint, jsonify, request
from models import db

# Blueprint 설정
diary_bp = Blueprint('diary', __name__)

# 샘플 데이터베이스 모델 정의
class Diary(db.Model):
    __tablename__ = 'diaries'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(10), nullable=False)

# 모든 일기 리스트 반환
@diary_bp.route('/list', methods=['GET'])
def get_diary_list():
    diaries = Diary.query.all()
    diary_list = [{"id": diary.id, "title": diary.title, "content": diary.content, "date": diary.date} for diary in diaries]
    return jsonify({"diaries": diary_list}), 200

# 특정 일기 반환 (ID로 조회)
@diary_bp.route('/<int:diary_id>', methods=['GET'])
def get_diary_by_id(diary_id):
    diary = Diary.query.get(diary_id)
    if diary:
        return jsonify({"id": diary.id, "title": diary.title, "content": diary.content, "date": diary.date}), 200
    return jsonify({"error": "일기를 찾을 수 없습니다."}), 404

# 새 일기 추가
@diary_bp.route('/add', methods=['POST'])
def add_diary():
    data = request.get_json()
    if "title" in data and "content" in data and "date" in data:
        new_diary = Diary(title=data["title"], content=data["content"], date=data["date"])
        db.session.add(new_diary)
        db.session.commit()
        return jsonify({"id": new_diary.id, "title": new_diary.title, "content": new_diary.content, "date": new_diary.date}), 201
    return jsonify({"error": "유효하지 않은 데이터입니다."}), 400
