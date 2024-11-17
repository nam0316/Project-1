// ReviewScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ReviewScreen = () => {
  const navigation = useNavigation();

  const navigateToReviewForm = () => {
    navigation.navigate('ReviewForm');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>리뷰 화면</Text>
      <Button title="리뷰 등록" onPress={navigateToReviewForm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // 상단 여백 추가
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ReviewScreen;
