import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

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
          {comments.map((comment) => (
            <li key={comment.id} className="list-group-item">
              <strong>{comment.user?.username || 'Unknown User'}: </strong>
              {comment.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostDetail;
