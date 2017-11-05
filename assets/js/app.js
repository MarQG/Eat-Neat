/*
	====== App.js ======
	Handles the application loading and processing.
*/
$("document").ready(function(){
	
	firebase.initializeApp(Config.firebase);

	// Setup Side Nav Element
	$(".button-collapse").sideNav({
      menuWidth: 300,
      closeOnClick: true 
    });


	// ===== Scripts ======
	Api.init();
	Views.init();

});