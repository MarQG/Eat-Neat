/*
	====== Api.js ======
	Handles loading the Apis and processing them.
*/
$("document").ready(function(){
	//console.log("Api.js linked");

	//Setup Yummly API Call

	var yumKey = "1f9b2a7d3efef07d7e62c12ae3fea734";
	var yumAppId = "5b89dde2";
	var yumRecipeId = "Cilantro-Lime-Chicken-2049115"

	//yumURL = "http://api.yummly.com/v1/api/metadata/allergy?_app_id=5b89dde2&_app_key=1f9b2a7d3efef07d7e62c12ae3fea734"
	var yumURL = "http://api.yummly.com/v1/api/recipes?_app_id=" + yumAppId + "&_app_key=" + yumKey + "&q=chicken&allowedAllergy[]=393^Gluten-Free";
	var yumGetRec = "http://api.yummly.com/v1/api/recipe/"+ yumRecipeId+"?_app_id=" + yumAppId + "&_app_key=" + yumKey;

	var nutriKey = "629421b1e71e0ed0e48f50e44429795b";
	var nutriAppId = "c7923083";
	var nutriObj = {
		"query":"cilantro lime chicken",
		"timezone":"US/Eastern"
	}

	var nutriURL = "https://trackapi.nutritionix.com/v2/natural/nutrients";

	var recipeKey = "BEAGFpnJzNmshCwrMP5I5LTVCo3qp1L9ydsjsnkqXNYsWX08Dx";

	var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=false&url=http%3A%2F%2Fwww.melskitchencafe.com%2Fthe-best-fudgy-brownies%2F";

	
	// $.ajax({
	// 	url: yumURL,
	// 	method: "GET"
	// }).done(function(data){
	// 	console.log(JSON.stringify(data));
	// });

	// $.ajax({
	// 	url: recipeURL,
	// 	type: "GET",
 //    	headers: {
	//         'Content-Type': 'application/json',
	//         'X-Mashape-Key': recipeKey
	//     }
	// }).done(function(data){
	// 	console.log(data);
	// 	console.log(JSON.stringify(data));
	// 	$.each(data.extendedIngredients, function(index, value){
	// 		var div = $("<div>");
	// 		div.html("<img src='" + value.image + "'>"+
	// 			"<p>" + value.originalString + "</p>"+
	// 			"<p>Locationa: " + value.aisle + "</p>");
	// 		$(".container").append(div);
	// 	})
	// 	$(".container").append(data.instructions);
	// })


	// $.ajax({
	// 	url: yumGetRec,
	// 	method: "GET"
	// }).done(function(data){
	// 	console.log(JSON.stringify(data));
	// });


});