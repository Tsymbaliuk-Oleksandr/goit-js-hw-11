import axios from "axios"

export class ApiImages {
    constructor(){
    this.KEY = '30438181-5fa6a1c16c4b444b6f9a1e533';
    this.URL = 'https://pixabay.com/api/'; 
    this.per_page = 40;
    this.page = 1; 
    }
    async fetchImages(value) {
        const searchParams = {
            params: {
            key: this.KEY,
            q: `${value}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: this.per_page,
            page: this.page,
            }
        };
        // стоврюємо запит
        const response = await axios.get(this.URL, searchParams);

        const data = response.data;
        return data;
    }

    incrementPage() {
        this.page += 1; 
    }

    resetPage() {
        this.page = 1; 
    }
}