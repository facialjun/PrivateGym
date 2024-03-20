import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { View,Text, KeyboardAvoidingView,Image,Dimensions, TextInput, TouchableOpacity } from 'react-native'
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import { resetPassword, type ResetPasswordOutput } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type ForgotPassWordScreenNavigationProps = StackNavigationProp<
    MainStackParamList,
    'ForgotPassword'
>;

interface ForgotPassWordScreenProps {
    navigation: ForgotPassWordScreenNavigationProps; 
};


const ForgotPasswordScreen: React.FunctionComponent<ForgotPassWordScreenProps> = ({navigation}) => {
    
    const [username, setUsername] = useState<string>('');

    const storeUsername = async (username: string) => {
        try {
            await AsyncStorage.setItem('username', username);
        } catch (error) {
            console.log('AsyncStorage Error: ', error);
        }
    };

    const isUsernameEmpty = () => {
        return username.trim().length === 0;
    };
    

    const handleResetPassword= async() => {
    try {
        const output = await resetPassword({ username });
        handleResetPasswordNextSteps(output);
        await storeUsername(username);
        navigation.navigate(MainScreens.NewPassword)
    } catch (error) {
        console.log(error);
    }
    }

    function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
            `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );
        // Collect the confirmation code from the user and pass to confirmResetPassword.
        break;
        case 'DONE':
        console.log('Successfully reset password.');
        break;
    }
    }


    return (
        <View style={{height:'100%',backgroundColor:'white'}}>
        <View style={{justifyContent:'center',alignItems:'center',height:screenHeight*0.4, backgroundColor:'white'}} >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20, fontWeight:'bold', }}>
                        비밀번호 재설정하기
                    </Text>
                    <TextInput
                        style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 22, fontWeight: '400',width:screenWidth*0.9, marginTop:'10%' }}
                        placeholder="이메일을 입력하세요"
                        onChangeText={(text) => setUsername(text)}
                    />  
                    
                </View>

            <View style={{ height: screenHeight * 0.1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        //  backgroundColor:  '#4A7AFF', // 버튼 색상 조건부 설정
                        backgroundColor: isUsernameEmpty() ? 'gray' : '#4A7AFF', // 버튼 색상 조건부 설정
                        width: screenWidth * 0.9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.05,
                        marginBottom: '3%'
                    }}
                    onPress={handleResetPassword}
                    disabled={isUsernameEmpty()} // 버튼 활성화 상태 조건부 설정
                >
                    <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                </TouchableOpacity>
            </View>

        </View>
        </View>
    )
}

export default ForgotPasswordScreen