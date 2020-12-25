import React from 'react';
import { View, Text } from 'react-native';

const SoundButton = (props) => {
  return (
    <>
      <View
        style={{
          width: 30,
          height: 70,
          backgroundColor: 'powderblue',
          marginTop: 20,
          borderBottomLeftRadius: 5,
          borderTopLeftRadius: 5,
          marginLeft: 'auto',
        }}>
        <Text
          style={{
            position: 'absolute',
            right: -38,
            top: 27,
            textAlign: 'center',
            // height: 10,
            width: 100,
            transform: [{ rotateZ: '-90deg' }],
          }}>
          {props.title}
        </Text>
      </View>
    </>
  );
};

export default SoundButton;