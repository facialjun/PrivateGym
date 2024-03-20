import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions, ScrollView, Image,RefreshControl,StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { HistoryScreens, HistoryStackParamList, MainScreens } from '../stacks/Navigator';
import moment from 'moment';
import config from '../config'
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = config.SERVER_URL;


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

// 그림자 효과를 위한 스타일 객체 생성
const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    android: {
        elevation: 5,
    },
});

type BookingHistoryNavigationProps = StackNavigationProp<
    HistoryStackParamList,
    HistoryScreens.History
>;

interface BookingHistoryScreenProps {
    navigation: BookingHistoryNavigationProps;
}

const BookingHistory: React.FunctionComponent<BookingHistoryScreenProps> = (props) => {
    const { navigation } = props;
    const [reservations, setReservations] = useState([]);
    const [AllReservation, setAllReservation] = useState(null);
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showTodayOnly, setShowTodayOnly] = useState(false);
    const [filter, setFilter] = useState('all'); 

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const logId = await AsyncStorage.getItem('logId');
            if (logId) {
                const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
                const response = await axios.get(`${BASE_URL}/reservationHistory/${formattedLogId}`);
                let sortedReservations = response.data.sort((a, b) => {
                    const dateA = moment(a.date_of_use + ' ' + a.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                    const dateB = moment(b.date_of_use + ' ' + b.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                    return dateA.diff(dateB);
                });
                if (filter === 'today') {
                    sortedReservations = sortedReservations.filter(reservation => moment(reservation.date_of_use).isSame(moment(), 'day'));
                }
                setReservations(sortedReservations);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setRefreshing(false);
        }
    };

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
    }, []);



//     useEffect(() => {
//     const fetchAllReservation = async () => {
//         try {
//             // AsyncStorage에서 로그인된 사용자의 logId 가져오기
//             const logId = await AsyncStorage.getItem('logId');

            
//             if (logId) {
//             const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
//             axios
//                 .get(`${BASE_URL}/user/${formattedLogId}`)
//                 .then((response) => {
//                 setAllReservation(response.data);
//                 })
//                 .catch((error) => {
//                 console.error(error);
//                 });
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     fetchAllReservation();
// }, []);

useEffect(() => {
    fetchReservations();
}, [filter]);

const fetchReservations = async () => {
    setRefreshing(true);
    try {
        const logId = await AsyncStorage.getItem('logId');
        if (logId) {
            const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
            const response = await axios.get(`${BASE_URL}/reservationHistory/${formattedLogId}`);
            let sortedReservations = response.data.sort((a, b) => {
                const dateA = moment(a.date_of_use + ' ' + a.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                const dateB = moment(b.date_of_use + ' ' + b.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                return dateA.diff(dateB);
            });
            if (filter === 'today') {
                sortedReservations = sortedReservations.filter(reservation => moment(reservation.date_of_use).isSame(moment(), 'day'));
            }
            setReservations(sortedReservations);
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
    } finally {
        setRefreshing(false);
    }
};

const cancelPay = (reservation) => {
        const cancelUrl = `${BASE_URL}/payments/cancel`; // Replace with the actual URL
        const requestData = {
        merchant_uid: reservation.merchant_uid,
        cancel_request_amount: "", 
        reason: "주문 오류", 
        };
    
        console.log('Cancellation Request Data:', requestData);
    
        axios({
        url: cancelUrl,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: requestData,
        })
        .then((response) => {
            // Handle success response
            console.log("Cancellation request successful", response);
            alert("예약이 취소되었습니다.");
        })
        .catch((error) => {
            // Handle error response
            console.error("Error cancelling payment", error);
        });
};

const cancelReservation = async (reservation) => {
  try {
    const merchant_uid = reservation.merchant_uid; 
    console.log(merchant_uid)
    const apiUrl = `${BASE_URL}/delete_reservation/${merchant_uid}`;
    const response = await axios.post(apiUrl);
    console.log(response.data);
    alert("예약이 취소되었습니다.");
    navigation.navigate(MainScreens.MyReservation)
  } catch (error) {
    console.error("에러:", error);
  }
};

const handleCancellation = (reservation) => {
  if (reservation.amount === 0) {
    // reservation.amount가 0이면 예약 취소 함수를 실행합니다.
    cancelReservation(reservation);
  } else {
    // 그렇지 않으면 결제 취소 함수를 실행합니다.
    cancelPay(reservation);
  }
};

const roomImages = {
    1: require('../images/rooms1.jpg'),
    2: require('../images/rooms2.jpg'),
    3: require('../images/rooms3.jpeg'),
    // 이하 생략, 필요한 모든 방 번호에 대해 반복
  };


const filteredReservations = showTodayOnly
    ? reservations.filter(reservation => moment(reservation.date_of_use).isSame(moment(), 'day'))
    : reservations;

    return (
        <View style={styles.container}>
             <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, filter === 'all' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() => setFilter('all')}>
                    <Text style={[styles.buttonText, filter === 'all' ? styles.buttonTextActive : styles.buttonTextinActive]}>전체</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, filter === 'today' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() => setFilter('today')}>
                    <Text style={[styles.buttonText,filter === 'today' ? styles.buttonTextActive : styles.buttonTextinActive]}>오늘이용</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
            {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => {
                    if (
                        reservation.merchant_uid !== null &&
                        reservation.rid !== null &&
                        reservation.room_number !== null &&
                        reservation.time_of_use !== null &&
                        reservation.date_of_use !== null
                        ){
                            const [startTime, endTime] = reservation.time_of_use.split('-');
                            const startDateTime = moment(reservation.date_of_use).format('YYYY-MM-DD') + ' ' + startTime;
                            const endDateTime = moment(reservation.date_of_use).format('YYYY-MM-DD') + ' ' + endTime;
                            const isBeforeNow = moment().isBefore(endDateTime);
        
                            return (
                                <View key={reservation.rid}>
                                <View style={{ alignItems: 'center', width: screenWidth, height: screenWidth * 0.75, justifyContent: 'center' }}>
                                <View style={{ width: '90%', height: screenWidth * 0.63, ...shadowStyle, backgroundColor: 'white', borderRadius: 15 }}>
                                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: '6%' }}>
                                        <Text style={{ color: '#C2C2C2', fontSize: 13 }}>대관 예약번호   {reservation.merchant_uid}</Text>
                                        <TouchableOpacity
                                        disabled={!isBeforeNow}
                                        style={{ marginLeft: 'auto',opacity: isBeforeNow ? 1 : 0.2,  }}
                                        onPress={() => handleCancellation(reservation)}><Text style={{ fontSize: 13, color: '#EB0D0D' }}>예약취소</Text>
                                        </TouchableOpacity>
                                    </View>
                
                                    <View style={{ flex: 3, flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
                                        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
                                        <Image
                                            style={{
                                            width: '75%',
                                            height: '85%',
                                            marginLeft: '10%',
                                            borderRadius: 8,
                                            }}
                                            source={roomImages[reservation.room_number]} />
                                    </View>
                                    <View style={{ marginLeft: 'auto', flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, color: '#4F4F4F', fontWeight: 'bold' }}>
                                            짐프라이빗 대관
                                        </Text>
                                        <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>방 번호 : {reservation.room_number}</Text>
                
                                        <View style={{ marginTop: '20%' }}>
                                            <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>사용날짜 : {moment(reservation.date_of_use).format('YYYY-MM-DD')}</Text>
                                            <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>
                                            사용시간 : {reservation.time_of_use}
                                            </Text>
                                        </View>
                                        </View>
                                    </View>
                
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1.1, backgroundColor: 'white', borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}>
                                        <TouchableOpacity
                                        style={{
                                            backgroundColor: reservation.rvid !== null || isBeforeNow ? 'lightgray' : '#1E90FF',
                                            width: '90%',
                                            height: '65%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                        }}
                                        onPress={() => {
                                            if (reservation.rvid === null) {
                                            navigation.navigate(HistoryScreens.Review, {
                                                room_number: reservation.room_number,
                                                date_of_use: reservation.date_of_use,
                                                time_of_use: reservation.time_of_use,
                                                merchant_uid: reservation.merchant_uid,
                                            });
                                            }
                                        }}
                                        disabled={reservation.rvid !== null || isBeforeNow }
                                        >
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>
                                            {reservation.rvid !== null ? '후기 작성 완료' : '후기 작성하기'}
                                        </Text>
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                </View>
                                </View>   
                            );
                        }
                    })
            ) : (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:24}}>예약 내역이 없습니다.</Text>
                </View>
                )}
            </ScrollView>
        </View>
    );
};


export default BookingHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        height:60,
        paddingHorizontal:24,
        backgroundColor:'white',
        alignItems:'center'
    },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 16,
        marginHorizontal: 10,
        height:30,
        width:90,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonActive: {
        backgroundColor: 'blue',
        borderColor: '#4169E1',
    },
    buttonInactive: {
        backgroundColor: 'transparent',
        borderColor:'#DEE2E6'
    },
    buttonText: {
        color: '#868E96',
    }
    ,
    buttonTextActive:{
        color:'white',
        fontWeight:'bold'
    },
    buttonTextinActive:{
        color:'#868E96'
    }
});