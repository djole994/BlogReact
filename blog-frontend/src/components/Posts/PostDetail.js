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

  // Pretpostavljamo da se token i korisničko ime čuvaju u localStorage nakon logovanja
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
  

  if (loading)
    return <p className="text-center mt-4">Loading post...</p>;
  if (!post)
    return <p className="text-center mt-4">Post not found</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">{post.title}</h2>
      <p>{post.content}</p>
      {post.imageUrl && (
        <img 
          src={post.imageUrl}
          alt={post.title}
          className="img-fluid my-3"
          style={{ maxWidth: '400px' }}
        />
      )}
      <p className="text-muted">Created at: {new Date(post.createdAt).toLocaleString()}</p>

      <hr />
      <h4 className="mb-3">Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group">
        {comments.map((comment) => {
          console.log('User for comment', comment.id, comment.user);
          
          const fileName = comment.user?.profileImageUrl;
          const imageUrl = fileName && fileName.trim() !== ''
            ? `http://localhost:5050/${fileName.trim()}`
            : 'http://localhost:5050/uploads/default-avatar.png';
          

          
          
          return (
            <li
              key={comment.id}
              className={`list-group-item d-flex align-items-center ${
                comment.user?.username === currentUsername ? 'bg-light border-primary' : ''
              }`}
            >
              <img
                src={imageUrl}
                alt={comment.user?.username || 'Unknown User'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '10px',
                  objectFit: 'cover',
                }}
              />
              <div style={{ flex: 1 }}>
                <strong>{comment.user?.username || 'Unknown User'}: </strong>
                {comment.content}
              </div>
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
