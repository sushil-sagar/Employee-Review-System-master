//SETTING TOASTR FOR NOTIFICATIONS
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut",
  "opacity": "1"
}


//using brackets to maintain scope
{
  //event listener to redirect to home on clicking on title
  $(".logo-heading-container>img").click(() => {
    window.location.href = "/";
  });


  //event listener to redirect to home on clicking on logo
  $(".logo-heading-container>h1").click(() => {
    window.location.href = "/";
  });

}