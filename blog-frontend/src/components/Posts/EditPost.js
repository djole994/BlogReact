import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";




const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [category, setCategory] = useState("");
  const categories = ["Sport", "Priroda", "Ljepota"]; 
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.category || "");

        setOldImageUrl(res.data.imageUrl || "");
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);


      // Ako je korisnik izabrao novu sliku, šaljemo je
      if (newImageFile) {
        formData.append("postImage", newImageFile);
      }

      await api.put(`/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Post updated successfully!");
      // Preusmerenje na detalje posta ili listu postova:
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Edit Post</h2>
      <form onSubmit={handleEditSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          ></textarea>
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
          <label className="form-label">Current Image:</label>
          {oldImageUrl ? (
            <div>
              <img
                src={`http://localhost:5050/${
                  oldImageUrl.startsWith("/") ? oldImageUrl.substring(1) : oldImageUrl
                }`}
                alt="Current Post"
                style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
              />
            </div>
          ) : (
            <p>No image available</p>
          )}

          <label className="form-label">Choose New Image (optional):</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => {
              if (e.target.files[0]) {
                setNewImageFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
