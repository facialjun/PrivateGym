import React, { useEffect, useState } from 'react';
import { Button,StyleSheet, Image,Text, View, Dimensions, TouchableOpacity, Platform,ScrollView,RefreshControl, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MainScreens, MainStackParamList, TRmainScreens } from '../stacks/Navigator';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import config from '../config'
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import EventComponent from '../assets/component/event';


const BASE_URL = config.SERVER_URL;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    android: {
        elevation: 10,
    },
})

////////////////////////////////////////////////////////////////////////


type MyInfoScreenNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
    MainScreens.MyInfo
>;

interface MyInfoScreenProps {
    navigation: MyInfoScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};

////////////////////////////////////////////////////////////////////////

const MyInfoScreen:React.FunctionComponent<MyInfoScreenProps> = (props) => {
    const {navigation} = props;
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [eventVisible, setEventVisible] = useState(false);

    
useFocusEffect(
    React.useCallback(() => {
        async function fetchData() {
            setIsLoading(true);
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
            finally {
                setIsLoading(false);
            }
        }


        fetchData().catch(console.error);
    }, [])
);


    useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true)
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
        finally {
            setIsLoading(false);
        }
    };
    

    fetchData();
    }, []); // 빈 의존성 배열로, 컴포넌트 마운트 시에만 실행

if (isLoading) {
    // 로딩 중이라면 로티 애니메이션 표시
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <LottieView
                source={require('../src/lottie/loading.json')}
                style={{width:100,height:100}}
                autoPlay
                loop
            />
        </View>
    );
}


const onRefresh = async () => {
    setRefreshing(true);

    try {
        // AsyncStorage에서 로그인된 사용자의 logId 가져오기
        const logId = await AsyncStorage.getItem('logId');
        
        if (logId) {
        const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');

        // Fetch user data
        try {
            const userResponse = await axios.get(`${BASE_URL}/user/${formattedLogId}`);
            if (userResponse.status === 200) {
            setUserData(userResponse.data);
            console.log("Updated user data:", userResponse.data);
            } else {
            console.log('Error fetching updated user data. Status:', userResponse.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

        
        }
    } catch (error) {
        console.error('Error fetching logId from AsyncStorage:', error);
    }

    setRefreshing(false);
};


    return (
        
        <ScrollView
        style={{height:'auto',backgroundColor:'white'}}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={{height:'auto',backgroundColor:'white'}}>
            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',paddingHorizontal:24,marginTop:30}}>
                    <Image 
                        source={
                            userData.gender === 'male' ? require('../images/Man.png') :
                            userData.gender === 'woman' ? require('../images/woman.png') :
                            require('../images/profile.png') // gender가 null이거나 다른 값일 때 기본 이미지
                        }
                        style={{
                        height: 50,
                        width: 50,
                        borderRadius: 45,
            
                        }}
                        />
                    <View style={{height:50,backgroundColor:'white',justifyContent:'center'}}>
                        <Text style={{fontSize: 17,fontWeight:'bold',marginLeft:10,color:'#4F4F4F'}}>{userData?.username}</Text>
                        <Text style={{fontSize: 13,marginLeft:10,color:'#4F4F4F'}}>{userData?.email}</Text>
                    </View>    
        </View>
        
        
        <View style={{paddingHorizontal:24,marginTop:40,borderBottomColor:'#DEE2E6',borderBottomWidth:1,paddingBottom:24}}>
            <Text style={{fontWeight:'600',fontSize:20}}>보유회원권</Text>
            <TouchableOpacity 
                onPress={()=>{navigation.navigate(MainScreens.MineMembership)}}
                style={{flexDirection:'row',alignItems:'center',marginTop:24,justifyContent:'space-between'}}>
                <Text style={{fontSize:18}}>대관/PT 이용권</Text>
                <AntDesign name="right" size={18} color="black" />
            </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal:24,marginTop:24,backgroundColor:'whitee',paddingBottom:24,borderBottomColor:'#DEE2E6',borderBottomWidth:1}}>
            <Text style={{fontWeight:'600',fontSize:20}}>회원정보</Text>
            <TouchableOpacity 
                onPress={()=>{navigation.navigate(MainScreens.LogInfo)}}
                style={{flexDirection:'row',alignItems:'center',marginTop:24,justifyContent:'space-between'}}>
                    <Text style={{fontSize:18}}>내 계정정보</Text>
                    <AntDesign name="right" size={18} color="black" />
            </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal:24,marginTop:24,backgroundColor:'whitee',paddingBottom:24}}>
            <Text style={{fontWeight:'600',fontSize:20}}>쿠폰</Text>
            <TouchableOpacity 
                onPress={()=>{navigation.navigate(MainScreens.MyCoupon)}}
                style={{flexDirection:'row',alignItems:'center',marginTop:24,justifyContent:'space-between'}}>
                    <Text style={{fontSize:18}}>발급 쿠폰 관리</Text>
                    <AntDesign name="right" size={18} color="black" />
            </TouchableOpacity>
        </View>

        <View style={{marginTop: 24}}>
            <TouchableOpacity onPress={() => setEventVisible(true)}>
                <Image source={require('../images/Bannerframe.png')} style={{width: screenWidth, height: screenWidth/5,paddingHorizontal:24}}/>
                <View style={{flex:1,position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,flexDirection:'row',paddingHorizontal:24}}>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{color:'white',fontSize:12}}>PT를 받아보고 싶으신가요?</Text>
                        <Text style={{color:'white',fontSize:18,fontWeight:'600'}}>정기권 이용자를 위한 할인 혜택!</Text>
                    </View>
                        <Image source={require('../images/card.png')} style={{width:'24%' , height: '80%',marginLeft:'auto',alignSelf:'center'}}/>
                </View>
                </TouchableOpacity>
                <EventComponent
                visible={eventVisible}
                onClose={() => setEventVisible(false)}
            />
            </View>
            <View style={{backgroundColor:'#F8F9FA',paddingHorizontal:24,borderTopColor:'#E5E5E5',marginTop:40}}>
                <Image source={require('../images/logo2.png')} style={{width: 160, height: 28 ,marginTop:30 }}/>
                    <Text style={{color:'#868E96',fontSize:16,fontWeight:'bold',marginTop:24}}>
                                    (주) 라이프팔레트
                    </Text>
                    <Text style={{color:'#868E96',fontSize:10,marginTop:8,fontWeight:'500'}}>
                            서울특별시 강남구 언주로 134길 6 2층 
                    </Text>
                    <Text style={{color:'#868E96',fontSize:10,marginTop:4,fontWeight:'500'}}>
                            대표이사:이승준,이상범 | 사업자번호: 853-87-02854
                    </Text>
                    <Text style={{color:'#868E96',fontSize:10,marginTop:4,fontWeight:'500'}}>
                            통신판매번호:제 2023-서울강남-06134
                    </Text>
                    <Text style={{color:'#868E96',fontSize:10,marginTop:4,fontWeight:'500'}}>
                            이메일: facialjun@gmail.com
                    </Text>
                    <Text style={{color:'#868E96',fontSize:10,marginTop:8}}>
                            주식회사 라이프팔레트는 통신판매중개자로서 통신판매의 당사자가 아니며 입점판매자가 등록한 상품정보 및 거래에 대한 책임을 지지 않습니다.
                    </Text>

                </View>
                    <View style={{flex:0.2,marginBottom:50,backgroundColor:'#F8F9FA',paddingHorizontal:24,paddingBottom:40}}>
                        <View style={{flex:0.7,flexDirection:'row',backgroundColor:'#F8F9FA',marginTop:16}}>
                            <TouchableOpacity 
                        
                            onPress={() => Linking.openURL('https://sites.google.com/view/using-gymprivate/%ED%99%88')}>
                                    <Text style={{ color: '#797676', fontSize: 10 }}>이용약관   |</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                       
                            onPress={() => Linking.openURL('https://sites.google.com/view/gymprivate/%ED%99%88')}>
                                <Text style={{color:'#797676',fontSize:10}}> 개인정보처리방침 </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            
                            onPress={() => Linking.openURL('https://sites.google.com/view/gymprivateusingduration/%ED%99%88')}>
                                <Text style={{ color: '#797676', fontSize: 10 }}>|   PT이용기간</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
            </View>

        </ScrollView>

    );
};

export default MyInfoScreen;