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
const PER_PAGE = 4;
let page = 1;
let query = '';
let pages = 1;
let pics = [];

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
      return pictures;
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
  page++;
  onSearchMore(e);
};

refs.loadMore.addEventListener('click', handleLoadMore);
