import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const categories = {
  '상의': ['상의 전체', '상의 신상', '맨투맨/스웨트셔츠', '셔츠/블라우스', '후드 티셔츠', '니트/스웨터', '피케/카라 티셔츠', '긴 소매 티셔츠', '반소매 티셔츠', '민소매 티셔츠', '스포츠 상의', '기타'],
  '아우터': ['아우터 전체', '아우터 신상', '후드 집업', '블루종/MA-1', '레더/라이더스 재킷', '무스탕/퍼', '트러커 재킷', '슈트/블레이저 재킷', '가디건', '아노락 재킷', '플리스/뽀글이', '트레이닝 재킷', '스타디움 재킷', '환절기 코트', '겨울 싱글 코트', '겨울 더블 코트', '겨울 기타 코트', '롱패딩/롱헤비 아우터', '숏패딩/숏헤비 아우터', '사파리/헌팅 재킷', '나일론/코치재킷', '기타 아우터'],
  '바지': ['바지 전체', '바지 신상', '데님 팬츠', '코튼 팬츠', '슈트 팬츠/슬랙스', '트레이닝/조거 팬츠', '숏 팬츠', '레깅스', '점프 슈트/오버올', '스포츠 하의', '기타 바지'],
  '신발': ['스니커즈 전체', '스니커즈 신상', '캔버스/단화', '스포츠 스니커즈', '패션 스니커즈화', '기타 스니커즈', '신발 전체', '신발 신상', '구두', '로퍼', '블로퍼', '샌들', '슬리퍼', '기타 신발', '모카신/보트 슈즈', '부츠', '신발 용품'],
  '가방': ['가방 전체', '가방 신상', '백팩', '메신저/ 크로스 백', '숄더백', '토트백', '에코백', '보스턴/드럼/더블백', '웨이스트 백', '파우치 백', '브리프케이스', '캐리어', '가방 소품', '지갑/머니클립', '클러치백'],
  '패션 소품': ['모자 전체', '모자 신상', '캡/ 야구 모자', '헌팅캡/베레모', '페도라', '버킷/사파리햇', '비니', '트루퍼', '기타 모자', '양말/레그웨어 전체', '양말/레그웨어 신상', '양말', '스타킹', '선글라스/안경테 전체', '선글라스/안경테 신상', '안경', '선글라스', '안경 소품', '액세서리 전체', '액세서리 신상', '마스크', '키링/키케이스', '벨트', '넥타이', '머플러', '스카프/반다나', '장갑', '기타 액세서리', '시계 전체', '시계 신상', '디지털', '쿼츠 아날로그', '오토매틱 아날로그', '시계 용품', '기타 시계', '기타'],
  '언더웨어': ['속옷 전체', '언더웨어 신상', '남성 속옷', '홈웨어'],
  '뷰티': ['뷰티 전체', '뷰티 신상', '스킨케어', '클렌징', '베이스 메이크업', '포인트 메이크업', '바디케어', '쉐이빙/제모', '헤어케어', '향수/탈취'],
  '스포츠/레저': ['러닝', '축구', '수영', '피트니스', '요가/필라테스', '테니스', '아웃도어', '캠핑', '낚시', '배드민턴', '자전거', '골프', '스포츠/용품 전체', '스포츠/용품 신상', '스포츠 신발', '유니폼', '스포츠 모자']
};

const mainCategories = Object.keys(categories);
const allSubCategories = Object.entries(categories).flatMap(([mainCategory, subCategories]) =>
  subCategories.map(subCategory => ({ mainCategory, subCategory }))
);
const screenWidth = Dimensions.get('window').width;

const CategoryScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMainCategory, setCurrentMainCategory] = useState(mainCategories[0]);

  const handleSubCategorySelect = (mainCategory, subCategory) => {
    navigation.navigate('ProductList', { category: mainCategory, subCategory });
  };

  const filteredSubCategories = allSubCategories.filter(({ subCategory }) =>
    subCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mainCategoryHeights = mainCategories.map(category => {
    const subCategoryCount = categories[category].length;
    return subCategoryCount * 55; // approximate height for each subcategory item
  });

  let accumulatedHeight = 0;
  const mainCategoryPositions = mainCategoryHeights.map(height => {
    const position = accumulatedHeight;
    accumulatedHeight += height;
    return position;
  });

  const subCategoryScrollRef = useRef(null);
  const mainCategoryScrollRef = useRef(null);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const totalScrollHeight = accumulatedHeight;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    const isAtBottom = offsetY + scrollViewHeight >= totalScrollHeight - 10;

    if (isAtBottom) {
      setCurrentMainCategory('스포츠/레저');
      if (mainCategoryScrollRef.current) {
        mainCategoryScrollRef.current.scrollToEnd({ animated: true });
      }
    } else {
      const mainCategoryIndex = mainCategoryPositions.findIndex(position => position > offsetY);
      const selectedMainCategoryIndex = mainCategoryIndex === -1 ? mainCategories.length - 1 : Math.max(mainCategoryIndex - 1, 0);

      const mainCategoryOffsetY = selectedMainCategoryIndex > 0 ? mainCategoryPositions[selectedMainCategoryIndex - 1] : 0;

      if (mainCategoryScrollRef.current) {
        mainCategoryScrollRef.current.scrollTo({
          y: mainCategoryOffsetY,
          animated: true,
        });
      }

      setCurrentMainCategory(mainCategories[selectedMainCategoryIndex]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <View style={styles.categoriesContainer}>
        <ScrollView
          style={styles.mainCategoryContainer}
          ref={mainCategoryScrollRef}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {mainCategories.map((category, index) => (
            <TouchableOpacity
              key={category}
              style={styles.mainCategoryItem}
              onPress={() => {
                setCurrentMainCategory(category);
                const categoryPosition = mainCategoryPositions[index];
                if (subCategoryScrollRef.current) {
                  subCategoryScrollRef.current.scrollTo({
                    y: categoryPosition,
                    animated: true,
                  });
                }
              }}
            >
              <Text
                style={[
                  styles.mainCategoryText,
                  category === currentMainCategory && styles.activeMainCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView
          style={styles.subCategoryContainer}
          ref={subCategoryScrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {filteredSubCategories.map(({ mainCategory, subCategory }, index) => (
            <TouchableOpacity
              key={index}
              style={styles.subCategoryItem}
              onPress={() => handleSubCategorySelect(mainCategory, subCategory)}
            >
              <Text style={styles.subCategoryText}>{subCategory}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    marginTop: 50,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 15,
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainCategoryContainer: {
    width: screenWidth * 0.3,
    backgroundColor: '#f4f4f4',
  },
  subCategoryContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainCategoryItem: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  mainCategoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  activeMainCategoryText: {
    color: 'blue',
  },
  subCategoryItem: {
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  subCategoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default CategoryScreen;
