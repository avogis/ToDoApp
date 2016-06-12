$(function() {


    $('#id_todo').on('keyup', function(event){
        if ($(this).val().length !== 0){
            $('input[type=submit]').removeAttr('disabled');
        }else{
            $('input[type=submit]').attr('disabled', 'disabled');
        }
    });

    $(document).on('click', '.delete_button', function(event){
        event.preventDefault();
        delete_todo($(this).attr('data-item-id'));
    });


    function delete_todo(id) {
        $("#no_todo").text("");
        $.ajax({
            url : "delete_todo/", // the endpoint
            type : "POST", // http method
            data : { the_post : id }, // data sent with the post request
            // handle a successful response
            success : function(json) {
                $('li.todo_item[data-item-id='+id+']').remove()
            },
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    };


    // Submit post on submit
    $('#get_name').on('submit', function(event){
        event.preventDefault();
        create_post();
    });

    // AJAX for posting
    function create_post() {
        $.ajax({
            url : "get_name/", // the endpoint
            type : "POST", // http method
            data : { the_post : $('#id_todo').val() }, // data sent with the post request
            // handle a successful response
            success : function(json) {
                $('#id_todo').val(''); // remove the value from the input
                $("#todos").prepend("<li data-item-id="+json.todo_id+" class=todo_item >"+json.todo_text+"<button data-item-id="+json.todo_id+" class=delete_button>delete</button></li>");
            },
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
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