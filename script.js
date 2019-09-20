//two recipes initially saved to localStorage are not set repeatedly on page reload/another browser session if deleted previously. "first" and "second" mark the deletion fact, so if they exist, the two recipes should not be set
let setArray; //array of "first" and "second"
let array = JSON.parse(localStorage.getItem("therecipes")) || [];

if (JSON.parse(localStorage.getItem("therecipes")) && JSON.parse(localStorage.getItem("therecipes")).length != 0) {
    setArray = (JSON.parse(localStorage.getItem("therecipes")).filter(r => r.title == "first" || r.title == "second"));    
} else {
    setArray = [];
}

//if "first" or "second" are not marked and the two recipes are already set, don't set them once more
if((setArray.filter(r=>r.title === "first")).length === 0 && (array.filter(r=>r.title === "Lentil soup")).length === 0) {
    let obj = {
        title: "Lentil soup", 
        ingredients: "2l veg or ham stock\n150g red lentils\n6 carrots, finely chopped\n2 medium leeks, sliced (300g)\nsmall handful chopped parsley, to serve", 
        directions: "Heat the stock in a large pan and add the lentils. Bring back to the boil and allow the lentils to soften for a few mins.\nAdd the carrots and leeks to the lentils and season (don't add salt if you use ham stock as it will make it too salty). Bring to the boil, the reduce the heat, cover and simmer for 45-60 mins until the lentils have broken down. Scatter over the parsley and serve with buttered bread, if you like.",
        servings: 4,
        prepTime: "1h 10min"
    }
    array.push(obj);
}
if ((setArray.filter(r=>r.title === "second")).length === 0 && (array.filter(r=>r.title === "Broccoli soup with crispy croutons and goat's cheese")).length === 0) {
    let obj = {
        title: "Broccoli soup with crispy croutons and goat's cheese",
        ingredients:"2 thick, crustless slices of bread, cubed\n1 tbsp olive oil\n900g broccoli\n50g butter\n1 large onion, finelychopped\ngenerous grating fresh nutmeg or ¼ tsp dried\n1l vegetable or chicken stock\n600ml full cream milk\n100g medium-soft goat's cheese, chopped (rind and all)",directions:"Preheat the oven to 200C/gas 6/fan 190C. Put the bread in a bowl and add the oil and a little salt. Mix well to coat the bread, then tip onto a baking tray. Bake for 10-12 minutes until crunchy and golden.\nMeanwhile, chop the broccoli stalks and florets, but keep them separate. Melt the butter in a pan, then add the onion, broccoli stalks and nutmeg and fry for 5 minutes until soft. Add the broccoli florets and stock, then the milk. Cover and simmer gently for 8 minutes until the broccoli is tender.\nTake out about four ladles of broccoli, then blend the rest in a food processor or with a hand blender, until smooth. Return the reserved broccoli to the soup and check for seasoning. (The soup will keep in the fridge for 2 days or you can cool and freeze it and keep the croutons in a plastic food bag.)\nTo serve, reheat if necessary and scatter with the croutons and goat’s cheese.",
        servings: 4,
        prepTime: "40-50min"
    };
    array.push(obj);
}

localStorage.removeItem("therecipes");
localStorage.setItem("therecipes", JSON.stringify(array));


//adds names of all recipes that have been created and saved in localStorage to list except for "first" and "second", which only contain deletion info of initial two recipes
const recipeListing = () => {
    const recipesListNames = (JSON.parse(localStorage.getItem("therecipes"))).map(r => r.title);
    for (let i = 0; i < recipesListNames.length; i++) {
        if(recipesListNames[i] === "first" || recipesListNames[i] === "second") {
            continue;
        }
        const recipesListItem = document.createElement("LI");
        recipesListItem.innerHTML = recipesListNames[i];
        recipesListItem.addEventListener("click", showRecipe);
        document.querySelector("#recipes-list").appendChild(recipesListItem);
    }
}
recipeListing();



//showcasing first recipe and pre-filling edit fields
if ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title != "first" && r.title != "second").length == 0) {
    // ["name", "ingredients", "directons","prepTime", "servings"].forEach(el => document.querySelector(`#showcase-${el}`).innerHTML = "");
} else {
    showRecipeName(document.querySelector("#recipes-list").firstChild.innerHTML);
    prefillEdit();
}

function prefillEdit(){
    const name = document.querySelector("#showcase-name").innerHTML; //chosen recipe name
    let recipe = ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title === name))[0];

    const ing = " -- " + recipe.ingredients.split('\n').join('\n -- ');
    const dir = " -- " + recipe.directions.split('\n').join('\n -- ');
    const prepTime = recipe.prepTime;
    const servings = recipe.servings;
    
    document.querySelector("#edit-name").value = name;
    document.querySelector("#edit-ingredients").value = ing;
    document.querySelector("#edit-directions").value = dir;
    document.querySelector("#edit-prepTime").value = prepTime;
    document.querySelector("#edit-servings").value = servings;
};


 //saving recipe in localStorage from either create or edit boxes(place)
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
                        "prepTime": document.querySelector(`#${place}-prepTime`).value,
                        "servings": document.querySelector(`#${place}-servings`).value
                        }
        
        let saveArr = (JSON.parse(localStorage.getItem("therecipes")));
        saveArr.push(recipeObject);
        localStorage.removeItem("therecipes");
        localStorage.setItem("therecipes", JSON.stringify(saveArr));

        //adding recipe name to list of recipes on submit
        let recipesListItem = document.createElement("LI");
        recipesListItem.innerHTML = recipeName;
        recipesListItem.addEventListener("click", showRecipe);
        document.querySelector("#recipes-list").appendChild(recipesListItem);

    } else {
        return false; //can't save
    }
    place === "recipe" ? document.querySelector(`#create-recipe`).style.display = "none" :
    document.querySelector(`#edit-recipe`).style.display = "none";
}

  //choosing a recipe to show in showcase
function showRecipeName(item) {
    let obj = ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title === item))[0];
    console.log(obj)
    let recipeIngredientsShow = obj.ingredients
                                        .split("\n")
                                        .map(item => `<li>${item}</li>`);
    let recipeDirectionsShow = obj.directions
                                        .split("\n")
                                        .map(item => `<li>${item}</li>`);
    let recipePrepTime = obj.prepTime;
    let recipeServings = obj.servings;

    document.querySelector("#showcase-name").innerHTML = item;
    document.querySelector("#showcase-ingredients").innerHTML = `<ul>${recipeIngredientsShow.reduce((item, sum) => item + sum)}</ul>`;
    document.querySelector("#showcase-directions").innerHTML = `<ol>${recipeDirectionsShow.reduce((item, sum) => item + sum)}</ol>`;
    document.querySelector("#showcase-prepTime").innerHTML = recipePrepTime ? `<span><i class="fas fa-clock"></i><span> `+ `<span>${recipePrepTime}</span>` : "";
    document.querySelector("#showcase-servings").innerHTML = recipeServings ? `<span><i class="fas fa-utensils"></i></span> ` + `<span>${recipeServings}</span>` : "";
}
    
function showRecipe(e) {
    showRecipeName(e.target.innerHTML);
    prefillEdit();
}

//remove the recipe
function deleteRecipe() {
    let name = document.querySelector("#showcase-name").innerHTML; //selected recipe name

    let array = ((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title !== name));
    console.log(array[0])
    localStorage.removeItem("therecipes");
    localStorage.setItem("therecipes", JSON.stringify(array));
    document.querySelector("#recipes-list").innerHTML = "";
    recipeListing();

    //after deletion, if no recipes are left, show nothing, otherwise show firt recipe in the list
    if (  (((JSON.parse(localStorage.getItem("therecipes"))).filter(r => r.title !== "first" && r.title !== "second"))).length  ==  0) {
        document.querySelector("#showcase-name").innerHTML = "";
        document.querySelector("#showcase-ingredients").innerHTML = "";
        document.querySelector("#showcase-directions").innerHTML = "";
        document.querySelector("#showcase-prepTime").innerHTML = "";
        document.querySelector("#showcase-servings").innerHTML = "";
    } else {
        showRecipeName((array.filter(r=> r.title != "first" && r.title != "second"))[0].title)
    }

    //when initial recipes are deleted, deletion fact info is saved in localStorage, so on next visit those recipes are not shown, name is of selected recipe
    if (name === "Lentil soup") {   
        let saveArr = (JSON.parse(localStorage.getItem("therecipes")));
        saveArr.push({title: "first"});
        localStorage.removeItem("therecipes");
        localStorage.setItem("therecipes", JSON.stringify(saveArr));    
    }
    if (name === "Broccoli soup with crispy croutons and goat's cheese") {
        let saveArr = (JSON.parse(localStorage.getItem("therecipes")));
        saveArr.push({title: "second"});
        localStorage.removeItem("therecipes");
        localStorage.setItem("therecipes", JSON.stringify(saveArr));       
    }
}


//edit and save or close unsaved recipe
function saveRecipe(choice) {
    if (choice === "save") {
        deleteRecipe(); //edit works as deletion of old version and saving new 
        inputRecipe("edit");
    } else {
        document.querySelector("#edit-recipe").style.display = "none";
    }
} 

//while scrolling "Recipe Box" header toggles between two designs
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if (window.pageYOffset >= 115) {
        header.innerHTML = "<h1>Recipe Box</h1>";
        header.classList.add("active");
    } else if(window.pageYOffset < 115) {
        header.innerHTML = "<h1>Recipe<br>Box</h1>";
        header.classList.remove("active");            
    }
})