from flask import Blueprint, request, jsonify, redirect, url_for
from werkzeug.security import generate_password_hash
from models import db, Users

auth_bp = Blueprint('auth', __name__)

# 회원가입 API
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        # 클라이언트로부터 데이터 받기
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

        # 필수 데이터 확인
        if not username or not email or not password:
            return jsonify({"error": "모든 필드를 입력해야 합니다."}), 400

        # 이미 존재하는 사용자 확인
        existing_user = Users.query.filter((Users.username == username) | (Users.email == email)).first()
        if existing_user:
            return jsonify({"error": "이미 존재하는 사용자입니다."}), 409

        # 새로운 사용자 생성
        new_user = Users(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "회원가입이 성공적으로 완료되었습니다."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"회원가입 중 오류가 발생했습니다: {str(e)}"}), 500
