import React, { useState, useEffect } from 'react';
import WebTorrent, { Torrent } from 'webtorrent';
import Video from 'react-native-video';

interface TorrentPlayerProps {
  magnetLink: string;
}

export const TorrentPlayer: React.FC<TorrentPlayerProps> = ({ magnetLink }) => {
  const [torrentClient, setTorrentClient] = useState<WebTorrent | null>(null);
  const [torrent, setTorrent] = useState<Torrent | null>(null);

  useEffect(() => {
    const client = new WebTorrent();
    setTorrentClient(client);

    return () => {
      if (client) {
        client.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (torrentClient && magnetLink) {
      const newTorrent = torrentClient.add(magnetLink);
      setTorrent(newTorrent);

      newTorrent.on('done', () => {
        // Torrent download is complete
      });
    }
  }, [torrentClient, magnetLink]);

  return (
    <Video
      source={{ uri: torrent?.magnetURI || '' }}
      controls={true}
      paused={!torrent || torrent.progress !== 1} // Pause if not fully downloaded
      style={{ flex: 1 }}
    />
  );
};


