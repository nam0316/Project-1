import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native'; // useIsFocused 훅 import
import ProductSize from './ProductSize';  // Import ProductSize component

const categories = {
  '상의': ['신상', '맨투맨/스웨트셔츠', '셔츠/블라우스', '후드 티셔츠', '니트/스웨터', '피케/카라 티셔츠', '긴소매 티셔츠', '반소매 티셔츠', '민소매 티셔츠', '스포츠 상의', '기타'],
  '아우터': ['아우터 신상', '후드 집업', '블루종/MA-1', '레더/라이더스 재킷', '무스탕/퍼', '트러커 재킷', '슈트/블레이저 재킷', '가디건', '아노락 재킷', '플리스/뽀글이', '트레이닝 재킷', '스타디움 재킷', '환절기 코트', '겨울 싱글 코트', '겨울 더블 코트', '겨울 기타 코트', '롱패딩/롱헤비 아우터', '숏패딩/숏헤비 아우터', '사파리/헌팅 재킷', '나일론/코치재킷', '기타 아우터'],
  '바지': ['바지 신상', '데님 팬츠', '코튼 팬츠', '슈트 팬츠/슬랙스', '트레이닝/조거 팬츠', '숏 팬츠', '레깅스', '점프 슈트/오버올', '스포츠 하의', '기타 바지'],
  '신발': ['스니커즈 신상', '캔버스/단화', '스포츠 스니커즈', '패션 스니커즈화', '기타 스니커즈', '신발 전체', '신발 신상', '구두', '로퍼', '블로퍼', '샌들', '슬리퍼', '기타 신발', '모카신/보트 슈즈', '부츠', '신발 용품'],
  '패션 소품': ['모자 신상', '캡/ 야구 모자', '헌팅캡/베레모', '페도라', '버킷/사파리햇', '비니', '트루퍼', '기타 모자', '양말/레그웨어 신상', '양말', '스타킹', '선글라스/안경테 전체', '선글라스/안경테 신상', '안경', '선글라스', '안경 소품', '액세서리 전체', '액세서리 신상', '마스크', '키링/키케이스', '벨트', '넥타이', '머플러', '스카프/반다나', '장갑', '기타 액세서리', '시계 신상', '디지털', '쿼츠 아날로그', '오토매틱 아날로그', '시계 용품', '기타 시계', '기타'],
  '언더웨어': ['언더웨어 신상', '남성 속옷', '홈웨어'],
  '스포츠/레저': ['러닝', '축구', '수영', '피트니스', '요가/필라테스', '테니스', '아웃도어', '캠핑', '낚시', '배드민턴', '자전거', '골프', '스포츠/용품 전체', '스포츠/용품 신상', '스포츠 신발', '유니폼', '스포츠 모자']
};

const genders = ['남자', '여자', '공용'];
const colors = ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '갈색', '검정', '회', '흰', '핑크', '연두', '민트', '파랑'];  // 색상 옵션 추가

const ProductScreen = ({ navigation }) => {
  const isFocused = useIsFocused(); // useIsFocused 훅 사용
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('상의');
  const [subCategory, setSubCategory] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [infoImages, setInfoImages] = useState([]);
  const [sizeImages, setSizeImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [season, setSeason] = useState('');
  const [gender, setGender] = useState(genders[0]);
  const [color, setColor] = useState(colors[0]);  // 색상 상태 추가

  useEffect(() => {
    if (isFocused) {
      resetForm(); // 화면이 포커스될 때 상태 초기화
    }
  }, [isFocused]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('상의');
    setSubCategory('');
    setProductImages([]);
    setInfoImages([]);
    setSizeImages([]);
    setBrand('');
    setSeason('');
    setGender(genders[0]);
    setColor(colors[0]);
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('이미지를 업로드하기 위해 갤러리 접근 권한이 필요합니다.');
        }
      }
    })();
  }, []);

  useEffect(() => {
    setSubCategory('');
  }, [category]);

  const pickImages = async (setImages) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !category || !subCategory || productImages.length === 0 || infoImages.length === 0 || sizeImages.length === 0) {
      Alert.alert('Error', '모든 필드를 채워주세요.');
      return;
    }

    try {
      const productImageBase64s = await Promise.all(productImages.map(async (image) => {
        return await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
      }));
      const infoImageBase64s = await Promise.all(infoImages.map(async (image) => {
        return await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
      }));
      const sizeImageBase64s = await Promise.all(sizeImages.map(async (image) => {
        return await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
      }));

      console.log('Sending request to server...');
      const response = await axios.post('http://192.168.45.126:3000/products', {
        name,
        price,
        category,
        subCategory,
        productImages: productImageBase64s,
        infoImages: infoImageBase64s,
        sizeImages: sizeImageBase64s,
        brand,
        season,
        gender,
        color,  // 색상 정보 추가
      });

      console.log('Response received:', response.data);
      if (response.data.message) {
        Alert.alert('성공', '상품이 추가되었습니다.');
        resetForm(); // 성공적으로 상품이 추가된 후에도 상태 초기화
        navigation.goBack();
      } else {
        Alert.alert('Error', '상품 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', '상품 추가 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior="padding" enabled>
        <TextInput
          style={styles.input}
          placeholder="상품명"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="가격"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="브랜드"
          value={brand}
          onChangeText={setBrand}
        />
        <TextInput
          style={styles.input}
          placeholder="시즌"
          value={season}
          onChangeText={setSeason}
        />
        <View style={styles.pickerContainer}>
          <Text>성별</Text>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            {genders.map((gender, index) => (
              <Picker.Item key={index} label={gender} value={gender} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text>카테고리</Text>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {Object.keys(categories).map((cat, index) => (
              <Picker.Item key={index} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text>서브 카테고리</Text>
          <Picker
            selectedValue={subCategory}
            style={styles.picker}
            onValueChange={(itemValue) => setSubCategory(itemValue)}
            enabled={category !== ''}
          >
            {(categories[category] || []).map((subCat, index) => (  // Undefined 체크 추가
              <Picker.Item key={index} label={subCat} value={subCat} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text>색상</Text>
          <Picker
            selectedValue={color}
            style={styles.picker}
            onValueChange={(itemValue) => setColor(itemValue)}
          >
            {colors.map((color, index) => (
              <Picker.Item key={index} label={color} value={color} />
            ))}
          </Picker>
        </View>
        
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImages(setProductImages)}>
          <Text>상품 이미지 선택</Text>
        </TouchableOpacity>
        <ScrollView horizontal style={styles.imageScrollContainer}>
          {productImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImages(setInfoImages)}>
          <Text>상품 정보 이미지 선택</Text>
        </TouchableOpacity>
        <ScrollView horizontal style={styles.imageScrollContainer}>
          {infoImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImages(setSizeImages)}>
          <Text>사이즈 정보 이미지 선택</Text>
        </TouchableOpacity>
        <ScrollView horizontal style={styles.imageScrollContainer}>
          {sizeImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>

        {/* Render ProductSize component and pass sizeImageUrl as a prop */}
        {sizeImages.length > 0 && (
          <ProductSize sizeImageUrl={sizeImages[0]} />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>상품 추가</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imageScrollContainer: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: 'contain',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductScreen;
