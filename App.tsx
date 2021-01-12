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
  NativeEventEmitter,
  Text,
  Animated, Easing,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import SoundPlayer from 'react-native-sound-player';
import ButtonContainer from "./components/ButtonContainer";
import Balloon from './components/Balloon'
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
import DefaultPreference from 'react-native-default-preference';
import osc from 'react-native-osc';
var RNFS = require('react-native-fs');

var portIn = 9999
var portOut = 8888

let buttonState = 'BELL';

class App extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.spinValue = new Animated.Value(0);


    // NOTE: Initialize
    DefaultPreference.get('hasRecordData')
      .then((value) => {
        const flag = !!value;
        this.props.changeVoice(flag);
      })
      .catch(err => {
        console.log('** error', err);
      });

    //create a client and send a message
    osc.createClient("192.168.1.0", portOut);
    osc.sendMessage("/address/", [1.0, 0.0]);


    //suscribe to GotMessage event to receive OSC messages
    const eventEmitter = new NativeEventEmitter(osc);
    eventEmitter.addListener('GotMessage', (oscMessage) => {
      console.log('oscmessege', oscMessage);

      if (oscMessage.address === '/sexy/60') {
        this.onPressButton();
      }
    });

    osc.createServer('', portIn);
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['90%', '100%']
    })

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
            backgroundColor: 'black',
            borderRadius: 5,
            resizeMode: 'cover',
          }}
        />
        <View style={styles.scrollView}>

          {/* NOTE: Balloon */}
          <Balloon></Balloon>

          <TouchableWithoutFeedback
            onPress={this.onPressButton.bind(this)}
          >
            <Animated.Image
              style={{
                width: spin,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                resizeMode: 'contain',
                // transform: [{ rotate: spin }]
              }}
              source={require('./assets/images/tinko.png')}
            />
          </TouchableWithoutFeedback>

        </View>

        <ButtonContainer callbackButton={this.callbackButton.bind(this)}></ButtonContainer>
      </>
    )
  }

  spin() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.bounce
      }
    ).start()
  }

  callbackButton(name) {
    this.audioRecorderPlayer.stopPlayer();
    buttonState = name;
  }

  onPressButton() {

    this.spin();
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
      if (buttonState == 'RECORD') {

        if (this.props.hasVoice) {
          this.onStartPlay();
        }
      } else {
        SoundPlayer.playSoundFile(file, 'wav')
      }
    } catch (e) {
      console.log(`cannot play the sound file`, e)
    }
  }

  onStartPlay = async () => {
    const path = Platform.select({
      ios: 'voice.m4a',
      android: 'sdcard/hello.mp4',
    });

    this.setState({
      isPlaying: true,
    });

    this.audioRecorderPlayer.seekToPlayer(0);
    this.audioRecorderPlayer.stopPlayer();
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
  };
}


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




export default connect(mapStateToProps, mapDispatchToProps)(App)

// export default App;
