import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios'; // axios 라이브러리 import

const FindUsername = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const handleFindUsername = () => {
        console.log('이메일:', email);
        axios.post('http://192.168.45.126:3000/api/findUsername', { email: email })
            .then(response => {
                console.log('서버 응답:', response.data);
                setUsername(response.data.username);
            })
            .catch(error => {
                console.error('서버로부터 데이터를 가져오는 중 에러 발생:', error);
                if (error.response && error.response.status === 404) {
                    // 서버가 404 응답을 보낸 경우
                    Alert.alert('사용자를 찾을 수 없음', '해당 이메일로 등록된 사용자를 찾을 수 없습니다.');
                } else if (error.request) {
                    // 요청이 서버에 도달하지 못한 경우 (네트워크 오류)
                    Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
                } else {
                    // 그 외의 경우 (기타 오류)
                    Alert.alert('오류', '오류가 발생했습니다. 나중에 다시 시도해주세요.');
                }
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="이메일을 입력하세요"
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <Button title="아이디 찾기" onPress={handleFindUsername} />
            <Text style={styles.username}>{username}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    username: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FindUsername;
