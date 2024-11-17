import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ProductInformation from './ProductInformation';
import ProductSize from './ProductSize';

const { width } = Dimensions.get('window');

const ProductDetail = ({ route, navigation }) => {
  const { product, userID } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [isSelectingQuantity, setIsSelectingQuantity] = useState(false);

  let imageUrls = [];
  if (typeof product.image_url === 'string' && product.image_url.startsWith('[')) {
    try {
      imageUrls = JSON.parse(product.image_url);
    } catch (e) {
      console.error('Error parsing image_url:', e);
    }
  } else {
    imageUrls = [product.image_url];
  }

  let infoImageUrls = [];
  if (typeof product.info_image_url === 'string' && product.info_image_url.startsWith('[')) {
    try {
      infoImageUrls = JSON.parse(product.info_image_url);
    } catch (e) {
      console.error('Error parsing info_image_url:', e);
    }
  } else if (product.info_image_url !== "null") {
    infoImageUrls = [product.info_image_url];
  }

  console.log('infoImageUrls:', infoImageUrls);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post('http://192.168.45.126:3000/cart', {
        userId: userID, // 실제 userID 사용
        productId: product.id,
        quantity: quantity, // 선택한 수량 사용
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Product added to cart');
        navigation.navigate('Cart', { userID }); // 장바구니 화면으로 이동할 때 userID 전달
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Error', 'Could not add product to cart');
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleBuyPress = () => {
    if (isSelectingQuantity) {
      handleAddToCart();
    } else {
      setIsSelectingQuantity(true);
    }
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'info', title: '정보' },
    { key: 'size', title: '사이즈' },
  ]);

  const renderScene = SceneMap({
    info: () => <ProductInformation infoImageUrls={infoImageUrls} />,
    size: () => <ProductSize route={route} />,
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {imageUrls.length > 0 && (
          <Swiper style={styles.wrapper} showsButtons={true} loop={false}>
            {imageUrls.map((url, index) => (
              <View key={index} style={styles.slide}>
                <Image source={{ uri: url }} style={styles.image} />
              </View>
            ))}
          </Swiper>
        )}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>브랜드: {product.brand}</Text>
        <Text style={styles.season}>시즌: {product.season}</Text>
        <Text style={styles.gender}>성별: {product.gender}</Text>
        <Text style={styles.price}>{product.price} 원</Text>

        {isSelectingQuantity && (
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncreaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          style={styles.tabView}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.indicator}
              style={styles.tabBar}
              labelStyle={styles.label}
              tabStyle={styles.tabStyle}
            />
          )}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyPress}>
          <Text style={styles.buyButtonText}>{isSelectingQuantity ? '구입하기' : '구매하기'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // 상단 여백 추가
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100,
  },
  wrapper: {
    height: 300,
    marginBottom: 20,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: 300,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  brand: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  season: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  gender: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  bottomSpacer: {
    height: 60,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: width * 0.1,
    width: width * 0.8,
  },
  buyButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  tabView: {
    flex: 1,
    width: '100%',
  },
  tabBar: {
    backgroundColor: '#fff',
  },
  tabStyle: {
    flex: 1, // flex 속성을 추가하여 각 탭이 동일한 공간을 차지하도록 함
    alignItems: 'center', // 탭 텍스트를 중앙에 정렬
  },
  indicator: {
    backgroundColor: '#007BFF',
  },
  label: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ProductDetail;
