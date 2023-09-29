
//Using IIFE to maintain scope
(() => {


    // =========EVENT HANDLERS================

    //to open feedback form
    function openFeedbackFormHandler(event) {
        renderFeedbackForm(event.target.id);
    }

    //to render the form on the DOM
    function renderFeedbackForm(id) {
        $(".form-container").css("height", "60vh");

        let username = $(`#username-${id}`).text();

        $("#username").text(username);

        $(".submit-feedback").attr({
            "method": "post",
            "action": `/reviews/update/${id}`
        });
        $(".submit-feedback>textarea").val("");


    }

    //to close the feedback form 
    function closeFeedbackFormHandler() {
        $(".form-container").css("height", "0vh");
    }



    //  =========EVENT LISTENERS===========
    //even listener to open the feedback form
    $(".open-feedback-form").on("click", openFeedbackFormHandler);

    //even listener to close the feedback form
    $("#close-form-btn").click(closeFeedbackFormHandler);


})()