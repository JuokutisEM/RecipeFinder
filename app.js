document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const ingredientInput = document.getElementById('ingredient');
    const recipesDiv = document.getElementById('recipes');
    const loadingSpinner = document.getElementById('loading');
    const errorMessage = document.getElementById('error');

    searchButton.addEventListener('click', () => {
        const ingredient = ingredientInput.value;
        if (ingredient) {
            fetchRecipes(ingredient);
        }
    });

    async function fetchRecipes(ingredient) {
        loadingSpinner.style.display = 'block';
        errorMessage.textContent = '';
        recipesDiv.innerHTML = '';
        
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=5&apiKey=168d1a8da3a84f6f8a60f3e50c104d0e`);
            const recipes = await response.json();
            if (recipes.length === 0) {
                throw new Error('No recipes found');
            }
            displayRecipes(recipes);
        } catch (error) {
            errorMessage.textContent = error.message;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    async function fetchRecipeDetails(id) {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=168d1a8da3a84f6f8a60f3e50c104d0e`);
            const recipe = await response.json();
            return recipe.sourceUrl;
        } catch (error) {
            console.error('Error fetching recipe details:', error);
            return '#'; // Fallback URL in case of error
        }
    }

    async function displayRecipes(recipes) {
        recipesDiv.innerHTML = '';
        for (const recipe of recipes) {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = recipe.title;

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;

            const recipeLink = document.createElement('a');
            recipeLink.href = await fetchRecipeDetails(recipe.id);
            recipeLink.target = '_blank'; // Open in a new tab
            recipeLink.appendChild(recipeTitle);
            recipeLink.appendChild(recipeImage);

            recipeDiv.appendChild(recipeLink);
            recipesDiv.appendChild(recipeDiv);
        }
    }
});
