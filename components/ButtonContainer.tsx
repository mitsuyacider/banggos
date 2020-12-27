import React, { useReducer, useState } from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Modal, Alert } from 'react-native';
import SoundButton from "./SoundButton";
import RecordingModal from './RecordingModal'

export default class ButtonContainer extends React.Component {
  constructor(props) {
    super();

    this.props = props;

    this.state = {
      selectedName: 'VOICE',
      showModal: true
    };
  }

  render() {
    const isVoice = this.state.selectedName === 'VOICE';
    // const [modalVisible, setModalVisible] = useState(false);

    return (
      <>
        <RecordingModal showModal={this.state.showModal}></RecordingModal>
        <View
          style={styles.container}>
          <SoundButton title='BELL' selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton title='CLAP' selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton title="CYMBAL" selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton style={{
            position: 'relative'
          }} title="VOICE" selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}>

            <TouchableHighlight onPress={() => this.onPressVoice()}>
              <Text
                style={
                  {
                    width: 70,
                    height: 70,
                    backgroundColor: 'white',
                    opacity: 1,
                    borderBottomLeftRadius: 5,
                    borderTopLeftRadius: 5,
                    marginLeft: 'auto',
                    opacity: isVoice ? 1 : 0,
                    top: 0
                  }
                }>
              </Text>
            </TouchableHighlight>
          </SoundButton>
        </View>
      </>
    );
  }

  onPressVoice() {
    // NOTE: Show recording view
    this.setState({ showModal: true })
    // console.log('tapped voice')
  }

  callbackHandler(name) {
    this.setState({ selectedName: name });
    this.props.callbackButton(name);
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
});
