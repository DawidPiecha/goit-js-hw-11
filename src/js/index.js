import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '39858115-22d22e85d671686e754408071';
const errorMessage1 = 'Please enter a search term.';
const errorMessage2 =
  'Sorry, there are no images matching your search query. Please try again.';
const itemsPerPage = 40;

let searchInputTerm = '';
let page = 1;
let data;
const searchInputField = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const galleryContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const resetButton = document.querySelector('.reset-button');

resetButton.style.display = 'none';
loadMoreButton.style.display = 'flex';
const clearGallery = () => {
  galleryContainer.innerHTML = '';
};
clearGallery();

const fetchGallery = async () => {
  const url = `?key=${apiKey}&q=${searchInputTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${itemsPerPage}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('fetchGallery error:', error);
  }
};

searchButton.addEventListener('click', async event => {
  event.preventDefault();
  clearGallery();
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
    Notiflix.Notify.warning(errorMessage2);
    return;
  }
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

  // resetButton.style.display = 'inline';

  const lightbox = new SimpleLightbox('.gallery a');
});
