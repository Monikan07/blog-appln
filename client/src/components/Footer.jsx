import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsDribbble } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-lime-500'> 
      <div className='w-full max-w-7xl mx-auto'>
        
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          
          <div className='mt-5'>
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
          </div>

          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='/explore'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Travel blog
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  WanderSpice Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='/explore'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Food blog
                </Footer.Link>
                <Footer.Link href='#'>Printrest</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="WanderSpice blog" 
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook}/>
            <Footer.Icon href='#' icon={BsInstagram}/>
            <Footer.Icon href='#' icon={BsTwitter}/>
            <Footer.Icon href='#' icon={BsDribbble}/>
          </div>
        </div>
      </div>
    </Footer>
  );
}