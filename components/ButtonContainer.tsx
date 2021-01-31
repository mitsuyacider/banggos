import React, {useReducer, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import SoundButton from './SoundButton';
import Button from './shared/Button';


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
        <View pointerEvents="box-none" style={styles.container}>
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
            
            <View style={{
              flexDirection:'row',
              justifyContent: 'space-between',
              display:isVoice ? 'flex' : 'none'
            }}>
              <View
                style={{
                  marginRight: 30,
                  color: 'white',
                  justifyContent: 'center',
                  alignItems:'center',
                  width: 250,
                  height: 80,
                  borderRadius: 8,
                  zIndex:-1,
                  backgroundColor:'white'
                }
                }>
                <Text style={{
                  color: 'black',
                  fontSize: 20,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: 5
                  }}>{this.getRecordingBallonText()}</Text>
                  
                  <View style={styles.triangle} />
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

  getRecordingBallonText() {
    let text = '';

    if (this.props.isRecording) {
      text = `${this.props.recordSecs} seconds left`;
    } else {
      text = this.state.text;
    }

    return text;
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
  triangle: {
    width: 0,
    height: 0,
    right: -20,
    position:'absolute',
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 25,
    borderRightWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: "white",    
  }
});
