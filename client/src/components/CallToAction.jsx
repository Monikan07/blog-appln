import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
<div className='flex border border-teal-500 p-3 justify-center text-blue-500 items-center  rounded-tl-3xl rounded-br-3xl flex-col sm:flex-row text-center bg-blue-100'>
  <div className='flex-1 justify-center flex flex-col'>
    <h2 className='text-2xl'>
      Ready to discover new recipes and plan your next culinary journey?
    </h2>
    <p className='text-blue-500 my-2'>
      Check out our latest destination guides and essential travel hacks!
    </p>
    <a
      href='/explore' 
      rel='noopener noreferrer'
    >
      <Button
        gradientDuoTone='tealToLime'
        className='rounded-tl-xl rounded-bl-none rounded-br-xl w-full'
      >
        Explore Our Latest Guides
      </Button>
    </a>
  </div>
  <div className='flex-1 p-7'>
    <img src='https://tse4.mm.bing.net/th/id/OIP.ekmZG-mDbZ89rsPZFZcBqwHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3' className='h-90' />
  </div>
</div>
  );
}
