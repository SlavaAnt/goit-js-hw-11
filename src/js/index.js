// import { fetchImage } from './api-service';
import NewsApiService from './api-service';
import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  box: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.js-load-btn'),
};

// Отримання нового екземпляру класу NewsApiService для отримання об'єкту з методами та властивостями
const newsApiService = new NewsApiService();

const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
//--------------------------------------------
refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  // clearBoxGalley();
  newsApiService.query = e.currentTarget.elements.searchQuery.value; // При події пошуку отримання доступу до форми та значення інпуту (searchQuery - це значення атрибуту name тегу input у html)

  // Перевірка на пустий рядок
  if (newsApiService.query === '') {
    return onNoImages();
  }
  newsApiService.resetPage();
  newsApiService
    .getImages()
    .then(data => {
      const hits = data.hits;
      const totalHits = data.totalHits;
      if (totalHits > 0) {
        onTotalHits(totalHits);
      }
      clearBoxGalley();
      renderMarkup(hits);
      refs.btnLoadMore.hidden = false;
    })
    .catch(error => console.log(error))
    .finally(() => refs.form.reset());
  //------------------------------------------
  //   .then(renderMarkup (так - передається посилання на функцію (аналог data => functionName(data)). Функція буде викликана тільки тоді коли прийдуть дані з серверу!!!))
}
//==================================================
function onLoadMore() {
  const page = newsApiService.page;
  newsApiService.getImages().then(data => {
    const hits = data.hits;
    const totalHits = data.totalHits;
    renderMarkup(hits);
    const a = page * hits.length;

    if (a > totalHits) {
      refs.btnLoadMore.hidden = true;
      onFreeSearch();
    }
  });
  // .catch(onNoImages());
}
//==================================================
function renderMarkup(hits) {
  const markup = onCardMarkup(hits);
  refs.box.insertAdjacentHTML('beforeend', markup);
  // refs.box.innerHTML = markup;
  gallerySimpleLightbox.refresh();
}

function clearBoxGalley() {
  refs.box.innerHTML = '';
}

function onCardMarkup(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" width="285" height="190" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>`
    )
    .join(''); // переведення з масиву до рядка
}
//-------------------------------------
function onNoImages() {
  Notiflix.Notify.failure(
    `❌ "Sorry, there are no images matching your search query. Please try again."`
  );
}
function onTotalHits(totalHits) {
  Notiflix.Notify.success(`✅ Hooray! We found ${totalHits} images.`);
}
function onFreeSearch() {
  Notiflix.Notify.failure(
    `❌ "We're sorry, but you've reached the end of search results."`
  );
}
//==================================================
