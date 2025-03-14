import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editCommentId, setEditCommentId] = useState(null);
const [editCommentContent, setEditCommentContent] = useState('');


  const currentUserId = parseInt(localStorage.getItem("userId"), 10);
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Nakon brisanja, refetch ili uklonite komentar iz state-a
      const updatedComments = comments.filter((c) => c.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Funkcija za uređivanje (ukoliko želite implementirati)
  const handleEditComment = (commentId) => {
    // Na primer, setujete modal ili state za uređivanje određenog komentara
    // Ovdje samo placeholder primer:
    console.log(`Editing comment with ID = ${commentId}`);
  };


  const token = localStorage.getItem('token');
  const currentUsername = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dohvati post
        const postRes = await api.get(`/posts/${id}`);
        setPost(postRes.data);

        // Dohvati komentare za post
        const commentsRes = await api.get(`/comments/post/${id}`);
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
  
    // Dohvati korisnikov ID iz localStorage
    const userId = localStorage.getItem("userId");
  
    try {
      const response = await api.post(
        '/comments',
        {
          content: newComment,
          blogPostId: id,   // promenjeno iz postId u blogPostId
          userId: parseInt(userId, 10),  // prosleđivanje korisničkog ID-ja kao broj
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      // Opcija 1: Refetch svih komentara nakon slanja
      const commentsRes = await api.get(`/comments/post/${id}`);
      setComments(commentsRes.data);
  
      // Opcija 2: Direktno dodavanje novog komentara u state
      // setComments(prev => [...prev, response.data]);
  
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

// edit
  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentContent(comment.content);
  };
  const handleSaveEditComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    try {
      await api.put(`/comments/${commentId}`, { content: editCommentContent }, { headers: { Authorization: `Bearer ${token}` } });
      const commentsRes = await api.get(`/comments/post/${id}`);
      setComments(commentsRes.data);
      setEditCommentId(null);
      setEditCommentContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditCommentContent('');
  };
  
  

  if (loading)
    return <p className="text-center mt-4">Loading post...</p>;
  if (!post)
    return <p className="text-center mt-4">Post not found</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">{post.title}</h2>
      <p className="text-muted">Created at: {new Date(post.createdAt).toLocaleString()}</p>
      <p>{post.content}</p>
      {post.imageUrl && (
  <img
    src={
      post.imageUrl.startsWith("http")
        ? post.imageUrl
        : `http://localhost:5050/${post.imageUrl.trim()}`
    }
    className="card-img-top"
    alt={post.title}
    style={{ maxHeight: '200px', objectFit: 'cover' }}
  />
)}
     

      <hr />
      <h4 className="mb-3">Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group">
        {comments.map((comment) => {
          
          const fileName = comment.user?.profileImageUrl;
          const imageUrl = fileName && fileName.trim() !== ''
            ? `http://localhost:5050/${fileName.trim()}`
            : 'http://localhost:5050/uploads/default-avatar.png';
          
      
          
          
          return (
            <li
              key={comment.id}
              className={`list-group-item d-flex align-items-center ${
                comment.user?.username === currentUsername
                  ? "bg-light border-primary"
                  : ""
              }`}
            >
              <img
                src={imageUrl}
                alt={comment.user?.username || "Unknown User"}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <strong>{comment.user?.username || "Unknown User"}: </strong>
                {editCommentId === comment.id ? (
                  <input
                    type="text"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    className="form-control form-control-sm"
                  />
                ) : (
                  comment.content
                )}
              </div>

              {comment.userId === currentUserId && (
                <div style={{ marginLeft: "10px" }}>
                  {editCommentId === comment.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleSaveEditComment(comment.id)}
                      >
                        Sačuvaj
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleCancelEdit}
                      >
                        Odustani
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleEditClick(comment)}
                      >
                        Uredi
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Da li ste sigurni da želite da obrišete ovaj komentar?"
                            )
                          ) {
                            handleDeleteComment(comment.id);
                          }
                        }}
                      >
                        Obriši
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      
      
      
      )}

      {token ? (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="newComment" className="form-label">Add a comment</label>
            <textarea
              id="newComment"
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="3"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="mt-4">Please log in to post a comment.</p>
      )}
    </div>
  );
};

export default PostDetail;
