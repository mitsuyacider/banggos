import React, {useReducer, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Modal,
  Alert,
} from 'react-native';
import SoundButton from './SoundButton';
import RecordingModal from './RecordingModal';
import Button from './shared/Button';

export default class ButtonContainer extends React.Component {
  constructor(props) {
    super();

    this.props = props;

    this.state = {
      selectedName: 'BELL',
      showModal: false,
    };

    this.child = React.createRef();
  }

  render() {
    const isVoice = this.state.selectedName === 'RECORD';
    // const [modalVisible, setModalVisible] = useState(false);

    return (
      <>
        <RecordingModal
          showModal={this.state.showModal}
          callbackButton={this.callbackModal.bind(this)}
        />
        <View style={styles.container}>
          <SoundButton
            title="BELL"
            selectedName={this.state.selectedName}
            callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton
            title="CLAP"
            selectedName={this.state.selectedName}
            callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton
            title="CYMBAL"
            selectedName={this.state.selectedName}
            callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton
            title="VOICE"
            selectedName={this.state.selectedName}
            callbackHandler={this.callbackHandler.bind(this)}></SoundButton>
          <SoundButton
            title="RECORD"
            selectedName={this.state.selectedName}
            callbackHandler={this.callbackHandler.bind(this)}>
            <Button
              style={{
                width: 70,
                height: 70,
                backgroundColor: 'black',
                marginLeft: 'auto',
                opacity: isVoice ? 1 : 0,
                top: 0,
              }}
              onPress={this.onPressVoice.bind(this)}
              imgCenterSrc={require('../assets/images/plus.png')}></Button>
          </SoundButton>
        </View>
      </>
    );
  }

  callbackModal(state) {
    this.setState({showModal: false});
  }

  onPressVoice() {
    // NOTE: Show recording view
    // this.setState({ showModal: true });
  }

  callbackHandler(name) {
    this.setState({selectedName: name});
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
