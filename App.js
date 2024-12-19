import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Sound from 'react-native-sound';
//import WebRTC from 'react-native-webrtc';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const backgroundTrack = useRef(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    backgroundTrack.current = new Sound('song.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the background track', error);
      }
    });

    return () => {
      audioRecorderPlayer.current.stopRecorder();
      backgroundTrack.current?.release();
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await audioRecorderPlayer.current.startRecorder();
      audioRecorderPlayer.current.addRecordBackListener((e) => {
        processAudio(e.currentMetering);
        return;
      });
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await audioRecorderPlayer.current.stopRecorder();
      audioRecorderPlayer.current.removeRecordBackListener();
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const startBackgroundTrack = () => {
    if (backgroundTrack.current) {
      backgroundTrack.current.play((success) => {
        if (!success) {
          console.error('Failed to play the background track');
        }
      });
      setIsPlaying(true);
    }
  };

  const stopBackgroundTrack = () => {
    if (backgroundTrack.current) {
      backgroundTrack.current.stop();
      setIsPlaying(false);
    }
  };

  const processAudio = (audioData) => {
    console.log('Processing audio with pitch adjustment', audioData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karaoke App</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <View style={{ marginVertical: 10}}/>
      <Button
        title={isPlaying ? 'Stop Background Track' : 'Start Background Track'}
        onPress={isPlaying ? stopBackgroundTrack : startBackgroundTrack}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
});

export default App;
