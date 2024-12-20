from flask import Blueprint, request, jsonify, render_template
from werkzeug.security import generate_password_hash
from models import db, User

auth_bp = Blueprint('auth', __name__, 
                    template_folder='templates')

# 회원가입 API
@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        # GET 요청 시 회원가입 폼 렌더링
        return render_template('signup.html')

    elif request.method == 'POST':
        try:
            # 클라이언트로부터 데이터 받기
            email = request.form.get('email')  # form 데이터에서 가져옴
            password = request.form.get('password')
            password_confirm = request.form.get('password_confirm')

            # 필수 데이터 확인
            if not email or not password:
                return jsonify({"code": 400, "body": {"error": {"message": "모든 필드를 입력해야 합니다."}}}), 400
            
            if password != password_confirm:
                return jsonify({"code": 400, "body": {"error": {"message": "비밀번호가 일치하지 않습니다."}}}), 400

            # 이미 존재하는 사용자 확인
            existing_user = User.query.filter(User.email == email).first()
            if existing_user:
                return jsonify({"code": 409, "body": {"error": {"message": "이미 존재하는 사용자입니다."}}}), 409

            # 새로운 사용자 생성
            new_user = User(
                email=email,
                password=generate_password_hash(password)
            )
            db.session.add(new_user)
            db.session.commit()

            return jsonify({"code": 201, "body": {"message": "회원가입이 성공적으로 완료되었습니다."}}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"code": 500, "body": {"error": {"message": "회원가입 중 오류가 발생했습니다", "detail": f"{str(e)}"}}}), 500
