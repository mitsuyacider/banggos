/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import SoundPlayer from 'react-native-sound-player';
import ButtonContainer from "./components/ButtonContainer";
import { connect } from 'react-redux';
import { changeVoice } from './actions/changeVoice';
import { bindActionCreators } from 'redux';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

let buttonState = 'BELL';

class App extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  render() {
    return (
      <>
        <Image
          source={require('./assets/images/bg.png')}
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            zIndex: 0,
            position: 'absolute',
            backgroundColor: 'yellow',
            resizeMode: 'contain',
          }}
        />
        <View style={styles.scrollView}>
          <TouchableWithoutFeedback
            onPress={this.onPressButton.bind(this)}
          >
            <Image
              source={require('./assets/images/tinko.png')}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                resizeMode: 'contain',
              }}
            />
          </TouchableWithoutFeedback>

        </View>

        <ButtonContainer callbackButton={this.callbackButton.bind(this)}></ButtonContainer>
      </>
    )
  }

  callbackButton(name) {
    buttonState = name;
  }

  onPressButton() {
    // NOTE: Make sound along with selected button
    try {
      // play the file tone.mp3
      const files = {
        'BELL': 'Ching',
        'CLAP': 'Clap',
        'CYMBAL': 'Cymbal',
        'VOICE': 'Vox'
      }
      const file = files[buttonState]
      if (buttonState == 'VOICE') {
        console.log('*** onstart')
        this.onStartPlay();
        // SoundPlayer.playSoundFile('file:///Users/mw/Library/Developer/CoreSimulator/Devices/BB206464-ADF0-413B-94F3-97BC3899EFD3/data/Containers/Data/Application/3880DDDC-677D-4423-A709-664A5CCC06ED/Library/Caches/hello', 'm4a')
      } else {
        SoundPlayer.playSoundFile(file, 'wav')
      }
    } catch (e) {
      console.log(`cannot play the sound file`, e)
    }
  }

  onStartPlay = async () => {
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
    console.log('**** message', msg);
    this.audioRecorderPlayer.addPlayBackListener((e: any) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
        // this.setState({
        //   isPlaying: false,
        //   showPlayView: true,
        //   showPlayBtn: true
        // });
      }

      // this.setState({
      //   currentPositionSec: e.current_position,
      //   currentDurationSec: e.duration,
      //   playTime: this.audioRecorderPlayer.mmssss(
      //     Math.floor(e.current_position),
      //   ).slice(3),
      //   duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)).slice(3),
      // });
    });
  };
}


const styles = StyleSheet.create({
  scrollView: {
    position: 'relative',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  background: {
    backgroundColor: '#FFCC24',
    width: '100%',
    height: '100%',
    position: 'absolute',

    top: '50%',
    zIndex: 1,
  },
  bg: {
    overflow: 'visible',
    resizeMode: 'contain',
    /*
     * These negative margins allow the image to be offset similarly across screen sizes and component sizes.
     *
     * The source logo.png image is 512x512px, so as such, these margins attempt to be relative to the
     * source image's size.
     */
  },
  text: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.black,
  },
});



const mapStateToProps = state => ({
  hasVoice: state.hasVoice,
});

const ActionCreators = Object.assign(
  {},
  changeVoice,
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App)

// export default App;
