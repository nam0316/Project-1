import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

const ProductInquiryScreen = ({ route }) => {
  const { userID, nickname } = route.params || { userID: '', nickname: '' };

  useEffect(() => {
    console.log('Received params in ProductInquiryScreen:', route.params);
  }, [route.params]);

  const [inquiries, setInquiries] = useState([]);
  const [question, setQuestion] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      let response;
      if (userID === 'yunnamgyun0316') {
        response = await axios.get('http://192.168.45.126:3000/inquiries');
      } else {
        response = await axios.get('http://192.168.45.126:3000/inquiries', {
          params: { userID }
        });
      }
      setInquiries(response.data);
    } catch (error) {
      console.error('상품 문의를 가져오는 중 오류 발생:', error);
    }
  };

  const handleSubmit = async () => {
    if (!question) {
      Alert.alert('에러', '문의 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post('http://192.168.45.126:3000/inquiries', {
        userID,
        nickname,
        question
      });
      Alert.alert('성공', '문의가 작성되었습니다.');
      setQuestion('');
      fetchInquiries();
    } catch (error) {
      Alert.alert('에러', '문의 작성 중 오류가 발생했습니다.');
      console.error('문의 작성 중 오류 발생:', error);
    }
  };

  const handleAdminResponseSubmit = async () => {
    if (!adminResponse || !selectedInquiry) {
      Alert.alert('에러', '문의 항목을 선택하고 답변 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`http://192.168.45.126:3000/inquiries/${selectedInquiry.id}/response`, {
        adminResponse
      });
      Alert.alert('성공', '답변이 추가되었습니다.');
      setAdminResponse('');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      Alert.alert('에러', '답변 작성 중 오류가 발생했습니다.');
      console.error('답변 작성 중 오류 발생:', error);
    }
  };

  const renderInquiryItem = ({ item }) => (
    <View style={styles.inquiryItem}>
      <Text style={styles.inquiryQuestion}>{item.question}</Text>
      <Text style={styles.inquiryDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.inquiryAuthor}>작성자: {item.nickname}</Text>
      {item.admin_response ? (
        <Text style={styles.adminResponse}>운영자 답변: {item.admin_response}</Text>
      ) : (
        userID === 'yunnamgyun0316' && <Button title="답변하기" onPress={() => setSelectedInquiry(item)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>상품 문의</Text>
      <TextInput
        style={styles.textArea}
        value={question}
        onChangeText={setQuestion}
        placeholder="문의 내용을 입력하세요"
        multiline
      />
      <Button title="문의 작성" onPress={handleSubmit} />
      <FlatList
        data={inquiries}
        renderItem={renderInquiryItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {selectedInquiry && (
        <View style={styles.adminResponseContainer}>
          <Text style={styles.title}>운영자 답변</Text>
          <TextInput
            style={styles.textArea}
            value={adminResponse}
            onChangeText={setAdminResponse}
            placeholder="답변 내용을 입력하세요"
            multiline
          />
          <Button title="답변 제출" onPress={handleAdminResponseSubmit} />
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  textArea: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
  },
  inquiryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inquiryQuestion: {
    fontSize: 16,
  },
  inquiryDate: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  inquiryAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  adminResponse: {
    marginTop: 8,
    fontSize: 14,
    color: 'blue',
  },
  adminResponseContainer: {
    marginTop: 20,
  },
});

export default ProductInquiryScreen;
