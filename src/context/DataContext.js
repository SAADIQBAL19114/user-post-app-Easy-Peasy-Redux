import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/posts";

const DataContext = createContext({})


export const DataProvider = ({children}) => {
    const history = useHistory();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
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
          } else {
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

    return (
      <DataContext.Provider
        value={{
          search,
          setSearch,
          searchResult,
          posts,
          setPosts,
        }}
      >
        {children}
      </DataContext.Provider>
    );
}

export default DataContext;