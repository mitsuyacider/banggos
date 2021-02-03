import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';

import { connect } from 'react-redux';
import { addOscListener } from "./scripts/addOscListener";
import SoundPlayer from 'react-native-sound-player';
import ButtonContainer from './components/ButtonContainer';
import Balloon from './components/Balloon';
import VoiceRecorder from "./scripts/VoiceRecorder";
import DefaultPreference from 'react-native-default-preference';

const MAX_RECORDING_TIME = 8

let buttonState = 'BELL';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.audioRecorderPlayer = new VoiceRecorder();
    this.scaleValue = new Animated.Value(0);
    this.bgColor = new Animated.Value(0);

    // NOTE: Initialize
    DefaultPreference.get('hasRecordData')
      .then((value) => {
        const flag = !!value;
        this.props.changeVoice(flag);
      })
      .catch((err) => { console.log(err); });

    // NOTE: Initialize osc settings
    addOscListener(this.playSound.bind(this));

    this.state = {
      isPlaying: false,
      isRecording: false,
      timeLeft: 8
    }
  }

  render() {
    const scaleValue = this.scaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['90%', '100%'],
    });

    const bgColor = this.bgColor.interpolate({
      inputRange: [-500, 500],
      outputRange: ['rgba(255, 160, 167, 1)', 'rgba(139, 0, 0, 1)']
    });
    return (
      <>
        <Animated.Image
          source={this.state.isRecording ? require('./assets/images/bgTransparent.png') : require('./assets/images/bg.png')}
          style={{ ...styles.background, backgroundColor: bgColor }}
        />
        <View style={styles.scrollView}>
          {/* NOTE: Balloon */}
          <Balloon></Balloon>

          <TouchableWithoutFeedback onPress={this.playSound.bind(this)}>
            <Animated.Image
              style={{ width: scaleValue, ...styles.tinko }}
              source={require('./assets/images/tinko.png')}
            />
          </TouchableWithoutFeedback>
        </View>

        <ButtonContainer
          callbackButton={this.callbackButton.bind(this)}
          callbackRecordingButton={this.callbackRecording.bind(this)}
          isRecording={this.state.isRecording}
          recordSecs={this.state.timeLeft}>
        </ButtonContainer>
      </>
    );
  }

  /**
   * NOTE: Scale up/down everytime a click event occurs.
   */
  private scaleUpAnimation() {
    this.scaleValue.setValue(0);
    Animated.timing(this.scaleValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.bounce,
    }).start();
  }

  /**
   * NOTE: Record button event
   * @param buttonState pressIn (mouse down) / pressOut (mouse leave)
   */
  private callbackRecording(buttonState: String) {
    if (buttonState === 'pressIn') {
      // NOTE: Start recording while pressing
      this.onStartRecord();
    } else if (buttonState === 'pressOut') {
      // NOTE: Stop recording
      this.onStopRecord().then(this.audioRecorderPlayer.trimSilenceAudio);
    }
  }

  /**
   * NOTE: Start recording
   */
  private onStartRecord = async () => {
    this.setState({ isRecording: true, showPlayView: false });
    const uri = await this.audioRecorderPlayer.onStartRecord();
    this.audioRecorderPlayer.addRecordBackListener(this.onRecordBackListener.bind(this));
  };

  /**
   * NOTE: Callback during recording
   */
  private onRecordBackListener = (e: any) => {
    const current = Math.floor(e.current_position / 1000);
    const timeLeft = MAX_RECORDING_TIME - current;

    this.setState({ timeLeft });

    const value = 500 * Math.sin(e.current_position / 400);
    this.bgColor.setValue(value);

    if (e.current_position >= MAX_RECORDING_TIME * 1000) {
      this.onStopRecord().then(this.audioRecorderPlayer.trimSilenceAudio);
    }
  }

  /**
   * NOTE: Stop recording
   */
  private onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.onStopRecord();
    this.setState({
      isRecording: false,
      showPlayView: true,
      showPlayBtn: true
    });

    this.props.changeVoice(true);
    DefaultPreference.set('hasRecordData', 'true');

    return result;
  };

  /**
   * NOTE: Callback on side menu button
   * @param name button name
   */
  private callbackButton(name) {
    this.audioRecorderPlayer.stopPlayer();
    buttonState = name;
  }

  private playSound() {
    this.scaleUpAnimation();
    // NOTE: Make sound along with selected button
    try {
      // play the file tone.mp3
      const files = {
        BELL: 'Ching',
        CLAP: 'Clap',
        CYMBAL: 'Cymbal',
        VOICE: 'Vox',
      };
      const file = files[buttonState];
      if (buttonState == 'RECORD') {
        console.log('*** has voice', this.props.hasVoice)
        if (this.props.hasVoice) {
          this.onStartPlay();
        }
      } else {
        SoundPlayer.playSoundFile(file, 'wav');
      }
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  }

  private onStartPlay = async () => {
    const path = Platform.select({
      ios: 'voice.m4a',
      android: 'sdcard/hello.mp4',
    });

    this.setState({ isPlaying: true });

    this.audioRecorderPlayer.seekToPlayer(0);
    this.audioRecorderPlayer.stopPlayer();
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
  };
}

const mapStateToProps = (state) => {
  return {
    hasVoice: state.hasVoice,
  };
};

// const ActionCreators = Object.assign(
//   {},
//   changeVoice,
// );
const mapDispatchToProps = (dispatch) => {
  // actions: bindActionCreators(ActionCreators, dispatch),
  return {
    changeVoice: (flag) => {
      dispatch({ type: 'VOICE_CHANGE', payload: flag });
    },
    // actions: bindActionCreators(ActionCreators, dispatch),
  };
};

const styles = StyleSheet.create({
  scrollView: {
    position: 'relative',
  },
  background: {
    width: '100%',
    height: '100%',
    top: 0,
    zIndex: 0,
    position: 'absolute',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  tinko: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    resizeMode: 'contain',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default App;
