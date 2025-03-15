import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = parseInt(localStorage.getItem("userId"), 10);


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
      // Nakon uspešnog brisanja, refetch ili izbacite post iz state-a:
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading)
    return <p className="text-center mt-4">Loading posts...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">Posts</h2>
      {posts.length === 0 && <p>No posts available.</p>}
      <div className="row">
        {posts.map((post) => (
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
                <p className="card-text">{post.content.substring(0, 100)}...</p>
                <Link
                  to={`/posts/${post.id}`}
                  className="btn btn-primary mt-auto"
                >
                  Read More
                </Link>

                  {/* Dugmad Edit / Delete samo ako je post.UserId === currentUserId */}
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
  );
};

export default PostList;
