import React, { useState } from "react";
import api from "../../api";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
      setCategory("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };
  
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Create Post</h2>
              
              {/* Title Field */}
              <div className="mb-3">
                <label htmlFor="postTitle" className="form-label">Title</label>
                <input
                  type="text"
                  id="postTitle"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                />
              </div>

              {/* Category Field */}
              <div className="mb-3">
                <label htmlFor="postCategory" className="form-label">Category</label>
                <select
                  id="postCategory"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Content Field */}
              <div className="mb-3">
                <label htmlFor="postContent" className="form-label">Content</label>
                <textarea
                  id="postContent"
                  className="form-control"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                />
              </div>

              {/* Image Field */}
              <div className="mb-3">
                <label htmlFor="postImage" className="form-label">Post Image</label>
                <input
                  type="file"
                  id="postImage"
                  className="form-control"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setPostImage(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-primary"
                onClick={handleCreatePost}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
