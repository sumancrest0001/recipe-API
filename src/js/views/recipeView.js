import { dom } from './base';
import { Fraction } from 'fractional';

const formatCount = count => {
    if (count) {
        const [int, decimal] = count.toString().split('.').map(el => parseInt(el, 10));
        if (!decimal) return count;
        if (int === 0) {
            const fr = new Fraction(count);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(count - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    };
    return '?';
}

export const clearRecipe = () => {
    dom.recipe.innerHTML = '';
}
const createIngredient = item =>
    `<li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check-circle"></use>
        </svg>
        <div class="recipe__count">${formatCount(item.amount)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${item.unit}</span>
            ${item.name}
        </div>
    </li>`;

export const renderRecipe = recipe => {
    const markup = `
  <figure class="recipe__fig">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-male"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>
                    <div class="recipe__info-buttons">
                        <button class="btn-tiny">
                            <svg>
                                <use href="img/icons.svg#icon-minus-circle"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny">
                            <svg>
                                <use href="img/icons.svg#icon-plus-circle"></use>
                            </svg>
                        </button>
                    </div>
                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart"></use>
                    </svg>
                </button>
            </div>
            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
                </ul>
                <button class="btn-small recipe__btn">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>
            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <a class="btn-small recipe__btn" href="${recipe.source}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-chevron-right"></use>
                    </svg>
                </a>
            </div>
  `;

    dom.recipe.insertAdjacentHTML('afterbegin', markup);
};
