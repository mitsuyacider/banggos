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

import DefaultPreference from 'react-native-default-preference';
import Button from './shared/Button';

const { width, height } = Dimensions.get('window');
let calRatio = width <= height ? 16 * (width / height) : 16 * (height / width);
const ratio = calRatio / (360 / 9);
export const screenWidth = width;

class RecordingModal extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    console.log('**** has voice in record modal', this.props.hasVoice)
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
    console.log('*******8 reren')
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    if (!playWidth) playWidth = 0;

    const digitWidth = 60;

    return (
      <>
        < Modal
          animationType="slide"
          transparent={false}
          visible={this.props.showModal} >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              {/* Recording view */}
              <View style={{
                width: '100%',
                backgroundColor: 'red',
                marginTop: 140,
                // display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                display: this.state.showPlayView ? 'none' : 'flex'
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
                {/* <Text style={{
                  fontSize: 20,
                }}>
                  ...Recording
                </Text> */}
              </View>

              {/* Play time container */}
              <View style={{
                ...styles.container,
                display: this.state.showPlayView ? 'flex' : 'none',
                marginTop: 120
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
                      borderRadius: 90
                    }}
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
                      {
                        ...styles.btn, display: this.state.showPlayBtn ? 'none' : 'flex',
                        marginLeft: 'auto', marginRight: 'auto',
                        width: 180,
                        height: 180,
                        borderRadius: 90
                      }
                    }
                    onPress={this.onStopPlay}
                    textStyle={styles.txt}
                  >
                    {'STOP'}
                  </Button>
                </View>

                {/* NOTE: Play time */}
                <View style={{
                  marginTop: 50
                }}>
                  <Text style={{
                    fontSize: 30,
                    textAlign: 'center'
                  }}>
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
                  display: this.state.isRecording || !this.state.showRecordingBtn ? 'none' : 'flex',
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
                DefaultPreference.set('hasRecordData', 'true')
                  .then(e => {
                    this.props.changeVoice(true);
                    this.props.callbackButton('DONE');
                  })
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
                DefaultPreference.set('hasRecordData', 'false')
                  .then(e => {
                    this.props.changeVoice(false);
                    this.props.callbackButton('DELETE');
                  })
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
    console.log('audioSet', audioSet);

    this.setState({ isRecording: true, showPlayView: false });
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
      isRecording: false,
      showPlayView: true,
      showPlayBtn: true
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
      showRecordingBtn: false,
      showPlayBtn: false
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
          showPlayView: true,
          showPlayBtn: true,
          showRecordingBtn: true

        });
      }

      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ).slice(3),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)).slice(3),
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
      showRecordingBtn: true,
      showPlayBtn: true,

    });
  };

  private deleteAudio() {
    console.log('delete audio')
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'blue'
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
    overflow: 'hidden',
  },
  viewBar: {
    // backgroundColor: '#ccc',
    borderColor: '#ccc',
    borderWidth: 2,
    height: 15,
    alignSelf: 'stretch',
    borderRadius: 8
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 10,
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

