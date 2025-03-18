import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import "./PostList.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const currentUserId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Izvučemo sve kategorije iz postova (i uklonimo duplikate)
  const categories = [
    "All",
    ...new Set(posts.map((p) => p.category).filter(Boolean)),
  ];

  // Filtrirani postovi prema odabranoj kategoriji
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  if (loading) {
    return <p className="text-center mt-4">Loading posts...</p>;
  }

  // Primjer: “Featured post” - uzmemo prvi (ili neki nasumični) ako postoji
  const featuredPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="post-list-container">
      {/* Hero sekcija */}
      <div
        className="hero-section text-center text-white py-5"
        style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          borderRadius: "0 0 10px 10px",
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to MyBlog!</h1>
          <p className="lead">
            Your daily dose of awesome articles and stories.
          </p>
          <Link to="/create-post" className="btn btn-light btn-lg mt-3">
            Write a New Post
          </Link>
        </div>
      </div>

      {/* Featured sekcija */}
      {featuredPost && (
        <div className="featured-section container my-4">
          <h2 className="mb-3 text-center">Featured Post</h2>
          <div className="card featured-card mx-auto">
            {featuredPost.imageUrl && (
              <img
                src={
                  featuredPost.imageUrl.startsWith("http")
                    ? featuredPost.imageUrl
                    : `http://localhost:5050/${featuredPost.imageUrl.trim()}`
                }
                className="card-img-top"
                alt={featuredPost.title}
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{featuredPost.title}</h5>
              <p className="card-text">
                {featuredPost.content.substring(0, 100)}...
              </p>
              <Link
                to={`/posts/${featuredPost.id}`}
                className="btn btn-primary"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Kategorije - Filter */}
      <div className="container my-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <h2 className="me-3 mb-0">Posts</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select w-auto"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Lista postova (filtriranih) */}
        {filteredPosts.length === 0 && (
          <p>No posts available in this category.</p>
        )}
        <div className="row">
          {filteredPosts.map((post) => (
            <div className="col-md-4 mb-3" key={post.id}>
              <div className="card h-100 shadow-sm">
                {post.imageUrl && (
                  <img
                    src={
                      post.imageUrl.startsWith("http")
                        ? post.imageUrl
                        : `http://localhost:5050/${post.imageUrl.trim()}`
                    }
                    className="card-img-top"
                    alt={post.title}
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">
                    {post.content.substring(0, 100)}...
                  </p>
                  <p className="text-muted mb-1">
                    Category: {post.category || "N/A"}
                  </p>
                  <Link
                    to={`/posts/${post.id}`}
                    className="btn btn-primary mt-auto"
                  >
                    Read More
                  </Link>
                  {post.userId === currentUserId && (
                    <div className="mt-2">
                      <Link
                        to={`/posts/${post.id}/edit`}
                        className="btn btn-sm btn-outline-secondary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;
