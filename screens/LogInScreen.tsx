import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text, BackHandler, Dimensions,TouchableOpacity,Image,StyleSheet, Alert } from 'react-native';
import { signIn } from 'aws-amplify/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { KeyboardAvoidingView } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';



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



////////// type

type LogInScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'LogIn'
>;

interface LogInScreenProps {
    navigation: LogInScreenNavigationProps;
};

///////////////////



const LogIn: React.FunctionComponent<LogInScreenProps> = ({navigation}) => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [authState, setAuthState] = useState<string>('initial');


    const handleSignUp = async () => {
        navigation.navigate(MainScreens.JoinMembership);
    };

const handleSignIn = async () => {
    try {
        const { isSignedIn } = await signIn({ username, password });

        if (isSignedIn) {
            console.log("log in successful");
            navigation.navigate(MainScreens.LogInLoading);
        }
    } catch (error) {
    console.log('Error signing in:', error);
        if (error.message.includes('NotAuthorizedException') || error.message.includes('Incorrect username or password.')) {
            Alert.alert("로그인 실패", "아이디나 비밀번호가 잘못되었습니다!");
        } else if (error.message.includes('UserNotFoundException') || error.message.includes('User does not exist.')) {
            Alert.alert("로그인 실패", "존재하지 않는 사용자입니다.");
        } else {
            Alert.alert("로그인 실패", "정보를 모두 입력해주세요!");
        }
    }
};


    const renderAuthForm = () => {
        switch (authState) {
        case 'initial':
            return (
            <SafeAreaView style={{height:'100%'}}>
            <KeyboardAvoidingView style={{height:'100%'}} behavior='padding'>
            <View style={{justifyContent: 'center',alignItems:'center',backgroundColor:'white',height:'auto',marginTop:24}}>
                <View style={{height: screenHeight*0.27,backgroundColor:'white',justifyContent:'center',alignItems:'baseline'}}>
                    <Image source={require('../images/gymprivate.jpeg')} style={{width: 200,height: 200}} />
                </View>
                <View style={{width:screenWidth,height:screenHeight*0.3,justifyContent:'center',alignItems:'center'}}>
                    <TextInput
                    style={{borderBottomWidth:0.5,width:screenWidth-48,height:screenHeight*0.065}}
                    placeholderTextColor={'gray'}
                    placeholder="이메일을 입력해주세요"
                    onChangeText={(text) => setUsername(text)}
                />
                <TextInput
                    style={{borderBottomWidth:0.5,width:screenWidth-48,height:screenHeight*0.065,marginTop:'8%'}}
                    placeholderTextColor={'gray'}
                    placeholder="패스워드를 입력해주세요"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
                <View style={{height:screenHeight*0.1,width:screenWidth,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity
                    style={{borderRadius:8,backgroundColor:'#4A7AFF',height:screenHeight*0.06,width:screenWidth-48,justifyContent:'center',alignItems:'center',marginBottom:'10%',marginTop:24}}
                    onPress={handleSignIn}
                    >
                        <Text style={{color:'white',fontWeight:'bold'}}>로그인</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',height:screenHeight*0.25,width:screenWidth,alignItems:'center',paddingHorizontal: 24}}>
                <View>
                    <TouchableOpacity>
                        <Text 
                        onPress={()=>{navigation.navigate(MainScreens.ForgotPassword)}}
                        style={{fontWeight:'200',fontSize:15,color:'gray'}}>비밀번호를 잊으셨나요?</Text>
                    </TouchableOpacity> 
                </View>
                <View style={{marginRight:'5%'}}>
                    <TouchableOpacity
                        onPress={handleSignUp}>
                        <Text style={{fontWeight:'200',fontSize:15,color:'gray'}}>회원가입</Text>
                    </TouchableOpacity> 
                </View>
                </View>
            </View>
            </KeyboardAvoidingView>
            </SafeAreaView>
            );
        default:
            return null;
        }
    };

    useEffect(() => {
        const backAction = () => {

            if (authState !== 'initial') {
                setAuthState('initial');
                return true; // 이벤트 처리 완료
            }
        return false; // 이벤트 처리하지 않음
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // 컴포넌트 언마운트 시 이벤트 핸들러 제거
        return () => backHandler.remove();
        } , [authState]);

    return (
        
        
            <View style={{height: screenHeight,backgroundColor:'white'}}>  
                {renderAuthForm()}
            </View>
            

    );
    };

    export default LogIn ;


    
