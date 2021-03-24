import React, {Component} from "react";
import {Animated, Easing, StyleSheet, Text, View} from "react-native";
import PropTypes from "prop-types";

const resetHeight = (size) => size+4;

const NumberTicker = ({style, textSize = 35, textStyle, number, duration}) => {

    const mapToDigits = () => {
        return (number + '').split('').map((data, idx) => {
            if (data === '.' || data === ',') {
                return (
                    <Text allowFontScaling={false} key={`number-${idx}`} style={[textStyle, {fontSize: textSize, lineHeight: resetHeight(textSize)}]}>{data}</Text>
                );
            }
            return (
                <TextTicker
                    key={`number-${idx}`}
                    textSize={textSize}
                    textStyle={textStyle}
                    targetNumber={parseFloat(data, 10)}
                    duration={duration}
                />
            );
        })
    };

    return (
        <View style={style}>
            <View style={{flexDirection: 'row',alignItems:'flex-end'}}>
                {mapToDigits()}
            </View>
        </View>
    );
};

class TextTicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animatedValue: new Animated.Value(0),
            isAnimating: true,
            delay: 800,
            number: 1
        };
        // const {targetNumber} = this.props;

        // if (this.props.targetNumber > 5) {
        //     for (let i = 0; i <= targetNumber; i++) {
        //         this.numberList.push({id: i});
        //     }
        // } else {
        //     for (let i = 9; i >= targetNumber; i--) {
        //         this.numberList.push({id: i});
        //     }
        // }
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.targetNumber !== this.props.targetNumber) {
        this.startAnimation();
      }
    }

    numberList = [0,1,2,3,4,5,6,7,8,9];

    startAnimation = () => {
        const {animatedValue} = this.state;
        const {targetNumber,textSize} = this.props;
        Animated.timing(animatedValue, {
            toValue: -(resetHeight(textSize)*targetNumber),
            duration: this.props.duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            // on finish..
        });
    };

    getInterpolatedVal = (val) => {
        return val.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.textSize * this.numberList.length, this.props.textSize*0.2],
            extrapolate: 'clamp',
        });
    };


    renderNumbers = (styles) => {
        return this.numberList.map((data, idx) => {
            return (
                <Text allowFontScaling={false} key={`numberList-${idx}`} style={[this.props.textStyle, styles.text]}>{data}</Text>
            )
        });
    };

    render() {
        const {animatedValue} = this.state;
        const styles = generateStyles(this.props.textSize);

        return (
            <View style={styles.container}>
                <Animated.View style={{
                    transform: [{
                        translateY: animatedValue,
                    }]
                }}>
                    {this.renderNumbers(styles)}
                </Animated.View>
            </View>
        );
    }
}

TextTicker.defaultProps = {
    duration: 1800,
    targetNumber: 7,
    movingDown: true,
    textSize: 35,
};

TextTicker.propTypes = {
    duration: PropTypes.number,
    targetNumber: PropTypes.number,
    movingDown: PropTypes.bool,
    textSize: PropTypes.number,
    textStyle: PropTypes.any,
};

const generateStyles = (textSize) => StyleSheet.create({
    container: {
        width: textSize * 0.62,
        height: resetHeight(textSize),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    text: {
        fontSize: textSize,
        lineHeight: resetHeight(textSize),
    },
});

export default NumberTicker;
