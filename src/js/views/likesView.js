import { dom } from './base';

export const toggleLikedBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart1';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeField = numLikes => {
  dom.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};


export const renderLike = like => {
  const markup = `
  <li>
  <a class="results__link" href="#${like.id}">
      <figure class="results__fig">
          <img src="${like.img}" alt="${like.title}">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${like.title}</h4>
      </div>
  </a>
</li>`;

  dom.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
  const el = document.querySelector(`.likes__link[href*="${id}"`).parentElement;
  if (el) el.parentElement.removeChild(el);
};