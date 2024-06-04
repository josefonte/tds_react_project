import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';

type FiltroIconProps = {
  image1: ImageSourcePropType;
  image2: ImageSourcePropType;
};

const FiltroIcon: React.FC<FiltroIconProps> = ({image1, image2}) => {
  const [currentImage, setCurrentImage] = useState<ImageSourcePropType>(image1);
  const animation = useRef(new Animated.Value(1)).current;

  const switchImage = () => {
    // Animate the effect
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Switch the image
    setCurrentImage(prevImage => (prevImage === image1 ? image2 : image1));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={switchImage}>
        <Animated.Image
          source={currentImage}
          style={[styles.image, {transform: [{scale: animation}]}]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default FiltroIcon;