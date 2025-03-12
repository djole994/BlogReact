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
        // 1) Dohvati post
        const postRes = await api.get(`/posts/${id}`);
        setPost(postRes.data);

        // 2) Dohvati komentare za post
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

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container my-4">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.imageUrl && (
        <img 
          src={post.imageUrl}
          alt={post.title}
          style={{ maxWidth: '400px', display: 'block', margin: '20px 0' }}
        />
      )}
      <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>

      {/* Sekcija za komentare */}
      <hr />
      <h4>Comments</h4>
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
