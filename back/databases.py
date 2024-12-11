import os
from flask_sqlalchemy import SQLAlchemy

# 현재있는 파일의 디렉토리 절대경로
basdir = os.path.abspath(os.path.dirname('../db/'))

# basdir 경로안에 DB파일 만들기
dbfile = os.path.join(basdir, 'techit-diary')

connection_string = 'sqlite:///' + dbfile

db = SQLAlchemy()