
        // transfer to CSS
        //document.querySelector("#create-recipe").style.display = "none";
        //document.querySelector("#edit-recipe").style.display = "none";

        //3 recipes that are saved to localStore
        localStorage.setItem("Lentil soup", JSON.stringify({ingredients: "2l veg or ham stock\n 150g red lentils\n 6 carrots, finely chopped\n 2 medium leeks, sliced (300g)\n small handful chopped parsley, to serve", directions: "Heat the stock in a large pan and add the lentils. Bring back to the boil and allow the lentils to soften for a few mins.\n Add the carrots and leeks to the lentils and season (don't add salt if you use ham stock as it will make it too salty). Bring to the boil, the reduce the heat, cover and simmer for 45-60 mins until the lentils have broken down. Scatter over the parsley and serve with buttered bread, if you like."}));
        localStorage.setItem("Nekepti jogurtiniai uogų torčiukai", JSON.stringify({ingredients: "2 šaukštų želatinos\n1 apelsino sulčių\n0,5–1 citrinos sulčių\n200 g grietinės\n400 g graikiško jogurto\n6 šaukštų miltelinio cukraus\n1 stiklinės šviežių arba šaldytų aviečių\n12 vnt. mėgstamų apvalių plokščių sausainių\nšviežių mėgstamų uogų papuošti", directions:"į dubenėlį išspaudžiame pusės apelsino sultis, suberiame želatiną ir paliekame brinkti 15–20 minučių.\nĮ didelį dubenį supilame grietinę ir jogurtą, suberiame cukrų ir avietes, išspaudžiame citrinos sultis. Gerai išplakame elektriniu maišytuvu, kol masė taps vientisa. Užverdame mažą puodą vandens, jame statome dubenėlį su išbrinkusia želatina. Maišydami visiškai ją ištirpiname, sumaišome su likusiomis pusės apelsino sultimis.\nĮ aviečių ir jogurto masę lėtai pildami įmaišome tirpintą želatiną. Paragaujame – jei mėgstate saldžiau, įberkite dar cukraus.\nĮ silikonines keksiukų kepimo formeles „Kaiser flexo“ įberiame mėgstamų uogų, iki viršaus užpilame jogurto mase, kiekvieną formelę uždengiame sausainiu, visą formą pridengiame maistine plėvele ir dedame į šaldytuvą 1–2 val. sustingti.\nPatiekdami į gilesnę skardą pripilame karšto vandens ir įmerkiame deserto formą. Palaikome apie vieną minutę, ištraukiame, plonu peiliu negiliai apipjauname desertų kraštus. Ant formos uždedame ją visą dengiantį padėklą ar lentelę ir staigiu judesiu apverčiame. Ragaujame."}));

        //lists names of all recipes that have been created and saved in localStorage
        function recipeListing() {
            const recipesListNames = Object.keys(localStorage);

            for (let i = 0; i < recipesListNames.length; i++) {
                const recipesListItem = document.createElement("LI");
                recipesListItem.innerHTML = recipesListNames[i];
                recipesListItem.addEventListener("click", showRecipe);
                console.log(document.getElementById("recipes-list"))
                (document.querySelector("#recipes-list")).appendChild(recipesListItem);
            }
        }
        recipeListing();

        //showcasing a recipe and pre-filling edit fields
        if (localStorage.length === 0) {
                ["name", "ingridients", "directons"].forEach(el => document.querySelector(`#showcase-${el}`).innerHTML = "");
            } else {
                showRecipeName(document.querySelector("#recipes-list").firstChild.innerHTML);
                }
        
        function prefillEdit(){
            const name = document.querySelector("#showcase-name").innerHTML; //chosen recipe name
            const ingredients = JSON.parse(localStorage.getItem(name)).ingredients;
            const directions = JSON.parse(localStorage.getItem(name)).directions;
            
            document.querySelector("#edit-name").value = name;
            document.querySelector("#edit-ingredients").value = ingredients;
            document.querySelector("#edit-directions").value = directions;
        };
        prefillEdit();

        //saving recipe in localStorage from either create or edit boxes
        
        function inputRecipe(place) {

            place === "recipe" ? document.querySelector(`#create-recipe`).style.display = "grid" :
            document.querySelector(`#edit-recipe`).style.display = "grid";

            let recipeName = document.querySelector(`#${place}-name`).value;
            if (!(localStorage.getItem(recipeName)) && recipeName !== "") {
                let recipeObject = {
                                "ingredients": document.querySelector(`#${place}-ingredients`).value,
                                "directions": document.querySelector(`#${place}-directions`).value
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
            document.querySelector("#showcase-name").innerHTML = item;
            //creating bullets and numbering
            document.querySelector("#showcase-ingredients").innerHTML = `<ul>${recipeIngredientsShow.reduce((item, sum) => item + sum)}</ul>`;
            document.querySelector("#showcase-directions").innerHTML = `<ol>${recipeDirectionsShow.reduce((item, sum) => item + sum)}</ol>`;
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
            } else {
                showRecipeName(map2[0]);
                }
        }
        //edit and save or close unsaved recipe
        function saveRecipe(choice) {
            if (choice === "save") {
                deleteRecipe();
                inputRecipe("edit");

            } else {
                document.querySelector("#edit-recipe").style.display = "none";
                //return false;
            }
        } 

        //while scrolling "Recipe Box" header toggles between two designs
        window.addEventListener("scroll", function() {
            const header = document.querySelector("header");
            console.log(window.pageYOffset);
            if (window.pageYOffset >= 115) {
                header.innerHTML = "<h1>Recipe Box</h1>";
                header.classList.add("active");
            } else if(window.pageYOffset < 115) {
                header.innerHTML = "<h1>Recipe<br>Box</h1>";
                header.classList.remove("active");            }
        })