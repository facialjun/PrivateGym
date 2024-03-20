import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity,Image, FlatList,Button, Platform, ScrollView,RefreshControl, SafeAreaView, BackHandler} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList, MembershipScreens } from '../stacks/Navigator';
import { signIn, signOut, autoSignIn, getCurrentUser, fetchAuthSession, } from 'aws-amplify/auth';
import { RouteProp } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config'
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import EventComponent from '../assets/component/event';
import ReviewEventComponent from '../assets/component/ReviewEvent';
import FirstReservationEventComponent from '../assets/component/FirstReservationEvent'

const BASE_URL = config.SERVER_URL;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export const basicDimensions = {
    height: 852,
    width: 393,
};


const calculateAdjustedRatio = (dimension, basicDimension) => {
    const ratio = dimension / basicDimension;
        if (ratio < 1) {
            // 화면 크기가 기준치보다 작은 경우, 비율을 조정
            return (1 / ratio).toFixed(2);
        }
    return ratio.toFixed(2);
};

export const height = calculateAdjustedRatio(screenHeight, basicDimensions.height);
export const width = calculateAdjustedRatio(screenWidth, basicDimensions.width);
//////////////////////////////////////////////////////////////// 코드 타입정의

type HomeScreenNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
    'Home' | 'Book' | 'Membership' | 'MembershipPurchase1' | 'PT'
>;

interface HomeScreenProps {
    route: RouteProp<MainStackParamList, 'Home'>;
    navigation: HomeScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};


//////////////////////////////////////////////////////////////// 





const HomeScreen: React.FunctionComponent<HomeScreenProps> = ({navigation,route}) => {

        useEffect(() => {
            // 뒤로 가기 버튼을 눌렀을 때 호출될 함수
            const backAction = () => {
            BackHandler.exitApp();
            return true;
            };

            // 뒤로 가기 버튼의 이벤트 리스너를 추가합니다.
            const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
            );

            // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
            return () => backHandler.remove();
        }, []);

    
    const [isLoading, setIsLoading] = useState(true);
    const images = [
        require('../images/FirstReservationEvent.png'),
        require('../images/NaverReviewEvent.png'),
        require('../images/PeriodMembershipBenefit.png'),
    ];

    //자동슬라이드 스크롤뷰 
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef();


useFocusEffect(
    React.useCallback(() => {


        async function fetchData() {
            setIsLoading(true);
            try {
                let storedLogId = await AsyncStorage.getItem('logId');
                if (storedLogId) {
                    storedLogId = storedLogId.replace(/^['"](.*)['"]$/, '$1');
                    console.log("데이터를 성공적으로 가져왔습니다.");

                    const uidResponse = await fetch(`${BASE_URL}/user/${storedLogId}`);
                    const uidData = await uidResponse.json();
                    const uid = uidData.uid;

                    const membershipResponse = await fetch(`${BASE_URL}/membership?uid=${uid}`);
                    const membershipData = await membershipResponse.json();
                    if (membershipData && membershipData.length > 0) {
                        // 정기권 내역이 있을 경우
                        setPState(membershipData[0].pstate);
                        setTotalTime(membershipData[0].total_time);
                        setUsedTime(membershipData[0].used_time);
                        console.log(pState);
                    } else {
                        // 정기권 내역이 없을 경우
                        setPState(0);
                        setTotalTime(0);
                        setUsedTime(0);
                        console.log('정기권 내역이 없습니다.');
                    }
                }
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생: ", error);
            } finally {
                setIsLoading(false);
            }
        }


        fetchData().catch(console.error);
    }, [])
);

const [isAutoScroll, setIsAutoScroll] = useState(true);


    useEffect(() => {
    const interval = setInterval(() => {
        if (isAutoScroll) {
            setActiveIndex(prevIndex => {
                const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ x: screenWidth * nextIndex, animated: true });
                }
                return nextIndex;
            });
        }
    }, 3000);

    return () => clearInterval(interval);
}, [isAutoScroll]);


    const renderIndicator = () => {
        return (
            <View style={styles.indicatorContainer}>
                {images.map((image, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: activeIndex === index ? 'darkgray' : 'lightgray' },
                        ]}
                    />
                ))}
            </View>
        );
    };
        const [pState, setPState] = useState(0);
        const [refreshing, setRefreshing] = useState(false);
        const [userData, setUserData] = useState(null);
        const [logId, setLogId] = useState(null);
        const [totalTime, setTotalTime] = useState(0);
        const [usedTime, setUsedTime] = useState(0);

const onRefresh = async () => {
    setRefreshing(true); // 새로고침 시작

    try {
        // AsyncStorage에서 logId 가져오기
        let storedLogId = await AsyncStorage.getItem('logId');
        if (storedLogId) {
            storedLogId = storedLogId.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes from logId, if present

            // logId를 사용하여 사용자 UID 가져오기
            const uidResponse = await fetch(`${BASE_URL}/user/${storedLogId}`);
            const uidData = await uidResponse.json();
            const uid = uidData.uid;

            // uid로 period_membership pstate 가져오기
            const membershipResponse = await fetch(`${BASE_URL}/membership?uid=${uid}`);
            const membershipData = await membershipResponse.json();
            if (membershipData && membershipData.length > 0) {
                // 정기권 내역이 있을 경우
                setPState(membershipData[0].pstate);
                setTotalTime(membershipData[0].total_time);
                setUsedTime(membershipData[0].used_time);
                console.log(pState);
            } else {
                // 정기권 내역이 없을 경우
                setPState(0);
                setTotalTime(0);
                setUsedTime(0);
                console.log('정기권 내역이 없습니다.');
            }
        }
    } catch (error) {
        console.log('Error during refresh:', error);
    } finally {
        setRefreshing(false); // 새로고침 완료
    }
};

        

//정기권 구매여부 확인
useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true); 
        try {
            // AsyncStorage에서 logId 가져오기
            let logId = await AsyncStorage.getItem('logId');
            if (logId) {
                // Remove quotes from logId, if present
                logId = logId.replace(/^['"](.*)['"]$/, '$1');
                console.log(logId);

                // logId를 사용하여 사용자 UID 가져오기
                const uidResponse = await fetch(`${BASE_URL}/user/${logId}`);
                const uidData = await uidResponse.json();
                const uid = uidData.uid;
                console.log(uid);

                // uid 로 period_membership pstate 가져오기
                const membershipResponse = await fetch(`${BASE_URL}/membership?uid=${uid}`);
                const membershipData = await membershipResponse.json();
                if (membershipData && membershipData.length > 0) {
                    // 정기권 내역이 있을 경우
                    setPState(membershipData[0].pstate);
                    setTotalTime(membershipData[0].total_time);
                    setUsedTime(membershipData[0].used_time);
                    console.log(pState);
                } else {
                    // 정기권 내역이 없을 경우
                    setPState(0);
                    setTotalTime(0);
                    setUsedTime(0);
                    console.log('정기권 내역이 없습니다.');
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
        setIsLoading(false);
    };

    fetchData();
}, []);

const handleMembershipPress = () => {
    if (pState === 1 && totalTime > usedTime) {
    navigation.navigate(MainScreens.Membership);
    } else {
    navigation.navigate(MainScreens.MembershipPurchase1);
    }
};

const [eventVisible, setEventVisible] = useState(false);
const [revieweventVisible, setReviewEventVisible] = useState(false);
const [firstreservationeventVisible,setFirstReservationEventVisible]=useState(false)



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

return (
    
        <ScrollView style={{backgroundColor:'white'}}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
            <View style={{height: 'auto'}}>
                <View style={{ width: screenWidth, height: screenWidth * 0.5, backgroundColor: 'white', paddingHorizontal: 24 ,marginTop:24}}>
            <ScrollView
                ref={scrollViewRef}
                style={{ width: screenWidth }} 
                horizontal
                pagingEnabled
                onMomentumScrollBegin={() => setIsAutoScroll(false)} // 사용자가 수동으로 슬라이드 시작
                onMomentumScrollEnd={(e) => {
                    const activeIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                    setActiveIndex(activeIndex);
                    setIsAutoScroll(true); // 사용자의 수동 슬라이드 종료 후 자동 슬라이드 재시작
                }}
                showsHorizontalScrollIndicator={false}
            >
                {images.map((image, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        style={{ width: screenWidth, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            // 예제 로직: 인덱스를 3으로 나눈 나머지에 따라 다른 동작을 합니다
                            switch (index % 3) {
                                case 0:
                                    console.log("첫 번째 이미지가 터치되었습니다.", index);
                                        {
                                            setFirstReservationEventVisible(true);
                                        }
                                    break;
                                case 1:
                                    console.log("두 번째 이미지가 터치되었습니다.", index);
                                    setReviewEventVisible(true);
                                    
                                    break;
                                case 2:
                                    console.log("세 번째 이미지가 터치되었습니다.", index);
                                        {
                                            setEventVisible(true);
                                            
                                        }
                                    break;
                            }
                        }}
                   >
                    <Image
                                source={image}
                                style={{ width: screenWidth - 48, height: '100%', borderRadius: 16, marginRight: 48 }}
                            />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {renderIndicator()}
            <ReviewEventComponent
              visible={revieweventVisible}
              onClose={() => setReviewEventVisible(false)}/>
            <FirstReservationEventComponent
              visible={firstreservationeventVisible}
              onClose={() => setFirstReservationEventVisible(false)}/>
            </View> 
        </View>
        <View style={{paddingBottom:40}}>
        <View style={{paddingHorizontal:24,paddingBottom:40}}>
        
            <Text style={styles.subtitle}>공간 이용 서비스</Text>
           
            <Text style={styles.Caption3Black}>온전히 나만의 운동공간을 경험 해보세요.</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <TouchableOpacity style={styles.Box1}
                    onPress={()=>{navigation.navigate(MainScreens.Book)}}>
                
                    <View style={{flex:1,paddingHorizontal:24,paddingVertical:24,justifyContent:'space-between'}}>
                        <Image source={require('../images/barbell.png')} style={styles.ImageIcon}/>
                        <View>
                            <Text style={styles.Body2Black}>일일</Text>
                            <Text style={styles.Body2Black}>이용하기</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Box1}
                    onPress={handleMembershipPress}>
                    <View style={{flex:1,paddingHorizontal:24,paddingVertical:24,justifyContent:'space-between'}}>
                        <Image source={require('../images/membership2.png')} style={styles.ImageIcon}/>
                        <View>
                            <Text style={styles.Body2Black}>정기</Text>
                            <Text style={styles.Body2Black}>이용하기</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.subtitle}>PT 이용 서비스</Text>
                <Text style={styles.Caption3Black}>검증된 전문가에게 안심하고 배우세요.</Text>
                <TouchableOpacity style={styles.Box2}   onPress={()=>{navigation.navigate(MainScreens.PT)}}>
                <View style={{flex:1,paddingHorizontal:24,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <View>
                        <Text style={styles.Caption2}>운동이 처음이시라면?</Text>
                        <Text style={styles.Body2}>PT 이용하기</Text>
                    </View>
                    <AntDesign name="right" size={24} color="#868E96" />
                </View>
            </TouchableOpacity>
            </View>
        </View>
        <View>
            <TouchableOpacity style={{marginTop: 0}} onPress={() => setEventVisible(true)} >
                <Image source={require('../images/Bannerframe.png')} style={{width: screenWidth, height: screenWidth/5,paddingHorizontal:24}}/>
                <View style={{flex:1,position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,flexDirection:'row',paddingHorizontal:24}}>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{color:'white',fontSize:12}}>매월 2만원 이상 할인</Text>
                        <Text style={{color:'white',fontSize:18,fontWeight:'600'}}>짐프라이빗 혜택 모아보기</Text>
                    </View>
                    <Image source={require('../images/3dpriceoff.png')} style={{width:'36%' , height: '80%',marginLeft:'auto',marginTop:'auto'}}/>
                </View>
            </TouchableOpacity>
            <EventComponent
                visible={eventVisible}
                onClose={() => setEventVisible(false)}
            />
        </View>
        <View style={{paddingHorizontal:24}}>
            <Text style={styles.subtitle}>문의사항이 있으신가요?</Text>
            <TouchableOpacity 
            style={styles.Box3}
            onPress={() => {
                const url = 'https://talk.naver.com/ct/w4f4np?frm=mnmb&frm=nmb_detail';
                Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                    Linking.openURL(url);
                    } else {
                    console.log("Can't handle URL: " + url);
                    }
                })
                .catch((err) => console.error('An error occurred', err));
            }}
            >
                <View style={{flex:1,paddingHorizontal:24,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:2}}>
                    <View>
                        <Text style={styles.Caption2Black}>궁금한 점이 있으신가요?</Text>
                        <Text style={styles.Body2Black}>1:1 문의하기를 이용해주세요.</Text>
                    </View>
                    <Image source={require('../images/1:1question.png')} style={{width:40,height:40}}/>    
                </View>
            </TouchableOpacity>
        </View>
        </View>

    </ScrollView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({

indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
dot:{
        height: 8/height,
        width: 8/height,
        borderRadius: 4,
        marginHorizontal: 3,
        marginTop:8
    },
subtitle:{
    fontSize:24,
    fontWeight:'bold',
    marginTop:40
},
Body2:{
    fontSize:18,
    fontWeight:'bold',
    color:'black'
},
Caption2:{
    fontSize:12,
    color:'black'
},
Caption3Black:{
    fontSize:14,
    color:'black',
    marginTop:8
},
Body1Black:{
    fontSize:18,
    fontWeight:'bold',
    color:'#333333'
},
Body2Black:{
    fontSize:18,
    fontWeight:'bold',
    color:'#333333'
},
Body2Primary:{
    fontSize:18,
    fontWeight:'bold',
    color:'#4169E1'
},
Caption2Black:{
    fontSize:12,
    color:'#333333'
},
Box1:{
    width:'47%',
    height:158/height,
    backgroundColor:'#F1F3F5',
    borderRadius:16,
    marginTop:24
},
Box2:{
    width:'100%',
    height:84/height,
    backgroundColor:'#F1F3F5',
    borderRadius:16,
    marginTop:24
},
Box3:{
    width:'100%',
    height:102/height,
    backgroundColor:'#F1F3F5',
    borderRadius:16,
    marginTop:24,
},
ImageIcon:{
    width:36/height,
    height:36/height
}

});

