/*
	====== Api.js ======
	Handles loading the Apis and processing them.
*/


var Api  = (function(){

	// ====== Private Varaibles ======
	var userSearch;
	var ref;
	var userFilters = ["393^Gluten-Free"];	

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
	var yumListURL = "https://api.yummly.com/v1/api/recipes" + yumAppId + yumKey + "&q=";

	// Yummly Recipe Search URL
	var yumGetRecURL = "https://api.yummly.com/v1/api/recipe/";

	// ====== Spoonacular API Information ======

	// RHN API Key
	var recipeKey = "BEAGFpnJzNmshCwrMP5I5LTVCo3qp1L9ydsjsnkqXNYsWX08Dx";

	// RHN API Recipe Instruction Search URL
	var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=true&url=";

	return{

		init: function(){

			ref = firebase.database().ref("/recent-search");
			
		},
		yummlyListSearch: function(search, allergyFilters, display){
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
					var searchDiv = $("<div>");
					searchDiv.addClass("center-align");
					searchDiv.html( data.attribution.html);
					$("#search-attribution").append(searchDiv);

					$("#search-results").empty();
					$("#search-label").text(data.criteria.q)
					$("#user-search").val("");
					$.each(data.matches, function(index, value){
						Api.displayCards(value, $("#search-results"));
					});

					// Event Listener for Favorite Button Being Clicked
					$(".recipe-list").on("click", function(){
						favRef = firebase.database().ref("/favorites");
						var searchId = $(this).attr("id");
						var isFav = false;
						favRef.orderByValue().once("value", function(data){
							data.forEach(function(child){

								//Removes Favorited Recipe
								if(child.val().id === searchId){
									isFav = true;
									favRef.child(child.key).remove();
									$("#" + searchId).text("favorite_border");
									Materialize.toast("Removed from Favorites", 4000);
								}
							});
						}).then(function(data){

							//Adds Recipe to Favorite
							if(!isFav){
								$("#" + searchId).text("favorite");
								$(this).text("favorite");
								Api.yummlyRecipeLookup(searchId, favRef);
								Materialize.toast("Added to Favorites", 4000);
							}
						});
					});
				});
			} else {
				Materialize.toast("Sorry Search was empty. Try again", 2000);
			}
		},
		yummlyRecipeLookup: function(id, ref){
			var curRecipe = yumGetRecURL + id + yumAppId + yumKey;

			$.ajax({
				url: curRecipe,
				method: "GET"
			}).done(function(data){

				var key = ref.push();
				key.set({
					name: data.name,
					recipeImage: data.images[0].hostedLargeUrl,
					cookTime: data.totalTime,
					ingredients: data.ingredientLines,
					servings: data.numberOfServings,
					id: data.id,
					source: data.source
				});

				Api.rpnInstructionFinder(data.source.sourceRecipeUrl, key.key);
			});
		},
		rpnInstructionFinder: function(url, key){
			var curRecipeIns = recipeURL + encodeURIComponent(url);
			var currentRef = firebase.database().ref("/favorites").child(key);

			$.ajax({
				url: curRecipeIns,
				type: "GET",
		    	headers: {
			        'Content-Type': 'application/json',
			        'X-Mashape-Key': recipeKey
			    }
			}).done(function(data){
				if(data.instructions != undefined){
					currentRef.update({
						instructions: data.instructions
					});
				} else {
					currentRef.update({
						instructions: "<a href='" + url + "' target='_blank'>Check out this recipe here.</a>"
					});
				}
			});
		},
		displayCards: function(data, display){
			if (location.hash === "#favorites") {
				var recipeItem = $("<div>");
				recipeItem.attr("id", data.id);
				recipeItem.addClass("card medium faveCard hoverable");
				recipeItem.html(
						'<div class="card-image"><img src="' + data.val().recipeImage + '">' +
						'<a class="btn-floating fav-fab waves-effect waves-light red modal-trigger" data-target="add-recipe"><i class="material-icons favorite-list" id="' + data.key + '">add</i></a>' +
						'</div>' +
						'<div class="dishDesc">' +
							'<h5 class="dishType">' + data.val().source.sourceDisplayName + '</h5>' +
							'<h6 class="dishName">' + data.val().name + '</h6>' +
							'<div class="details"><a class="time"><i class="material-icons">access_time</i>' + data.val().cookTime + ' </a>' +
							'<a class="servings"><i class="material-icons">people</i>' + data.val().servings + 'servings</a>' +
						'</div>');
				display.append(recipeItem);	
			}

			if (location.hash === "#search") {
				var recipeItem = $("<div>");
				recipeItem.addClass("card medium faveCard hoverable");
				var imageUrl = "";
				if(data.hasOwnProperty('imageUrlsBySize')){
					imageUrl = data.imageUrlsBySize[90];
				} else {
					imageUrl = "assets/images/testdish.jpg"
				}
				recipeItem.html(
					'<div class="card-image"><img src="' + imageUrl + '">' +
					'<a class="btn-floating fav-fab waves-effect waves-light red "><i class="recipe-list material-icons" id=' + data.id + '>favorite_border</i></a>' +
					'</div>' +
					'<div class="dishDesc">' +
						'<h6 class="dishType">' + data.sourceDisplayName + '</h6>' +
						'<h6 class="dishName">' + data.recipeName + '</h6>' +
						'<div class="details"><a class="time"><i class="material-icons">access_time</i>' + (data.totalTimeInSeconds / 60 ) + ' mins </a>' +
					'</div>');
				display.append(recipeItem);
			}
		}
	}
})();