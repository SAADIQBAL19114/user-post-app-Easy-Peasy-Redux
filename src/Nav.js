import React from "react";
import { Link, useParams } from "react-router-dom";

const Nav = ({ search, setSearch }) => {
  const params = useParams();
  console.log("params: ", params);

  return (
    <nav className="Nav">
      <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search">Search Post</label>
        <input
          type="text"
          placeholder="Search Post"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/post">New Post</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
