import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import axios from 'axios';
import BottomTabBar from './BottomTabBar'; // BottomTabBar import

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemWidth = width / numColumns - 20; // 여백을 고려하여 계산
const itemHeight = 250; // 고정된 높이 설정
const categories = ['전체', '상의', '아우터', '바지', '신발', '패션 소품', '언더웨어', '스포츠/레저'];

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]); // 찜 상태 관리
  const [userID, setUserID] = useState(''); // 로그인한 유저의 ID 상태

  useEffect(() => {
    // 로그인 시 userID를 받아와 설정
    const loggedInUserID = '12345'; // 여기에 실제 로그인한 유저의 ID를 설정
    setUserID(loggedInUserID);
    fetchProducts();
    fetchWishlist(loggedInUserID); // 찜 목록도 가져옵니다.
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.45.126:3000/products');
      console.log('Fetched products:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchWishlist = async (userID) => {
    try {
      const response = await axios.get('http://192.168.45.126:3000/wishlist', {
        params: { userID }
      });
      setWishlist(response.data.map(product => product.id)); // 찜한 상품의 ID를 저장합니다.
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const filterProducts = (category) => {
    setSelectedCategory(category);
  };

  const toggleWishlist = async (productId) => {
    try {
      if (!userID) {
        console.error('로그인된 유저의 ID가 설정되지 않았습니다.');
        return;
      }
      if (wishlist.includes(productId)) {
        setWishlist(wishlist.filter(id => id !== productId));
      } else {
        const response = await axios.post('http://192.168.45.126:3000/api/addToWishlist', { userID, productID: productId });
        if (response.data.success) {
          setWishlist([...wishlist, productId]);
        } else {
          Alert.alert('Error', 'Failed to add product to wishlist.');
        }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const renderProducts = () => {
    return products
      .filter(item => selectedCategory === '전체' || item.category === selectedCategory)
      .filter(item => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((item) => {
        let imageUrl = item.image_url;
        if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
          try {
            imageUrl = JSON.parse(item.image_url)[0]; // 이미지 배열의 첫 번째 이미지를 사용
          } catch (e) {
            console.error('Error parsing image_url:', e);
          }
        }

        const isWished = wishlist.includes(item.id);

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            style={styles.productItemContainer}
          >
            <View style={styles.productItem}>
              <Image source={{ uri: imageUrl }} style={styles.productImage} onError={(e) => console.error('Failed to load image', e)} />
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>{item.price} 원</Text>
              </View>
              <TouchableOpacity 
                onPress={() => toggleWishlist(item.id)} 
                style={styles.wishlistButton}
              >
                <Text style={{ color: isWished ? 'red' : 'gray' }}>
                  {isWished ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      });
  };


  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < products.length; i += numColumns) {
      rows.push(
        <View key={i} style={styles.row}>
          {renderProducts().slice(i, i + numColumns)}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>LMC MALL</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
          <Image source={require('../assets/cart.png')} style={styles.cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Product')} style={styles.addButton}>
          <Image source={require('../assets/add.png')} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, selectedCategory === category && styles.selectedCategoryTab]}
              onPress={() => filterProducts(category)}
            >
              <Text style={styles.categoryTabText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView contentContainerStyle={styles.productList}>
          {renderRows()}
        </ScrollView>
      </View>
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginTop: 30, // 상단 공백 추가
  },
  cartButton: {
    marginTop: 30, // 상단 공백 추가
    position: 'absolute',
    right: 0,
  },
  cartIcon: {
    width: 30,
    height: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  addButton: {
    alignSelf: 'center',
  },
  addIcon: {
    width: 40,
    height: 40,
  },
  body: {
    flex: 1,
    marginBottom: 50, // 바텀탭을 위한 여백
  },
  categoryTabs: {
    marginBottom: 10,
    flexGrow: 0,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  selectedCategoryTab: {
    backgroundColor: '#007BFF',
  },
  categoryTabText: {
    fontSize: 12,
    color: '#000',
  },
  productList: {
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productItemContainer: {
    flex: 1,
    margin: 5,
  },
  productItem: {
    width: itemWidth,
    height: itemHeight,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // 부모 요소에 relative를 설정
  },
  productImage: {
    width: '100%',
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5, // 텍스트 요소 간의 여백 추가
  },
  priceContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  productPrice: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 5,
  },
  wishlistButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default HomeScreen;
