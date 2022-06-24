import axios from "axios";

const caurl = "http://localhost:5000/api/posts/cat";

class PostService {
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
    return axios.delete(`${caurl}${id}`);
  }
}


export default PostService;