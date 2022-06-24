import axios from 'axios';

const courl = "http://localhost:5000/api/posts/cur/";


class CurrencyService {

    static getMultiplier(short) {
        return axios.get(courl+short)
    }


}


export default CurrencyService;