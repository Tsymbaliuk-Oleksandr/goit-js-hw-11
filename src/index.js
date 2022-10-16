import { ApiImages } from './js/apiImages';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css'


const getImages = new ApiImages();

let sumPage = 0; 

const searchForm = document.querySelector("#search-form");
const input = document.querySelector("input");
const gallery = document.querySelector(".gallery");
const btnScroll = document.querySelector(".scroll");


searchForm.addEventListener("submit", onSubmit);

// export class ApiImages {
//     constructor(){
//         this.KEY = '30438181-5fa6a1c16c4b444b6f9a1e533';
//         this.URL = 'https://pixabay.com/api/'; 
//         this.per_page = 40;
//         this.page = 1; 
//         }
//         async fetchImages(value) {
//             const searchParams = {
//                 params: {
//                 key: this.KEY,
//                 q: `${value}`,
//                 image_type: 'photo',
//                 orientation: 'horizontal',
//                 safesearch: 'true',
//                 per_page: this.per_page,
//                 page: this.page,
//                 }
//             };
//             // стоврюємо запит
//             const response = await axios.get(this.URL, searchParams);
    
//             const data = response.data;
//             return data;
//         }
    
//         incrementPage() {
//             this.page += 1; 
//         }
    
//         resetPage() {
//             this.page = 1; 
//         }
//     }

async function onSubmit(evt){
    evt.preventDefault();
    gallery.innerHTML = "";
    sumPage = 0; 
    getImages.resetPage();

    const inputValue = evt.currentTarget.elements.searchQuery.value.trim();// зчитує значення з input
    // trim(); - відрізає пробіли перед або після введеного значення
    try {
        const dataOfImages = await getImages.fetchImages(inputValue);
        const arrayImages = dataOfImages.hits;
        const totalArrayImages = dataOfImages.totalHits;

        if (arrayImages.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            }
            else if (inputValue === "") {
            return;
        } else {
            Notiflix.Notify.success(`Hooray! We found ${totalArrayImages} images.`,
            {
                timeout: 3000,
                position: "left-top",
            });
            renderPhotoCard(arrayImages);

            const lightbox = new SimpleLightbox('.gallery a', { /* options */ });

           if (totalArrayImages / getImages.per_page <= 1) {
            btnScroll.classList.add("visually-hidden");
            return;
           }

           btnScroll.classList.remove("visually-hidden");

           btnScroll.addEventListener("click", onbtnScroll);
           sumPage = getImages.per_page;
        }     
    } catch (error){
        console.log(error.message);
    }
}

async function onbtnScroll(){
    const inputVal = input.value;

    getImages.incrementPage();

    sumPage += getImages.per_page;

    btnScroll.classList.add("visually-hidden");

    try {
        const dataOfImages = await getImages.fetchImages(inputVal);
        const arrayImages = dataOfImages.hits;
        const totalArrayImages = dataOfImages.totalHits;

        if (totalArrayImages <= sumPage) {
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")

            // renderPhotoCard(arrayImages);
            renderScroll(arrayImages);

            btnScroll.classList.add("visually-hidden");
            btnScroll.removeEventListener("click", onbtnScroll);
            return;
           }

        // renderPhotoCard(arrayImages);
        renderScroll(arrayImages);
           
            const lightbox = new SimpleLightbox(".gallery a",{
                /*options*/
            });
        btnScroll.classList.remove("visually-hidden");
        }

     catch (error){
    console.log(error.message);
    }
}

function renderPhotoCard(arrayImages){
    const markup = arrayImages.map(img => {
        const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        } = img;

    return `<div class="photo-card">
    <a href='${largeImageURL}'>
        <div class="image-wrap">
            <img class='image' src='${webformatURL}' alt='${tags}' loading="lazy" />
        </div>
        <div class="info">
            <p class="info-item">
                <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
                <b>Views</b> ${views}
            </p>
            <p class="info-item">
                <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b> ${downloads}
            </p>
        </div>
    </a>
  </div>`;
    })
    .join("");

gallery.insertAdjacentHTML('beforeend', markup);
}

function smoothScroll() {
    const positionCardToScroll =
      gallery.firstElementChild.getBoundingClientRect().height; // отримання координати позиції першого елемента (картки) в гвлереї, які загрузилися після натискання кнопки "Load more"
    window.scrollBy({
      top: positionCardToScroll * 2,
      behavior: 'smooth',
    });
}

function renderScroll(arrayImages) {
    renderPhotoCard(arrayImages);
    smoothScroll();
}