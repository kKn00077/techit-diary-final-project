from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func
from databases import db

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    
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

    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    emotion_id = db.Column(db.Integer, db.ForeignKey('emotions.id'), nullable=False)
    
    user = db.relationship('User', backref='diaries')  # `diaries`로 역참조
    emotion = db.relationship('Emotion', backref='diaries')  # `diaries`로 역참조
    

class Emotion(db.Model):
    __tablename__ = 'emotions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(5), nullable=False)
    icon = db.Column(db.String(15), nullable=False)

    diaries = db.relationship('Diary', backref='emotion', cascade="all, delete-orphan")  # `emotion`으로 역참조
