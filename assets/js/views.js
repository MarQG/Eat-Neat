/*
	====== Views.js ======
	Handles loading the views dynamically into a single page
*/


var Views  = (function(){
	var userFilters = ["393^Gluten-Free"];
	var userSearchVal;

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

	function loadSearch(){
		if( userSearchVal === undefined){
			$("#search-bar").hide();
			Api.yummlyListSearch("trending", userFilters, $("#search-results"));

		} else {
			Api.yummlyListSearch(userSearchVal, userFilters, $("#search-results"));
			$("#search-bar").show();
		}
	}

	function loadFavorites(){
		setTimeout(function(){
			var displayFavRef = firebase.database().ref("/favorites");
			displayFavRef.on("child_added", function(data){
				Api.displayCards(data, $("#favorite-list"));
			});

		}, 400);
		setTimeout(function(){
			$(".favorite-list").on("click", function(){
				var recId = $(this).attr("id");
				console.log(recId);
				$("#add-recipe").modal({
					dismissable:true,
					ready:function(){
						$('select').material_select();
					},
					complete:function(){

						var weekday = $("#recipe-weekday option:selected").text();
						var mealTime = $("#recipe-mealtime option:selected").text();
						var recipeRef = firebase.database().ref("/myweek/" + weekday + "/" + mealTime);
						var favoriteRef = firebase.database().ref("/favorites/" + recId)
						favoriteRef.once("value").then(function(data){
							recipeRef.set(data.val());
						});

						Materialize.toast("Added Recipe to " + weekday + " for " + mealTime, 4000);
					}
				});
			});
		}, 1100);
	}


	function windowListener(hash){
		switch(hash){

			case "#search":
				loadSearch();
				break;

			case "#favorites":
				loadFavorites();
				
				break;

			case "#myweek":
				console.log("myweek");
				break;

			case "#grocerylist":
				console.log("Grocery List");
				break;

			case "#recipeDetails":
				console.log("Recipe Details");
				break;

			default:
				console.log("Default")
				break;
		}
	}

	return{
		init: function(){
			new Via(views);

			var userSearch = $("#search-form");
			userSearch.submit(function(){
				userSearchVal = $("#user-search").val();
				console.log(userSearchVal)
				windowListener("#search");
			});



			$(window).on("hashchange", function(){
				windowListener(location.hash);
			});

			$(document).ready(function(){
				windowListener(location.hash);
			});


		}
	}
})();