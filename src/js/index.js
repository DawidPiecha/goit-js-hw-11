import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '39858115-22d22e85d671686e754408071';
const errorMessage1 = 'Oops! Something went wrong! Try reloading the page!';
const errorMessage2 =
  'Sorry, there are no images matching your search query. Please try again.';
const itemsPerPage = 40;

let searchInputTerm = '';
let page = 1;

const searchInputField = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const galleryContainer = document.querySelector('.gallery');

const fetchGallery = async () => {
  const url = `?key=${apiKey}&q=${searchInputTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${itemsPerPage}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('fetchGallery error:', error);
    Notiflix.Notify.failure(errorMessage1);
  }
};
