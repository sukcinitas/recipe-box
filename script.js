    //two recipes initially saved to localStorage, they are not set to localStorage if deleted previously
    if(!localStorage.getItem("first")) {
        localStorage.setItem("Lentil soup", JSON.stringify({
            ingredients: "2l veg or ham stock\n150g red lentils\n6 carrots, finely chopped\n2 medium leeks, sliced (300g)\nsmall handful chopped parsley, to serve", 
            directions: "Heat the stock in a large pan and add the lentils. Bring back to the boil and allow the lentils to soften for a few mins.\nAdd the carrots and leeks to the lentils and season (don't add salt if you use ham stock as it will make it too salty). Bring to the boil, the reduce the heat, cover and simmer for 45-60 mins until the lentils have broken down. Scatter over the parsley and serve with buttered bread, if you like.",
            servings: 4,
            prepTime: "1h 10min"}));
    }
    if (!localStorage.getItem("second")) {
        localStorage.setItem("Broccoli soup with crispy croutons and goat's cheese", JSON.stringify({
            ingredients:"2 thick, crustless slices of bread, cubed\n1 tbsp olive oil\n900g broccoli\n50g butter\n1 large onion, finelychopped\ngenerous grating fresh nutmeg or ¼ tsp dried\n1l vegetable or chicken stock\n600ml full cream milk\n100g medium-soft goat's cheese, chopped (rind and all)",directions:"Preheat the oven to 200C/gas 6/fan 190C. Put the bread in a bowl and add the oil and a little salt. Mix well to coat the bread, then tip onto a baking tray. Bake for 10-12 minutes until crunchy and golden.\nMeanwhile, chop the broccoli stalks and florets, but keep them separate. Melt the butter in a pan, then add the onion, broccoli stalks and nutmeg and fry for 5 minutes until soft. Add the broccoli florets and stock, then the milk. Cover and simmer gently for 8 minutes until the broccoli is tender.\nTake out about four ladles of broccoli, then blend the rest in a food processor or with a hand blender, until smooth. Return the reserved broccoli to the soup and check for seasoning. (The soup will keep in the fridge for 2 days or you can cool and freeze it and keep the croutons in a plastic food bag.)\nTo serve, reheat if necessary and scatter with the croutons and goat’s cheese.",
            servings: 4,
            prepTime: "40-50min"}));
    }

    //adds names of all recipes that have been created and saved in localStorage to list except for "first" and "second", which only contain deletion info of initial two recipes
    const recipeListing = () => {
        const recipesListNames = Object.keys(localStorage);
        for (let i = 0; i < recipesListNames.length; i++) {
            console.log(recipesListNames[i])
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
    if (localStorage.length === 0) {
        ["name", "ingridients", "directons"].forEach(el => document.querySelector(`#showcase-${el}`).innerHTML = "");
    } else {
        showRecipeName(document.querySelector("#recipes-list").firstChild.innerHTML);
    }
    
    function prefillEdit(){
        const name = document.querySelector("#showcase-name").innerHTML; //chosen recipe name
        const ingredients = (JSON.parse(localStorage.getItem(name)).ingredients);
        const ing = " -- " + ingredients.split('\n').join('\n -- ');
        const directions = (JSON.parse(localStorage.getItem(name)).directions);
        const dir = " -- " + directions.split('\n').join('\n -- ');
        const prepTime = (JSON.parse(localStorage.getItem(name)).prepTime);
        const servings = (JSON.parse(localStorage.getItem(name)).servings);
        
        document.querySelector("#edit-name").value = name;
        document.querySelector("#edit-ingredients").value = ing;
        document.querySelector("#edit-directions").value = dir;
        document.querySelector("#edit-prepTime").value = prepTime;
        document.querySelector("#edit-servings").value = servings;
    };
    prefillEdit();


    //saving recipe in localStorage from either create or edit boxes(place)
    function inputRecipe(place) {

        place === "recipe" ? document.querySelector(`#create-recipe`).style.display = "grid" :
        document.querySelector(`#edit-recipe`).style.display = "grid";


        let recipeName = document.querySelector(`#${place}-name`).value;
        if (!(localStorage.getItem(recipeName)) && recipeName !== "") {
            let recipeObject = {
                            "ingredients": document.querySelector(`#${place}-ingredients`).value,
                            "directions": document.querySelector(`#${place}-directions`).value,
                            "prepTime": document.querySelector(`#${place}-prepTime`).value,
                            "servings": document.querySelector(`#${place}-servings`).value
                            }
            localStorage.setItem(recipeName, JSON.stringify(recipeObject));

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
        let recipeIngredientsShow = JSON.parse(localStorage.getItem(item)).ingredients
                                                                            .split("\n")
                                                                            .map(item => `<li>${item}</li>`);
        let recipeDirectionsShow = JSON.parse(localStorage.getItem(item)).directions
                                                                            .split("\n")
                                                                            .map(item => `<li>${item}</li>`);
        let recipePrepTime = JSON.parse(localStorage.getItem(item)).prepTime;
        let recipeServings = JSON.parse(localStorage.getItem(item)).servings;
        document.querySelector("#showcase-name").innerHTML = item;
        //creating bullets and numbering
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
        let list = document.querySelector("#recipes-list");
        let map = Array.prototype.slice.call(list.childNodes).map(child => child.innerText);
        
        localStorage.removeItem(name);
        list.removeChild(list.childNodes[map.indexOf(name)]);
        //if none left - shows nothing in showcase, if deleted, shows first recipe
        let map2 = Array.prototype.slice.call(list.childNodes).map(child => child.innerText);
        if (map2.length === 0) {
            document.querySelector("#showcase-name").innerHTML = "";
            document.querySelector("#showcase-ingredients").innerHTML = "";
            document.querySelector("#showcase-directions").innerHTML = "";
            document.querySelector("#showcase-prepTime").innerHTML = "";
            document.querySelector("#showcase-servings").innerHTML = "";
        } else {
            showRecipeName(map2[0]);
        }

        //when initial recipes are deleted, deletion fact info is saved in localStorage, so on next visit those recipes are not shown
        if (name === "Lentil soup") {
           localStorage.setItem("first", "deleted");       
        }
        if (name === "Broccoli soup with crispy croutons and goat's cheese") {
           localStorage.setItem("second", "deleted");      
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