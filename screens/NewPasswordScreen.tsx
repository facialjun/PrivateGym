import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { confirmResetPassword, type ConfirmResetPasswordInput } from 'aws-amplify/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type NewPassWordScreenNavigationProps = StackNavigationProp<
    MainStackParamList,
    'NewPassword'
>;

interface NewPassWordScreenProps {
    navigation: NewPassWordScreenNavigationProps; 
};



const ConfirmResetPasswordScreen: React.FunctionComponent<NewPassWordScreenProps> = ({ navigation }) => {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [username, setUsername] = useState('');

    const isInputValid = () => {
        return code.trim().length > 0 && newPassword.trim().length > 0;
    };

    useEffect(() => {
        // AsyncStorage에서 username 로드
        const loadUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername !== null) {
                    setUsername(storedUsername);
                    console.log(username)
                }
            } catch (error) {
                console.error('Failed to load the username from AsyncStorage', error);
            }
        };

        loadUsername();
    }, []);


    const handleSubmit = async () => {
        try {
            // 비밀번호 재설정 확인 함수 호출
            // confirmResetPassword 함수 호출 시 입력 파라미터를 객체 형태로 전달
            await confirmResetPassword({
                username, // 사용자명
                confirmationCode: code, // 사용자로부터 입력받은 확인 코드
                newPassword // 사용자가 설정한 새 비밀번호
            });
            Alert.alert('성공', '비밀번호가 재설정되었습니다.', [
                { text: 'OK', onPress: () => navigation.navigate(MainScreens.LogIn) } // 성공 시 로그인 화면으로 이동
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('실패', '인증코드나 비밀번호를 확인해주세요!.');
        }
    };

    return (

        <View style={{height:'100%',backgroundColor:'white'}}>
        <View style={{justifyContent:'center',alignItems:'center',height:screenHeight*0.5, backgroundColor:'white'}} >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:16, fontWeight:'bold', }}>
                        확인코드와 새로운 비밀번호를 입력해주세요!
                    </Text>
                    <TextInput
                        style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 23, fontWeight: 'bold',width:screenWidth*0.9, marginTop:'10%' }}
                        value={code}
                        onChangeText={setCode}
                        placeholder="확인 코드"
                    />  
                    <TextInput
                        style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 23, fontWeight: 'bold',width:screenWidth*0.9, marginTop:'10%' }}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="새 비밀번호"
                        secureTextEntry={true}
                    />  
                    
                </View>

            <View style={{ height: screenHeight * 0.1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        //  backgroundColor:  '#4A7AFF', // 버튼 색상 조건부 설정
                        backgroundColor: isInputValid() ? '#4A7AFF' : 'gray', // 버튼 색상 조건부 설정
                        width: screenWidth * 0.9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.05,
                        marginBottom: '3%'
                    }}
                    onPress={handleSubmit}
                    disabled={!isInputValid()} // 버튼 활성화 상태 조건부 설정
                >
                    <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                </TouchableOpacity>
            </View>

        </View>
        </View>
        // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //     <Text>확인 코드 입력</Text>
        //     <TextInput
        //         value={code}
        //         onChangeText={setCode}
        //         placeholder="확인 코드"
        //         style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
        //     />
        //     <TextInput
        //         value={newPassword}
        //         onChangeText={setNewPassword}
        //         placeholder="새 비밀번호"
        //         secureTextEntry={true}
        //         style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10 }}
        //     />
        //     <TouchableOpacity onPress={handleSubmit} style={{ marginTop: 20, backgroundColor: 'blue', padding: 10 }}>
        //         <Text style={{ color: 'white' }}>제출</Text>
        //     </TouchableOpacity>
        // </View>
    );
};

export default ConfirmResetPasswordScreen;
