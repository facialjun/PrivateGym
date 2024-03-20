import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Dimensions, TextInput,Image, Button, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Input, KeyboardAvoidingView } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';


type NameScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Name'
>;

interface NameScreenProps {
    navigation: NameScreenNavigationProps; 

};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


const NameScreen:React.FunctionComponent<NameScreenProps> = ({navigation}) => {


useEffect(() => {
        const backAction = () => {
            navigation.navigate(MainScreens.LogIn);
            return true; 
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);

    
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    // 유효성 검사 상태
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [passwordValid, setPasswordValid] = useState<boolean>(true);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean>(true);




    const handleContinue = async () => {
        // 모든 유효성 검사가 통과했는지 확인
        if (isFormValid()) {
            try {
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('password', password);
                // 다음 화면으로 네비게이션 또는 성공 메시지 표시
                console.log('Registration Successful', username, password);
                navigation.navigate(MainScreens.PassWord); // 다음 화면이 있다면 여기에
            } catch (error) {
                console.error('Error saving data to AsyncStorage:', error);
            }
        } else {
            Alert.alert('Error', 'Please correct the errors before continuing.');
        }
    };

    // 이메일, 비밀번호, 비밀번호 확인 필드의 유효성 검사
    const validateEmail = (username) => /\S+@\S+\.\S+/.test(username);
    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const isFormValid = () => emailValid && passwordValid && confirmPasswordValid && username !== '' && password !== '' && confirmPassword !== '';

    // 입력 값 변경 핸들러
    const setEmailWithValidation = (text) => {
        setUsername(text);
        setEmailValid(validateEmail(text));
    };

    const setPasswordWithValidation = (text) => {
        setPassword(text);
        setPasswordValid(validatePassword(text));
        setConfirmPasswordValid(text === confirmPassword); // 비밀번호 재설정 시, 비밀번호 확인 일치 여부도 재검증
    };

    const setConfirmPasswordWithValidation = (text) => {
        setConfirmPassword(text);
        setConfirmPasswordValid(password === text);
    };


    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'white'}}>
            <KeyboardAvoidingView
                style={{flex:1, backgroundColor:'white'}} 
                keyboardVerticalOffset={Platform.OS === 'android' ? -500 : 0}
                behavior="padding"
                >
                <ScrollView style={{height:'auto'}} showsVerticalScrollIndicator={true}>
                <View style={{flex:1,paddingHorizontal:24,backgroundColor:'white'}}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10,marginTop:24 }}>회원가입</Text>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>아이디로 사용할 이메일과 비밀번호를 입력해주세요.</Text>
                </View>
                <View style={{flex:1,backgroundColor:'white'}}>
                    <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20 }}>이메일</Text>
                    <TextInput
                        style={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: emailValid ? '#4169E1' : 'red',
                            fontSize: 14,
                            padding: 10,
                            marginTop: 8,
                            height:48
                        }}
                        placeholder="사용가능한 이메일을 입력해주세요."
                        placeholderTextColor={'gray'}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        onChangeText={setEmailWithValidation}
                        value={username}
                    />

                    <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20 }}>비밀번호</Text>
                    <TextInput
                        style={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: passwordValid ? '#4169E1' : 'red',
                            fontSize: 13,
                            padding: 10,
                            marginTop: 8,
                            height:48
                        }}
                        placeholder="영문,숫자,특수문자 조합으로 8자리 이상으로 설정해주세요."
                        placeholderTextColor={'gray'}
                        secureTextEntry={true}
                        onChangeText={setPasswordWithValidation}
                        value={password}
                    />
                    <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20 }}>비밀번호 확인</Text>
                    <TextInput
                        style={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: confirmPasswordValid ? '#4169E1' : 'red',
                            fontSize: 14,
                            padding: 10,
                            marginTop: 8,
                            height:48
                        }}
                        placeholder="비밀번호를 다시 입력해주세요."
                        placeholderTextColor={'gray'}
                        secureTextEntry={true}
                        onChangeText={setConfirmPasswordWithValidation}
                        value={confirmPassword}
                    />
                    </View>
                    </View>
                </ScrollView>
                    <View style={{ backgroundColor: 'white' }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: isFormValid() ? '#4A7AFF' : 'gray',
                                width: screenWidth,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 48,
                            }}
                                onPress={handleContinue}
                                disabled={!isFormValid()}
                            >
                            <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView >         
        </SafeAreaView>                  
        
    );
};

export default NameScreen;
