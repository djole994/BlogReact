import React, { useState } from "react";
import api from "../../api";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreatePost = async () => {
    try {
      // Ako API zahteva token:
      const token = localStorage.getItem("token");
      await api.post(
        "/posts",
        { title, content,imageUrl
              },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Post created!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "1rem" }}>
      <h2>Create Post</h2>
      <div className="mb-3">
        <label>Title</label>
        <input
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Content</label>
        <textarea
          className="form-control"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleCreatePost}>
        Create
      </button>
    </div>
  );
};

export default CreatePost;
