/*
	====== Api.js ======
	Handles loading the Apis and processing them.
*/


var Api  = (function(){

	// ====== Private Varaibles ======
	var userSearch;
	var userFilters = ["393^Gluten-Free"];
	var ref;	

	// ====== Yummly API Information ======

	// Yummly API Key
	var yumKey = "&_app_key=1f9b2a7d3efef07d7e62c12ae3fea734";
	// Yummly API App ID
	var yumAppId = "?_app_id=5b89dde2";

	// Yummly Recipe IDs and Varabiables
	var yumRecipeId = "Cilantro-Lime-Chicken-2049115"

	// Yummy Endpoint URLS
	//yumURL = "http://api.yummly.com/v1/api/metadata/allergy?_app_id=5b89dde2&_app_key=1f9b2a7d3efef07d7e62c12ae3fea734"

	// Yummly Recipe List Search URL
	var yumListURL = "http://api.yummly.com/v1/api/recipes" + yumAppId + yumKey + "&q=";

	// Yummly Recipe Search URL
	var yumGetRecURL = "http://api.yummly.com/v1/api/recipe/";

	// ====== Recipe-Nutrition-Health API Information ======

	// RHN API Key
	var recipeKey = "BEAGFpnJzNmshCwrMP5I5LTVCo3qp1L9ydsjsnkqXNYsWX08Dx";

	// RHN API Recipe Instruction Search URL
	var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=true&url=";

	// ====== yummlyListBuilder =====
	/*
		Takes a search term from the user and passes it into our Yummly API and returns a recipe object
	*/

	function loadRecommended(){

	}

	function pushFavorite(){

	}

	function displaySearch(data, display){
		var recipeItem = $("<div>");
		recipeItem.attr("id", data.id);
		recipeItem.addClass("recipe-list card medium faveCard hoverable");
		recipeItem.html(
				'<div class="card-image"><img src="' + data.imageUrlsBySize[90] + '">' +
				'<a class="btn-floating fav-fab waves-effect waves-light red"><i class="material-icons">favorite_border</i></a>' +
				'</div>' +
				'<div class="dishDesc">' +
					'<h6 class="dishType">' + data.sourceDisplayName + '</h6>' +
					'<h6 class="dishName">' + data.recipeName + '</h6>' +
					'<div class="details"><a class="time"><i class="material-icons">access_time</i>' + (data.totalTimeInSeconds / 60 ) + ' mins </a>' +
				'</div>');
		display.append(recipeItem);
	}

	function yummlyListSearch(search, allergyFilters, display){
		console.log("ran yummyListSearch");
		if(search != ""){
			var newSearch = yumListURL + search;
			if(allergyFilters != []){
				newSearch += "&allowedAllergy[]=" + allergyFilters[0];
			}
			$.ajax({
				url: newSearch,
				method: "GET"
			}).done(function(data){

				ref.push({
					savedSearchValue: data.criteria.q,
					savedSearch: data.matches
				});
				console.log(data);
				var searchDiv = $("<div>");
				searchDiv.addClass("center-align");
				searchDiv.html( data.attribution.html);
				$("#search-attribution").append(searchDiv);

				$("#search-results").empty();
				$("#search-label").text(data.criteria.q)
				$.each(data.matches, function(index, value){
					displaySearch(value, display);
				});

				$(".recipe-list").on("click", function(){
					window.location = "#";
					yummlyRecipeLookup($(this).attr("id"));
				});

			});
		} else {
			console.log("Alert user input was empty");
		}

	}

	function yummlyRecipeLookup(id, ref){

			var curRecipe = yumGetRecURL + id + yumAppId + yumKey;

			$.ajax({
				url: curRecipe,
				method: "GET"
			}).done(function(data){
				// Push Favorite Recipe to database according to Yummyly Recipe API Info
				ref.push()
				rpnInstructionFinder(data.source.sourceRecipeUrl);
			});
	}

	function rpnInstructionFinder(url){
			console.log(url);
			console.log(encodeURIComponent(url));
			var curRecipeIns = recipeURL + encodeURIComponent(url);

			$.ajax({
				url: curRecipeIns,
				type: "GET",
		    	headers: {
			        'Content-Type': 'application/json',
			        'X-Mashape-Key': recipeKey
			    }
			}).done(function(data){
				console.log(data);
				if(data.instructions != null){
					$("#search-title").append(data.instructions);
				} else {
					$("#search-title").append("<a href='" + url + "' target='_blank'>Check out this recipe here.</a>" );
				}
			})
	}

	return{

		init: function(){
			userSearch = $("#search-form");

			ref = firebase.database().ref("/recent-search");

			userSearch.submit(function(){
				var userSearchVal = $("#user-search").val().trim();
				yummlyListSearch(userSearchVal, userFilters, $("#search-results"));
				$("#search-bar").show();
			});

			// Search Listener. Will load previous search that user entered
			$(window).on("hashchange", function(){
				if(location.hash === "#search" && $("#user-search").val() === ""){
					$("#search-bar").hide();
					yummlyListSearch("trending", userFilters, $("#search-results"));

					$(".recipe-list").on("click", function(){
						window.location = "#home";
						yummlyRecipeLookup($(this).attr("id"));
					});
					$(".dropdown-button").dropdown();

				}	
				
			});


			$(document).ready(function(){
				// Search Load
				if(location.hash === "#search" && $("#user-search").val() === ""){
					$("#search-bar").hide();
					yummlyListSearch("trending", userFilters, $("#search-results"));

					$(".recipe-list").on("click", function(){
						favRef = firebase.database().ref("/favorites");
						yummlyRecipeLookup($(this).attr("id", favRef);
					});
					$(".dropdown-button").dropdown();

				}

				//Favorites Load
				
			});
			
		}
	}
})();