import axios from 'axios';

const courl = "https://lesna-polana.herokuapp.com/api/posts/cur/";


class CurrencyService {

    static getMultiplier(short) {
        return axios.get(courl+short)
    }


}


export default CurrencyService;