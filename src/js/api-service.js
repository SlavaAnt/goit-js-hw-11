import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33023790-bde176e9c85efd42a33b96f43';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  // метод класу fetchHits() для http запитів:
  // fetchHits() {
  //   return fetch(
  //     `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
  //   )
  //     .then(
  //       response =>
  //         // {
  //         //   if (!response.ok) {
  //         //     throw new Error(response.statusText); //  примусове переривання коду та відправлення в catch
  //         //   }
  //         response.json()
  //       // }
  //     )
  //     .then(data => {
  //       // console.log(data);
  //       // console.log(data.totalHits);
  //       this.incrementPage();

  //       return data;
  //     });
  // }

  createRequest() {
    return `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
  }

  async getImages() {
    const response = await axios.get(this.createRequest());
    this.incrementPage();
    return response.data;
  }

  // метод класу NewsApiService для збільшення сторінки на 1
  incrementPage() {
    this.page += 1;
  }
  // метод класу NewsApiService для скидання сторінки у вихідний стан
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
//==================================================
