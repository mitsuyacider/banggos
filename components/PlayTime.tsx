import React, { useState, useReducer } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class PlayTime extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    return (
      <>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          <Text style={{
            ...styles.textStyle,
            textAlign: 'left',
          }}>
            {this.props.playTime}
          </Text>

          <Text style={{
            ...styles.textStyle,
            marginLeft: 'auto'
          }}>
            {this.props.duration}
          </Text>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }
});