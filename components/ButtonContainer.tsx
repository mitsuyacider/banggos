import React, {useReducer, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  Modal,
  Alert,
} from 'react-native';
import SoundButton from './SoundButton';
import RecordingModal from './RecordingModal';
import Button from './shared/Button';
import Balloon from './Balloon';


export default class ButtonContainer extends React.Component {
  constructor(props) {
    super();

    this.props = props;

    this.state = {
      selectedName: 'RECORD',
      showModal: false,
      text:'Keep pressing during your record'
    };

    this.child = React.createRef();
  }

  render() {
    const isVoice = this.state.selectedName === 'RECORD';
    // const [modalVisible, setModalVisible] = useState(false);

    return (
      <>
        {/* <RecordingModal
          showModal={this.state.showModal}
          callbackButton={this.callbackModal.bind(this)}
        /> */}
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
            isRecording={this.props.isRecording}
            selectedName={this.state.selectedName}
            callbackHandler={this.callbackHandler.bind(this)}>

            {/* NOTE: Balloon */}
            {/* <Balloon></Balloon> */}

            <View style={{
              display: 'flex',
              flexDirection:'row',
              justifyContent: 'space-between',
              opacity: isVoice ? 1 : 0,
          }}>
            <View
              style={{
                marginRight:10,
                color: 'white',
                justifyContent: 'center',
                width: 250,
                height: 100,
                zIndex: 5,
              }
              }>
              <Image
                source={require('../assets/images/balloon.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  top: 0,
                  zIndex: 0,
                  position: 'absolute',
                  borderRadius: 5,
                  resizeMode: 'cover',
                }}
              />
              <Text style={{
                color: 'black',
                fontSize: 20,
                textAlign: 'center',
                marginTop: -20,
                fontWeight: 'bold',
                padding: 5
              }}>{this.state.text}</Text>
            </View>
                  
            <Button
              style={{
                width: 70,
                height: 70,
                backgroundColor: 'black',
                marginLeft: 'auto',
                top: 0,
              }}
              onPressIn={this.onPressVoice.bind(this)}
              onPressOut={this.onPressOutVoice.bind(this)}
              imgCenterSrc={require('../assets/images/plus.png')}>              
            </Button>              
          </View>
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
    this.props.callbackRecordingButton('pressIn');
  }

  onPressOutVoice() {
    this.props.callbackRecordingButton('pressOut');
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
