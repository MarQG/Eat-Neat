/*
	====== EatNeat ======
	Version: 0.5a
	Description:

	====== App.js ======
	Handles the application loading and processing.
*/
$("document").ready(function(){
	
	firebase.initializeApp(Config.firebase);

	// Login - takes to Home Page
	$(".login").on("click", function(){
		window.location = "#search";
	});

	// Setup Side Nav Element
	$(".button-collapse").sideNav({
      menuWidth: 300,
      closeOnClick: true 
    });

	// ===== Scripts ======
	Api.init();
	Views.init();

});