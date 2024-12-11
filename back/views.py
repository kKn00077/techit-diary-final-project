from flask import render_template, request, redirect, url_for
from databases import db
import os

def setup_routes(app):

    @app.route('/')
    def index():
        return os.path.abspath(os.path.dirname('../db/'))