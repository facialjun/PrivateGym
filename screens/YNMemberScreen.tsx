import React,{useState,useEffect} from 'react'
import { View, Text, Dimensions, Platform, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList,MainScreens } from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import config from '../config'

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const BASE_URL = config.SERVER_URL;


const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    android: {
        elevation: 6,
    },
})


//////////////////////////////////////////////////////////////// 코드 타입정의

type YNMemberScreenNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
    'Home' | 'Book' | 'Membership' | 'MembershipPurchase1' | 'PT'
>;

interface YNMemberScreenProps {
    route: RouteProp<MainStackParamList, 'YNMember'>;
    navigation: YNMemberScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};


//////////////////////////////////////////////////////////////// 

const YNMemberScreen: React.FunctionComponent<YNMemberScreenProps> = ({navigation}) => {

        const [selectedImage, setSelectedImage] = useState(null);
        const [pState, setPState] = useState(0);
        const [totalTime, setTotalTime] = useState(0);
        const [usedTime, setUsedTime] = useState(0);
        const [userData, setUserData] = useState(null);
        const [logId, setLogId] = useState(null);

        useEffect(() => {
            const fetchData = async () => {
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

                        // uid 로 peirod_membership 가져오기
                        const membershipResponse = await fetch(`${BASE_URL}/membership?uid=${uid}`);
                        const membershipData = await membershipResponse.json();
                        setPState(membershipData[0].pstate);
                        setTotalTime(membershipData[0].total_time);
                        setUsedTime(membershipData[0].used_time);
                     
                                
                    }
                } catch (error) {
                    console.log('Error:', error);
                }
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

    return (
        <View style={{width:screenWidth,height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'white',flexDirection:'column'}}>
            <View style={{width:screenWidth*0.9,height:screenHeight*0.3,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                        style={styles.ReservationContainer}
                        onPress={()=>{navigation.navigate(MainScreens.Book)}}>
                                    <Image
                                        source={require('../images/credit-card.gif')}
                                        style={{width:'34%',height:'39%',marginBottom:'3%'}}
                                    />
                
                            <View style={{flexDirection:'row',paddingHorizontal:'8%'}}>
                                <View style={{backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                                    <View ><Text style={styles.gray}>비회원으로 이용하시나요?</Text></View>
                                    <View style={{marginTop:'4%'}}><Text style={styles.black}>1일 예약하기</Text></View>
                                </View>
                                <View style={{backgroundColor:'white',justifyContent:'center',left:'14%'}}>
                                <AntDesign name="right" size={15} color="#131515"  />
                                </View>
                            </View>

                </TouchableOpacity>
            </View>
            
            <View style={{backgroundColor:'white',width:screenWidth*0.9,height:screenHeight*0.3,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                        style={styles.ReservationContainer}
                        onPress={handleMembershipPress}>
                            
                                    <Image
                                        source={require('../images/id-card.png')}
                                        style={{width:'22%',height:'36%',marginBottom:'3%'}}
                                    />

                            <View style={{flexDirection:'row',paddingHorizontal:'8%'}}>
                                
                                <View style={{backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                                    <View ><Text style={styles.gray}>회원권으로 더 저렴하게!</Text></View>
                                    <View style={{marginTop:'4%'}}><Text style={styles.black}>회원권 이용하기</Text></View>
                                </View>
                                <View style={{backgroundColor:'white',justifyContent:'center',left:'14%'}}>
                                    <AntDesign name="right" size={15} color="#131515" />
                                </View>
                            </View>

                </TouchableOpacity>
            </View>

                
        </View>
    )
}

export default YNMemberScreen

const styles = StyleSheet.create({

    ReservationContainer: {
    ...shadowStyle,
    height: '75%',
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent:'center',
    alignItems:'center'
},

gray:{
    fontSize:11,
    color: 'gray',
    fontWeight:'500'
},

black:{
    fontSize:17,
    color:'black',
    fontWeight:'bold'
},

serviceTitle:{
    left:'7%',
    fontSize: 21,
    fontWeight: 'bold',
    
},
})