import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import PostList from "./components/Posts/PostList";
import CreatePost from "./components/Posts/CreatePost";
import PostDetail from "./components/Posts/PostDetail";
import Register from "./components/Auth/Register";
import EditPost from "./components/Posts/EditPost";
import About from './components/Layout/About';
import Contact from './components/Layout/Contact';

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);

  // Ako je korisnik već ulogovan, povucimo ga iz localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      {/* Navbar dobija props user i setUser */}
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Ako korisnik nije ulogovan, ne može da kreira post */}
        <Route
          path="/create-post"
          element={
            user ? (
              <CreatePost />
            ) : (
              <h3 className="mt-4 text-center">
                Please log in to create a post
              </h3>
            )
          }
        />

        {/* Login komponenti prosljjedimo setUser da možemo ažurirati stanje */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/posts" element={<PostList />} />

        <Route path="/posts/:id" element={<PostDetail user={user} />} />
        <Route path="/posts/:id" element={<PostDetail user={user} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
