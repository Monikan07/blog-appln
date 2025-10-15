import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';


export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

 return (
    <Navbar className='flex gap-5 md:order-2 '>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-bold dark:text-white font-mono flex items-center gap-2' 
      >
        <img 
          src='/src/assests/ws.png'
          alt='WanderSpice Logo'
          className='w-16 h-16 rounded-full object-cover' 
          onerror="this.onerror=null;this.src='https://placehold.co/40x40/34D399/ffffff?text=Logo';"
        />
        <span className='px-2 py-1 bg-gradient-to-r from-teal-500 to-lime-500 rounded-lg text-white font-playwrite'>
          WanderSpice
        </span>
        <span className='text-3xl font-updock'>Blog</span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline-flex w-[350px] xl:w-[450px] text-base py-2 '
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-14 h-12 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button> 
      <div className='flex gap-5 md:order-2'>
        <Button
          className='w-14 h-12 sm:inline flex items-center justify-center text-lg'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded  />
            }
          >
            <Dropdown.Header className="font-sans">
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item className="font-sans">Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout} className="font-sans">Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='tealToLime' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'} className="font-sans">
          <Link to='/' className='text-2xl font-bold font-mono'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'} className="font-sans">
          <Link to='/about' className='text-2xl font-bold font-mono'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/explore'} as={'div'} className="font-sans">
          <Link to='/explore' className='text-2xl font-bold font-mono'>Explore</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
