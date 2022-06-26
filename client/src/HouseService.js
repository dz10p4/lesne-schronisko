import axios from 'axios';

const hourl = "https://lesna-polana.herokuapp.com/api/posts/hou";
const anhourl = "https://lesna-polana.herokuapp.com/api/posts/houa";
const delhourl = "https://lesna-polana.herokuapp.com/api/posts/houd";

class HouseService {
    // get posts
    static getPosts() {
        return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.get(hourl);
            const data = res.data;
            resolve(
            data.map((category) => ({
                ...category,
                
            }))
            );
        } catch (err) {
            reject(err);
        }
        });
    }
    //Create post
   

    static updateData(object) {
        
        return axios.post(hourl,{
            object
        })
    }

    static addData(object) {
        return axios.post(anhourl,{
            object
        })
    }
    //delete post
    static deletePost(id) {
        return axios.post(delhourl, {
            _id: id,
        });
    }
}

export default HouseService;