from django.http import HttpResponse
from django.template import loader
from .forms import TodoForm
from django.shortcuts import render
from django.http import HttpResponseRedirect
import json

from .models import Todo


def index(request):
    todo_list = Todo.objects.all().order_by('-id')
    template = loader.get_template('index.html')
    context = {
        'todo_list': todo_list,
        'form': TodoForm
    }
    return HttpResponse(template.render(context, request))


def get_name(request):
    print('yolo')
    if request.method == 'POST':
        response_data = {}
        form = request.POST
        print(form['the_post'])
        todo = Todo(todo_text = form['the_post'])
        todo.save()
        response_data['result'] = 'Create post successful!'
        response_data['todo_text'] = todo.todo_text
        return HttpResponse(
            json.dumps(response_data),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )


