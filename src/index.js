import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  inputSearch: document.querySelector('#inputSearch'),
  btnSearch: document.querySelector('.btnSeach'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const KEY = '34209652-437fd061aa0754a74419b4413';
const URL = 'https://pixabay.com/api/';
const IMAGETYPE = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';
const PER_PAGE = 50;
let page = 1;
let query = '';
let pages = 1;
let pics = [];
let totalHits = 0;

function onSearch(e) {
  e.preventDefault();

  if (query === refs.inputSearch.value || !refs.inputSearch.value) {
    return;
  }
  if (query !== refs.inputSearch.value) {
    refs.gallery.innerHTML = '';
  }

  query = refs.inputSearch.value;
  console.log(query);
  page = 1;
  fetchQuery(query);
}

refs.form.addEventListener('submit', onSearch);

function fetchQuery(query) {
  axios
    .get(
      `${URL}?key=${KEY}&per_page=${PER_PAGE}&page=${page}&q=${query}&image_type=${IMAGETYPE}&orientation=${orientation}&safesearch=${safesearch}`
    )
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }

      console.log(response);
      console.log(response.data.hits);
      const pictures = response.data.hits;
      pics = pictures;
      totalHits = response.data.totalHits;
      console.log(totalHits);
      pages = Math.ceil(totalHits / PER_PAGE);
      console.log(pages);

      if (totalHits !== 0) {
        loadMoreVisible();
      } else {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      return pics;
    })
    .then(renderPictures)
    .catch(error => console.log(error.message));
}

function renderPictures(pic) {
  const list = pic
    .map(onePic => {
      return `<div class="photo-card">
  <img src="${onePic.webformatURL}" alt="${onePic.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${onePic.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${onePic.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${onePic.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${onePic.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  if (!page) {
    refs.gallery.innerHTML = '';
  }
  refs.gallery.insertAdjacentHTML('beforeend', list);
}

function onSearchMore(e) {
  e.preventDefault();

  query = refs.inputSearch.value;
  console.log(query);
  fetchQuery(query);
}

const handleLoadMore = e => {
  if (query !== refs.inputSearch.value || !refs.inputSearch.value) {
    return;
  }
  page++;
  if (pages === page) {
    loadMoreInactive();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else onSearchMore(e);
};

refs.loadMore.addEventListener('click', handleLoadMore);

// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку(для безкоштовного акаунту).
// Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом
// "We're sorry, but you've reached the end of search results.".

// Використовується синтаксис async/await.

const loadMoreVisible = () => {
  refs.loadMore.classList.remove('inactive');
};
const loadMoreInactive = () => {
  refs.loadMore.classList.add('inactive');
};
