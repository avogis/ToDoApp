from django.http import HttpResponse
from django.template import loader
import json
from django.utils.html import escape

from .models import Todo, Project


def index(request):
    projects_list = Project.objects.all().order_by('-id')
    template = loader.get_template('index.html')
    context = {
        'projects_list': projects_list,
    }
    return HttpResponse(template.render(context, request))


def show_todos(request):
    if request.method == 'POST':
        project_id = request.POST['the_post']
        project = Project.objects.get(pk=project_id)
        todo_list = project.todo_set.filter(complete=False).order_by('-id')
        context = {
            'todo_list': todo_list,
            'project_id': project_id,
            'project_text': project.project_text
        }
        template = loader.get_template('all_todos.html')
        return HttpResponse(template.render(context, request))
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )


def show_completed(request):
    if request.method == 'POST':
        project_id = request.POST['the_post']
        project = Project.objects.get(pk=project_id)
        todo_completed_list = project.todo_set.filter(complete=True).order_by('-id')
        context = {
            'todo_completed_list': todo_completed_list,
        }
        template = loader.get_template('todos_completed.html')
        return HttpResponse(template.render(context, request))
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )



def add_new_todo(request):
    if request.method == 'POST':
        form = request.POST
        todo = Todo(todo_text=escape(form['text']), project_id=form['project_id'])
        todo.save()
        response_data = {'result': 'Create post successful!', 'todo_text': todo.todo_text, 'todo_id': todo.id}
        return HttpResponse(
            json.dumps(response_data),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )


def add_new_project(request):
    if request.method == 'POST':
        form = request.POST
        project = Project(project_text=escape(form['text']))
        project.save()
        response_data = {'result': 'Create post successful!', 'project_text': project.project_text, 'project_id': project.id}
        return HttpResponse(
            json.dumps(response_data),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )


def delete_todo(request):
    if request.method == 'POST':
        response_data = {}
        form = request.POST
        todo = Todo.objects.get(id=form['the_post'])
        todo.delete()
        return HttpResponse(
            json.dumps(response_data),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )


def delete_project(request):
    if request.method == 'POST':
        response_data = {}
        form = request.POST
        project = Project.objects.get(id=form['the_post'])
        project.delete()
        return HttpResponse(
            json.dumps(response_data),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )


def done_todo(request):
    if request.method == 'POST':
        respone_data = {}
        post = request.POST
        todo = Todo.objects.get(id=post['the_post'])
        todo.complete = True
        todo.save()
        return HttpResponse(
            json.dumps(respone_data),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )

