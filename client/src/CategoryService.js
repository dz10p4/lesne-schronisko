import axios from "axios";

const caurl = "https://lesna-polana.herokuapp.com/api/posts/hou/cat";
const dcurl = "https://lesna-polana.herokuapp.com/api/posts/cat/del"
const ecurl = "https://lesna-polana.herokuapp.com/api/posts/hou/cat/del"

class CategoryService {
  // get posts
  static getPosts() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(caurl);
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
  static insertPost(text) {
    
    return axios.post(caurl, {
      category: text,
    });
    
  }

  //delete post
  static deletePost(id) {
    return axios.post(dcurl,{category: id,});
  }

  static deleteFields(id) {
    return axios.post(ecurl,{category: id,});
  }
}


export default CategoryService;