import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import ProductDetail from './Screens/ProductDetail';
import CartScreen from './Screens/CartScreen';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import BottomTabBar from './Screens/BottomTabBar';
import MyInfoScreen from './Screens/MyInfoScreen';
import WishlistScreen from './Screens/WishlistScreen';
import CategoryScreen from './Screens/CategoryScreen';
import ProductListScreen from './Screens/ProductListScreen';
import NoticeScreen from './Screens/NoticeScreen';
import NoticeFormScreen from './Screens/NoticeFormScreen';
import NoticeDetailScreen from './Screens/NoticeDetailScreen';
import ProductInquiryScreen from './Screens/ProductInquiryScreen';
import ForgetPassword from './Screens/ForgetPassword';
import ReviewScreen from './Screens/ReviewScreen ';
import ReviewFormScreen from './Screens/ReviewFormScreen';
import SizeInputScreen from './Screens/SizeInputScreen';
import RegisterSize from './Screens/RegisterSize';
import PersonalColorScreen from './Screens/PersonalColorScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = ({ userID, nickname }) => (
  <Stack.Navigator>
    <Stack.Screen name="MainHome" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen 
      name="ProductDetail" 
      options={{ headerShown: false }} 
      component={ProductDetail} 
      initialParams={{ userID }} // 전달
    />
    <Stack.Screen name="Notice" options={{ headerShown: false }} component={NoticeScreen} initialParams={{ userID, nickname }} />
    <Stack.Screen name="NoticeForm" options={{ headerShown: false }} component={NoticeFormScreen} />
    <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
    <Stack.Screen name="ProductInquiry" options={{ headerShown: false }} component={ProductInquiryScreen} initialParams={{ userID, nickname }} />
    <Stack.Screen name="SizeInput"options={{ headerShown: false }} component={SizeInputScreen} />
    <Stack.Screen name="RegisterSize" component={RegisterSize} />
  </Stack.Navigator>
);

const MainTab = ({ setIsLoggedIn, nickname, userID }) => (
  <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Tab.Screen name="HomeTab" options={{ headerShown: false }}>
      {props => <HomeStack {...props} userID={userID} nickname={nickname} />}
    </Tab.Screen>
    <Tab.Screen name="Product" component={ProductScreen} />
    <Tab.Screen name="Cart" options={{ headerShown: false }}>
      {props => <CartScreen {...props} userID={userID} />}
    </Tab.Screen>
    <Tab.Screen name="Wishlist" options={{ headerShown: false }} component={WishlistScreen} initialParams={{ userID }} />
    <Tab.Screen name="Category" options={{ headerShown: false }} component={CategoryScreen} />
    <Tab.Screen name="PersonalColor" options={{ headerShown: false }} component={PersonalColorScreen} initialParams={{ userID }} />
    <Tab.Screen name="MyInfo" options={{ headerShown: false }}>
      {props => <MyInfoScreen {...props} setIsLoggedIn={setIsLoggedIn} nickname={nickname} userID={userID} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [userID, setUserID] = useState('');

  const handleLogin = (user) => {
    setUserID(user.userID);
    setNickname(user.nickname);
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {props => <MainTab {...props} setIsLoggedIn={setIsLoggedIn} nickname={nickname} userID={userID} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {props => (
                <LoginScreen
                  {...props}
                  setIsLoggedIn={setIsLoggedIn}
                  setNickname={setNickname}
                  setUserID={setUserID}
                />  
              )}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="ProductList" options={{ headerShown: false }} component={ProductListScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="ReviewForm" component={ReviewFormScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
