import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebTorrent from 'webtorrent';
import Video from 'react-native-video';
import prettyBytes from 'pretty-bytes';
import moment from 'moment';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  TorrentPlayer: { magnetLink: string };
};

type TorrentPlayerScreenRouteProp = RouteProp<RootStackParamList, 'TorrentPlayer'>;

type TorrentPlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TorrentPlayer'>;

type Props = {
  route: TorrentPlayerScreenRouteProp;
  navigation: TorrentPlayerScreenNavigationProp;
};

export const TorrentPlayer: React.FC<Props> = ({ route }) => {
  const [streamingFile, setStreamingFile] = useState<any>(null);
  const [torrentInfo, setTorrentInfo] = useState<any>(null);

  const client = new WebTorrent();

  useEffect(() => {
    const magnetLink = route.params?.magnetLink;
    if (magnetLink) {
      downloadTorrent(magnetLink);
    }
  }, []);

  const downloadTorrent = (magnetLink: string) => {
    client.add(magnetLink, (torrent) => {
      const largestFile = torrent.files.reduce(
        (prev, curr) => (curr.length > prev.length ? curr : prev),
        torrent.files[0]
      );

      setTorrentInfo({
        name: largestFile.name,
        progress: torrent.progress,
        downloaded: torrent.downloaded,
        totalSize: torrent.length,
        remainingTime: torrent.done
          ? 'Done'
          : moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize(),
        downloadSpeed: torrent.downloadSpeed,
      });

      setStreamingFile(largestFile);
    });
  };

  return (
    <View style={styles.container}>
      {streamingFile && (
        <Video
          source={{ uri: streamingFile.createReadStream().toBlobURL() }}
          controls
          style={styles.video}
        />
      )}

      {torrentInfo && (
        <View style={styles.torrentInfoContainer}>
          <Text style={styles.torrentInfoText}>Streaming: {torrentInfo.name}</Text>
          <Text style={styles.torrentInfoText}>Progress: {torrentInfo.progress * 100}%</Text>
          <Text style={styles.torrentInfoText}>
            Downloaded: {prettyBytes(torrentInfo.downloaded)}
          </Text>
          {/* ... Other torrent info */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  video: {
    width: 300,
    height: 200,
  },
  torrentInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  torrentInfoText: {
    fontSize: 16,
    marginBottom: 8,
  },
});


