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
  TouchableWithoutFeedback
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import ButtonContainer from "./components/ButtonContainer";
import SoundPlayer from 'react-native-sound-player';

let buttonState = 'BELL';

const App: () => React$Node = () => {
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
          onPress={onPressButton}
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

      <ButtonContainer callbackButton={callbackButton}></ButtonContainer>
    </>
  );
};

const callbackButton = (name) => {
  buttonState = name;
}

const onPressButton = () => {
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
    SoundPlayer.playSoundFile(file, 'wav')
  } catch (e) {
    console.log(`cannot play the sound file`, e)
  }
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

export default App;
