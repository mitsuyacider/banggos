import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import { RNFFmpeg } from 'react-native-ffmpeg';

const RNFS = require('react-native-fs');

export default class VoiceRecorder extends AudioRecorderPlayer {
  constructor() {
    super();
  }

  trimSilenceAudio = async () => {
    console.log('**** trim silence audior')
    const filePath = RNFS.CachesDirectoryPath + '/hello.m4a';
    const filePath2 = RNFS.CachesDirectoryPath + '/voice.m4a';

    // NOTE: Command for ffmpeg to trim silence audio
    const executeFFmpeg = () => RNFFmpeg.execute(`-i ${filePath} -af silenceremove=1:0:-50dB ${filePath2}`);

    const outcome = await RNFS.exists(RNFS.CachesDirectoryPath + '/voice.m4a')
      .then(isExist => {
        if (isExist) {
          RNFS.unlink(RNFS.CachesDirectoryPath + '/voice.m4a').then(executeFFmpeg)
        } else {
          executeFFmpeg();
        }
      })

    return outcome;
  }

  onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        // console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        // console.warn(err);
        return;
      }
    }
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };


    // this.setState({ isRecording: true, showPlayView: false });
    const uri = await this.startRecorder(path, audioSet);

    return uri;
  };

  onStopRecord = async () => {
    const result = await this.stopRecorder();
    this.removeRecordBackListener();

    return result;
  };
}