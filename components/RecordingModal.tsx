import React, { useState, useReducer } from 'react';
import {
  Animated, View, Text, TouchableHighlight, StyleSheet, Image, Modal, PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import Button from './shared/Button';

const { width, height } = Dimensions.get('window');
let calRatio = width <= height ? 16 * (width / height) : 16 * (height / width);
const ratio = calRatio / (360 / 9);
export const screenWidth = width;

export default class RecordingModal extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      visible: this.props.showModal,
      recordSecs: 0,
      recordTime: '00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      isPlaying: false,
      isRecording: true,
    }

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1

  }

  setModalVisible = (visible) => {
    this.setState({ visible: visible });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.showModal });
  }

  render() {
    const { visible } = this.state;
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    if (!playWidth) playWidth = 0;

    const showPlayView = !this.state.isRecording;
    const showPlayBtn = showPlayView && !this.state.isPlaying;
    const digitWidth = 60;

    return (
      <>
        < Modal
          animationType="slide"
          transparent={false}
          visible={visible} >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              {/* Recording view */}
              <View style={{
                width: '100%',
                backgroundColor: 'red',
                marginTop: 140,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    fontSize: 80,
                    width: digitWidth,
                    backgroundColor: 'blue',
                  }}>
                    {this.state.recordTime.substr(0, 1)}
                  </Text>

                  <Text style={{
                    width: digitWidth,
                    fontSize: 80,
                    backgroundColor: 'blue',
                  }}>
                    {this.state.recordTime.substr(1, 1)}
                  </Text>

                  <Text style={{
                    width: 25,
                    fontSize: 80,
                    backgroundColor: 'blue',
                  }}>
                    :
                  </Text>

                  <Text style={{
                    width: digitWidth,
                    fontSize: 80,
                    backgroundColor: 'blue',
                  }}>
                    {this.state.recordTime.substr(3, 1)}
                  </Text>

                  <Text style={{
                    width: 80,
                    fontSize: 80,
                    backgroundColor: 'blue',
                  }}>
                    {this.state.recordTime.substr(4, 1)}
                  </Text>

                </View>
                <Text style={{
                  fontSize: 20,
                }}>
                  ...Recording
                </Text>
              </View>

              {/* Play time container */}
              <View style={{ ...styles.container, display: showPlayView ? 'flex' : 'none' }}>

                {/* Play / Stop button */}
                <View style={{ justifyContent: 'center', width: '100%' }}>
                  <Button
                    style={{ ...styles.btn, display: showPlayBtn ? 'flex' : 'none' }}
                    onPress={this.onStartPlay}
                    textStyle={styles.txt}
                  >
                    {'PLAY'}
                  </Button>
                  {/* <Button
                    style={[
                      styles.btn,
                      {
                        marginLeft: 12 * ratio,
                      },
                    ]}
                    onPress={this.onPausePlay}
                    textStyle={styles.txt}
                  >
                    {'PAUSE'}
                  </Button> */}
                  <Button
                    style={
                      { ...styles.btn, display: showPlayBtn ? 'none' : 'flex' }
                    }
                    onPress={this.onStopPlay}
                    textStyle={styles.txt}
                  >
                    {'STOP'}
                  </Button>
                </View>

                {/* NOTE: Play time */}
                <View>
                  <Text>
                    {this.state.playTime} / {this.state.duration}
                  </Text>
                </View>

                {/* NOTE: Time bar */}
                <View
                  style={styles.viewBarWrapper}
                >
                  <View style={styles.viewBar}>
                    <View style={[styles.viewBarPlay, { width: playWidth }]} />
                  </View>
                </View>

              </View>
            </View>
          </View>



          {/* NOTE: Record / Stop button */}
          <View style={{
            justifyContent: 'center',
            width: '100%',
            height: 100,
            position: 'absolute',
            bottom: 50,
            zIndex: 1,
          }}>

            <Button
              style={
                {
                  ...styles.btn,
                  display: this.state.isRecording ? 'none' : 'flex',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }
              }
              onPress={this.onStartRecord}
              imgCenterSrc={require('../assets/images/bellThumbnail.png')}
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
              imgCenterSrc={require('../assets/images/voiceThumbnail.png')}
            >
            </Button>
          </View>

          {/* Footer */}
          <View style={{
            height: 100,
            position: 'absolute',
            bottom: 0,
            zIndex: 0,
            backgroundColor: 'rgba(255,0,0,0.5)',
            width: '100%'
          }}>

            {/* Completion */}
            <TouchableHighlight
              style={{
                ...styles.openButton,
                backgroundColor: "#2196F3",
                right: 40,
                height: 100,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute'
              }}
              onPress={() => {
                this.setModalVisible(!visible)
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{
                ...styles.openButton,
                backgroundColor: "#2196F3",
                left: 40,
                height: 100,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute'
              }}
              onPress={() => {
                this.deleteAudio();
              }}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight>
          </View>
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
        console.warn(err);
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
        console.warn(err);
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
    console.log('audioSet', audioSet);

    this.setState({ isRecording: true });
    const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);
    this.audioRecorderPlayer.addRecordBackListener((e: any) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ).slice(3),
      });
    });
    console.log(`uri: ${uri}`);
  };

  private onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
      isRecording: false
    });
    console.log(result);
  };

  private onStartPlay = async () => {
    console.log('onStartPlay');
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });

    this.setState({
      isPlaying: true,
    });

    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener((e: any) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
        this.setState({
          isPlaying: false,
        });
      }

      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
  };

  private onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  private onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
    this.setState({
      isPlaying: false,
    });
  };

  private deleteAudio() {
    console.log('delete audio')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'yellow',
    width: '100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    backgroundColor: 'yellow'
    // height: '100%'
  },
  modalView: {
    // margin: 20,
    backgroundColor: "yellow",
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
  titleTxt: {
    marginTop: 100 * ratio,
    color: 'black',
    fontSize: 28 * ratio,
  },
  viewRecorder: {
    marginTop: 40 * ratio,
    width: '100%',
    alignItems: 'center',
  },
  recordBtnWrapper: {
    flexDirection: 'row',
  },
  viewPlayer: {
    marginTop: 60 * ratio,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewBarWrapper: {
    marginTop: 28 * ratio,
    marginHorizontal: 28 * ratio,
    alignSelf: 'stretch',
    overflow: 'hidden'
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 5,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 5,
    width: 0,
  },
  playStatusTxt: {
    marginTop: 8 * ratio,
    color: '#ccc',
  },
  playBtnWrapper: {
    flexDirection: 'row',
    marginTop: 40 * ratio,
  },
  btn: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
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
  txtCounter: {
    marginTop: 12 * ratio,
    color: 'black',
    fontSize: 20 * ratio,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
  textStyle: {
    fontSize: 20
  }
});
