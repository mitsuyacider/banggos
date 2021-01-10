import React, { useReducer, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableHighlight, Modal, Alert, Animated, Easing, } from 'react-native';

export default class Balloon extends React.Component {
	constructor(props) {
		super();
		this.opacityValue = new Animated.Value(0);
		this.state = {
			text: "Hit Me!",
		};

		this.sentences = ["Hit Me!", "I'm feeling...", "Please softer...", "Please harder..."];
		this.index = 0;
		this.fadeIn();
	}

	render() {
		const balloonOpacity = this.opacityValue.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1]
		});

		return (
			<Animated.View
				style={{
					color: 'white',
					justifyContent: 'center',
					width: 250,
					height: 100,
					position: 'absolute',
					zIndex: 5,
					top: '50%',
					marginTop: -200,
					left: '50%',
					marginLeft: -135,
					opacity: balloonOpacity
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
					fontWeight: 'bold'
				}}>{this.state.text}</Text>
			</Animated.View>
		);
	}

	fadeIn() {
		this.opacityValue.setValue(0);
		Animated.timing(
			this.opacityValue,
			{
				toValue: 1,
				duration: 500,
				easing: Easing.linear
			}
		).start(e => {
			setTimeout(() => {
				this.fadeOut();
			}, 5000);
		}
		)
	}

	fadeOut() {
		this.opacityValue.setValue(1);
		Animated.timing(
			this.opacityValue,
			{
				toValue: 0,
				duration: 200,
				easing: Easing.linear
			}
		).start(e => {
			setTimeout(() => {

				// NOTE: Update text
				this.index += 1;
				if (this.index > this.sentences.length - 1) {
					this.index = 0;
				}

				this.setState({
					text: this.sentences[this.index]
				})

				this.fadeIn();
			}, 5000);
		});
	}
}