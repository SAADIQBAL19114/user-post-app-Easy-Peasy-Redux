import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import EditPost from "./EditPost.js";
import About from "./About";
import Missing from "./Missing.js";
import { Route, Switch, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "./api/posts";

function App() {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        }else{
          console.log(`ERROR : ${err.message}`);
        }
      }
    };
  fetchPosts();
  }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResult(filteredResults.reverse());
  }, [posts, search]);

  const handleDelete = async(id) => {
    try {
       const response = await api.delete(`/posts/${id}`)
      const postList = posts.filter((post) => post.id !== id);
      setPosts(postList);
    } catch (err) {
      console.log(err.message);
    }
    history.push("/");
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
      try {
        const response = await api.post('/posts',newPost)
        const allPosts = [...posts, response.data];
        setPosts(allPosts);
        setPostTitle("");
        setPostBody("");
        history.push("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEdit  = async (id) => {
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`,updatedPost)
      setPosts(posts.map(post => post.id === id ? { ...response.data }: post))
      setEditTitle("")
      setEditBody("")
      history.push('/')
    } catch (err) {
      console.log(err.message);
    }

  }

  return (
    <div className="App">
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      <Switch>
        <Route exact path="/">
          <Home posts={searchResult} />
        </Route>
        <Route exact path="/post">
          <NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />
        </Route>
        <Route path="/edit/:id">
          <EditPost
            posts = {posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody}
          />
        </Route>
        <Route path="/post/:id">
          <PostPage 
            posts={posts} 
            handleDelete={handleDelete}
          />
        </Route>
        <Route path="/about" component={About} />
        <Route path="*" component={Missing} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
