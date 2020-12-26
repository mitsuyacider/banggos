import React, { useState, useReducer } from 'react';
import { Animated, View, Text, TouchableHighlight, StyleSheet, Image, Modal } from 'react-native';

export default class RecordingModal extends React.Component {
  constructor(props) {
    super();

    this.props = props;
  }

  render() {
    return (
      <>
        < Modal
          animationType="slide"
          transparent={false}
          visible={this.props.showModal} >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>

              {/* <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                // setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight> */}
            </View>
          </View>
        </Modal >
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    textAlign: 'right',
    right: 0,
    justifyContent: 'center',
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: '100%',
    height: '100%'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
  }
});
