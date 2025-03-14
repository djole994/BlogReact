import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
