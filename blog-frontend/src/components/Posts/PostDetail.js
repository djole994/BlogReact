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

function containsBadWords(text) {
  return badWords.some((word) => text.toLowerCase().includes(word));
}

export default function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  // Adding a new comment
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Editing comment
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  // Token/user info
  const token = localStorage.getItem('token');
  const currentUsername = localStorage.getItem('username');
  const currentUserId = parseInt(localStorage.getItem('userId') || "0", 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the post
        const postRes = await api.get(`/posts/${id}`);
        setPost(postRes.data);

        // Fetch comments for that post
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

      // Re-fetch comments after posting
      const commentsRes = await api.get(`/comments/post/${id}`);
      setComments(commentsRes.data);

      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveEditComment = async (commentId) => {
    if (!editCommentContent.trim()) return;

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

  if (loading) return <p className="container my-4">Loading post...</p>;
  if (!post) return <p className="container my-4">Post not found</p>;

  return (
    <div className="container my-4">
      {/* Post Card */}
      <div className="card mb-4 shadow-sm">
        {post.imageUrl && (
          <img
            src={
              post.imageUrl.startsWith('http')
                ? post.imageUrl
                : `http://localhost:5050/${post.imageUrl.trim()}`
            }
            className="card-img-top"
            alt={post.title}
            style={{ objectFit: 'cover', maxHeight: '300px' }}
          />
        )}
        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Created at: {new Date(post.createdAt).toLocaleString()}
          </p>
          <p className="card-text">{post.content}</p>
        </div>
      </div>

      {/* Comments Card */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Comments</h4>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {comments.map((comment) => {
                const fileName = comment.user?.profileImageUrl;
                const imageUrl =
                  fileName && fileName.trim() !== ''
                    ? `http://localhost:5050/${fileName.trim()}`
                    : 'http://localhost:5050/uploads/default-avatar.png';

                return (
                  <li
                    key={comment.id}
                    className={
                      "list-group-item d-flex align-items-center " +
                      (comment.user?.username === currentUsername ? "bg-light border-primary" : "")
                    }
                  >
                    <img
                      src={imageUrl}
                      alt={comment.user?.username || "Unknown User"}
                      className="rounded-circle me-3"
                      style={{
                        width: "40px",
                        height: "40px",
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
                          autoFocus
                        />
                      ) : (
                        comment.content
                      )}
                    </div>

                    {/* Edit/Delete buttons if the current user is the author of the comment */}
                    {comment.userId === currentUserId && (
                      <div className="ms-3">
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
                                if (window.confirm("Are you sure you want to delete this comment?")) {
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

          {/* Form for adding a new comment */}
          <div className="mt-4">
            {token ? (
              <form onSubmit={handleCommentSubmit}>
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
              <p>Please log in to post a comment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
