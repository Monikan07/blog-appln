import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 p-10  px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold font-edu lg:text-6xl pt-10 max-w-2xl mx-auto text-lime-700 dark:text-white'>Welcome to my Blog</h1>
        <p className='text-lime-500 text-base sm:text-2xl mt-5'>
         Welcome to my travel and food blog! Here you'll find a wide range of articles,
tutorials, and resources designed to help you plan your next adventure and discover
incredible cuisine. Whether you're interested in budget travel tips, luxury destination
guides, local street food secrets, or gourmet recipes from around the world, there's
something here for everyone. Dive in and explore the content to expand your palate
and fill your passport.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-blue-500 font-bold hover:underline'
        >
          View all posts
        </Link>
        <div className='p-3 '>
          <CallToAction />
        </div>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-3'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-3'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-blue-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
