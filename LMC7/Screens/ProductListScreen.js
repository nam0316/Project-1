import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const itemWidth = width / 3 - 20;

const ProductListScreen = ({ route, navigation }) => {
  const { category, subCategory } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [category, subCategory]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.45.126:3000/products', {
        params: { category, subCategory: subCategory.includes('전체') ? undefined : subCategory }
      });
      const productsData = response.data.map(product => {
        let imageUrl = product.image_url;
        if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
          try {
            imageUrl = JSON.parse(imageUrl)[0];
          } catch (e) {
            console.error('이미지 URL 파싱 중 오류 발생:', e);
          }
        }
        return { ...product, imageUrl };
      });
      setProducts(productsData);
    } catch (error) {
      console.error('상품을 가져오는 중 오류 발생:', error);
    }
  };

  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} 원</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} - {subCategory}</Text>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3} // 한 행에 3열로 설정
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50, // 상단 여백 추가
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center', // 제목을 가운데 정렬
  },
  flatListContent: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: itemWidth,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 80, // 이미지 크기 조정
    height: 80, // 이미지 크기 조정
    marginBottom: 10,
    resizeMode: 'contain', // 이미지의 크기를 조절하여 내용이 잘리지 않도록 함
  },
  productDetails: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
});

export default ProductListScreen;
