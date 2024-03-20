import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Linking , Modal, Alert,StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Constants from 'expo-constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogInformationScreens, MainScreens, MainStackParamList } from '../stacks/Navigator';
import { signOut } from 'aws-amplify/auth';
import config from '../config'
import Icon from 'react-native-vector-icons/AntDesign';
import { deleteUser } from 'aws-amplify/auth';
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

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



const BASE_URL = config.SERVER_URL;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

////////////////////////////////////////////////////////////////////////


type LogInfoScreenNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
    MainScreens.LogInfo
>;

interface LogInfoScreenProps {
    navigation: LogInfoScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};

////////////////////////////////////////////////////////////////////////

const LogInformationScreen:React.FunctionComponent<LogInfoScreenProps> = (props) => {
    const {navigation} = props;
    const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);
    const [deleteModal,setDeleteModal] = useState(false);

    // useEffect(() => {
    //     AsyncStorage.getItem('logId')
    //     .then((logId) => {
    //         // Remove quotes from logId, if present
    //         logId = logId.replace(/^['"](.*)['"]$/, '$1');
            
    //         console.log(logId);

    //         if (logId) {
    //         setLogId(logId);
    //         }
    //     })
    //     .catch((error) => {
    //         console.log('Error retrieving logId:', error);
    //     });
    // }, []);


    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //         const response = await axios.get(`${BASE_URL}/user/${logId}`);
            
    //         if (response.status === 200) {
    //             setUserData(response.data);
    //             console.log('Fetched User Data:', response.data);
    //         } 
    //         } catch (error) {
    //         console.log('Error fetching user data:', error);
    //         }
    //     };

    //     fetchUserData();

    // },[logId]); 

    useEffect(() => {
    const fetchData = async () => {
        try {
        // AsyncStorage에서 logId 가져오기
        let logId = await AsyncStorage.getItem('logId');
        if (logId) {
            // Remove quotes from logId, if present
            logId = logId.replace(/^['"](.*)['"]$/, '$1');
            console.log(logId);

            // logId를 사용하여 사용자 데이터 가져오기
            const response = await axios.get(`${BASE_URL}/user/${logId}`);
            if (response.status === 200) {
            setUserData(response.data);
            console.log('Fetched User Data:', response.data);
            }
        }
        } catch (error) {
        console.log('Error:', error);
        }
    };

    fetchData();
    }, []); // 빈 의존성 배열로, 컴포넌트 마운트 시에만 실행


const handleSignOut = async () => {
    try {
        // 사용자에게 로그아웃 여부를 확인하는 알림 창 표시
        Alert.alert(
            '로그아웃',
            '로그아웃 하시겠습니까?',
            [
                {
                    text: '예',
                    onPress: async () => {
                        // 로그아웃 수행
                        await signOut({ global: true });
                        console.log('Logout completed');
                        
                        // AsyncStorage 클리어
                        await AsyncStorage.clear();
                        console.log('AsyncStorage cleared');
                    
                        // AsyncStorage가 비어있는지 확인
                        const keys = await AsyncStorage.getAllKeys();
                        if (keys.length === 0) {
                            console.log('Confirmed: AsyncStorage is empty');
                        } else {
                            console.log('Remaining keys in AsyncStorage:', keys);
                        }

                        // 로그인 화면으로 네비게이션 리셋
                        navigation.reset({routes: [{name: MainScreens.LogIn}]});
                    },
                },
                {
                    text: '아니요',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    } catch (error) {
        console.log('Error signing out: ', error);
    }
};

const handleDeleteUser = async () => {
    try {
        // 로컬 스토리지에서 logId 가져오기
        let logId = await AsyncStorage.getItem('logId');
        

        if (logId){
            logId = logId.replace(/^['"](.*)['"]$/, '$1');

            // 서버에 사용자 삭제 요청을 보냄
        const response = await axios.delete(`${BASE_URL}/user/${logId}`);

        // 성공적으로 사용자가 삭제된 경우
        if (response.status === 200) {
            console.log('Server response: User deleted successfully.');
        }
        
        // AWS Amplify를 통해 Cognito 사용자 삭제
            await deleteUser();
            console.log('Delete user completed');

            // 로그인 화면으로 네비게이션 리셋
            navigation.reset({routes: [{name: MainScreens.LogIn}]});
            
            // 로컬 스토리지 클리어
            await AsyncStorage.clear();
            console.log('AsyncStorage cleared');

            // 사용자에게 회원 탈퇴 완료 알림
            Alert.alert(
                "회원 탈퇴 완료",
                "계정이 정상적으로 삭제되었습니다.",
                [{ text: "확인", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        } else {
            // 서버로부터 예상치 못한 응답을 받은 경우
            throw new Error('Unexpected response from the server.');
        }
    } catch (error) {
        console.log('Error deleting user: ', error);
        Alert.alert("회원 탈퇴 오류", "회원 탈퇴 중 오류가 발생했습니다.");
    }
    console.log(logId);
};



   // 모달에서 '예'를 클릭했을 때 실행할 함수
    const onDeleteConfirm = () => {
        handleDeleteUser();
        setDeleteModal(false); // 모달 닫기
    };

    return (
        <View style={{height:'auto'}}>
            <View style={{height:screenHeight,width:screenWidth}}>
                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.1,justifyContent:'center',alignItems:'flex-start',borderBottomColor:'lightgray',borderBottomWidth:0.5}}>
                    <Text style={{fontSize:18, fontWeight:'bold',marginLeft:'5%'}}>
                        가입정보
                    </Text>
                </View>
                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>이름 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '7%',color:'gray'}}>{userData?.username}</Text>
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>이메일 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '7%',color:'gray'}}>{userData?.email}</Text>
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row',borderBottomColor:'lightgray',borderBottomWidth:0.5}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>생일 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '7%',color:'gray'}}>{userData?.birthday}</Text>
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.1,justifyContent:'center',alignItems:'flex-start',marginTop:'3%',borderBottomColor:'lightgray',borderBottomWidth:0.5,borderTopColor:'lightgray'}}>
                    <Text style={{fontSize:18, fontWeight:'bold',marginLeft:'5%'}}>
                        알림
                    </Text>
                </View>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity 
                    onPress={() => Linking.openURL('https://sites.google.com/view/using-gymprivate/%ED%99%88')}
                    style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                        <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>이용약관</Text>
                        <View style={{backgroundColor:'white',alignItems:'flex-end',marginRight:'5%'}}>
                                <AntDesign name="right" size={17} color="#131515" style={{marginLeft:'auto',fontWeight:'bold'}} />
                        </View>
                    </TouchableOpacity>
                    
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>앱 버전 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '5%',color:'gray'}}>v1.0.0</Text>
                </View>

                <View style={{justifyContent:'center',alignItems:'center',top:'6%'}}>
                    <TouchableOpacity
                        style={{
                            height:screenWidth*0.12,
                            width:screenWidth*0.8,
                            backgroundColor:'#4A7AFF',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:15,
                        }}
                        onPress={handleSignOut}>
                        <Text style={{color:'rgba(255,255,255,1)',fontWeight:'bold',fontSize:15}}>로그아웃</Text>
                    </TouchableOpacity>
                </View>

                <View style={{justifyContent:'center',alignItems:'center',top:'10%'}}>
                    <TouchableOpacity
                        style={{
                            height:screenWidth*0.12,
                            width:screenWidth*0.8,
                            justifyContent:'center',
                            alignItems:'center',
                            flexDirection:'row',
                            borderRadius:15,
                        }}
                        onPress={() => setDeleteModal(true)}
                        >
                            <View style={{justifyContent:'flex-start',width:screenWidth*0.6}}>
                                <Text style={{color:'#868E96',fontWeight:'300',fontSize:14}}>더 이상 앱을 이용하지 않으시나요?</Text>
                            </View>
                        <Icon name="right" size={13} color='#868E96'/>
                    </TouchableOpacity>

                    {/* 모달 */}

            <Modal
                animationType="none"
                transparent={true}
                visible={deleteModal}
                onRequestClose={() => {
                    setDeleteModal(!deleteModal);
                }}>
                <View style={{height:'100%',width:screenWidth,backgroundColor: 'rgba(0, 0, 0, 0.5)',justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:screenHeight*0.3,width:screenWidth*0.8,backgroundColor:'white',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                        <View style={{height:screenHeight*0.15,alignItems:'center'}}>
                            <Text style={{fontSize:17,fontWeight:'400'}}>짐프라이빗 앱에서 회원탈퇴 하시겠어요?</Text>
                            <Text style={{fontSize:13,fontWeight:'400',color:'gray',marginTop:'3%'}}>⛔️ 회원 탈퇴 후, 서비스를 이용하시려면</Text>
                            <Text style={{fontSize:13,fontWeight:'400',color:'gray'}}>신규 회원으로 가입 후 이용해야합니다.</Text>
                        </View>
                        
                        <View style={{flexDirection: "row",justifyContent: "space-around",width: "80%"}}>
                            <TouchableOpacity
                                style={{borderRadius: 15,width:80,height:40, backgroundColor:'#4A7AFF',justifyContent:'center',alignItems:'center'}}
                                onPress={() => setDeleteModal(!deleteModal)}>
                                <Text style={{color: "white",fontWeight: "bold",fontSize:17}}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{borderRadius: 15,width:80,height:40, backgroundColor:'#4A7AFF',justifyContent:'center',alignItems:'center'}}
                                onPress={onDeleteConfirm}>
                                <Text style={{color: "white",fontWeight: "bold",fontSize:17}}>예</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
                </View>

            </View>
        

        
        </View>
    );
};

export default LogInformationScreen;

