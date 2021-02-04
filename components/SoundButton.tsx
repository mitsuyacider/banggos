import React, { useState, useReducer } from 'react';
import { Animated, View, Text, TouchableHighlight, StyleSheet, Image, Easing } from 'react-native';

export default class SoundButton extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.animVal = new Animated.Value(30);
    this.updateButtonWidth();
  }

  render() {
    const isSelected = this.props.title == this.props.selectedName
    const width = this.animVal.interpolate({
      inputRange: [30, 90],
      outputRange: [30, 90]
    });

    const filePaths = {
      'BELL': require('../assets/images/bellThumbnail.png'),
      'CYMBAL': require('../assets/images/cymbalThumbnail.png'),
      'CLAP': require('../assets/images/clapThumbnail.png'),
      'VOICE': require('../assets/images/voiceThumbnail.png'),
      'RECORD': require('../assets/images/microphone_black.png'),
    };
    const filePath = filePaths[this.props.title];

    let backgroundColor = isSelected ? '#FFD228' : 'white';
    if (this.props.isRecording) backgroundColor = '#FF2400';

    return (
      <>
        <TouchableHighlight style={{ ...styles.container, backgroundColor }} onPress={() => this.onPressButton(this.props)} underlayColor="white">
          <Animated.View style={{ width }}>
            <Image
              source={filePath}
              style={{ ...styles.image, opacity: isSelected ? 1 : 0 }}
            />
            <Text
              style={styles.text}>
              {this.props.title}
            </Text>
          </Animated.View>
        </TouchableHighlight>
        {this.props.children}
      </>
    );
  }

  componentDidUpdate(prevProps) {
    this.updateButtonWidth();
  }

  updateButtonWidth() {
    const isSelected = this.props.title == this.props.selectedName
    const width = isSelected ? 90 : 30;
    Animated.timing(
      this.animVal,
      {
        toValue: width,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: false,
      }
    ).start();
  }

  onPressButton(props) {
    props.callbackHandler(props.title);
  };
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'white',
    marginTop: 20,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    marginLeft: 'auto',
    position: 'relative',
    zIndex: 2
  },
  text: {
    position: 'absolute',
    right: -38,
    top: 27,
    textAlign: 'center',

    width: 100,
    transform: [{ rotateZ: '-90deg' }],
  },
  image: {
    width: 35,
    height: '100%',
    marginLeft: 15,
    resizeMode: 'contain',
  }
});
