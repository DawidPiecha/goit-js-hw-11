import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchGallery } from './api.js';

const errorMessage1 = 'Please enter a search term.';
const errorMessage2 =
  'Sorry, there are no images matching your search query. Please try again or reload the page.';
const errorMessage3 = 'Failed to load more images.';
const infoMessage = 'No more images available';
let searchInputTerm = '';
let page = 1;
let data;

const searchInputField = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const galleryContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const resetButton = document.querySelector('.reset-button');
const infoForUser = document.querySelector('.info-for-user');

infoForUser.style.display = 'none';
resetButton.style.display = 'none';
loadMoreButton.style.display = 'none';

const clearGallery = () => {
  galleryContainer.innerHTML = '';
};
clearGallery();

const displayGallery = hits => {
  const galleryElements = hits
    .map(hit => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hit;
      return `<div class="photo-card"> <a href="${largeImageURL}">
    <img class="picture" src="${webformatURL}" alt="${tags}" loading="lazy" title="${tags}"/></a>
    <div class="info">
      <p class="info-item">
        <b>Likes </b></br>${likes}
      </p>
      <p class="info-item">
        <b>Views </b></br>${views}
      </p>
      <p class="info-item">
        <b>Comments </b></br>${comments}
      </p>
      <p class="info-item">
        <b>Downloads </b></br>${downloads}
      </p>
    </div>
  </div>`;
    })
    .join('');
  galleryContainer.innerHTML = galleryElements;
};

searchButton.addEventListener('click', async event => {
  event.preventDefault();

  searchInputTerm = searchInputField.value.trim();

  if (!searchInputTerm) {
    Notiflix.Notify.warning(errorMessage1);
    return;
  }

  data = await fetchGallery(searchInputTerm, page);

  if (!data) {
    Notiflix.Notify.failure(errorMessage2);
    return;
  }
  const hits = data.hits;
  const totalHits = data.totalHits;

  if (hits.length === 0) {
    Notiflix.Notify.failure(errorMessage2);
    return;
  }
  displayGallery(hits);

  resetButton.style.display = 'inline';
  loadMoreButton.style.display = 'flex';
  infoForUser.style.display = 'block';
  infoForUser.innerHTML = `We've found <strong>${hits.length}</strong> pictures from <strong>${totalHits}</strong> available.`;

  const lightbox = new SimpleLightbox('.gallery a');
});

loadMoreButton.addEventListener('click', async () => {
  page++;

  const newData = await fetchGallery(searchInputTerm, page);

  if (!newData) {
    Notiflix.Notify.failure(errorMessage3);
    return;
  }
  const hits = data.hits;
  const newHits = newData.hits;
  const newTotalHits = newData.totalHits;

  if (newHits.length === 0) {
    Notiflix.Notify.info(infoMessage);
    return;
  }
  data.hits = [...data.hits, ...newHits];
  displayGallery(data.hits);

  infoForUser.style.display = 'block';
  infoForUser.innerHTML = `We've found <strong>${
    hits.length + newHits.length
  }</strong> pictures from <strong>${newTotalHits}</strong> available.`;
  const lightbox = new SimpleLightbox('.gallery a');
});

resetButton.addEventListener('click', event => {
  event.preventDefault();
  clearGallery();
  loadMoreButton.style.display = 'none';
  resetButton.style.display = 'none';
  infoForUser.style.display = 'none';
  const form = document.querySelector('.search-form');
  form.reset();
});
