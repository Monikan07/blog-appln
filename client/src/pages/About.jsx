import CallToAction from '../components/CallToAction';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-6xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-green-600 text-6xl font-updock font-bold text-center  my-7'>
            WanderSpice Blog
          </h1>
          <div className='text-base sm:text-2xl text-lime-500 flex flex-col gap-6'>
            <p>
               Welcome to Blog: Passport & Plate! This blog was created as a personal project to share the excitement of
    travel and culinary exploration** with the world.
            </p>

            <p>
              On this blog, you'll find weekly articles and guides on topics
    such as budget travel hacks, luxury destination reviews, street food guides, and global recipes.
    We are always learning and exploring new places and flavors, so be sure to check back often for new content to inspire your next trip!
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
    fellow explorers. Share your own favorite travel tips and food discoveries! We believe that engaging with our community can help
    each other grow, improve, and explore more...
            </p>
          </div>
        </div>
        <div className='mt-10'>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}