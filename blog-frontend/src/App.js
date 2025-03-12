import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostList from './components/Posts/PostList';
import PostDetail from './components/Posts/PostDetail';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
