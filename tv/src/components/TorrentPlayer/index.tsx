import React, { useEffect, useState } from 'react';
import WebTorrent, { Torrent } from 'webtorrent';
import Video from 'react-native-video';

interface TorrentVideoPlayerProps {
  magnetURI: string;
}

const TorrentVideoPlayer: React.FC<TorrentVideoPlayerProps> = ({ magnetURI }) => {
  const [torrent, setTorrent] = useState<Torrent | null>(null);
  const [videoBlobURL, setVideoBlobURL] = useState<string | null>(null);

  useEffect(() => {
    const client = new WebTorrent();
    
    const torrentInstance = client.add(magnetURI, { path: '/tmp' });

    torrentInstance.on('done', () => {
      setTorrent(torrentInstance);
    });

    return () => {
      client.destroy();
    };
  }, [magnetURI]);

  useEffect(() => {
    if (torrent) {
      const file = torrent.files.find((file) => file.name.endsWith('.mp4'));
      if (file) {
        const reader = file.createReadStream();
        const chunks: Uint8Array[] = [];

        reader.on('data', (chunk: Uint8Array) => {
          chunks.push(chunk);
          if (chunks.length === 1) {
            const videoBlob = new Blob(chunks, { type: 'video/mp4' });
            const videoBlobURL = URL.createObjectURL(videoBlob);
            setVideoBlobURL(videoBlobURL);
          }
        });

        reader.on('end', () => {
          if (chunks.length > 1) {
            const concatenatedChunks = new Uint8Array(chunks.reduce((totalLength, chunk) => totalLength + chunk.length, 0));
            let offset = 0;
            for (const chunk of chunks) {
              concatenatedChunks.set(chunk, offset);
              offset += chunk.length;
            }

            const videoBlob = new Blob([concatenatedChunks], { type: 'video/mp4' });
            const videoBlobURL = URL.createObjectURL(videoBlob);
            setVideoBlobURL(videoBlobURL);
          }
        });
      }
    }
  }, [torrent]);

  return (
    <Video
      source={{ uri: videoBlobURL || undefined }}
      controls
      style={{ flex: 1 }}
    />
  );
};

export default TorrentVideoPlayer;
