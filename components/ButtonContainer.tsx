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
    super(props);

    this.state = {
      selectedName: 'BELL',
      text:'Keep pressing during your record'
    };

    this.child = React.createRef();
  }

  render() {
    const isVoice = this.state.selectedName === 'RECORD';

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
            
            {/* NOTE: Recording container */}
            <View style={{ ...styles.recordingContainer, opacity: isVoice ? 1 : 0 }}>
              {/* NOTE: Bubble */}
              <View
                style={{ ...styles.bubbleContainer }}>
                <Text style={{ ...styles.bubbleText }}>{this.getRecordingBallonText()}</Text>                  
                <View style={styles.triangle} />
              </View>
              
              {/* NOTE: Recording button */}
              <Button
                style={{ ...styles.recordingButton }}
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

  /**
   * NOTE: If now recording, return time count.
   * Otherwise return annotation text.
   * @return Bubble text
   */
  private getRecordingBallonText() {
    let text = '';

    if (this.props.isRecording) {
      text = `${this.props.recordSecs} seconds left`;
    } else {
      text = this.state.text;
    }

    return text;
  }

  /**
   * NOTE: Start recording
   */
  private onPressVoice() {
    this.props.callbackRecordingButton('pressIn');
  }

  /**
   * NOTE: Stop recording
   */
  private onPressOutVoice() {
    this.props.callbackRecordingButton('pressOut');
  }

  /**
   * NOTE: Callback on each side menu buttons.
   */
  private callbackHandler(name) {
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
  },
  bubbleContainer: {
    marginRight: 30,
    color: 'white',
    justifyContent: 'center',
    alignItems:'center',
    width: 250,
    height: 80,
    borderRadius: 8,
    zIndex:-1,
    backgroundColor:'white'    
  },
  bubbleText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5    
  },
  recordingButton: {
    width: 70,
    height: 70,
    backgroundColor: 'black',
    marginLeft: 'auto',
    top: 0,    
  },
  recordingContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
  }
});
