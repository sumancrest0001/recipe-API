import { dom } from './base';

export const getInput = () => dom.searchInput.value;
export const clearSearch = () => {
  dom.searchInput.value = '';
};
export const clearResults = () => {
  dom.recipeList.innerHTML = '';
  dom.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
  const nodeArr = Array.from(document.querySelectorAll('.results__link'));
  nodeArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, current) => {
      if (acc + current.length <= limit) {
        newTitle.push(current);
      }
      return acc + current.length;
    }, 0);
    //return the result
    return `${newTitle.join(' ')} ...`;
  }
  return title;
}
const renderRecipe = recipe => {
  const markup = `<li>
  <a class="results__link" href="#${recipe.id}">
      <figure class="results__fig">
          <img src="https://spoonacular.com/recipeImages/${recipe.image}" alt="${recipe.title}">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
      </div>
  </a>
</li>`;
  dom.recipeList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `<button class="btn-inline results__btn--${type}" data-goto= ${type === 'prev' ? page - 1 : page + 1}>
  <svg class="search__icon"><use href="img/icons.svg#icon-chevron-${type === 'prev' ? 'left' : 'right'}"></use>
  </svg>
  <span>Page ${type === 'prev' ? page - 1 : page + 1}</span></button>`;


const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    button = createButton(page, 'next');
  } else if (page < pages) {
    button = `${createButton(page, 'next')}
              ${createButton(page, 'prev')}`;
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev')
  }
  dom.searchResPages.insertAdjacentHTML('afterbegin', button);
}
export const renderResults = (recipes, page = 1, resPerPage = 5) => {
  //render results
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  //render button
  renderButtons(page, recipes.length, resPerPage);
}