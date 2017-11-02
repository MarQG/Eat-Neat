/*
	====== App.js ======
	Handles the application loading and processing.
*/
$("document").ready(function(){
	
	firebase.initializeApp(Config.firebase);

	//TestData.init();
	//TestData.storeTestData();
	console.log("App.js linked");

	var views = {
		home: [
			{
				selector: "#title",
				templateUrl: 'views/home-title.html'
			}, {
				selector: "#content",
				templateUrl: 'views/home-content.html'
			}
		],
		search: [{
			selector: "#title",
			templateUrl: 'views/search-title.html'
		}, {
			selector: "#content",
			templateUrl: 'views/search-content.html'
		},
		],
		favorites: [{
			selector: "#title",
			templateUrl: 'views/favorite-title.html'
		}, {
			selector: "#content",
			templateUrl: 'views/favorite-content.html'
		},
		],

		defaultView: {
			view: 'home'
		}
	};

	new Via(views);
	console.log(views);

});