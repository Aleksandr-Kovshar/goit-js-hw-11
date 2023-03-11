import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  inputSearch: document.querySelector('#inputSearch'),
  btnSearch: document.querySelector('.btnSeach'),
  picturesList: document.querySelector('.pictures-list'),
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
      return `<li class="pictures-list__item">
           <img class = "image" src="${onePic.previewURL}" alt="" >
           </li>`;
    })
    .join('');
  refs.picturesList.innerHTML = list;
}
