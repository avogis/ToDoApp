from __future__ import unicode_literals

from django.db import models


class Project(models.Model):
    project_text = models.CharField(max_length=200)


class Todo(models.Model):
    todo_text = models.CharField(max_length=200)
    complete = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, default=1)
