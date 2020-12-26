import React, { useReducer } from 'react';
import { View, StyleSheet } from 'react-native';
import SoundButton from "./SoundButton";

export default class ButtonContainer extends React.Component {
  constructor(props) {
    super();

    this.props = props;

    this.state = {
      selectedName: 'BELL'
    };
  }

  render() {
    return (
      <>
        <View
          style={styles.container}>
          <SoundButton title='BELL' selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton title='CLAP' selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton title="CYMBAL" selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton title="VOICE" selectedName={this.state.selectedName} callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
        </View>
      </>
    );
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
  }
});
