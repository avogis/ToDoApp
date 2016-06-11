from django import forms


class TodoForm(forms.Form):
    todo = forms.CharField(label='New Todo', max_length=100)
