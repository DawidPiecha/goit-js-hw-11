import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
import fetchGallery from './api.js';

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

  data = await fetchGallery();

  if (!data) {
    Notiflix.Notify.failure(errorMessage2);
    return;
  }
  const hits = data.hits;

  if (hits.length === 0) {
    Notiflix.Notify.failure(errorMessage2);
    return;
  }
  displayGallery(hits);

  resetButton.style.display = 'inline';
  loadMoreButton.style.display = 'flex';

  const lightbox = new SimpleLightbox('.gallery a');
});

loadMoreButton.addEventListener('click', async () => {
  page++;

  const newData = await fetchGallery();

  if (!newData) {
    Notiflix.Notify.failure(errorMessage3);
    return;
  }

  const newHits = newData.hits;

  if (newHits.length === 0) {
    Notiflix.Notify.info(infoMessage);
    return;
  }
  data.hits = [...data.hits, ...newHits];
  displayGallery(data.hits);

  const lightbox = new SimpleLightbox('.gallery a');
});

resetButton.addEventListener('click', event => {
  event.preventDefault();
  clearGallery();
  loadMoreButton.style.display = 'none';
  resetButton.style.display = 'none';
  const form = document.querySelector('.search-form');
  form.reset();
});
