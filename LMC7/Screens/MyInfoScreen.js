import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PersonalColorModal from './PersonalColorModal';

const MyInfoScreen = ({ navigation, setIsLoggedIn, nickname, userID }) => {
  const [isColorModalVisible, setColorModalVisible] = useState(false);

  const handlePress = (buttonName) => {
    console.log(`${buttonName} 버튼 클릭됨`);
    if (buttonName === '공지사항') {
      console.log('Navigating to Notice with:', { userID, nickname });
      navigation.navigate('Notice', { userID, nickname });
    } else if (buttonName === '상품문의') {
      console.log('Navigating to ProductInquiry with:', { userID, nickname });
      navigation.navigate('ProductInquiry', { userID, nickname });
    } else if (buttonName === '고객센터') {
      Linking.openURL('tel:01000000000');
    } else if (buttonName === '퍼스널 컬러 등록') {
      setColorModalVisible(true);
    } else if (buttonName === '나의 사이즈') {
      navigation.navigate('SizeInput', { userID });
    } else {
      alert(`${buttonName} 버튼이 클릭되었습니다.`);
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/user.png')} style={styles.icon} />
        <Text style={styles.nickname}>닉네임: {nickname}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>주문/배송</Text>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('주문/배송내역')}>
          <Text style={styles.buttonText}>주문/배송내역</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('환불')}>
          <Text style={styles.buttonText}>환불</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('교환내용')}>
          <Text style={styles.buttonText}>교환내용</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>설정</Text>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('나의 사이즈')}>
          <Text style={styles.buttonText}>나의 사이즈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('퍼스널 컬러 등록')}>
          <Text style={styles.buttonText}>퍼스널 컬러 등록</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>고객 지원</Text>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('상품문의')}>
          <Text style={styles.buttonText}>상품문의</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('공지사항')}>
          <Text style={styles.buttonText}>공지사항</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('고객센터')}>
          <Text style={styles.buttonText}>고객센터</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      <PersonalColorModal 
        isVisible={isColorModalVisible} 
        onClose={() => setColorModalVisible(false)} 
        userID={userID} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 30,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  button: {
    backgroundColor: '#d9d9d9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#dc3545',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '80%',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MyInfoScreen;