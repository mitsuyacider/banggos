import React, { useState, useReducer } from 'react';
import { Animated, View, Text, TouchableHighlight, StyleSheet, Image } from 'react-native';

export default class SoundButton extends React.Component {
  constructor(props) {
    super();
    this.props = props;

    this.animVal = new Animated.Value(0);
    this.interpolateIcon = this.animVal.interpolate({ inputRange: [30, 80], outputRange: [0, 1] })
  }

  render() {
    const isSelected = this.props.title == this.props.selectedName
    const width = isSelected ? 80 : 30;
    const filePaths = {
      'BELL': require('../assets/images/bellThumbnail.png'),
      'CYMBAL': require('../assets/images/cymbalThumbnail.png'),
      'CLAP': require('../assets/images/clapThumbnail.png'),
      'VOICE': require('../assets/images/voiceThumbnail.png'),
    };
    const filePath = filePaths[this.props.title];
    const backgroundColor = isSelected ? 'yellow' : 'white';

    return (
      <>
        <TouchableHighlight style={{ ...styles.container, width, backgroundColor }} onPress={() => this.onPressButton(this.props)} underlayColor="white">
          <Animated.View>
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
