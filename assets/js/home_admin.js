//Using IIFE to maintain scope
(() => {
    // calling function on script load
    onLoad();

    // ==============ON LOAD=============
    function onLoad() {
        $.ajax({
            type: "get",
            url: "/reviews",
            success: function (response) {
                //for pending reviews
                renderPendingReviews(response.data);
                //for submitted reviews
                renderReviews(response.data);
            }
        });
    }


    //function to render the pending reviews on DOM
    function renderPendingReviews(reviewsArray) {
        const pendingReviews = reviewsArray.filter((review) => {
            return !review.isSubmitted;
        });

        pendingReviews.forEach((review) => {

            let pendingReviewContainer = $("<div>").addClass("pending-review item-hover").attr("id", `pending-review-container-${review._id}`);
            let innerDiv = $("<div>")
            let revieweeName = $("<p>").text("Recipient: ");
            let revieweeNameSpan = $("<span>").text(review.reviewee.name);
            let reviewerName = $("<p>").text("Reviewer: ");
            let reviewerNameSpan = $("<span>").text(review.reviewer.name);
            let deleteBtn = $("<img>").attr("src", "images/icons/close-white.png").addClass("delete-pending-review").attr("id", review._id);

            revieweeName.append(revieweeNameSpan);
            reviewerName.append(reviewerNameSpan);
            innerDiv.append(revieweeName, reviewerName);
            pendingReviewContainer.append(innerDiv, deleteBtn);

            $(".pending-reviews").prepend(pendingReviewContainer);
        });
    }


    //function to render reviews on DOM
    function renderReviews(reviewsArray) {
        const reviews = reviewsArray.filter((review) => {
            return review.isSubmitted;
        });


        reviews.forEach((review) => {

            let reviewContainer = $("<div>").addClass("review").attr("id", `review-container-${review._id}`);
            let innerInnerDiv = $("<div>");
            let innerDiv = $("<div>");
            let revieweeName = $("<p>").text("Recipient: ");
            let revieweeNameSpan = $("<span>").text(review.reviewee.name);
            let reviewerName = $("<p>").text("Reviewer: ");
            let reviewerNameSpan = $("<span>").text(review.reviewer.name);
            let editExpandContainer = $("<div>").addClass("edit-expand-container");
            let expandBtn = $("<img>").attr("src", "images/icons/expand-white.png").addClass("expand-review item-hover").attr("id", review._id);
            let editBtn = $("<img>").attr("src", "images/icons/edit-white.png").attr("id", review._id).addClass("edit-review-btn item-hover");
            let feedback = $("<div>").addClass("feedback").text(review.feedback).attr("id", `feedback-${review._id}`);

            revieweeName.append(revieweeNameSpan);
            reviewerName.append(reviewerNameSpan);
            innerInnerDiv.append(revieweeName, reviewerName);
            editExpandContainer.append(expandBtn, editBtn);
            innerDiv.append(innerInnerDiv, editExpandContainer);

            reviewContainer.append(innerDiv, feedback);
            $(".reviews").prepend(reviewContainer);
        });
    }


    // =================TO CREATE==================
    function createReview(data) {
        $.ajax({
            type: "post",
            url: "/reviews/create",
            data: data,
            success: function (response) {
                //checking that the review is pending ir not
                if (response.data.isSubmitted) {
                    renderReview(response.data);
                    //to notify the user
                    toastr.success("Review submitted successfully");
                } else {
                    //to notify the user
                    toastr.success("Review assigned successfully");
                    renderPendingReview(response.data);
                }
            },
            error: function (error) {
                //to notify the user
                toastr.error("Unable to Submit/Assign Review");
            }
        });

    }

    //to render newly assigned review on DOM
    function renderPendingReview(review) {
        let pendingReviewContainer = $("<div>").addClass("pending-review item-hover").attr("id", `pending-review-container-${review._id}`);
        let innerDiv = $("<div>");
        let revieweeName = $("<p>").text("Recipient: ");
        let revieweeNameSpan = $("<span>").text(review.reviewee.name);
        let reviewerName = $("<p>").text("Reviewer: ");
        let reviewerNameSpan = $("<span>").text(review.reviewer.name);
        let deleteBtn = $("<img>").attr("src", "images/icons/close-white.png").addClass("delete-pending-review").attr("id", review._id);

        revieweeName.append(revieweeNameSpan);
        reviewerName.append(reviewerNameSpan);
        innerDiv.append(revieweeName, reviewerName);
        pendingReviewContainer.append(innerDiv, deleteBtn);

        $(".pending-reviews").prepend(pendingReviewContainer);
    }



    //to render newly made review on DOM
    function renderReview(review) {
        let reviewContainer = $("<div>").addClass("review").attr("id", `review-container-${review._id}`);
        let innerInnerDiv = $("<div>");
        let innerDiv = $("<div>");
        let revieweeName = $("<p>").text("Recipient: ");
        let revieweeNameSpan = $("<span>").text(review.reviewee.name);
        let reviewerName = $("<p>").text("Reviewer: ");
        let reviewerNameSpan = $("<span>").text(review.reviewer.name);
        let editExpandContainer = $("<div>").addClass("edit-expand-container");
        let expandBtn = $("<img>").attr("src", "images/icons/expand-white.png").addClass("expand-review item-hover").attr("id", review._id);
        let editBtn = $("<img>").attr("src", "images/icons/edit-white.png").attr("id", review._id).addClass("edit-review-btn item-hover");
        let feedback = $("<div>").addClass("feedback").text(review.feedback).attr("id", `feedback-${review._id}`);

        revieweeName.append(revieweeNameSpan);
        reviewerName.append(reviewerNameSpan);
        innerInnerDiv.append(revieweeName, reviewerName);
        editExpandContainer.append(expandBtn, editBtn);
        innerDiv.append(innerInnerDiv, editExpandContainer);

        reviewContainer.append(innerDiv, feedback);

        $(".reviews").prepend(reviewContainer);
    }




    // ==============TO DELETE===============

    //function to delete pending reviews
    function toDestroy(id) {
        $.ajax({
            type: "get",
            url: `/reviews/destroy/${id}`,
            success: function (response) {
                //to remove the pending review from DOM
                $(`#pending-review-container-${response.id}`).remove();
                //to notify the user
                toastr.success("Review deleted successfully");
            },
            error: (error) => {
                //to notify the user
                toastr.error("Unable to delete review");
            }
        });
    }


    // ===================EVENT HANDLERS==================

    //to open and close the assign review from
    function onOpenReviewFormHandler() {
        if ($(".assign-review-form-container").height() == 0) {
            $("#open-assign-review-form").css("rotate", "45deg");
            $(".assign-review-form-container").css("height", "30%");
            $(".assign-review-form-container").css("border", "2px solid var(--borderColor)");
            $(".pending-reviews-container").css("height", "57%");
        } else {
            $("#open-assign-review-form").css("rotate", "0deg");
            $(".assign-review-form-container").css("height", "0%");
            $(".assign-review-form-container").css("border", "none");
            $(".pending-reviews-container").css("height", "87%");
        }
    }

    //to assign a review to employee
    function assignReviewFormHandler(event) {
        //to restrict form default action
        event.preventDefault();
        createReview($("#assign-review-form").serialize());
        this.reset();
    }

    //function to convert the height in vh
    function getHeightInVh(containerSelector) {
        const containerHeightInPixels = $(containerSelector).height();
        const viewportHeightInPixels = $(window).height();
        return containerHeightInVh = (containerHeightInPixels / viewportHeightInPixels) * 100;
    }


    //to expand a review
    function expandReviewHandler(event) {
        let containerHeight = getHeightInVh(`#review-container-${event.target.id}`);

        if (containerHeight < 11) $(`#review-container-${event.target.id}`).css("height", "30vh");
        else $(`#review-container-${event.target.id}`).css("height", "10vh");
    }



    //to delete a pending review
    function deletePendingReviewHandler(event) {
        toDestroy(event.target.id);
    }

    // to open and close create review form
    function addReviewBtnClickHandler() {
        if ($(".create-review-form-container").height() == 0) {
            $("#add-review-btn").css("rotate", "45deg");
            $(".create-review-form-container").css("height", "30vh");
            $(".create-review-form-container");
            $(".reviews").css("height", "56%");
        } else {
            $("#add-review-btn").css("rotate", "0deg");
            $(".create-review-form-container").css("height", "0vh");
            $(".create-review-form-container").css("border", "none");
            $(".reviews").css("height", "90%");
        }
    }

    //to submit new review
    function onReviewSubmitHandler(event) {
        event.preventDefault();
        createReview($(".create-review-form").serialize());
        this.reset();
    }

    //to edit the review
    function editReviewBtnClickHandler(event) {
        renderReviewForm(event.target.id);
    }

    //to edit the feedback given by the user
    function renderReviewForm(id) {

        if ($(`#review-container-${id}>form`).length == 0) {
            if (getHeightInVh(`#review-container-${id}`) < 11) {
                $(`#review-container-${id}`).css("height", "30vh");
            }

            let feedbackText = $(`#feedback-${id}`).text();
            let form = $("<form>").addClass("feedback feedback-form").attr({
                "action": `/reviews/update/${id}`,
                "method": "post",
            });
            let textarea = $("<textarea>").attr({
                "rows": "5",
                "cols": "30",
                "name": "feedback",
            }).val(feedbackText);
            form.append(textarea);

            $(`#feedback-${id}`).remove();
            $(`#review-container-${id}`).append(form);


            //to submit the form on enter press
            textarea.on("keydown", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    form.submit();
                }
            });

        } else {
            let text = $(`#review-container-${id}>form>textarea`).val();
            let feedback = $("<div>").addClass("feedback").attr("id", `feedback-${id}`).text(text);
            $(`#review-container-${id}>form`).remove();
            $(`#review-container-${id}`).append(feedback);
        }
    }




    // =============EVENT LISTENERS=============

    //setting event listeners

    //listener to open close assign review form
    $("#open-assign-review-form").click(onOpenReviewFormHandler);
    //listener to assign a review
    $("#assign-review-form").submit(assignReviewFormHandler);

    //listener to delete a pending review
    $(".pending-reviews").on("click", ".delete-pending-review", deletePendingReviewHandler);

    //listener to open create a new review
    $("#add-review-btn").click(addReviewBtnClickHandler);


    //listener to expand a review
    $(".reviews").on("click", ".expand-review", expandReviewHandler);

    //listener to submit a review
    $(".create-review-form").submit(onReviewSubmitHandler);

    //listener to edit review
    $(".reviews").on("click", ".edit-review-btn", editReviewBtnClickHandler);

})();