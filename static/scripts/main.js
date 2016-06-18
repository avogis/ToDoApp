$(function() {

    $(document).on('keyup', 'input[type=text]', function(event){
        if ($(this).val().length !== 0){
            $('input[type=submit]').removeAttr('disabled');
        }else{
            $('input[type=submit]').attr('disabled', 'disabled');
        }
    });

    $(document).on('click', '.project_button', function(event){
        event.preventDefault();
        show_todos($(this).attr('data-item-id'));
    });

    function show_todos(id){
        $.ajax({
            url : "show_todos/",
            type : "POST",
            data : { the_post : id },
            success : function(json) {
                $('#main').html(json);
            },
            error : function(xhr,errmsg,err) {
                $('#results').html("<div>An error!!!: "+errmsg+"</div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    };

    $(document).on('click', '.delete_button', function(event){
        event.preventDefault();
        delete_todo($(this).attr('data-item-id'));
    });


    function delete_todo(id) {
        $.ajax({
            url : "delete_todo/",
            type : "POST",
            data : { the_post : id },
            success : function(json) {
                $('li.todo_item[data-item-id='+id+']').remove();
            },
            error : function(xhr,errmsg,err) {
                $('#results').html("<div>An error!!!: "+errmsg+"</div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    };

    $(document).on('click', '.delete_project_button', function(event){
        event.preventDefault();
        delete_project($(this).attr('data-item-id'));
    });

    function delete_project(id) {
        $.ajax({
            url : "delete_project/",
            type : "POST",
            data : { the_post : id },
            success : function(json) {
                $('#main').html('');
                $('li.project[data-item-id='+id+']').remove();

            },
            error : function(xhr,errmsg,err) {
                $('#results').html("<div>An error!!!: "+errmsg+"</div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    };


    $(document).on('click', '.done_button', function(event){
        event.preventDefault();
        done_todo($(this).attr('data-item-id'));
    });

    function done_todo(id){
        $.ajax({
            url : "done_todo/",
            type : "POST",
            data : { the_post : id },
            success : function(json) {
                $('li.todo_item[data-item-id='+id+']').addClass('True').removeClass('False');
                $('button.done_button[data-item-id='+id+']').hide();
            },
            error : function(xhr,errmsg,err) {
                $('#results').html("<div>An error!!!: "+errmsg+"</div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    };

    $(document).on('submit', '#new_todo_form', function(event){
        event.preventDefault();
        create_new_todo();
    });


    function create_new_todo() {
        $.ajax({
            url : "add_new_todo/",
            type : "POST",
            data : { text : $('#id_todo').val(),  project_id: $('#id_todo').attr('data-item-id')},
            success : function(json) {
                $('#id_todo').val('');
                $("#todos").prepend("<li data-item-id="+json.todo_id+" class=todo_item >"+json.todo_text+
                "<button data-item-id="+json.todo_id+" class=done_button>Done</button>"+
                "<button data-item-id="+json.todo_id+" class=delete_button>Delete</button></li>");
            },
            error : function(xhr,errmsg,err) {
                $('#results').html("<div>An error!!!: "+errmsg+"</div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    };

    $(document).on('submit', '#new_project_form', function(event){
        event.preventDefault();
        create_new_project();
    });


    function create_new_project() {
        $.ajax({
            url : "add_new_project/",
            type : "POST",
            data : { text : $('#id_project').val()},
            success : function(json) {
                $('#id_project').val('');
                $("#all_projects").prepend("<li class=project data-item-id="+json.project_id+"> <button data-item-id="+json.project_id+" class=project_button>"+json.project_text+"</button></li>");
            },
            error : function(xhr,errmsg,err) {
                $('#results').html("<div>An error!!!: "+errmsg+"</div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    };


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});