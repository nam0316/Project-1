// SignUpScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState(''); // 닉네임 상태 추가
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleCheckDuplicate = async () => {
    if (userID === '') {
      Alert.alert('아이디를 입력하세요');
      return;
    }

    try {
      const response = await fetch('http://192.168.45.126:3000/api/checkDuplicateID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isDuplicate) {
          Alert.alert('이미 사용 중인 아이디입니다.');
        } else {
          Alert.alert('사용 가능한 아이디입니다.');
        }
      } else {
        Alert.alert('서버 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error checking duplicate ID:', error);
      Alert.alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const handleCheckDuplicateNickname = async () => {
    if (nickname === '') {
      Alert.alert('닉네임을 입력하세요');
      return;
    }

    try {
      const response = await fetch('http://192.168.45.126:3000/api/checkDuplicateNickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isDuplicate) {
          Alert.alert('이미 사용 중인 닉네임입니다.');
        } else {
          Alert.alert('사용 가능한 닉네임입니다.');
        }
      } else {
        Alert.alert('서버 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error checking duplicate nickname:', error);
      Alert.alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const response = await fetch('http://192.168.45.126:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, password, email, nickname }),
      });

      if (response.ok) {
        Alert.alert('회원가입이 완료되었습니다.');
        navigation.navigate('Login');
      } else {
        Alert.alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      Alert.alert('서버 오류가 발생했습니다.');
    }
  };

  const handlePasswordConfirmation = () => {
    if (password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  useEffect(() => {
    handlePasswordConfirmation();
  }, [confirmPassword]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { marginRight: 65 }]}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={userID}
          onChangeText={setUserID}
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckDuplicate}>
          <Text style={styles.checkButtonText}>아이디 중복 확인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={[styles.input, { marginLeft: 32 }]}
          placeholder="비밀번호"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={handlePasswordConfirmation}
            onFocus={() => setPasswordMatch(true)}
          />
          {(confirmPassword !== '' && !passwordMatch) && (
            <Text style={[styles.errorText, { color: 'red' }]}>
              비밀번호가 일치하지 않습니다.
            </Text>
          )}
          {(confirmPassword !== '' && passwordMatch) && (
            <Text style={[styles.errorText, { color: 'blue' }]}>
              비밀번호가 일치합니다.
            </Text>
          )}
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={[styles.input, { marginLeft: 44 }]}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setPasswordMatch(true)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { marginRight: 65 }]}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          value={nickname}
          onChangeText={setNickname}
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckDuplicateNickname}>
          <Text style={styles.checkButtonText}>닉네임 중복 확인</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 20,
    fontSize: 16,
  },
  input: {
    width: 140,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  checkButton: {
    height: 30,
    width: 78,
    paddingHorizontal: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 8.5,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    marginTop: 5,
  },
});

export default SignUpScreen;
