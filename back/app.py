from flask import Flask
from databases import connection_string, db
from login import login_manager
from blueprints.diary import diary_bp
from blueprints.auth.views import auth_bp
from views import setup_routes
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)  # 모든 도메인에서 모든 요청 허용

# DataBase 연결 URI
app.config['SQLALCHEMY_DATABASE_URI'] = connection_string

# 비지니스 로직이 끝날때 Commit 실행(DB반영)
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True

app.config['SECRET_KEY'] = 'M"Z*JS?AVkxKH=8T'

db.init_app(app)

login_manager.init_app(app)

# app.register_blueprint(auth, url_prefix='/auth')
# app.register_blueprint(diary, url_prefix='/diary')
app.register_blueprint(diary_bp, url_prefix='/diary')
app.register_blueprint(auth_bp, url_prefix='/auth')


with app.app_context():
    import models
    db.create_all()


setup_routes(app)