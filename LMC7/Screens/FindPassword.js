// 클라이언트 측 코드
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const FindPassword = () => {
    const [email, setEmail] = useState('');
    const [userID, setUserID] = useState('');

    const handleFindPassword = () => {
        // 아이디와 이메일을 서버로 보내 비밀번호를 찾는 요청을 보냅니다.
        fetch('http://192.168.45.126:3000/api/findPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, userID: userID }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('비밀번호를 찾는 데 문제가 발생했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Alert.alert('비밀번호 찾기 성공', `이메일로 전송된 비밀번호: ${data.password}`);
            } else {
                Alert.alert('비밀번호 찾기 실패', '해당 이메일 또는 아이디로 등록된 사용자가 없습니다.');
            }
        })
        .catch(error => {
            console.error('비밀번호 찾기 중 오류 발생:', error);
            Alert.alert('오류', '비밀번호를 찾는 데 문제가 발생했습니다.');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.content}>비밀번호 찾기</Text>
            <TextInput
                style={styles.input}
                placeholder="아이디를 입력하세요"
                value={userID}
                onChangeText={text => setUserID(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="이메일을 입력하세요"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Button title="비밀번호 찾기" onPress={handleFindPassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default FindPassword;
