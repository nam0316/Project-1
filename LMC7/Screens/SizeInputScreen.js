import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CategoryTabView from './CategoryTabView';

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

const SizeInputScreen = ({ route, navigation }) => {
  const layout = useWindowDimensions();
  const { userID } = route.params;

  const [index, setIndex] = useState(0);
  const [routes] = useState(
    Object.keys(subCategories).map(category => ({ key: category, title: category }))
  );

  const renderScene = SceneMap(
    Object.keys(subCategories).reduce((scenes, category) => {
      scenes[category] = () => <CategoryTabView category={category} navigation={navigation} userID={userID} />;
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
          style={[styles.tabBar, { marginTop: 50 }]} // 상위탭의 위쪽 공간
          tabStyle={styles.tabStyle}
          labelStyle={styles.labelStyle}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
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

export default SizeInputScreen;
