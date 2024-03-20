import React, { useEffect } from 'react'
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import axios from 'axios';
import { View,Text } from 'react-native'
import { fetchAuthSession } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import config from '../config'

const BASE_URL = config.SERVER_URL;


type LogInLoadingNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'LogIn'
>;

interface LogInLoadingProps {
    navigation: LogInLoadingNavigationProps;
};



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

const LogInLoading:React.FunctionComponent<LogInLoadingProps> = ({navigation}) => {

    const currentSession = async () => {
            try {
                const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
                console.log(accessToken, idToken);

            const currentSession = await fetchAuthSession();
            if (currentSession && currentSession.tokens) {
                console.log('Sign-In Successful');

                // 서버에 유저 정보 전송
                const userData = {
                    logId: idToken.payload['cognito:username'],
                    username: idToken.payload.name,
                    email: idToken.payload.email,
                    gender: idToken.payload.gender,
                    birthday: idToken.payload.birthdate,
                    phoneNumber:idToken.payload.phone_number
                };
                
                if (!userData.hasOwnProperty('gender')) {
                    userData.gender = null; // gender 속성이 없다면 null 값 할당
                }
                
                axios.post(`${BASE_URL}/user`, userData)
                    .then(response => {
                        console.log(response.data);
                    
                            AsyncStorage.setItem('logId',JSON.stringify(userData.logId));
                            AsyncStorage.setItem('username', JSON.stringify(userData.username));
                            AsyncStorage.setItem('email', JSON.stringify(userData.email));
                            AsyncStorage.setItem('birthday', JSON.stringify(userData.birthday));
                            AsyncStorage.setItem('phoneNumber', JSON.stringify(userData.phoneNumber));

                            console.log(userData.username)
                    })
                    .catch(error => {
                        console.error('Error sending user data to server:', error);
                        // 에러 처리 로직을 추가하세요
                    });

                    const timer = setTimeout(() => {
                        navigation.reset({ routes: [{ name: MainScreens.Main }] })
                }, 3000);

                return () => clearTimeout(timer);
                }


            } catch (error) {
                console.log('Sign-In error:', error);
            }
            };

        useEffect(()=>{
            currentSession();
        })


return (
    <View flex={1} alignItems={'center'} justifyContent={'center'}>
        <Text fontSize={20}>로그인 중입니다...</Text>
    </View>
)
}

export default LogInLoading