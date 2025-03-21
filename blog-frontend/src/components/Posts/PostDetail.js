import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const badWords = [
  "fuck",
  "shit",
  "sht",
  "fak",
  "bitch",
  "asshole",
  "faggot"
];

// Prosta funkcija koja provejrava da li tekst sadrži neku od uvrjedljivih riječi
function containsBadWords(text) {
  return badWords.some((word) => text.toLowerCase().includes(word));
}

export default function PostDetail() {
  const { id } = useParams();


  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);


  const [comments, setComments] = useState([]);

  // Dodavanje novog komentara
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Uređivanje KOmentara
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  // Dohvatanje tokena i korisničkih info iz localStorage
  const token = localStorage.getItem('token');
  const currentUsername = localStorage.getItem('username');
  const currentUserId = parseInt(localStorage.getItem('userId') || "0", 10);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Dohvati post
        const postRes = await api.get(`/posts/${id}`);
        setPost(postRes.data);

        // 2. Dohvati komentare za taj post
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

    if (containsBadWords(newComment)) {
      alert("Your comment contains offensive words. Please remove them.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(
        '/comments',
        {
          content: newComment,
          blogPostId: id,        
          userId: currentUserId, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Nakon kreiranja – refetch komentara
      const commentsRes = await api.get(`/comments/post/${id}`);
      setComments(commentsRes.data);

      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Brisanje komentara
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ukloni obrisani komentar iz state-a
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Klik na Uredi
  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  // Sačuvaj izmenjeni komentar
  const handleSaveEditComment = async (commentId) => {
    if (!editCommentContent.trim()) return;

    // Provera uvrjedljivih riječi i za edit
    if (containsBadWords(editCommentContent)) {
      alert("Your edited comment contains offensive words. Please remove them.");
      return;
    }

    try {
      await api.put(
        `/comments/${commentId}`,
        { content: editCommentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container my-4">
      <h2>{post.title}</h2>
      <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
      <p>{post.content}</p>
      {post.imageUrl && (
        <img
          src={
            post.imageUrl.startsWith('http')
              ? post.imageUrl
              : `http://localhost:5050/${post.imageUrl.trim()}`
          }
          alt={post.title}
          style={{ maxHeight: '200px', objectFit: 'cover' }}
        />
      )}

      <hr />
      <h4>Comments</h4>

      {/* Lista komentara */}
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group">
          {comments.map((comment) => {
            // Profilna slika korisnika
            const fileName = comment.user?.profileImageUrl;
            const imageUrl = fileName && fileName.trim() !== ''
              ? `http://localhost:5050/${fileName.trim()}`
              : 'http://localhost:5050/uploads/default-avatar.png';

            return (
              <li
                key={comment.id}
                className={"list-group-item d-flex align-items-center " +
                  (comment.user?.username === currentUsername ? "bg-light border-primary" : "")}
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
                  <strong>{comment.user?.username || "Unknown User"}:</strong>{" "}
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

                {/* Ako je komentarov user == trenutno ulogovan user -> Edit/Delete dugmad */}
                {comment.userId === currentUserId && (
                  <div style={{ marginLeft: "10px" }}>
                    {editCommentId === comment.id ? (
                      <>
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => handleSaveEditComment(comment.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleEditClick(comment)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this comment?"
                              )
                            ) {
                              handleDeleteComment(comment.id);
                            }
                          }}
                        >
                          Delete
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

      {/* Forma za dodavanje komentara */}
      {token ? (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="newComment" className="form-label">
              Add a comment
            </label>
            <textarea
              id="newComment"
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              required
            />
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
}
