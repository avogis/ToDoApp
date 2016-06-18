from django.conf import settings
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^add_new_todo/$', views.add_new_todo, name='add_new_todo'),
    url(r'^delete_todo/$', views.delete_todo, name='delete_todo'),
    url(r'^done_todo/$', views.done_todo, name='done_todo'),
    url(r'^show_todos/$', views.show_todos, name='show_todos'),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.STATIC_ROOT, 'show_indexes': True}),
]
