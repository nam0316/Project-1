import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const numColumns = 3;
const categories = ['전체', '상의', '바지', '신발', '기타'];

const PersonalColorScreen = ({ route, navigation }) => {
  const { userID } = route.params;
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    console.log('PersonalColorScreen userID:', userID);

    const fetchRecommendations = async () => {
      try {
        const response = await axios.post('http://192.168.45.126:3000/fetch-recommendations', { userID });
        console.log('Fetched recommendations:', response.data);
        setRecommendations(response.data);
        setFilteredRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [userID]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    if (category === '전체') {
      setFilteredRecommendations(recommendations);
    } else {
      const filtered = recommendations.filter(item => item.category === category);
      setFilteredRecommendations(filtered);
    }
  };

  const renderProducts = () => {
    return filteredRecommendations.map((item, index) => {
      let imageUrl = item.image_url;
      if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
        try {
          imageUrl = JSON.parse(item.image_url)[0]; // 첫 번째 이미지를 사용
        } catch (e) {
          console.error('Error parsing image_url:', e);
        }
      }

      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
          style={styles.productItemContainer}
        >
          <View style={styles.productItem}>
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
            <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.productPrice}>{item.price} 원</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>퍼스널컬러 추천</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategoryPress(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.productList}>
        <View style={styles.productsContainer}>
          {renderProducts()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // 텍스트 아래 공간 추가
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20, // 카테고리 아래 공간 추가
  },
  categoryButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: width / categories.length - 10, // 버튼 너비를 조정합니다
  },
  selectedCategoryButton: {
    backgroundColor: '#4caf50',
  },
  categoryButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  productList: {
    alignItems: 'center',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItemContainer: {
    width: (width - 40) / numColumns, // 항목 간격을 고려하여 항목 너비를 조정
    marginBottom: 20,
  },
  productItem: {
    width: '100%',
    height: 250,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain', // 이미지 크기 조정
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default PersonalColorScreen;
