import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';

// Import all images
import 반소매티셔츠Image from '../assets/반소매사이즈.png';
import 반소매래글런Image from '../assets/반소매_래글런사이즈.png';
import 민소매Image from '../assets/민소매사이즈.png';
import 긴소매티셔츠Image from '../assets/긴소매티셔츠사이즈.png';
import 긴소매래글런Image from '../assets/긴소매_래글런사이즈.png';
import 셔츠Image from '../assets/셔츠사이즈.png';
import 점퍼Image from '../assets/점퍼사이즈.png';
import 점퍼래글런Image from '../assets/점퍼_래글런사이즈.png';
import 헤비아우터Image from '../assets/헤비아우터사이즈.png';
import 블레이저Image from '../assets/블레이저사이즈.png';
import 코트Image from '../assets/코트사이즈.png';
import 원피스Image from '../assets/원피스사이즈.png';
import 바지Image from '../assets/바지사이즈.png';
import 반바지Image from '../assets/반바지사이즈.png';
import 레깅스Image from '../assets/레깅스사이즈.png';
import 스커트Image from '../assets/스커트사이즈.png';
import 백팩Image from '../assets/백팩사이즈.png';
import 메신저백Image from '../assets/메신저백사이즈.png';
import 크로스백Image from '../assets/크로스백사이즈.png';
import 웨이스트백Image from '../assets/웨이스트백사이즈.png';
import 토드핸드백Image from '../assets/토드핸드백사이즈.png';
import 보스턴더플백Image from '../assets/보스턴더플백사이즈.png';
import 캐리어Image from '../assets/캐리어사이즈.png';
import 스니커즈Image from '../assets/스니커즈사이즈.png';
import 캡야구모자Image from '../assets/캡야구모자사이즈.png';
import 비니Image from '../assets/비니사이즈.png';
import 헌팅베레Image from '../assets/헌팅베레사이즈.png';
import 페도라버킷Image from '../assets/페도라버킷사이즈.png';
import 속옷하의Image from '../assets/속옷_하의사이즈.png';
import 양말Image from '../assets/양말사이즈.png';

const subCategories = {
  '상의': ['반소매티셔츠', '반소매_래글런', '민소매', '긴소매티셔츠', '긴소매_래글런', '셔츠'],
  '아우터': ['점퍼', '점퍼_래글런', '헤비아우터', '블레이저', '코트'],
  '원피스': ['원피스'],
  '하의': ['바지', '반바지', '레깅스', '스커트'],
  '가방': ['백팩', '메신저백', '크로스백', '웨이스트백', '토드/핸드백', '보스턴/더플백', '캐리어'],
  '스니커즈': ['스니커즈'],
  '신발': ['신발'],
  '모자': ['캡/야구모자', '비니', '헌팅/베레', '페도라/버킷'],
  '레그웨어/속옷': ['속옷_하의', '양말']
};

const imageMap = {
  '반소매티셔츠': 반소매티셔츠Image,
  '반소매_래글런': 반소매래글런Image,
  '민소매': 민소매Image,
  '긴소매티셔츠': 긴소매티셔츠Image,
  '긴소매_래글런': 긴소매래글런Image,
  '셔츠': 셔츠Image,
  '점퍼': 점퍼Image,
  '점퍼_래글런': 점퍼래글런Image,
  '헤비아우터': 헤비아우터Image,
  '블레이저': 블레이저Image,
  '코트': 코트Image,
  '원피스': 원피스Image,
  '바지': 바지Image,
  '반바지': 반바지Image,
  '레깅스': 레깅스Image,
  '스커트': 스커트Image,
  '백팩': 백팩Image,
  '메신저백': 메신저백Image,
  '크로스백': 크로스백Image,
  '웨이스트백': 웨이스트백Image,
  '토드/핸드백': 토드핸드백Image,
  '보스턴/더플백': 보스턴더플백Image,
  '캐리어': 캐리어Image,
  '스니커즈': 스니커즈Image,
  '캡/야구모자': 캡야구모자Image,
  '비니': 비니Image,
  '헌팅/베레': 헌팅베레Image,
  '페도라/버킷': 페도라버킷Image,
  '속옷_하의': 속옷하의Image,
  '양말': 양말Image
};

const CategoryTabView = ({ category, userID, navigation }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    subCategories[category].map(subCategory => ({ key: subCategory, title: subCategory }))
  );
  const [sizeData, setSizeData] = useState({});

  useEffect(() => {
    const fetchSizeData = async () => {
      try {
        const response = await axios.get('http://192.168.45.126:3000/get-size', {
          params: {
            userID,
            category
          }
        });
        setSizeData(response.data);
      } catch (error) {
        console.error('Error fetching size data:', error);
      }
    };

    fetchSizeData();
  }, [userID, category]);

  const renderScene = SceneMap(
    subCategories[category].reduce((scenes, subCategory) => {
      scenes[subCategory] = () => (
        <View style={styles.scene}>
          <Image
            source={imageMap[subCategory]}
            style={styles.image}
          />
          {sizeData[subCategory] ? (
            <View style={styles.sizeInfoContainer}>
              {Object.entries(sizeData[subCategory]).map(([key, value]) => (
                <Text key={key} style={styles.sizeInfoText}>{`${key}: ${value}`}</Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noSizeText}>사이즈 정보가 없습니다</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('RegisterSize', { subCategory, userID })}
          >
            <Text style={styles.buttonText}>내 사이즈 실측 입력하기</Text>
          </TouchableOpacity>
        </View>
      );
      return scenes;
    }, {})
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={styles.indicator}
          style={[
            styles.tabBar,
            { marginTop: category === '상의' || category === '아우터' ? 10 : 50 }
          ]}
          tabStyle={styles.tabStyle}
          labelStyle={styles.labelStyle}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  sizeInfoContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  sizeInfoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  noSizeText: {
    fontSize: 16,
    color: 'red',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  indicator: {
    backgroundColor: '#007bff',
  },
  tabBar: {
    backgroundColor: '#f0f0f0',
  },
  tabStyle: {
    width: 'auto',
  },
  labelStyle: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default CategoryTabView;
