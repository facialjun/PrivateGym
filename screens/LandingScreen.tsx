import { fetchAuthSession } from '@aws-amplify/auth';
import React, { useEffect, useState } from 'react'
import { View,Text,StyleSheet,Image, Dimensions} from 'react-native'
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'
import LottieView from 'lottie-react-native';

const BASE_URL = config.SERVER_URL;

type LandingScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Landing'
>;

interface LandingScreenProps {
    navigation: LandingScreenNavigationProps;
};


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


const authConfig: ResourcesConfig['Auth'] = {
        Cognito: {
            userPoolId: 'ap-northeast-2_Ygi7yuERr',
            userPoolClientId: '27bu3ncb7rvghc0gjdt6sjfr4d'
        }
    };

    Amplify.configure({
        Auth: authConfig
    });

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);


const LandingScreen:React.FunctionComponent<LandingScreenProps> = ({navigation}) => {

    useEffect(()=>{
        console.log(BASE_URL);
    })

    const handleAutoSignIn = async () => {

    try {
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        console.log(accessToken, idToken);
        const currentSession = await fetchAuthSession();

    if (currentSession && currentSession.tokens) {
        console.log('Auto Sign-In Successful');
        
        const userData = {
            logId: idToken.payload['cognito:username'],
            username: idToken.payload.name,
            email: idToken.payload.email,
            gender: idToken.payload.gender,
            birthday: idToken.payload.birthdate,
            phoneNumber:idToken.payload.phone_number
        };

        axios.post(`${BASE_URL}/user`, userData)
            .then(response => {
                console.log(response.data);
            
                    AsyncStorage.setItem('logId',JSON.stringify(userData.logId));
                    AsyncStorage.setItem('username', JSON.stringify(userData.username));
                    AsyncStorage.setItem('email', JSON.stringify(userData.email));
                    AsyncStorage.setItem('birthday', JSON.stringify(userData.birthday));
                    AsyncStorage.setItem('phoneNumber', JSON.stringify(userData.phoneNumber));

                    console.log(userData.logId,userData.username)
            })
            .catch(error => {
        // 에러 발생 시 처리
        console.error('Error sending user data to server:', error);
        if (error.response) {
            // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답한 경우
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // 요청이 이루어졌으나 응답을 받지 못한 경우
            console.log(error.request);
        } else {
            // 요청을 설정하는 중에 문제가 발생한 경우
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
    const timer = setTimeout(() => {
            navigation.navigate(MainScreens.Main)
        }, 1500);

        return () => clearTimeout(timer);
        
}    
    } 
    catch (error) {
        console.log('Auto Sign-In error:', error);   
        const timer = setTimeout(() => {
            navigation.replace(MainScreens.LogIn)
        }, 3000);
        return () => clearTimeout(timer);
    }
    };

useEffect(() => {
    handleAutoSignIn(); // Check current session and attempt auto sign-in
}, []);

    return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
            <LottieView
                source={require('../src/lottie/loading.json')}
                style={{width:100,height:100}}
                autoPlay
                loop
            />
    </View>
    )
}

export default LandingScreen

const styles = StyleSheet.create({

container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent:'center',
    alignItems:'center'
},
gymIcon: {
    width:screenWidth,
    height:screenWidth,  
},


});