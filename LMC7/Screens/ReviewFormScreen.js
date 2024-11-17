import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // axios를 사용하여 서버와 통신

const ReviewFormScreen = ({ userID, productID }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('userID', userID);
      formData.append('productID', productID);
      formData.append('rating', rating);
      formData.append('review', review);

      images.forEach((image, index) => {
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('images', {
          uri: image.uri,
          name: `photo.${index}.${fileType}`,
          type: image.mimeType,
        });
      });

      const response = await axios.post('http://192.168.45.126:3000/api/addReview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        Alert.alert('리뷰가 제출되었습니다.');
        setReview('');
        setRating('');
        setImages([]);
      } else {
        Alert.alert('리뷰 제출 중 오류 발생');
      }
    } catch (error) {
      console.error('리뷰 제출 중 오류 발생:', error);
      Alert.alert('리뷰 제출 중 오류 발생');
    }
  };

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("카메라 롤에 대한 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('ImagePicker result:', result);

    if (!result.cancelled) {
      console.log('Selected images:', result.assets.map((asset) => asset.uri));
      setImages(result.assets);
    } else {
      console.log('Image selection was cancelled');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>리뷰 작성</Text>
      <TextInput
        style={styles.input}
        placeholder="리뷰를 입력하세요"
        value={review}
        onChangeText={setReview}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="평점을 입력하세요 (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
        <Text style={styles.imagePickerText}>이미지 선택</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <View key={index}>
            <Text>{image.uri}</Text>
            <Image source={{ uri: image.uri }} style={styles.image} onError={(error) => console.error('Image load error:', error.nativeEvent.error)} />
          </View>
        ))}
      </View>
      <Button title="제출" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  imagePicker: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default ReviewFormScreen;
