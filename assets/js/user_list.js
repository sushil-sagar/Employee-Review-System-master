//using IIFE to maintain scope
(() => {
    //saving list of users locally for functionality
    let usersArray = new Array();

    // calling functions on loading
    onLoad();



    // =================ON LOAD===============

    function onLoad() {
        //making AJAX request to fetch all the users
        $.ajax({
            type: "get",
            url: "/users/",
            success: function (response) {
                //to render users on DOM
                renderUsers(response.data);
                //storing users to global variable for later use
                usersArray = response.data;
            }
        });

    }

    //to render the user on DOM
    function renderUsers(usersArray) {
        usersArray.forEach((user) => {
            let imgSrc = "/images/icons/admin-grey.png";
            if (user.isAdmin) imgSrc = "/images/icons/admin-white.png";

            // creating element for each user
            let div = $("<div>").addClass("user-container").attr("id", `container-${user._id}`);
            let name = $("<p>").text(user.name).attr("id", `username-${user._id}`);
            let email = $("<p>").text(user.email).attr("id", `email-${user._id}`);
            let password = $("<p>").text(user.password).attr("id", `password-${user._id}`);

            let optionsContainer = $("<div>")
            let admin = $("<img>").attr("src", imgSrc).attr("id", user._id).addClass("toggle-admin");
            let toEdit = $("<img>").attr("src", "/images/icons/edit-white.png").attr("id", user._id).addClass("edit-user button-hover");
            let toDelete = $("<img>").attr("src", "/images/icons/close-white.png").attr("id", user._id).addClass("delete-user button-hover");
            optionsContainer.append(admin, toEdit, toDelete);

            div.append(name, email, password, optionsContainer);

            $(".users-list").prepend(div);
        });

    }


    // ================EVENT HANDLERS==============

    // =========TOGGLE ADMIN============

    //to toggle a user as admin
    function toggleAdminHandler(event) {
        $.ajax({
            type: "get",
            url: `/users/update/admin/${event.target.id}`,
            success: function (response) {
                //to reflect the changes on DOM
                if (response.isAdmin) {
                    //to notify the user
                    toastr.success("User Assigned as Admin");
                    $(`#${event.target.id}`).attr("src", `/images/icons/admin-white.png`);
                }
                else {
                    //to notify the user
                    toastr.success("User removed as Admin");
                    $(`#${event.target.id}`).attr("src", `/images/icons/admin-grey.png`);

                }

            }
        }).fail((error) => {
            //to notify the user
            toastr.error("Unable to update user");
        });
    }





    //to open the edit form
    function editBtnClickHandler(event) {
        $(".user-list-container").css("width", "65vw");
        setTimeout(() => {
            $(".aside-section").css("height", "85vh");
        }, 500);

        //to render the edit form with credentials
        renderEditForm(event.target.id);

    }

    //to close the edit form
    function closeEditFormHandler() {

        $(".aside-section").css("height", "0%");
        setTimeout(() => {
            $(".user-list-container").css("width", "90vw");
        }, 500);
    }



    //to open create user form
    function openCreateUserFormHandler() {
        $(".user-list-container").css("width", "65vw");
        setTimeout(() => {
            $(".aside-section").css("height", "85vh");

        }, 500);
        $(".create-user-form").trigger("reset");
        $(".create-user-form").removeAttr("id");
        $(".create-user-form>#submit-form").val("CREATE USER");
    }



    //to render the edit form on DOM
    function renderEditForm(id) {
        const user = usersArray.find((user) => {
            return user._id == id;
        });
        if (user) {
            $(".create-user-form").attr("id", user._id);
            $("#input-user-name").val(user.name);
            $("#input-user-email").val(user.email);
            $("#input-user-password").val(user.password);
            $("#confirm-password").val(user.password);
            $("#submit-form").val("UPDATE USER");
        }

    }

    // ===============TO CREATE================
    //to create new user
    function createUser(data) {
        $.ajax({
            type: "post",
            url: "/users/create",
            data: data,
            success: function (response) {
                renderUser(response.data);
                toastr.success("New user created");

            },
            error: function (error) {
                toastr.error(error.responseJSON.message);
            }
        });
    }

    //to render newly created user on DOM after creation
    function renderUser(user) {
        let imgSrc = "/images/icons/admin-grey.png";
        if (user.isAdmin) imgSrc = "/images/icons/admin.png";

        let div = $("<div>").addClass("user-container").attr("id", `container-${user._id}`);
        let name = $("<p>").text(user.name).attr("id", `username-${user._id}`);
        let email = $("<p>").text(user.email).attr("id", `email-${user._id}`);
        let password = $("<p>").text(user.password).attr("id", `password-${user._id}`);

        let optionsContainer = $("<div>")
        let admin = $("<img>").attr("src", imgSrc).attr("id", user._id).addClass("toggle-admin");
        let toEdit = $("<img>").attr("src", "/images/icons/edit-white.png").attr("id", user._id).addClass("edit-user");
        let toDelete = $("<img>").attr("src", "/images/icons/close-white.png").attr("id", user._id).addClass("delete-user");
        optionsContainer.append(admin, toEdit, toDelete);

        div.append(name, email, password, optionsContainer);

        $(".users-list").prepend(div);
    }

    // ==============TO UPDATE============

    //to update users credentials
    function updateUser(id, data) {
        $.ajax({
            type: "post",
            url: `/users/update/${id}`,
            data: data,
            success: function (response) {
                updateDOM(response.data);
                toastr.success("Credentials updated successfully");
            },
            error: function (error) {
                toastr.error(error.responseJSON.message);
            }
        });

    }

    //to reflect the changes on DOM
    function updateDOM(updatedUser) {
        $(`#username-${updatedUser._id}`).text(updatedUser.name);
        $(`#email-${updatedUser._id}`).text(updatedUser.email);
        $(`#password-${updatedUser._id}`).text(updatedUser.password);
    }

    // ===============TO DELETE================

    //event handler to delete a user
    function deleteUserBtnHandler(event) {
        deleteUser(event.target.id);
    }

    //to delete a user
    function deleteUser(id) {
        $.ajax({
            type: "get",
            url: `/users/destroy/${id}`,
            success: function (response) {
                $(`#container-${response.id}`).remove();
                toastr.success("User deleted successfully");
            }
        });
    }


    // ==============EVENT LISTENERS================

    //setting event listeners using event delegation

    //event listener to toggle admin
    $("#user-list-container").on("click", ".toggle-admin", toggleAdminHandler);

    //event listener to edit users details
    $("#user-list-container").on("click", ".edit-user", editBtnClickHandler);

    //event listener to delete user
    $("#user-list-container").on("click", ".delete-user", deleteUserBtnHandler);

    //event listener to close edit form 
    $("#close-form-btn").click(closeEditFormHandler);

    //event listener to open create user form
    $("#open-create-user-form").click(openCreateUserFormHandler);

    // event listener on submitting the create/edit user form 
    $(".create-user-form").submit((event) => {
        event.preventDefault();
        if (event.target.id) updateUser(event.target.id, $(".create-user-form").serialize());
        else {
            createUser($(".create-user-form").serialize())
            $(".create-user-form").trigger("reset");
        }

    });














})();