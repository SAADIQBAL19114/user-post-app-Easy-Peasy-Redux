import React from 'react'
import { useContext,useState } from "react";
import DataContext from "./context/DataContext";
import { format } from "date-fns";
import api from './api/posts'
import { useHistory } from 'react-router-dom';

const NewPost = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const {posts,setPosts} = useContext(DataContext)
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post("/posts", newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      history.push("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <main className='NewPost'>
        <h2>New Post</h2>
        <form className='newPostForm' onSubmit={handleSubmit}>
          <label htmlFor="postTitle">Post Title:</label>
          <input 
            type="text"
            required
            id='postTitle'
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <label htmlFor="postBody">Post Body:</label>
          <textarea 
            required
            id='postBody'
            value ={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          />
          <button
            type='submit'
          >
          Submit
          </button>
        </form>
    </main>
  )
}

export default NewPost