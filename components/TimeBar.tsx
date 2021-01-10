import React, { useState, useReducer } from 'react';
import { View, StyleSheet } from 'react-native';

export default class TimeBar extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    return (
      <>
        <View
          style={styles.viewBarWrapper}
        >
          <View style={styles.viewBar}>
            <View style={[styles.viewBarPlay, { width: this.props.playWidth }]} />
          </View>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  viewBarWrapper: {
    marginTop: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    textAlign: 'center'
  },
  viewBar: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
    borderWidth: 2,
    height: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 18,
    width: 0,

  }
});