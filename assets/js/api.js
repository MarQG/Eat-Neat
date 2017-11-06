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
	function yummlyListSearch(search, allergyFilters){
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

				$("#search-label").text(data.criteria.q)

				$("#search-attribution").append(searchDiv);
				$("#search-results").empty();
				$.each(data.matches, function(index, value){
					var recipeItem = $("<div>");
					recipeItem.attr("id", value.id);
					recipeItem.addClass("recipe-list faveCard");
					recipeItem.html(
							'<div class="dishImg"><img class="dishPic" src="' + value.imageUrlsBySize[90] + '"></div>' +
							'<div class="dishDesc">' +
								'<h6 class="dishType">' + value.sourceDisplayName + '</h6>' +
								'<h6 class="dishName">' + value.recipeName + '</h6>' +
								'<div class="details"><a class="time"><i class="material-icons">access_time</i>' + (value.totalTimeInSeconds / 60 ) + '</a>' +
								'<a class="servings"><i class="material-icons">people</i>3 servings</a></div>' +
							'</div>');
					$("#search-results").append(recipeItem);
				})

				$(".recipe-list").on("click", function(){
					window.location = "#home";
					yummlyRecipeLookup($(this).attr("id"));
				});

			});
		} else {
			console.log("Alert user input was empty");
		}

	}

	function yummlyRecipeLookup(id){

			var curRecipe = yumGetRecURL + id + yumAppId + yumKey;

			$.ajax({
				url: curRecipe,
				method: "GET"
			}).done(function(data){

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
					$.each(data.extendedIngredients, function(index, value){
						var div = $("<div>");
						div.html(
							"<p>" + value.originalString + "</p>");
						$("#search-title").append(div);
					})
					$("#search-title").append(data.instructions);
				} else {
					$("#search-title").append("<a href='" + url + "''>Check out this recipe here.</a>" );
				}
			})
	}

	return{

		init: function(){
			userSearch = $("#search-form");

			ref = firebase.database().ref("/recent-search");

			userSearch.submit(function(){
				var userSearchVal = $("#user-search").val().trim();
				yummlyListSearch(userSearchVal,userFilters);
			});

			// Search Listener. Will load previous search that user entered
			$(window).on("hashchange", function(){
				if(location.hash === "#search" && $("#user-search").val() === ""){
					console.log("Search reloaded");
					ref.limitToLast(1).once("child_added", function(data){
						$("#search-results").empty();
						$("#search-label").text(data.val().savedSearchValue);
						$.each(data.val().savedSearch, function(index, value){
							var recipeItem = $("<div>");
							recipeItem.attr("id", value.id);
							recipeItem.addClass("recipe-list faveCard");
							recipeItem.html(
									'<div class="dishImg"><img class="dishPic" src="' + value.imageUrlsBySize[90] + '"></div>' +
									'<div class="dishDesc">' +
										'<h6 class="dishType">' + value.sourceDisplayName + '</h6>' +
										'<h6 class="dishName">' + value.recipeName + '</h6>' +
										'<div class="details"><a class="time"><i class="material-icons">access_time</i>' + (value.totalTimeInSeconds / 60 ) + '</a>' +
										'<a class="servings"><i class="material-icons">people</i>3 servings</a></div>' +
									'</div>');
							$("#search-results").append(recipeItem);


						});

						$(".recipe-list").on("click", function(){
							window.location = "#home";
							yummlyRecipeLookup($(this).attr("id"));
						});
					});
					$(".dropdown-button").dropdown();
				}	
				
			});


			$(document).ready(function(){
				if(location.hash === "#search" && $("#user-search").val() === ""){
					ref.limitToLast(1).once("child_added", function(data){
						$("#search-results").empty();
						$("#search-label").text(data.val().savedSearchValue);
						$.each(data.val().savedSearch, function(index, value){
							var recipeItem = $("<div>");
							recipeItem.attr("id", value.id);
							recipeItem.addClass("recipe-list faveCard");
							recipeItem.html(
									'<div class="dishImg"><img class="dishPic" src="' + value.imageUrlsBySize[90] + '"></div>' +
									'<div class="dishDesc">' +
										'<h6 class="dishType">' + value.sourceDisplayName + '</h6>' +
										'<h6 class="dishName">' + value.recipeName + '</h6>' +
										'<div class="details"><a class="time"><i class="material-icons">access_time</i>' + (value.totalTimeInSeconds / 60 ) + '</a>' +
										'<a class="servings"><i class="material-icons">people</i>3 servings</a></div>' +
									'</div>');
							$("#search-results").append(recipeItem);


						});

						$(".recipe-list").on("click", function(){
							window.location = "#home";
							yummlyRecipeLookup($(this).attr("id"));
						});
					});
					$(".dropdown-button").dropdown();
				}

				
			});
			
		}
	}
})();


	

	

	









// });