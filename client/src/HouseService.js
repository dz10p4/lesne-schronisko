import axios from 'axios';

const hourl = "http://localhost:5000/api/posts/hou";
const anhourl = "http://localhost:5000/api/posts/houa";
const delhourl = "http://localhost:5000/api/posts/houd";

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
        console.log(object);
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