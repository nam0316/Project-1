// ForgetPassword.js

import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FindUsername from './FindUsername'; // 아이디 찾기 컴포넌트 import
import FindPassword from './FindPassword'; // 비밀번호 찾기 컴포넌트 import

const Tab = createBottomTabNavigator();

const ForgetPassword = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="FindPassword" component={FindPassword} options={{ title: '비밀번호 찾기' }} />
            <Tab.Screen name="FindUsername" component={FindUsername} options={{ title: '아이디 찾기' }} />
        </Tab.Navigator>
    );
};

export default ForgetPassword;
