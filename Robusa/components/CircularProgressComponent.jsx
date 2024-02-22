// CircularProgressComponent.js
// CircularProgressComponent.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

const CircularProgressComponent = ({ percentage, buttonColor }) => {

  const animationColor = buttonColor === 'yellow' ? 'blue' : buttonColor === 'red' ? 'green' : 'red';

  const animationDone = () => {
        console.log("ANIMATION DONE")
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress
        value={100} // Pass the percentage value to show progress
        radius={150} // Set the radius of the circular progress indicator
        maxValue={100} // Set the maximum value (100%)
        textColor="transparent" // Set the text color
        valueSuffix="%" // Set the suffix for the value display
        valueFontSize={20} // Set the font size for the value display
        fontSize={0} // Set the font size for additional text (optional)
        duration={3000}
        activeStrokeColor={animationColor}
        progressValueColor='transparent'
        inActiveStrokeColor={buttonColor}
        onAnimationComplete={animationDone} // Set the animation color based on the button color
      />
      
    </View>
  );
};

export default CircularProgressComponent;
