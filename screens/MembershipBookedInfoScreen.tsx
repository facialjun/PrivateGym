import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions,Image,TextInput, Alert,TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {  MainScreens, MembershipScreens, MembershipStackParamList } from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'
import { height } from './HomeScreen';


const BASE_URL = config.SERVER_URL;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type MembershipScreenNavigationProps = StackNavigationProp<
    MembershipStackParamList,
    MembershipScreens.MembershipBookedInfo,
    MainScreens.MyReservation
>;

interface MembershipScreenProps {
    route: RouteProp<MembershipStackParamList, 'MembershipBookedInfo'>;
    navigation: MembershipScreenNavigationProps;
}

const MembershipBookedInfoScreen: React.FunctionComponent<MembershipScreenProps> = ({navigation,route}) => {
    const roomImages = {
        1: require('../images/rooms1.jpg'),
        2: require('../images/rooms2.jpg'),
        3: require('../images/rooms3.jpeg'),
    };
    const now = new Date();
    const timestamp = now.getTime(); // 밀리초 단위 타임스탬프
    const milliseconds = now.getMilliseconds(); // 현재 밀리초
    const merchantUid = `mid_${timestamp}_${milliseconds}`;
    const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    

    useEffect(() => {
        const fetchSelectedRoomNumber = async () => {
        try {
            const roomNumber = await AsyncStorage.getItem('selectedRoomNumber');
            setSelectedRoomNumber(roomNumber);
        } catch (error) {
            console.log('Error fetching selected room number from AsyncStorage:', error);
        }
        };

        fetchSelectedRoomNumber();
    }, []);
    
    useEffect(() => {
        const fetchSelectedDate = async () => {
        try {
            const savedDate = await AsyncStorage.getItem('selectedDateSlot');
            setSelectedDate(savedDate || '');
        } catch (error) {
            console.error('Failed to fetch selected date:', error);
        }
        };

        fetchSelectedDate();
    }, []);


    const {
        selectedUsingTimeSlot,
        isMorning,
        isEvening,
        selectedDayTimeSlot,
        selectedNightTimeSlot,
        selectedEndTime,
    } = route.params;


    const [logId, setLogId] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
        
        try {
            // Fetch logId from AsyncStorage
            let fetchedLogId = await AsyncStorage.getItem('logId');
            if (fetchedLogId) {
                // Remove quotes if present
                fetchedLogId = fetchedLogId.replace(/^['"](.*)['"]$/, '$1');
                console.log(fetchedLogId);
                setLogId(fetchedLogId); // Update the logId state
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    fetchData();
}, []);



const handleSubmit = async () => {
    try {
        let startTime, endTime;
        if (isMorning && selectedDayTimeSlot) {
            startTime = selectedDayTimeSlot;
            endTime = selectedEndTime;
        } else if (isEvening && selectedNightTimeSlot) {
            startTime = selectedNightTimeSlot;
            endTime = selectedEndTime === '24:00' ? '23:59' : selectedEndTime; // 24:00이면 23:59로 변경
        } else {
            return; // Handle the case when the time slot is not selected properly
        }

        //used_time + 예약시간 < total_time인지 로그아이디로 조회: 잔여시간에 따른 예약 제한
        const uidResponse = await fetch(`${BASE_URL}/user?logid=${logId}`);
        const uidData = await uidResponse.json();
        const uid = uidData.uid;
        
        const periodMembershipResponse = await fetch(`${BASE_URL}/Myperiodmembership?uid=${uid}&pstate=1`);
        if (!periodMembershipResponse.ok) {
            throw new Error('멤버쉽 정보를 가져오는 데 문제가 발생했습니다.');
        }
        const periodMembershipData = await periodMembershipResponse.json();
        console.log(periodMembershipData)
        // 데이터가 로드되지 않은 경우 예외 처리: membership status가 0이되었는데 추가로 예약 잡아서 들어온 경우
        if (!periodMembershipData || periodMembershipData.length === 0) {
            Alert.alert('잔여시간이 부족합니다.');
            navigation.navigate(MainScreens.MyReservation)
        }

        const { total_time, used_time } = periodMembershipData[0];
        let minutes = parseInt(selectedUsingTimeSlot.replace(/[^0-9]/g, ''), 10); // 분 단위 숫자 추출
        const bookingTimeInHours = minutes / 60;  // 분을 시간으로 변경
        console.log(bookingTimeInHours)
    
        if (used_time + bookingTimeInHours > total_time) {
            Alert.alert('잔여 시간이 부족합니다.', `잔여시간: ${total_time - used_time}시간`);
            return;
        }

    const response = await axios.post(`${BASE_URL}/reservation`, {
        room: selectedRoomNumber,
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        usingTime: selectedUsingTimeSlot,
        logId: logId,
        amount:0,
        merchantUid:merchantUid,
    });
        console.log(response.data);
        console.log('success');
        Alert.alert(
            '예약완료', 
            '예약이 완료되었습니다! 추가로 예약하시겠습니까?',
            [
                { text: '아니오', onPress: () => navigation.navigate(MainScreens.MyReservation) },
                { 
                    text: '예', 
                    onPress: () => {
                        if (used_time + bookingTimeInHours >= total_time) {
                            Alert.alert('잔여시간이 부족합니다.');
                            navigation.navigate(MainScreens.MyReservation);
                        } else {
                            navigation.navigate(MembershipScreens.MembershipRoomSelect);
                        }
                    }
                }
                
            ],
            { cancelable: false }
        );
        } catch (error) {
        console.error(error);
    }
    // navigation.navigate(MainScreens.MyReservation);
};
    
return (
    <>     
        <View style={{flex:1}}>
        <View style={{paddingHorizontal:24,backgroundColor:'white',paddingBottom:24}}>
            <Text style={styles.subtitle}>예약정보</Text>
            <View style={{flexDirection:'row',marginTop:24}}>
                <Image
                    style={styles.image}
                    source={roomImages[selectedRoomNumber]}
                />
                <View style={{marginLeft:24}}>
                <Text style={styles.caption1gray}>방 번호 : {selectedRoomNumber}</Text> 
                <Text style={styles.caption1gray}>사용날짜 :  {selectedDate}</Text>
                <Text style={styles.caption1gray}>
                    사용시간 : {' '}
                    {isMorning 
                    ? `${selectedDayTimeSlot} - ${selectedEndTime}`
                    : isEvening 
                    ? `${selectedNightTimeSlot} - ${selectedEndTime}`
                    : null}
                </Text>
            </View>
            </View>
        </View>
        </View>
        <View style={{backgroundColor:'transparent'}}>
            <TouchableOpacity
            style={{
                backgroundColor: '#4169E1',
                padding: 15,
                marginHorizontal: 16,
                borderRadius: 20,
                alignItems: 'center',
                marginBottom:30
            }}
            onPress={handleSubmit}
            //   disabled={!name}
            >
            
            <Text
                style={{
                color:'white',
                fontSize: 20,
                fontWeight: 'bold',
                }}
            >
                예약하기
            </Text>
            </TouchableOpacity>
        </View>
    </>     
    );
    };

export default MembershipBookedInfoScreen;

const styles = StyleSheet.create({
    
    subtitle:{
        fontSize:24,
        color:'black',
        fontWeight:'bold',
        marginTop:36
    },
    image:{
        width: 120/height,
        height: 112/height,
        borderRadius:8,
    },
    caption1gray:{
        fontSize:18,
        fontWeight:'600',
        color:'#868E96',
        marginTop:8/height
    }
  });