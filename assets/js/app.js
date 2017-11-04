/*
	====== App.js ======
	Handles the application loading and processing.
*/
$("document").ready(function(){
	
	firebase.initializeApp(Config.firebase);

	// ===== Scripts ======
	//console.log(Api);
	Api.init();
	//TestData.init();
	//TestData.storeTestData();
	console.log("App.js linked");


	var views = {
		login: [{
				selector: "#title",
				templateUrl: 'views/login-title.html'
			}, {
				selector: "#content",
				templateUrl: 'views/login-content.html'
			}
		],
		home: [{
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
			view: 'login'
		}
	};

	new Via(views);

});