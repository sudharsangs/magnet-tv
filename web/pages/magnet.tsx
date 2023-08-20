import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import Head from "next/head";
import { useState, FormEvent } from 'react';

const MagnetForm = () => {
  const [magnetLink, setMagnetLink] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/v1/magnet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: magnetLink }),
      });

      if (response.ok) {
        // Handle success
        console.log('Magnet link sent successfully!');
      } else {
        // Handle error
        console.error('Failed to send magnet link.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-800 h-screen p-4">
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
        <meta property="og:url" content="https://magnet-tv.vercel.app" />
        <meta
          property="og:image"
          content="https://magnet-tv.vercel.app/og_image.jpeg"
        />
        <meta
          property="og:description"
          content="Magnet TV the coolest torrent streaming app."
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <div className='flex flex-col items-center justify-center' style={{height: "80vh"}}>
            <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-gray-800 to-zinc-900 shadow-md rounded-md">
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 font-medium" htmlFor="magnetLink">
                    Magnet Link
                    </label>
                    <input
                    type="text"
                    id="magnetLink"
                    value={magnetLink}
                    onChange={(e) => setMagnetLink(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Enter a magnet link..."
                    required
                    />
                    <button
                    type="submit"
                    className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                    Send Magnet Link
                    </button>
                </form>
            </div>
        </div>
        <Footer/>
    </div>
  );
};

export default MagnetForm;
