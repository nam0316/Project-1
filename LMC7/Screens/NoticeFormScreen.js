import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const NoticeFormScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userID = '12345';  // 실제 애플리케이션에서는 로그인한 사용자의 ID를 사용
  const nickname = '12345'; // 실제 애플리케이션에서는 로그인한 사용자의 닉네임을 사용

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('에러', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.45.126:3000/notices', {
        title,
        content,
        userID,
      });
      Alert.alert('성공', '공지사항이 작성되었습니다.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('에러', '공지사항 작성 중 오류가 발생했습니다.');
      console.error('공지사항 작성 중 오류 발생:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
      />
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.textArea}
        value={content}
        onChangeText={setContent}
        placeholder="내용을 입력하세요"
        multiline
      />
      <Button title="작성" onPress={handleSubmit} />
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  textArea: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
  },
});

export default NoticeFormScreen;
