/*
	====== Views.js ======
	Handles loading the views dynamically into a single page
*/


var Views  = (function(){

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
		myweek: [{
				selector: "#title",
				templateUrl: 'views/my-week-title.html'
			}, {
				selector: "#content",
				templateUrl: 'views/my-week-content.html'
			},
		],
		grocerylist: [{
				selector: "#title",
				templateUrl: 'views/grocery-title.html'
			}, {
				selector: "#content",
				templateUrl: 'views/grocery-content.html'
			},
		],
		settings: [{
				selector: "#title",
				templateUrl: 'views/settings-title.html'
			}, {
				selector: "#content",
				templateUrl: 'views/settings-content.html'
			},
		],

		defaultView: {
			view: 'login'
		}
	};	

	return{
		init: function(){
			new Via(views);
		}
	}
})();