import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { Component } from 'react';

import { ratio } from '../../utils/Styles';

// import NativeButton from 'apsl-react-native-button';

const styles: any = StyleSheet.create({
  btn: {
    // backgroundColor: 'transparent',
    // alignSelf: 'center',
    // borderRadius: 4 * ratio,
    // borderWidth: 2 * ratio,
    // width: 320 * ratio,
    // height: 52 * ratio,
    // borderColor: 'white',

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  btnDisabled: {
    backgroundColor: 'rgb(243,243,243)',
    alignSelf: 'center',
    borderRadius: 4 * ratio,
    borderWidth: 2 * ratio,
    width: 320 * ratio,
    height: 52 * ratio,
    borderColor: '#333',

    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 14 * ratio,
    color: 'white',
  },
  imgLeft: {
    // width: 24 * ratio,
    // height: 24 * ratio,
    // position: 'absolute',
    // left: 16 * ratio,
  },
});

interface ItemProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  onPressOut?: () => void;
  onPressIn?: () => void;
  style?: any;
  disabledStyle?: any;
  textStyle?: any;
  imgLeftSrc?: any;
  imgCenterSrc?: any;
  imgLeftStyle?: any;
  imgCenterStyle?: any;
  indicatorColor?: string;
  activeOpacity?: number;
}

class Button extends Component<ItemProps, any> {
  private static defaultProps: Partial<ItemProps> = {
    isLoading: false,
    isDisabled: false,
    style: styles.btn,
    textStyle: styles.txt,
    imgLeftStyle: styles.imgLeft,
    imgCenterStyle: styles.imgCenter,
    indicatorColor: 'white',
    activeOpacity: 0.5,
  };

  constructor(props: ItemProps) {
    super(props);
    this.state = {};
  }

  public render() {
    if (this.props.isDisabled) {
      return (
        <View style={this.props.disabledStyle}>
          <Text style={this.props.textStyle}>{this.props.children}</Text>
        </View>
      );
    }
    if (this.props.isLoading) {
      return (
        <View style={this.props.style}>
          <ActivityIndicator size='small' color={this.props.indicatorColor} />
        </View>
      );
    }
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        onPress={this.props.onPress}
        onPressOut={this.props.onPressOut}
        onPressIn={this.props.onPressIn}
      >
        <View style={{
          ...this.props.style,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {this.props.imgLeftSrc ? (
            <Image
              style={this.props.imgLeftStyle}
              source={this.props.imgCenterSrc}
            />
          ) : null}
          {this.props.imgCenterSrc ? (
            <Image
              style={{ width: 70, height: 70 }}
              source={this.props.imgCenterSrc}
            />
          ) : null}
          <Text style={this.props.textStyle}>{this.props.children}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Button;
