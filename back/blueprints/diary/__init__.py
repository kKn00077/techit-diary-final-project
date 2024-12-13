from flask import Blueprint
from .views import diary_bp  # views.py에서 블루프린트를 가져옴

diary = diary_bp  # 블루프린트를 외부에 노출
