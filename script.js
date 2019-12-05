// localStorage.clear();
//Two recipes initially saved to a localStorage are not set repeatedly on a page reload/another browser session if deleted previously. "firstRecipeDeletionMarker" and "secondRecipeDeletionMarker" mark the deletion fact, so if they exist or initial recipes are already set, don't set them once more
let array = JSON.parse(localStorage.getItem("therecipes")) || [];
if((array.filter(r => r.title === "firstRecipeDeletionMarker" || r.title === "Lentil soup")).length === 0) {
    let obj = {
        title: "Lentil soup", 
        ingredients: "2l veg or ham stock\n150g red lentils\n6 carrots, finely chopped\n2 medium leeks, sliced (300g)\nsmall handful chopped parsley, to serve", 
        directions: "Heat the stock in a large pan and add the lentils. Bring back to the boil and allow the lentils to soften for a few mins.\nAdd the carrots and leeks to the lentils and season (don't add salt if you use ham stock as it will make it too salty). Bring to the boil, the reduce the heat, cover and simmer for 45-60 mins until the lentils have broken down. Scatter over the parsley and serve with buttered bread, if you like.",
        servings: 4,
        prepTime: 70
    }
    array.push(obj);
}
if ((array.filter(r => r.title === "secondRecipeDeletionMarker" || r.title === "Broccoli soup with crispy croutons and goat's cheese")).length === 0) {
    let obj = {
        title: "Broccoli soup with crispy croutons and goat's cheese",
        ingredients:"2 thick, crustless slices of bread, cubed\n1 tbsp olive oil\n900g broccoli\n50g butter\n1 large onion, finelychopped\ngenerous grating fresh nutmeg or ¼ tsp dried\n1l vegetable or chicken stock\n600ml full cream milk\n100g medium-soft goat's cheese, chopped (rind and all)",directions:"Preheat the oven to 200C/gas 6/fan 190C. Put the bread in a bowl and add the oil and a little salt. Mix well to coat the bread, then tip onto a baking tray. Bake for 10-12 minutes until crunchy and golden.\nMeanwhile, chop the broccoli stalks and florets, but keep them separate. Melt the butter in a pan, then add the onion, broccoli stalks and nutmeg and fry for 5 minutes until soft. Add the broccoli florets and stock, then the milk. Cover and simmer gently for 8 minutes until the broccoli is tender.\nTake out about four ladles of broccoli, then blend the rest in a food processor or with a hand blender, until smooth. Return the reserved broccoli to the soup and check for seasoning. (The soup will keep in the fridge for 2 days or you can cool and freeze it and keep the croutons in a plastic food bag.)\nTo serve, reheat if necessary and scatter with the croutons and goat’s cheese.",
        servings: 4,
        prepTime: 40
    };
    array.push(obj);
}
localStorage.removeItem("therecipes");
localStorage.setItem("therecipes", JSON.stringify(array));

//Add names of all recipes that have been created and saved in a localStorage to a list except for deletion markers - "firstRecipeDeletionMarker" and "secondRecipeDeletionMarker"
const listRecipes = () => {
    const recipesListNames = (JSON.parse(localStorage.getItem("therecipes"))).map(r => r.title);
    for (let i = 0; i < recipesListNames.length; i++) {
        if (recipesListNames[i] === "firstRecipeDeletionMarker" || recipesListNames[i] ===  "secondRecipeDeletionMarker") {
            continue;
        }
        const recipesListItem = document.createElement("LI");
        recipesListItem.innerHTML = recipesListNames[i];
        recipesListItem.addEventListener("click", (e) => showRecipe(e.target.innerHTML, true));
        document.querySelector("#recipes-list").appendChild(recipesListItem);
    }
}
listRecipes();


//If recipes are not empty showcase the first recipe and pre-fill its edit fields
if ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title != "firstRecipeDeletionMarker" && r.title != "secondRecipeDeletionMarker").length != 0) {
    showRecipe(document.querySelector("#recipes-list").firstChild.innerHTML, true);
}

//Pre-fill edit fields
function prefillEdit() {
    const name = document.querySelector("#showcase-name").innerHTML; //selected recipe name
    const recipe = ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title === name))[0];
    const ing = " -- " + recipe.ingredients.split('\n').join('\n -- ');
    const dir = " -- " + recipe.directions.split('\n').join('\n -- ');
    const prepTime = recipe.prepTime;
    const servings = recipe.servings;
    
    document.querySelector("#edit-name").value = name;
    document.querySelector("#edit-ingredients").value = ing;
    document.querySelector("#edit-directions").value = dir;
    document.querySelector("#edit-servings").value = servings;
    document.querySelector("#edit-prepTime-hours").value = parseInt(prepTime / 60);
    document.querySelector("#edit-prepTime-mins").value = prepTime % 60;  
};

//Save a recipe in localStorage from either create box or edit box (place)
function inputRecipe(place) {

    place === "recipe" ? document.querySelector(`#create-recipe`).style.display = "grid" :
    document.querySelector(`#edit-recipe`).style.display = "grid";

    let recipeName = document.querySelector(`#${place}-name`).value;
    let array = ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title === recipeName));
    if (array.length == 0 && recipeName !== "") {
        let ing = (document.querySelector(`#${place}-ingredients`).value).split('\n -- ').join('\n').split(' -- ').join(" ");
        let dir = (document.querySelector(`#${place}-directions`).value).split('\n -- ').join('\n').split(' -- ').join(" ");;
        let recipeObject = {
                        "title": recipeName,
                        "ingredients": ing,
                        "directions": dir,
                        "prepTime": Number(document.querySelector(`#${place}-prepTime-hours`).value) * 60 + Number(document.querySelector(`#${place}-prepTime-mins`).value),
                        "servings": document.querySelector(`#${place}-servings`).value
                        }
        
        let saveArr = (JSON.parse(localStorage.getItem("therecipes")));
        saveArr.push(recipeObject);
        localStorage.removeItem("therecipes");
        localStorage.setItem("therecipes", JSON.stringify(saveArr));

        //Add recipe name to the list of recipes
        let recipesListItem = document.createElement("LI");
        recipesListItem.innerHTML = recipeName;
        recipesListItem.addEventListener("click", (e) => showRecipe(e.target.innerHTML, true));
        document.querySelector("#recipes-list").appendChild(recipesListItem);
        
        //Reset create box fields
        document.querySelector("#recipe-name").value = "";
        document.querySelector("#recipe-ingredients").value = "";
        document.querySelector("#recipe-directions").value = "";
        document.querySelector("#recipe-prepTime-hours").value = "";
        document.querySelector("#recipe-prepTime-mins").value = "";
        document.querySelector("#recipe-servings").value = "";
        
        showRecipe(recipeName, true);
    } else {
        return false; //can't save, either a name is not given or used already
    }
    place === "recipe" ? document.querySelector(`#create-recipe`).style.display = "none" :
    document.querySelector(`#edit-recipe`).style.display = "none";
}

//Choose a recipe to showcase
function showRecipe(item, prefill) {
    let obj = ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title === item))[0];
    let recipeIngredientsShow = obj.ingredients
                                        .split("\n")
                                        .map(item => `<li>${item}</li>`);
    let recipeDirectionsShow = obj.directions
                                        .split("\n")
                                        .map(item => `<li>${item}</li>`);
    let recipePrepTimeHours = (parseInt(obj.prepTime / 60)) > 0 ? (parseInt(obj.prepTime / 60)) + "h" : "";
    let recipePrepTimeMins = obj.prepTime % 60 > 0 ? obj.prepTime % 60 + "min" : "";
    let recipeServings = obj.servings;

    document.querySelector("#showcase-name").innerHTML = item;
    document.querySelector("#showcase-ingredients").innerHTML = `<ul>${recipeIngredientsShow.reduce((item, sum) => item + sum)}</ul>`;
    document.querySelector("#showcase-directions").innerHTML = `<ol>${recipeDirectionsShow.reduce((item, sum) => item + sum)}</ol>`;
    document.querySelector("#showcase-prepTime").innerHTML = recipePrepTimeHours || recipePrepTimeMins ? `<span><i class="fas fa-clock"></i><span> `+ `<span>${recipePrepTimeHours} ${recipePrepTimeMins}</span>` : "";
    document.querySelector("#showcase-servings").innerHTML = recipeServings ? `<span><i class="fas fa-utensils"></i></span> ` + `<span>${recipeServings}</span>` : "";

    if (prefill) {
      prefillEdit();  
    }   
}
    
//Remove the recipe
function deleteRecipe() {
    let name = document.querySelector("#showcase-name").innerHTML; //selected recipe name
    let array = ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title !== name));
    localStorage.removeItem("therecipes");
    localStorage.setItem("therecipes", JSON.stringify(array));
    document.querySelector("#recipes-list").innerHTML = "";
    listRecipes();
  
    //Set deletion markers
    if (name === "Lentil soup") {   
        let saveArr = (JSON.parse(localStorage.getItem("therecipes")));
        saveArr.push({title: "firstRecipeDeletionMarker"});
        localStorage.removeItem("therecipes");
        localStorage.setItem("therecipes", JSON.stringify(saveArr));    
    }
    if (name === "Broccoli soup with crispy croutons and goat's cheese") {
        let saveArr = (JSON.parse(localStorage.getItem("therecipes")));
        saveArr.push({title: "secondRecipeDeletionMarker"});
        localStorage.removeItem("therecipes");
        localStorage.setItem("therecipes", JSON.stringify(saveArr));       
    }
    //Check if it's not a deletion act in editing
    //If no recipes are left, show nothing, otherwise show first recipe in the list
    if (arguments[0] !== "edit") {
      if ((((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title !== "firstRecipeDeletionMarker" && r.title !== "secondRecipeDeletionMarker"))).length  ==  0) {
          document.querySelector("#showcase-name").innerHTML = "";
          document.querySelector("#showcase-ingredients").innerHTML = "";
          document.querySelector("#showcase-directions").innerHTML = "";
          document.querySelector("#showcase-prepTime").innerHTML = "";
          document.querySelector("#showcase-servings").innerHTML = "";
          document.querySelector("#edit-name").value = "";
          document.querySelector("#edit-ingredients").value = "";
          document.querySelector("#edit-directions").value = "";
          document.querySelector("#edit-prepTime-hours").value = "";
          document.querySelector("#edit-prepTime-mins").value = "";
          document.querySelector("#edit-servings").value = "";
      } else {
          showRecipe((array.filter(r => r.title != "firstRecipeDeletionMarker" && r.title != "secondRecipeDeletionMarker"))[0].title, true);
      }
    }
}

//Save edited recipe
function saveRecipe() {
        deleteRecipe("edit"); //edit works as deletion of old version and saving new 
        inputRecipe("edit");
} 

//On scroll "Recipe Box" header toggles between two designs
//Content box is chosen instead of a window because when height is 100vh, scrollTop is not changing
let cont = document.querySelector("#cont");
cont.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (cont.scrollTop >= 115) {
        header.innerHTML = "<h1>Recipe Box</h1>";
        header.classList.add("active");
    } else if(cont.scrollTop < 115) {
        header.innerHTML = "<h1>Recipe<br>Box</h1>";
        header.classList.remove("active");            
    }
})