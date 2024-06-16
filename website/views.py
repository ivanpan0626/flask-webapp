from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note, Task
from . import db
import json

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    return render_template("home.html", user=current_user)

@views.route('/notes', methods=['GET', 'POST'])
@login_required
def notes():
    if request.method == 'POST':
        note = request.form.get('note')

        if len(note) < 1:
            flash('Note is too short!', category='error')
        else:
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("notes.html", user=current_user)

@views.route('/delete-note', methods=['POST'])
@login_required
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
    
    return jsonify({})

@views.route('/passwords', methods=['GET', 'POST'])
def keymanager():
    return render_template("passwords.html", user=current_user) 

@views.route('/tasks', methods=['GET', 'POST'])
@login_required
def tasks():
    return render_template("tasks.html", user=current_user)

@views.route('/add-tasks', methods=['POST'])
@login_required
def add_tasks():
    taskData = request.json['data']
    if len(taskData) < 1:
        pass
    else:
        new_task = Task(data=taskData, user_id=current_user.id)
        db.session.add(new_task)
        db.session.commit()

    return jsonify({})

@views.route('/get-tasks', methods=['GET'])
@login_required
def get_tasks():
    tasks = Task.query.all()
    
    # Create a list of tasks dictionaries
    tasks_list = [{
        'id': task.id,
        'data': task.data,
        'user_id': task.user_id
    } for task in tasks]
    
    # Return as JSON array
    return jsonify(tasks_list)

@views.route('/delete-tasks', methods=['POST'])
@login_required
def delete_tasks():
    taskId = request.json['taskId']
    task = Task.query.get(taskId)
    if task:
        if task.user_id == current_user.id:
            db.session.delete(task)
            db.session.commit()
    
    return jsonify({})