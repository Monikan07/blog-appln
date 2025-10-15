import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const navigate = useNavigate(); 
  const { currentUser } = useSelector((state) => state.user); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    if (post && post._id) {
        const incrementViews = async () => {
            try {
                await fetch(`/api/post/viewpost/${post._id}`, {
                    method: 'PUT',
                });
            } catch (error) {
                console.error('Error incrementing view count:', error);
            }
        };
        incrementViews();
    }
  }, [post]);


  const handleLikePost = async () => {
    if (!currentUser) {
        return navigate('/sign-in'); 
    }
    
    try {
        const res = await fetch(`/api/post/likepost/${post._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        
        if (res.ok) {
            setPost((prevPost) => ({
                ...prevPost,
                likes: data.likes, 
            }));
            console.log('Post liked/unliked successfully.');
        } else {
            console.error(data.message);
        }

    } catch (error) {
        console.error('Error liking post:', error);
    }
  };


  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  
  if (error) return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl text-red-500'>Error loading post.</p>
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-5xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <div className='flex flex-wrap justify-center gap-4 mt-10 p-3'>
        {post && Array.isArray(post.imageUrls) && post.imageUrls.length > 0 ? (
          post.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${post.title} image ${index + 1}`}
              className='w-96 h-96 object-cover rounded-lg shadow-lg' />
          ))
        ) : (
          post && post.image && (
            <img
              src={post.image}
              alt={post.title}
              className='mt-10 p-3 max-h-[600px] w-full object-cover'
            />
          )
        )}
      </div>
      
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-6xl text-xs'>
        
        <div className='flex gap-4'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>
                {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
        </div>

        <div className='flex items-center gap-4 text-sm'>
            
            <span className='flex items-center gap-1 text-gray-700 dark:text-gray-400'>
                👁️
                {post && post.numberOfViews ? post.numberOfViews : 0}
            </span>

            <span className='flex items-center gap-1 text-red-500'>
                ❤️
                {post && post.likes ? post.likes.length : 0}
            </span>
            
            <Button 
                size="xs" 
                outline 
                gradientDuoTone={
                    post && currentUser && post.likes.includes(currentUser._id) 
                        ? 'redToPink' 
                        : 'pinkToOrange'
                } 
                onClick={handleLikePost} 
                disabled={!post}
            >
                {post && currentUser && post.likes.includes(currentUser._id) 
                    ? 'Liked' 
                    : 'Like'}
            </Button>
        </div>
      </div>


      <div
        className='p-3 max-w-6xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}