import Search from './models/search';
import Recipe from './models/recipe';
import { dom, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
// const search = new Search('pizza');
// console.log(search);
// search.getResults();


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
  console.log(id);
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
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert(error);
    }

  }
};
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));