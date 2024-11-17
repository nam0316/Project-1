import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';

const WishlistScreen = ({ route, navigation }) => {
  const { userID } = route.params || { userID: '' };
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    console.log('Received userID:', userID);
    fetchWishlist();
  }, [userID]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('http://192.168.45.126:3000/wishlist', {
        params: { userID }
      });
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      Alert.alert('Error', 'Failed to fetch wishlist.');
    }
  };

  const renderWishlistItem = ({ item }) => {
    let imageUrl = item.image_url;
    if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
      try {
        imageUrl = JSON.parse(item.image_url)[0]; // 이미지 배열의 첫 번째 이미지를 사용
      } catch (e) {
        console.error('Error parsing image_url:', e);
      }
    }
    
    return (
      <View style={styles.wishlistItem}>
        <Image source={{ uri: imageUrl }} style={styles.wishlistImage} />
        <Text style={styles.wishlistName}>{item.name}</Text>
        <Text style={styles.wishlistPrice}>{item.price} 원</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        renderItem={renderWishlistItem}
        keyExtractor={(item, index) => item.id.toString() + index} // 고유한 키로 설정
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // 상단 여백 추가
    backgroundColor: '#fff',
    padding: 16,
  },
  wishlistItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  wishlistImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  wishlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  wishlistPrice: {
    fontSize: 14,
    color: '#888',
  },
});

export default WishlistScreen;
