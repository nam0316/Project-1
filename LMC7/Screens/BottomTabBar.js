import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BottomTabBar = ({ isVisible = true }) => {
  const navigation = useNavigation();

  if (!isVisible) return null;

  const navigateToHomeScreen = () => {
    navigation.navigate('HomeTab');
  };
  const navigateToWishlist = () => {
    navigation.navigate('Wishlist'); // 변경: WishlistScreen으로 이동
  };
  const navigateToReview = () => {
    navigation.navigate('PersonalColor'); // Ensure this matches the screen name in the navigator
  };
  const navigateToMyInfo = () => {
    navigation.navigate('MyInfo'); // Ensure this matches the screen name in the navigator
  };
  const navigateToCategory = () => {
    navigation.navigate('Category');
  };

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={navigateToCategory}>
        <Image source={require('../assets/category.png')} style={styles.bottomBarIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToReview}>
        <Image source={require('../assets/personal.png')} style={styles.bottomBarIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToHomeScreen}>
        <Image source={require('../assets/home.png')} style={styles.bottomBarIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToWishlist}>
        <Image source={require('../assets/love.png')} style={styles.bottomBarIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToMyInfo}>
        <Image source={require('../assets/my_info.png')} style={styles.bottomBarIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarIcon: {
    width: 30,
    height: 30,
  },
});

export default BottomTabBar;
