/* Javascript for BadgerXBlock. */
function BadgerXBlock(runtime, element, data) {

    var user = data.user
    var my_url = '/api/grades/v0/course_grade/' + data.course_id + '/users/?username=' + user
    var section_title = data.section_title;
    var pass_mark = data.pass_mark;
    var award_message = data.award_message;
    var motivation_message = data.motivation_message;
    var handlerUrl = runtime.handlerUrl(element, 'new_award_badge');
    var noAwardUrl = runtime.handlerUrl(element, 'no_award_received');

    function getGrades(data) {
        var section_scores = data['section_scores'];
        if (section_scores.hasOwnProperty(section_title)) {
            var this_section = section_scores[String(section_title)];
            var section_title_id = '#' + section_title
            if ( parseFloat(this_section) >= pass_mark) {
                $.ajax({
                    type: "POST",
                    url: handlerUrl,
                    data:JSON.stringify({"name": "badger"}),
                    success: function(json) {
                            location.reload();
                    },
                    error : function(xhr,errmsg,err) {
                        $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                        " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                    }
                });
            }
            else {
                $.ajax({
                type: "POST",
                url: noAwardUrl,
                data:JSON.stringify({"name": "badger"}),
                success: function(json) {
                    $('.badge-loader').hide();
                    $('#lean_overlay').hide();
                    var $motivation = $('<p class="badger-motivation">' 
                    + motivation_message + '</p>' );
                    $('.badger_block').append($motivation);
                    $('#check-for-badge').remove();
                    }
                });
            }
        } else {
            $('.badge-loader').hide();
            $('#lean_overlay').hide();
            alert('The modlue named ' + '"'+ section_title + '"' + ' does not exist in the Grades Report! Please check you have specified the correct module name for this badge.')
        }
    }



    $('#check-for-badge').click(function(event) {
        event.preventDefault();
        event.stopImmediatePropagation()
        $('#lean_overlay').show();
        $('.badge-loader').show();
        $.ajax({
            type: "GET",
            url: my_url,
            // data: JSON.stringify({"username": user}),
            success: getGrades
        });
    });

}
