import React, { useState, useReducer } from 'react';
import {
  Animated, View, Text, TouchableHighlight, StyleSheet, Image, Modal, PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import DefaultPreference from 'react-native-default-preference';
import Button from './shared/Button';
import TimeBar from './TimeBar';
import PlayTime from './PlayTime';
import RecordingTime from './RecordingTime'
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';

// require the module
var RNFS = require('react-native-fs');

const { width, height } = Dimensions.get('window');
let calRatio = width <= height ? 16 * (width / height) : 16 * (height / width);
const ratio = calRatio / (360 / 9);
export const screenWidth = width;

class RecordingModal extends React.Component {
  constructor(props) {
    super();

    this.props = props;

    this.state = {
      visible: false,
      recordSecs: 0,
      recordTime: '00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00',
      duration: '00:00',
      isPlaying: false,
      isRecording: false,
      showPlayView: this.props.hasVoice,
      showPlayBtn: this.props.hasVoice,
      showRecordingBtn: true,
    }

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }


  componentDidUpdate(prevProp, prevState) {
    const { showModal } = this.props;
    if (!prevProp.showModal && showModal) {
      // NOTE: Open
      this.setState({
        recordSecs: 0,
        recordTime: '00:00',
        currentPositionSec: 0,
        currentDurationSec: 0,
        playTime: '00:00',
        duration: '00:00',
        isPlaying: false,
        isRecording: false,
        showPlayView: this.props.hasVoice,
        showPlayBtn: this.props.hasVoice,
        showRecordingBtn: true,
      });
    }
  }

  render() {
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 70);
    if (!playWidth) playWidth = 0;

    return (
      <>
        < Modal
          animationType="slide"
          transparent={false}
          visible={this.props.showModal} >
          <LinearGradient colors={['#F3CF39', '#EE7141', '#E71E47', '#000000']} style={styles.centeredView}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>

                <RecordingTime showPlayView={this.state.showPlayView} recordTime={this.state.recordTime}></RecordingTime>

                {/* Play time container */}
                <View style={{
                  ...styles.container,
                  display: this.state.showPlayView ? 'flex' : 'none',
                  marginTop: 120,
                }}>
                  {/* Play / Stop button */}
                  <View style={{
                    justifyContent: 'center', width: '100%'
                  }}>
                    <Button
                      style={{
                        ...styles.btn,
                        display: this.state.showPlayBtn ? 'flex' : 'none',
                        marginLeft: 'auto', marginRight: 'auto',
                        width: 180,
                        height: 180,
                        borderRadius: 90,
                      }}
                      onPress={this.onStartPlay}
                      textStyle={styles.txt}
                      imgCenterSrc={require('../assets/images/play.png')}
                    >
                    </Button>

                    <Button
                      style={
                        {
                          ...styles.btn,
                          display: this.state.showPlayBtn ? 'none' : 'flex',
                          marginLeft: 'auto', marginRight: 'auto',
                          width: 180,
                          height: 180,
                          borderRadius: 90
                        }
                      }
                      onPress={this.onStopPlay}
                      textStyle={styles.txt}
                      imgCenterSrc={require('../assets/images/stop.png')}
                    >
                    </Button>
                  </View>

                  {/* NOTE: Time bar */}
                  <TimeBar playWidth={playWidth}></TimeBar>
                  <PlayTime playTime={this.state.playTime} duration={this.state.duration}></PlayTime>
                </View>
              </View>
            </View>



            {/* NOTE: Record / Stop button */}
            <View style={{
              justifyContent: 'center',
              width: 100,
              height: 100,
              position: 'absolute',
              bottom: 50,
              zIndex: 1,
            }}>

              <Button
                style={
                  {
                    ...styles.btn,
                    display: this.state.isRecording || !this.state.showRecordingBtn ? 'none' : 'flex',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: 100,
                    height: 100
                  }
                }
                onPress={this.onStartRecord}
                imgCenterSrc={require('../assets/images/microphone.png')}
              >
              </Button>
              <Button
                style={{
                  ...styles.btn,
                  display: this.state.isRecording ? 'flex' : 'none',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                onPress={this.onStopRecord}
                imgCenterSrc={require('../assets/images/pause.png')}
              >
              </Button>
            </View>

            {/* Footer */}
            <View style={{
              height: 100,
              position: 'absolute',
              bottom: 0,
              zIndex: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              width: '100%',
              display: this.state.isRecording || !this.state.showRecordingBtn ? 'none' : 'flex',
            }}>

              {/* Completion */}
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  right: 40,
                  height: 100,
                  width: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  display: this.state.showPlayBtn ? 'flex' : 'none',
                }}
                onPress={() => {
                  const filePath = RNFS.CachesDirectoryPath + '/hello.m4a';
                  const filePath2 = RNFS.CachesDirectoryPath + '/voice.m4a';
                  DefaultPreference.set('hasRecordData', 'true')
                    .then(e => {
                      // NOTE: If has existing data, delete it first
                      RNFS.exists(RNFS.CachesDirectoryPath + '/voice.m4a')
                        .then(isExist => {
                          if (isExist) {
                            RNFS.unlink(RNFS.CachesDirectoryPath + '/voice.m4a')
                              .then(e => {
                                RNFFmpeg.execute(`-ss 2 -i ${filePath} ${filePath2}`)
                                  .then(result => {
                                    this.props.changeVoice(true);
                                    this.props.callbackButton('DONE');
                                    console.log(`********* FFmpeg process exited with rc=${result}.`);
                                  });

                                // RNFS.copyFile(RNFS.CachesDirectoryPath + '/hello.m4a', RNFS.CachesDirectoryPath + '/voice.m4a')
                                //   .then(e => {
                                //     this.props.changeVoice(true);
                                //     this.props.callbackButton('DONE');
                                //   })
                              })
                          } else {
                            RNFFmpeg.execute(`-ss 2 -i ${filePath} ${filePath2}`)
                              .then(result => {
                                this.props.changeVoice(true);
                                this.props.callbackButton('DONE');
                                console.log(`FFmpeg process exited with rc=${result}.`);
                              });

                            // RNFS.copyFile(RNFS.CachesDirectoryPath + '/hello.m4a', RNFS.CachesDirectoryPath + '/voice.m4a')
                            //   .then(e => {
                            // this.props.changeVoice(true);
                            // this.props.callbackButton('DONE');
                            //   })
                          }
                        })
                    })
                }}
              >
                <Text style={styles.textStyle}>Done</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  left: 40,
                  height: 100,
                  width: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute'
                }}
                onPress={() => {
                  this.props.callbackButton('DELETE');
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </LinearGradient>

        </Modal >
      </>
    )
  }

  private onStartRecord = async () => {
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


    this.setState({ isRecording: true, showPlayView: false });
    const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);
    this.audioRecorderPlayer.addRecordBackListener((e: any) => {

      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ).slice(3),
      });

      if (e.current_position >= 8000) {
        this.onStopRecord();
      }
    });

  };

  private onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
      isRecording: false,
      showPlayView: true,
      showPlayBtn: true
    });
  };

  private onStartPlay = async () => {
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });

    this.setState({
      isPlaying: true,
      showRecordingBtn: false,
      showPlayBtn: false
    });

    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);

    this.audioRecorderPlayer.addPlayBackListener((e: any) => {
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ).slice(3),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)).slice(3),
      });

      if (e.current_position === e.duration) {
        this.stopAudioPlay();

        return;
      }
    });
  };

  private onStopPlay = async () => {
    this.stopAudioPlay();
  };

  private stopAudioPlay = () => {
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
    this.setState({
      isPlaying: false,
      showPlayView: true,
      showPlayBtn: true,
      showRecordingBtn: true,
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00',
      duration: '00:00',
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    // backgroundColor: 'yellow'
    // height: '100%'
  },
  modalView: {
    // margin: 20,
    // backgroundColor: "yellow",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    width: '100%',
    height: '100%'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  btn: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
    // borderWidth: 1 * ratio,
  },
  txt: {
    color: 'black',
    fontSize: 14,
    marginHorizontal: 8 * ratio,
    marginVertical: 4 * ratio,
  },
  txtRecordCounter: {
    marginTop: 32 * ratio,
    color: 'black',
    fontSize: 20 * ratio,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
  textStyle: {
    fontSize: 24,
    color: 'white'
  }
});

const mapStateToProps = state => {
  return {
    hasVoice: state.hasVoice,
  }
};

// const ActionCreators = Object.assign(
//   {},
//   changeVoice,
// );
const mapDispatchToProps = dispatch => {
  // actions: bindActionCreators(ActionCreators, dispatch),
  return {
    changeVoice: (flag) => { dispatch({ type: 'VOICE_CHANGE', payload: flag }) }
    // actions: bindActionCreators(ActionCreators, dispatch),
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(RecordingModal)

