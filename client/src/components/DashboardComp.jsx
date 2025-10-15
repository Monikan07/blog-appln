import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const ArrowUpIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
  </svg>
);

const UserGroupIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-5v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1H2M3 10L12 3l9 7v11a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5a1 1 0 00-1-1H9a1 1 0 00-1 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1V10z"></path>
  </svg>
);

const AnnotationIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m-4 8h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);

const DocumentTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);


const mockUseSelector = (selector) => {
  return selector({
    user: {
      currentUser: {
        _id: 'mockUserId123',
        isAdmin: true, 
      }
    }
  });
};

const useReduxSelector = mockUseSelector;


const MockTable = ({ children, hoverable, className }) => (
  <table className={`min-w-full text-sm text-left text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </table>
);

MockTable.Head = ({ children }) => (
  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>{children}</tr>
  </thead>
);

MockTable.HeadCell = ({ children }) => (
  <th scope="col" className="px-6 py-3">{children}</th>
);

MockTable.Body = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);

MockTable.Row = ({ children, className }) => (
  <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${className}`}>{children}</tr>
);

MockTable.Cell = ({ children, className }) => (
  <td className={`px-6 py-4 ${className}`}>{children}</td>
);

const MockButton = ({ children, outline, gradientDuoTone, onClick, className }) => {
  const baseClasses = 'font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200';
  let styleClasses = 'bg-red-500 hover:bg-red-600 text-white';

  if (outline) {
    styleClasses = 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700';
  }
  if (gradientDuoTone) {
    styleClasses = 'bg-gradient-to-r from-red-500 via-yellow-500 to-yellow-400 text-white hover:opacity-90';
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${styleClasses} ${className}`}>
      {children}
    </button>
  );
};


export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  
  const { currentUser } = useReduxSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5&sort=desc&lastMonth=true');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5&sort=desc&lastMonth=true');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5&sort=desc&lastMonth=true');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser._id]); 
  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Explorers</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <UserGroupIcon className='bg-orange-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className={`flex items-center ${lastMonthUsers > 0 ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUpIcon className='w-4 h-4' />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Comments
              </h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <AnnotationIcon className='bg-amber-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
             <span className={`flex items-center ${lastMonthComments > 0 ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUpIcon className='w-4 h-4' />
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <DocumentTextIcon className='bg-red-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className={`flex items-center ${lastMonthPosts > 0 ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUpIcon className='w-4 h-4' />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2  text-lime-600'>Recent Explorers</h1>
            <MockButton outline gradientDuoTone='redToYellow'> 
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </MockButton>
          </div>
          
          <MockTable hoverable>
            <MockTable.Head >
              <MockTable.HeadCell>User image</MockTable.HeadCell>
              <MockTable.HeadCell>Username</MockTable.HeadCell>
            </MockTable.Head>
            <MockTable.Body className='divide-y'>
              {users && users.map((user) => (
                <MockTable.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800  '>
                  <MockTable.Cell>
                    <img
                      src={user.profilePicture}
                      alt='user'
                      className='w-10 h-10 rounded-full bg-gray-500'
                    />
                  </MockTable.Cell>
                  <MockTable.Cell>{user.username}</MockTable.Cell>
                </MockTable.Row>
              ))}
            </MockTable.Body>
          </MockTable>

        </div>

        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2  text-lime-600'>Recent discussions</h1> 
            <MockButton outline gradientDuoTone='redToYellow'>
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </MockButton>
          </div>

          <MockTable hoverable>
            <MockTable.Head>
              <MockTable.HeadCell>Comment content</MockTable.HeadCell>
              <MockTable.HeadCell>Likes</MockTable.HeadCell>
            </MockTable.Head>
            <MockTable.Body className='divide-y'>
              {comments && comments.map((comment) => (
                <MockTable.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <MockTable.Cell className='w-96'>
                    <p className='line-clamp-2'>{comment.content}</p>
                  </MockTable.Cell>
                  <MockTable.Cell>{comment.numberOfLikes}</MockTable.Cell>
                </MockTable.Row>
              ))}
            </MockTable.Body>
          </MockTable>

        </div>
        
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2 text-lime-600'>Recent posts</h1>
            <MockButton outline gradientDuoTone='redToYellow'>
              <Link to={'/search'}>See all</Link>
            </MockButton>
          </div>

          <MockTable hoverable>
            <MockTable.Head>
              <MockTable.HeadCell>Post image</MockTable.HeadCell>
              <MockTable.HeadCell>Post Title</MockTable.HeadCell>
              <MockTable.HeadCell>Category</MockTable.HeadCell>
            </MockTable.Head>
            <MockTable.Body className='divide-y'>
              {posts && posts.map((post) => (
                <MockTable.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <MockTable.Cell>
                    <img
                      src={post.image}
                      alt='post image'
                      className='w-14 h-10 rounded-md bg-gray-500'
                    />
                  </MockTable.Cell>
                  <MockTable.Cell className='w-96'>{post.title}</MockTable.Cell>
                  <MockTable.Cell className='w-5'>{post.category}</MockTable.Cell>
                </MockTable.Row>
              ))}
            </MockTable.Body>
          </MockTable>
          
        </div>
      </div>
    </div>
  );
}
