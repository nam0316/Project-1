import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const NoticeScreen = ({ navigation, route }) => {
  const { userID, nickname } = route.params || { userID: '', nickname: '' };

  useEffect(() => {
    console.log('Received params in NoticeScreen:', route.params); // 로그 추가
  }, [route.params]);

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('http://192.168.45.126:3000/notices');
      setNotices(response.data);
    } catch (error) {
      console.error('공지사항을 가져오는 중 오류 발생:', error);
    }
  };

  const renderNoticeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noticeItem}
      onPress={() => navigation.navigate('NoticeDetail', {
        title: item.title,
        content: item.content,
        date: item.date,
        nickname: item.nickname,
      })}
    >
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>공지사항</Text>
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => {
          console.log('Navigating to NoticeForm with:', { userID, nickname }); // 로그 추가
          navigation.navigate('NoticeForm', { userID, nickname });
        }}
      >
        <Image source={require('../assets/write.png')} style={styles.writeIcon} />
      </TouchableOpacity>
      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
  writeButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  writeIcon: {
    width: 24,
    height: 24,
  },
  noticeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noticeDate: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
});

export default NoticeScreen;
