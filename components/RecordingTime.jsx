import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class RecordingTime extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const digitWidth = 60;

    return (
      <>
        {/* Recording view */}
        <View style={{
          width: '100%',
          marginTop: 140,
          // display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          display: this.props.showPlayView ? 'none' : 'flex'
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'

          }}>
            最大で8秒まで録音できます
                    </Text>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center'
          }}>

            <Text style={{
              fontSize: 80,
              width: digitWidth,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'

            }}>
              {this.props.recordTime.substr(0, 1)}
            </Text>

            <Text style={{
              width: digitWidth,
              fontSize: 80,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {this.props.recordTime.substr(1, 1)}
            </Text>

            <Text style={{
              width: 25,
              fontSize: 80,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              :
                  </Text>

            <Text style={{
              width: digitWidth,
              fontSize: 80,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'

            }}>
              {this.props.recordTime.substr(3, 1)}
            </Text>

            <Text style={{
              width: 50,
              fontSize: 80,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {this.props.recordTime.substr(4, 1)}
            </Text>

          </View>
        </View>
      </>
    )
  }
}