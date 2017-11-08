/*
	====== Views.js ======
	Handles loading the views dynamically into a single page
*/


var Views  = (function(){
	var userFilters = ["393^Gluten-Free"];
	var userSearchVal;
	
	var daysSort = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	var mealTimeSort = ['Breakfast', 'Lunch', 'Dinner'];

	var currentRecipeRef = "";

	var views = {
		login: [{
				selector: "#title",
				templateUrl: 'views/login-title.html'
			}, {
				selector: "#content",
				templateUrl: 'views/login-content.html'
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
		recipe: [{
				selector: "#title",
				templateUrl: 'views/recipe-title.html'
			}, {
				selector: "#content",
				templateUrl: 'views/recipe-content.html'
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

	function saveRecipeToWeek(id){
		$("#add-recipe").modal({
			dismissable:true,
			ready:function(){
				$('select').material_select();
			},
			complete:function(){
				var weekday = $("#recipe-weekday option:selected").text();
				var mealTime = $("#recipe-mealtime option:selected").text();
				var recipeRef = firebase.database().ref("/myweek/"+ weekday + "/" + mealTime);
				var favoriteRef = firebase.database().ref("/favorites/" + id)
				favoriteRef.once("value").then(function(data){
					recipeRef.set(data.val());
				});

				Materialize.toast("Added Recipe to " + weekday + " for " + mealTime, 4000);
			}
		});
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
				saveRecipeToWeek(recId);
				
			});
		}, 1100);
	}

	function objSorter(obj, sortKey){
		const unordered = obj;		
		const ordered = {};

		Object.keys(unordered).sort(function (a, b) {
		    return sortKey.indexOf(a) > sortKey.indexOf(b);
		}).forEach(function(key) {
		    ordered[key] = unordered[key];
		});

		return ordered;
	}

	function weekBuilder(data){
		var sortedWeek = objSorter(data.val(), daysSort);
		$.each(sortedWeek, function(key, value){
			var newDay = $("<div>");
			var sortedMeals = objSorter(value, mealTimeSort);

			var recipeRef = key;

			newDay.addClass("card my-week-card hoverable grey lighten-2");
			newDay.append('<div class="day-of-week"><h4 class="day-title">'+ key +'</h4></div>');
			
			$.each(sortedMeals, function(key, value){
				newDay.append(
					'<div class="meal-time"><p class="meal-title">' + key + '</p></div>'+
					'<div class="row waves-effect waves-green">'+
						'<div class="meal-item" id="' + value.id + '" data-weekday="' + recipeRef + '" data-meal="' + key + '">'+
							'<h5 class="dishName">' + value.name + '</h5>' +
							'<div class="details">' +
								'<a class="time"> <i class="material-icons">access_time</i> ' + value.cookTime + '</a>' +
									'<a class="servings"> <i class="material-icons">people</i> ' + value.servings + ' servings</a>'+
								'</div>'+
						'</div>'+
					'</div');
			});
			
			$("#my-week-view").append(newDay);
		});
		$(".meal-item").on("click", function(){
			currentRecipeRef = $(this).attr("data-weekday") + "/" + $(this).attr("data-meal");
			window.location = "#recipe";
		});
	}

	function loadMyWeek(){
		setTimeout(function(){
			$("#my-week-view").empty();
			var myWeekRef = firebase.database().ref("/myweek");
			myWeekRef.on("value", function(data){
				weekBuilder(data);
			})
		}, 500);
	}

	function groceryListBuilder(){
		var newGroceryList = $("<div>");
		newGroceryList.addClass("card recipe-card hoverable grey lighten-2");
		newGroceryList.append("GroceryListWorks");
	}

	function loadGroceryList(){
		$("#grocery-list-view").empty();
		var groceryListRef = firebase.database().ref("/grocerylist")
		groceryListRef.on("value", function(data){
			groceryListBuilder(data);
		})
	}

	function displayRecipe(recipe){
		if(recipe != ""){
			setTimeout(function(){
				$("#recipe-details").empty();
				var ref = firebase.database().ref("/myweek/" + recipe + "/");
				ref.on("value", function(data){
					var recipeData = data.val()
					$("#recipe-label").text(recipeData.name);
					var newRecipe = $("<div>");
					newRecipe.addClass("row");

					var ingredients = $("<div>");
					$.each(recipeData.ingredients, function(key, value){
						ingredients.append('<p class="grey-text">' + value + '</p>');
					});

					newRecipe.append(
						'<div class="col m12 l6 card large recipe-card black white-text">' +
							'<img class="recipe-image"src="' + recipeData.recipeImage + '">'+
							'<div class="row recipe-details">'+
								'<div class="col s4 recipe-detail-item">'+
									'<p class="recipe-time">' + recipeData.cookTime +'</p>'+
								'</div>'+
								'<div class="col s4 recipe-detail-item">'+
									'<p class="recipe-servings">' + recipeData.servings +' person</p>'+
								'</div>'+
								'<div class="col s4 recipe-detail-item">'+
									'<p class="recipe-ingredients">' + recipeData.ingredients.length +' ingredients</p>'+
								'</div>'+
							'</div>'+
							'<div class="row recipe-source">'+
								'<div class="col s12 recipe-source-item">'+
									'<a class="recipe-source-url" href="' + recipeData.source.sourceRecipeUrl + '" target="_blank">by ' + recipeData.source.sourceDisplayName +'</a>'+
								'</div>'+
							'</div>'+	
						'</div>' +
						'<div class="col m12 l6 recipe-instructions grey-text">' +
							'<h4>Ingredients</h4>'+
							'<hr>' +
							ingredients.html() +
							'<div class="row recipe-grocery-add">'+
								'<div class="col s12 recipe-grocery-item">'+
									'<a class="btn waves-effect waves-blue blue" id="recipe-grocery-save" >Save Ingredients To Grocery List</a>'+
								'</div>'+
							'</div>'+
							'<h4>Preparation</h4>'+
							'<hr>' +
							recipeData.instructions +
						'</div>');
					$("#recipe-details").append(newRecipe);

					var groceryRef = firebase.database().ref("/grocerylist");
					groceryRef.on("value", function(data){
						console.log("loading grocery list")
						if(data.val() != null){
							data.forEach(function(child){
								if(child.val().recipeName === recipeData.name){
									console.log("Item exists");
									$("#recipe-grocery-save").text("Remove Recipe From Grocery List");
									$("#recipe-grocery-save").off().on("click", function(){
										groceryRef.child(child.key).remove();
										$("#recipe-grocery-save").text("Save Recipe To Grocery List");
										
									});
								} else {
									console.log("Item doesnt exist");
									$("#recipe-grocery-save").text("Save Recipe To Grocery List");
									$("#recipe-grocery-save").off().on("click", function(){
										groceryRef.push({
											recipeName: recipeData.name,
											recipeIngredients: recipeData.ingredients
										});
									});
								} 
							});
						}else {
							console.log("Item doesnt exist");
							$("#recipe-grocery-save").text("Save Recipe To Grocery List");
							$("#recipe-grocery-save").off().on("click", function(){
								groceryRef.push({
									recipeName: recipeData.name,
									recipeIngredients: recipeData.ingredients
								});
		
							});
						}
					});

					

				});
			}, 500);
		}else {
			window.location = "#myweek";
		}
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
				loadMyWeek();
				break;

			case "#grocerylist":
				loadGroceryList();
				break;

			case "#recipe":
				displayRecipe(currentRecipeRef);
				break;

			default:
				console.log("Something Went Wrong on page load");
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