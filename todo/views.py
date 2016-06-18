from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import loader
from .forms import TodoForm
import json

from .models import Todo, Project


def index(request):
    projects_list = Project.objects.all()
    todo_list = Todo.objects.all().order_by('-id')
    template = loader.get_template('index.html')
    context = {
        'projects_list': projects_list,
        # 'todo_list': todo_list,
        # 'form': TodoForm
    }
    return HttpResponse(template.render(context, request))


def show_todos(request):
    if request.method == 'POST':
        project_id = request.POST['the_post']
        project = Project.objects.get(pk=project_id)
        todo_list = project.todo_set.all()
        response_data = {}
        #todo_list = [ob.as_json() for ob in all_todos]
        response_data['todo_list'] = todo_list
        projects_list = Project.objects.all()
        context = {
            'todo_list': todo_list,
            'form': TodoForm
        }
        template = loader.get_template('all_todos.html')
        return HttpResponse(template.render(context, request))


def add_new_todo(request):
    if request.method == 'POST':
        form = request.POST
        todo = Todo(todo_text=form['the_post'])
        todo.save()
        response_data = {}
        response_data['result'] = 'Create post successful!'
        response_data['todo_text'] = todo.todo_text
        response_data['todo_id'] = todo.id
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


def done_todo(request):
    print("here??")
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