import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  inputSearch: document.querySelector('#inputSearch'),
  btnSearch: document.querySelector('.btnSeach'),
  gallery: document.querySelector('.gallery'),
};

const KEY = '34209652-437fd061aa0754a74419b4413';
const URL = 'https://pixabay.com/api/';

function onSearch(e) {
  e.preventDefault();
  const query = refs.inputSearch.value;

  console.log(query);

  fetchQuery(query);
}

refs.form.addEventListener('submit', onSearch);

function fetchQuery(query) {
  axios
    .get(`${URL}?key=${KEY}&q=${query}&image_type=photo`)
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
  refs.gallery.innerHTML = list;
}
