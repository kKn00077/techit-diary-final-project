from flask import Blueprint, request, jsonify, session, render_template, redirect, url_for
from werkzeug.security import generate_password_hash
from models import db, User
from flask_login import login_user


auth_bp = Blueprint('auth', __name__)

# 회원가입 API
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        # 클라이언트로부터 데이터 받기
        email = request.json.get('email')
        password = request.json.get('password')
        password_confirm = request.json.get('password_confirm')

        # 필수 데이터 확인
        if not email or not password:
            return jsonify({"code":400, "body":{"error": {"message": "모든 필드를 입력해야 합니다."}}}), 400
        
        if password != password_confirm:
            return jsonify({"code": 400, "body": {"error": {"message": "비밀번호가 일치하지 않습니다."}}}), 400

        # 이미 존재하는 사용자 확인
        existing_user = User.query.filter(User.email == email).first()
        if existing_user:
            return jsonify({"code":409, "body":{"error": {"message": "이미 존재하는 사용자입니다."}}}), 409

        # 새로운 사용자 생성
        new_user = User(
            email=email,
            password=generate_password_hash(password)
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"code":201, "body":{"message": "회원가입이 성공적으로 완료되었습니다."}}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"code":500, "body":{"error": {"message": "회원가입 중 오류가 발생했습니다", "detail":f"{str(e)}"}}}), 500

# 로그인
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        error_code = request.args.get('error_code')
        error_message = None
    
    if error_code == '400':
            return jsonify({"code": 400, "body": {"error": {"message": "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요."}}}), 400

    else:  # POST 요청 처리
        email = request.form.get('email')
        password = request.form.get('password')

        # 사용자 조회
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):  
            login_user(user)
            session['user_email'] = user.email  
            session['user_id'] = user.id

            # 성공 응답
            return jsonify({"code": 200, "body": {"error": {"message": "로그인이 성공적으로 완료되었습니다."}}}), 200

        else:  
            # 실패 응답
            return jsonify({"code": 400, "body": {"error": {"message": "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요."}}}), 400
