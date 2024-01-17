import React from 'react'
import { useEffect,useState } from 'react'
import { useParams, Link,useHistory } from 'react-router-dom'
import { useContext } from "react";
import DataContext from "./context/DataContext";
import { format } from "date-fns";
import api from "./api/posts";

const EditPost = (
  ) => {
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");
    const {posts,setPosts } = useContext(DataContext) 
    const {id} = useParams()
    const history = useHistory()
    const post = posts.find(post => (post.id).toString() === id)

    const handleEdit = async (id) => {
      const datetime = format(new Date(), "MMMM dd, yyyy pp");
      const updatedPost = { id, title: editTitle, datetime, body: editBody };
      try {
        const response = await api.put(`/posts/${id}`, updatedPost);
        setPosts(
          posts.map((post) => (post.id === id ? { ...response.data } : post))
        );
        setEditTitle("");
        setEditBody("");
        history.push("/");
      } catch (err) {
        console.log(err.message);
      }
    };
    
    useEffect(() => {
      if(post) {
        setEditTitle(post.title)
        setEditBody(post.body)

      }
    },[post, setEditBody, setEditTitle])
  return (
    <main className="NewPost">
      {editTitle && 
        <>
          <h2>Edit Post</h2>
          <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              required
              id="postTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label htmlFor="postBody">Post:</label>
            <textarea
              required
              id="postBody"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <button type="submit" onClick={() => handleEdit(post.id)}>Submit</button>
          </form>
        </>
      }
      {!editTitle && 
      <>
        <h2>Page Not Found</h2>
        <p>
          <Link to="/">Visit Our HomePage</Link>
        </p>
      </>}
    </main>
  );
}

export default EditPost