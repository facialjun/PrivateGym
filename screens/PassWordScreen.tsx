import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions,Image, TextInput, ScrollView, SafeAreaView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';
import { signUp, confirmSignUp,resendSignUpCode } from 'aws-amplify/auth';


type PassWordScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'PassWord'
>;

interface PassWordScreenProps {
    navigation: PassWordScreenNavigationProps; 
};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const PassWordScreen:React.FunctionComponent<PassWordScreenProps> = ({navigation}) => {
    
    const [name, setName] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmationCode, setConfirmationCode] = useState<string>('');

    // 유효성 검사 상태
    const [nameValid, setNameValid] = useState<boolean>(true);
    const [birthdateValid, setBirthDateValid] = useState<boolean>(true);
    const [confirmationCodeValid, setConfirmationCodeValid] = useState<boolean>(true);
    const [phoneNumberValid, setPhoneNumberValid] = useState<boolean>(true);
    const [showconfirmation, setshowconfirmation] = useState<boolean>(false);



    
    useEffect(() => {
        // Fetch data from AsyncStorage when the component mounts
        const fetchDataFromStorage = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                const storedPassword = await AsyncStorage.getItem('Password');
                // const storedName = await AsyncStorage.getItem('Name');
                // const storedBirthdate = await AsyncStorage.getItem('Birthdate');
                // const storedPhoneNumber = await AsyncStorage.getItem('PhoneNumber');

                setUsername(storedUsername || '');
                setPassword(storedPassword || '');
                // setName(storedName || '');
                // setBirthdate(storedBirthdate || '');
                // setPhoneNumber(storedPhoneNumber || '');
            } catch (error) {
                console.error('Error fetching data from AsyncStorage:', error);
            }
        };

        fetchDataFromStorage();
    }, []);


    const handleSignUp = async () => {
        const convertToFormattedDate = (input: string): string => {
            if (input.length === 8) {
                const year = input.substring(0, 4);
                const month = input.substring(4, 6);
                const day = input.substring(6, 8);
                return `${year}-${month}-${day}`;
            } else {
                // 유효한 날짜 형식이 아닌 경우 또는 다른 예외처리를 원하는 경우 추가 로직 구현
                console.error('Invalid date format');
                return input;
            }
        };
        
            const formattedDate = convertToFormattedDate(birthdate);
            const username = await AsyncStorage.getItem('username');
            const password = await AsyncStorage.getItem('password');

            const formattedPhoneNumber = `+82${phoneNumber.substring(1)}`;
    try {
        setshowconfirmation(true)
        const { userId } = await signUp({
            username: username,
            password: password,
            options: {
            userAttributes: {
                phone_number: formattedPhoneNumber,
                name: name,
                birthdate: formattedDate
            },
            autoSignIn: true
            }
        });

        console.log(`User ID: ${userId}`);
        } catch (error) {
        console.log('Error signing up:', error);
        }
    };

    // const handleResendCode = async () => {
    //     const username = await AsyncStorage.getItem('username');
    //     try{
    //         const {} = await resendSignUpCode({ username: username });

    //     } catch(error){
    //         console.log('Error confirming resend sign up code', error);
    //     }
        
    //     }



const handleSignUpConfirmation = async () => {
    const username = await AsyncStorage.getItem('username');
    try {
        
        const { isSignUpComplete } = await confirmSignUp({
            username: username,
            confirmationCode
        });

        if (isSignUpComplete) {
            // 회원가입 성공 알림 표시
            Alert.alert(
                "회원가입 성공", // 대화 상자 제목
                "회원가입에 성공했습니다! 로그인 해주세요.", // 메시지 내용
                [
                    { text: "OK", onPress: () => navigation.navigate(MainScreens.LogIn) }
                    // 사용자가 OK 버튼을 누르면 로그인 화면으로 이동
                ],
                { cancelable: false } // 안드로이드에서 뒤로가기 버튼으로 대화 상자를 닫을 수 없게 설정
            );
        }
    } catch (error) {
        console.log('Error confirming sign up', error);
    }
};


     // 이름, 생년월일, 휴대폰 번호 확인 필드의 유효성 검사
    const validateName = (name) => /^[가-힣a-zA-Z\s]+$/.test(name);
    const validateBirthDate = (birthDate) => /^\d{8}$/.test(birthDate);
    const validatePhoneNumber = (phoneNumber) => /^\d{11}$/.test(phoneNumber); 
    const ValidateConfirmationCode = (phoneNumber) => /^\d{6}$/.test(phoneNumber);// 수정: 8~11자리 숫자

    // 이름 변경 핸들러
    const setNameWithValidation = (text) => {
        setName(text);
        setNameValid(validateName(text));
    };

    // 생년월일 변경 핸들러
    const setBirthdateWithValidation = (text) => {
        setBirthdate(text);
        setBirthDateValid(validateBirthDate(text));
    };

    // 휴대폰 번호 변경 핸들러
    const setPhoneNumberWithValidation = (text) => {
        setPhoneNumber(text);
        setPhoneNumberValid(validatePhoneNumber(text));
    };
    

     // 인증번호 변경 핸들러
     const setConfirmationWithValidation = (text) => {
        setConfirmationCode(text);
        setConfirmationCodeValid(ValidateConfirmationCode(text));
    };

    // 폼의 유효성 검사
    const isFormValid = () => {
        return nameValid && birthdateValid && phoneNumberValid && confirmationCodeValid &&
            name !== '' && birthdate !== '' && phoneNumber !== ''  && confirmationCode !== '';
    };



    return (

    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <KeyboardAvoidingView
                style={{flex:1, backgroundColor:'white'}} 
                keyboardVerticalOffset={0}     
                behavior="padding"
                >
      <ScrollView style={{height:'auto'}}>
        <View style={{flex:1,paddingHorizontal:24,backgroundColor:'white'}}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 ,marginTop:24 }}>회원가입</Text>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>이름, 생년월일, 휴대폰번호를 입력해주세요.</Text>
            </View>

            <View style={{ width: '100%', paddingHorizontal: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20 }}>이름</Text>
                <TextInput
                    style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: nameValid ? '#4169E1' : 'red',
                        fontSize: 16,
                        padding: 10,
                        marginTop: 8,
                        height: 48
                    }}
                        placeholder="실명"
                        placeholderTextColor={'#868E96'}
                        onChangeText={setNameWithValidation}
                        value={name}
                />

                <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20 }}>생년월일</Text>
                <TextInput
                    style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: birthdateValid ? '#4169E1' : 'red',
                        fontSize: 16,
                        padding: 10,
                        marginTop: 8,
                        height: 48
                    }}
                        placeholder="생년월일 8자리 ex)20000101"
                        placeholderTextColor={'#868E96'}
                        keyboardType="numeric"
                        onChangeText={setBirthdateWithValidation}
                        value={birthdate}
                />

                {/* 휴대폰 번호 입력 필드 */}
                <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20 }}>휴대폰 번호</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TextInput
                    style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: phoneNumberValid ? '#4169E1' : 'red',
                        fontSize: 16,
                        padding: 10,
                        marginTop: 8,
                        height: 48,
                        width:'66%'
                    }}
                    placeholder="전화번호 입력"
                    placeholderTextColor={'#868E96'}
                    keyboardType="numeric"
                    onChangeText={setPhoneNumberWithValidation}
                    value={phoneNumber}
                    />
                    <TouchableOpacity 
                    onPress={handleSignUp}
                    style={{height:48,backgroundColor: phoneNumberValid ? '#4169E1' : '#868E96', borderRadius:8,width:'30%',marginTop: 8, }}>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <Text style={{color:'white'}}>인증하기</Text>
                        </View>
                    </TouchableOpacity>
                    
                    </View>
                    {/* <TouchableOpacity 
                    onPress={handleResendCode}
                    style={{height:48,backgroundColor: phoneNumberValid ? '#4169E1' : '#868E96', borderRadius:8,width:'30%',marginTop: 8, }}>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <Text style={{color:'white'}}>인증번호가 오지 않나요 ?</Text>
                        </View>
                    </TouchableOpacity> */}
                    {showconfirmation && (
                        <View style={{marginBottom:20 }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20}}>인증번호</Text>
                            <TextInput
                            style={{
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: confirmationCodeValid ? '#4169E1' : 'red',
                                fontSize: 16,
                                padding: 10,
                                marginTop: 8,
                                height: 48,
                                width: '100%'
                            }}
                            placeholder="인증번호 6자리"
                            placeholderTextColor={'#868E96'}
                            keyboardType="numeric"
                            onChangeText={setConfirmationWithValidation}
                            value={confirmationCode}
                            />
                        </View>
                        )}
                </View>
                </View>
            </ScrollView>
        <View style={{ paddingHorizontal: 24, backgroundColor: 'white' }}>
        <TouchableOpacity
            style={{
                backgroundColor: isFormValid() ? '#4A7AFF' : '#868E96',
                width: screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,    
            }}
            onPress={handleSignUpConfirmation}
            disabled={!isFormValid()}
            >
            <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    </SafeAreaView>

    );
};

export default PassWordScreen;
