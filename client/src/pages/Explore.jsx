import CallToAction from '../components/CallToAction';

export default function Explore() {
  return (
    <div className='min-h-screen max-w-6xl mx-auto flex justify-center gap-8 items-center flex-col p-6'>
      <h1 className='text-8xl font-bold text-center font-updock text-green-600'>Explore Our Projects</h1>
      <p className=' text-lime-600 text-base sm:text-2xl text-center max-w-3xl'>
       Welcome to my travel and food blog! Here you'll find a wide range of articles, 
       tutorials, and resources designed to help you plan your next adventure and discover incredible cuisine. 
       Whether you're interested in budget travel tips, luxury destination guides, local street food secrets, 
       or gourmet recipes from around the world, there's something here for everyone. Dive in and explore the 
       content to expand your palate and fill your passport!
      </p>
      <div className='w-full flex flex-col gap-6'>
        <section className=' p-6 rounded-lg shadow-md'>
         <h2 className='text-4xl font-semibold font-playwrite text-green-700'>
    Why Explore New Destinations and Flavors?
</h2>
<p className='text-lime-600 text-base sm:text-2xl mt-2'>
    Exploring new places and cuisines is one of the best ways to grow and enrich your life. It
    allows you to apply curiosity in a practical way, immerse yourself in
    different cultures, and gather memories that expand your
    understanding of the world.
</p>
        </section>
        <section className=' p-6 rounded-lg shadow-md'>
          <h2 className='text-4xl font-semibold font-playwrite text-green-700'>
    What You'll Discover
</h2>
<ul className='list-disc list-inside text-base sm:text-2xl text-lime-700 mt-2'>
    <li>How to plan a memorable trip on any budget</li>
    <li>Essential cooking techniques and global recipe tutorials</li>
    <li>Tips for finding the best local street food and hidden gems</li>
    <li>How to travel safely and responsibly</li>
    <li>Best practices for food photography and documenting your adventures</li>
</ul>
        </section>
      </div>
      <CallToAction />
    </div>
  );
}
