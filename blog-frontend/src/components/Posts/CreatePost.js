import React, { useState } from "react";
import api from "../../api";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [category, setCategory] = useState("");
  const categories = ["Sport", "Priroda", "Ljepota"]; 

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);

      if (postImage) {
        formData.append("postImage", postImage);
      }
      await api.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Post created!");
      setTitle("");
      setContent("");
      setPostImage(null);
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
        <label>Category</label>
        <select
          className="form-control"
            value={category}
              onChange={e => setCategory(e.target.value)}
        >
    <option value="">Select a category</option>
    {categories.map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>
</div>

      <div className="mb-3">
        <label>Content</label>
        <textarea
          className="form-control"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div className="mb-3">
  <label>Post Image</label>
  <input
    type="file"
    className="form-control"
    onChange={e => {
      if (e.target.files && e.target.files.length > 0) {
        setPostImage(e.target.files[0]);
      }
    }}
  />
</div>

      <button className="btn btn-primary" onClick={handleCreatePost}>
        Create
      </button>
    </div>
  );
};

export default CreatePost;
