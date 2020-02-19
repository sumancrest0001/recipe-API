import Search from './models/search';
import Recipe from './models/recipe';
import { dom, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import List from './models/list';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Likes from './models/likes';

/** Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * Liked recipes
 */
const state = {};

const controlSearch = async () => {
  // 1.Get query from view
  const query = searchView.getInput();
  if (query) {
    //2. New search object and add to the state
    state.search = new Search(query);
    // 3. Prepare UI for results
    searchView.clearSearch();
    searchView.clearResults();
    renderLoader(dom.recipeList);
    try {
      //4. Search for recipes
      await state.search.getResults();
      //5. render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Recipe not found');
      clearLoader();
    }
  }
}

//event handler

dom.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
dom.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});



// Recipe controller
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(dom.recipe)
    //Highlight selected recipe

    if (state.search) searchView.highlightSelected(id);
    //Create new recipe object
    state.recipe = new Recipe(id);
    window.r = state.recipe;
    try {
      // Get recipe data
      await state.recipe.getRecipe();
      // Render recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
    } catch (error) {
      alert(error);
    }

  }
};

//list Controller

const listController = () => {
  // creating an new object if there is not list
  if (!state.list) state.list = new List();

  // Add each ingredient to the list 
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.amount, el.unit, el.name);
    listView.renderItem(item);
  });
}


// Like controller 

const likeController = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  if (!state.likes.isLiked(currentID)) {
    //User has NOT yet liked current recipe
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.source,
      state.recipe.image
    )
    // Add like to the state

    // change heart button
    likesView.toggleLikedBtn(true);
    // Add like to UI list
    likesView.renderLike(newLike);
  } else {
    //  remove like from the state
    state.likes.deleteLike(currentID);
    // change heart button
    likesView.toggleLikedBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeField(state.likes.getNumLike());
};

// Restoring liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeField(state.likes.getNumLike());
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling delete and update of list items
dom.shoppingList.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item, .shopping_item *').dataset.itemid;

  // handling delete event
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state 
    state.list.deleteItem(id);
    // delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count')) {
    const newValue = parseFloat(e.target.value, 10);
    state.list.updateCount(id, newValue);
  }
});
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Click events on recipes
dom.recipe.addEventListener('click', e => {
  // Decrease servings
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase servings
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    listController();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {

    likeController();
  }
});

