import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const itemsPerPage = 40;

const fetchGallery = async (searchInputTerm, page) => {
  const url = `?key=${apiKey}&q=${searchInputTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${itemsPerPage}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('fetchGallery error:', error);
  }
};
export { fetchGallery };
