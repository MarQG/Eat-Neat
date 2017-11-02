/*
	====== App.js ======
	Handles the application loading and processing.
*/
$("document").ready(function(){
	console.log("App.js linked");

	var views = {
		home: [{
			selector: "#title",
			templateUrl: '../views/home-title.html'
		}, {
			selector: "#content",
			templateUrl: '../views/home-content.html'
		},
		],
		search: [{
			selector: "#title",
			templateUrl: '../views/search-title.html'
		}, {
			selector: "#content",
			templateUrl: '../views/search-content.html'
		},
		],

		defaultView: {
			view: 'home'
		}
};

var via = new Via();

via.init(views);
});