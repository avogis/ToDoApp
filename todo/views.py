from django.http import HttpResponse
from django.template import loader

from .models import Todo


def index(request):
    todo_list = Todo.objects.all()
    template = loader.get_template('index.html')
    context = {
        'todo_list': todo_list
    }
    return HttpResponse(template.render(context, request))


def new_todo(request):
    todo_list = Todo.objects.all()
    template = loader.get_template('index.html')
    context = {
        'todo_list': todo_list,
    }
    todo = Todo(todo_text=request.POST['new_todo'])
    todo.save()
    return HttpResponse(template.render(context, request))