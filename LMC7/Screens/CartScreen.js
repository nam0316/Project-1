import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Alert, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ route, navigation }) => {
  const userID = route?.params?.userID || null;
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && userID) {
      fetchCartItems();
    }
  }, [isFocused, userID]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://192.168.45.126:3000/cart', {
        params: { userId: userID }
      });
      setCartItems(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Could not fetch cart items');
    }
  };

  const calculateTotals = (items) => {
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotalQuantity(totalQty);
    setTotalPrice(totalPrice);
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://192.168.45.126:3000/cart/${id}`);
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      calculateTotals(updatedItems);
      Alert.alert('Success', 'Item deleted');
    } catch (error) {
      console.error('Error deleting item:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Could not delete item');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://192.168.45.126:3000/cart', {
        data: { userId: userID }
      });
      setCartItems([]);
      setTotalQuantity(0);
      setTotalPrice(0);
      Alert.alert('Success', 'All items deleted');
    } catch (error) {
      console.error('Error deleting all items:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Could not delete all items');
    }
  };

  const handleCheckout = () => {
    Alert.alert('결제', '결제 페이지로 이동합니다.');
    // 결제 페이지로 이동하거나 결제 기능을 실행합니다.
    // navigation.navigate('Checkout'); 예: 결제 페이지로 이동
  };

  const renderItem = ({ item }) => {
    let imageUrl = item.image_url;
    if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
      try {
        imageUrl = JSON.parse(item.image_url)[0]; // 이미지 배열의 첫 번째 이미지를 사용
      } catch (e) {
        console.error('Error parsing image_url:', e);
      }
    }

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: imageUrl }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          <Text style={styles.cartItemPrice}>{item.price} 원</Text>
          <Text style={styles.cartItemQuantity}>수량: {item.quantity}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>장바구니</Text>
      <View style={styles.titleUnderline} />
      <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAll}>
        <Text style={styles.deleteAllButtonText}>일괄 삭제</Text>
      </TouchableOpacity>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.totalsContainer}>
        <Text style={styles.totalText}>결제할 상품 총 {totalQuantity}개</Text>
        <Text style={styles.totalText}>상품 금액: {totalPrice} 원</Text>
        <Text style={styles.totalText}>결제 금액: {totalPrice} 원</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>결제하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // 상단 여백 추가
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  titleUnderline: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  deleteAllButton: {
    backgroundColor: '#d9d9d9',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start', // 왼쪽 정렬
  },
  deleteAllButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 150, // 바텀바와 겹치지 않도록 충분한 여백 추가
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#333',
  },
  cartItemQuantity: {
    fontSize: 16,
    color: '#333',
  },
  deleteButtonText: {
    color: '#aaa',
    fontSize: 20,
    textAlign: 'center',
  },
  totalsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 50, // 바텀바 높이보다 위에 위치하도록 여백 설정
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CartScreen;
