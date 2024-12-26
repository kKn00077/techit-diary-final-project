from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func
from sqlalchemy import event
from databases import db
from datetime import datetime
import pytz

# KST를 반환하는 함수 추가
def kst_now():
    now = datetime.now(pytz.timezone('Asia/Seoul'))
    return now.replace(microsecond=0)

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=kst_now)
    updated_at = db.Column(db.DateTime, nullable=False, default=kst_now, onupdate=kst_now)
    
    diaries = db.relationship('Diary', backref='user', cascade="all, delete-orphan")  # `user`로 역참조
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    

class Diary(db.Model):
    __tablename__ = 'diaries'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    contents = db.Column(db.String(1000), nullable=False)

    created_at = db.Column(db.DateTime, nullable=False, default=kst_now)
    updated_at = db.Column(db.DateTime, nullable=False, default=kst_now, onupdate=kst_now)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    emotion_id = db.Column(db.Integer, db.ForeignKey('emotions.id'), nullable=False)

    tags = db.Column(db.Text, nullable=True)  # 추가
    advice = db.Column(db.Text, nullable=True) # 추가

class Emotion(db.Model):
    __tablename__ = 'emotions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(5), nullable=False)
    icon = db.Column(db.String(15), nullable=False)

    diaries = db.relationship('Diary', backref='emotion', cascade="all, delete-orphan")  # `motion`으로 역참조

