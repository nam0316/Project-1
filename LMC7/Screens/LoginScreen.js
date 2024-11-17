import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation, setIsLoggedIn, setNickname, setUserID }) => {
  const [userIDInput, setUserIDInput] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    console.log('로그인 시도:', { userID: userIDInput, password });
    try {
      const response = await axios.post('http://192.168.45.126:3000/api/login', { userID: userIDInput, password });
      console.log('서버 응답:', response.data);
      if (response.data.success) {
        Alert.alert('로그인 성공');
        console.log('서버로부터 받은 닉네임:', response.data.nickname);
        setNickname(response.data.nickname); // 로그인 성공 시 닉네임 설정
        setUserID(userIDInput); // 로그인 성공 시 userID 설정
        setIsLoggedIn(true);
        navigation.navigate('Main', { screen: 'Home' });
      } else {
        console.error('로그인 실패:', response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      setErrorMessage('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/LMC_logo.jpg')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={userIDInput}
        onChangeText={setUserIDInput}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <View style={styles.linkContainer}>
        <View style={styles.linkItem}>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkItem}>
          <TouchableOpacity onPress={handleForgetPassword}>
            <Text style={styles.linkText}>아이디/비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
    width: '100%',
  },
  linkItem: {
    marginBottom: 5,
  },
  linkText: {
    color: 'gray',
    textDecorationLine: 'underline',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
