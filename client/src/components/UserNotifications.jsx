
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner, Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function UserNotifications() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserPostComments = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const res = await fetch('/api/comment/getcomments-on-user-posts'); 
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setLoading(false);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch comments on your posts.');
          setLoading(false);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    };
    fetchUserPostComments();
  }, [currentUser]);

  if (loading) return (
    <div className='flex justify-center p-8'><Spinner size='xl' /></div>
  );

  return (
    <div className='max-w-4xl mx-auto p-3 w-full'>
      <h2 className='text-3xl font-semibold mb-6 text-center dark:text-white'>
        Comments on Your Posts
      </h2>
      
      {error && <div className='p-4'><Alert color='failure'>{error}</Alert></div>}

      {comments.length === 0 && !loading && !error ? (
        <Alert color='lime' className='text-center'>No comments found on your articles yet.</Alert>
      ) : (
        <div className='flex flex-col gap-4'>
          {comments.map((comment) => (
            <div 
              key={comment._id} 
              className='border border-gray-200 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700'
            >
              
              <div className='flex justify-between items-start mb-2 border-b pb-2 dark:border-gray-600'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Likes: {comment.likes.length || 0} ❤️
                </p>
              </div>

              <p className='text-lg text-gray-800 dark:text-gray-100 mb-3 font-medium'>
                {comment.commenterUsername} commented:
              </p>
              
              <p className='text-gray-700 dark:text-gray-300 mb-3 italic break-words'>
                "{comment.content}"
              </p>

              <Link 
                to={`/post/${comment.postSlug}`} 
                className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium'
              >
                View Post: "{comment.postTitle}"
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}