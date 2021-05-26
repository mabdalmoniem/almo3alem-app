import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import { Button, Divider, Text } from 'react-native-paper';

interface AudioPlayerRecorderProps { }

const AudioPlayerRecorder = (props: AudioPlayerRecorderProps) => {

  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const audioRecorderPlayer = useRef<AudioRecorderPlayer>();

  useEffect(() => {
    audioRecorderPlayer.current = new AudioRecorderPlayer();
    audioRecorderPlayer.current.setSubscriptionDuration(0.09);  // optional. Default is 0.1
  }, [])

  const onStartRecord = async () => {
    console.log('onStartRecord')
    const path = 'hello.m4a';
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const uri = await audioRecorderPlayer.current!.startRecorder(path, audioSet);
    audioRecorderPlayer.current!.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition)
      setRecordTime(audioRecorderPlayer.current!.mmssss(Math.floor(e.currentPosition)))
    });

    console.log(`uri: ${uri}`);
  }

  const onStopRecord = async () => {
    console.log('onStopRecord')
    const result = await audioRecorderPlayer.current!.stopRecorder();
    audioRecorderPlayer.current!.removeRecordBackListener();
    setRecordSecs(0)

    console.log(result);
  }

  const onStartPlay = async () => {
    console.log('onStartPlay')
    const path = 'hello.m4a'
    const msg = await audioRecorderPlayer.current!.startPlayer(path);
    audioRecorderPlayer.current!.setVolume(1.0);
    console.log(msg);

    audioRecorderPlayer.current!.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        console.log('finished');
        audioRecorderPlayer.current!.stopPlayer();
      }

      setCurrentPositionSec(e.currentPosition)
      setCurrentDurationSec(e.duration)
      setPlayTime(audioRecorderPlayer.current!.mmssss(Math.floor(e.currentPosition)))
      setDuration(audioRecorderPlayer.current!.mmssss(Math.floor(e.duration)))
    })
  }

  const onPausePlay = async () => {
    console.log('onPausePlay')
    await audioRecorderPlayer.current!.pausePlayer();
  }

  const onStopPlay = async () => {
    console.log('onStopPlay')
    audioRecorderPlayer.current!.stopPlayer();
    audioRecorderPlayer.current!.removePlayBackListener();
  }

  return (
    <View>
      <Text>recordSecs: {recordSecs}</Text>
      <Divider />

      <Text>recordTime: {recordTime}</Text>
      <Divider />

      <Text>currentPositionSec: {currentPositionSec}</Text>
      <Divider />

      <Text>currentDurationSec: {currentDurationSec}</Text>
      <Divider />

      <Text>playTime: {playTime}</Text>
      <Divider />

      <Text>duration: {duration}</Text>
      <Divider />

      <Button mode="contained" onPress={onStartRecord}>
        Start Record
      </Button>

      <Button mode="contained" onPress={onStopRecord}>
        Stop Record
      </Button>

      <Button mode="contained" onPress={onStartPlay}>
        Play
      </Button>

      <Button mode="contained" onPress={onPausePlay}>
        Pause Play
      </Button>

      <Button mode="contained" onPress={onStopPlay}>
        Stop Play
      </Button>

    </View>
  );
};

export default AudioPlayerRecorder;

const styles = StyleSheet.create({
  container: {}
});
