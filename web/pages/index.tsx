import { FAQItem } from '@/app/components/FAQItem';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import {Step} from '@/app/components/Step'
import Head from "next/head";
import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-800 min-h-screen flex flex-col items-center justify-center p-4">
        <Head>
        <title>Magnet TV</title>
        <meta
          name="description"
          content="Magnet TV the coolest torrent streaming app."
        />
        <meta
          name="keywords"
          content="torrent, magnet, android tv, firestick"
        />
        <meta name="author" content="Magnet TV" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Magnet TV" />
        {/* <meta property="og:url" content="https://sudharsangs.in" />
        <meta
          property="og:image"
          content="https://sudharsangs.in/og-image.jpeg"
        /> */}
        <meta
          property="og:description"
          content="Magnet TV the coolest torrent streaming app."
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <div className='flex items-center flex-col sm:flex-row'>
        <div className="sm:w-1/2">
          <img
            className="w-full h-auto"
            src="/tv_screenshot.png"  
            alt="Magnet TV"
          />
        </div>
        <div className="sm:w-1/2 space-y-4 text-white px-8 flex flex-col items-center">
          <h1 className="text-4xl font-semibold mb-4 text-center mt-4">
            Welcome to <span className="text-blue-400">Magnet TV</span>
          </h1>
          <p className="text-gray-300 text-2xl text-center">
            Elevate Your Streaming Experience! 📺🚀
          </p>
        <p className="mb-4 text-xl text-center">
          Discover the Magic of Instant Torrent Streaming with Magnet TV 🎉
        </p>
           <button className="block w-full py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 mt-6">
            Start Streaming Now with Magnet TV
          </button>
        </div>
      </div>
      <div className="space-y-6 my-10">
         <div className="flex flex-col gap-4">
        <FAQItem
          title="⚡ Lightning-Fast Streaming"
          content="With Magnet TV, you can dive into your favorite content immediately, directly from the magnet link. No more waiting around for files to download – experience swift, instant entertainment like never before."
        />
        <FAQItem
          title="🚀 Effortless Integration"
          content="Our user-centric interface effortlessly adapts to magnet links, revolutionizing your torrent streaming journey. Just paste the magnet link into Magnet TV, and let the magic unfold."
        />
        <FAQItem
          title="🌐 Global Content Access"
          content="Enjoy content from around the world without limitations. Magnet TV breaks through geo-restrictions, granting you access to an extensive array of TV shows and movies."
        />
        <FAQItem
          title="🔒 Privacy First"
          content="Concerned about online privacy? Magnet TV employs advanced encryption to keep your streaming activities completely private and secure. Enjoy your shows with peace of mind."
        />
        <FAQItem
          title="🎬 Curated Viewing"
          content="Explore new horizons with our thoughtfully curated playlists, handpicked by experts and fellow users. Immerse yourself in a world of infinite entertainment options."
        />
        </div>
      </div>
      <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-6">
            <Step
              number={1}
              title="Copy Magnet Link"
              description="Grab the magnet link of the content you're eager to watch."
              emoji="📋"
            />
            <Step
              number={2}
              title="Paste into Magnet TV"
              description="Simply paste the magnet link into Magnet TV's intuitive interface."
              emoji="🔗"
            />
            <Step
              number={3}
              title="Click Play"
              description="Sit back, relax, and indulge in your desired content without any delays."
              emoji="▶️"
            />
          </div>
        </div>
        <Footer/>
    </div>
  );
};

export default LandingPage;
