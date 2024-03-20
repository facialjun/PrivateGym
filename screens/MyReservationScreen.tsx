import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions, ScrollView, Image,RefreshControl,StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList, MainScreens } from '../stacks/Navigator';
import moment from 'moment';
import config from '../config'
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import CalendarComponent from '../assets/component/calendar';
import AntDesign from 'react-native-vector-icons/AntDesign';


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

type MyReservationScreenyNavigationProps = StackNavigationProp<
    MainStackParamList,
    MainScreens.MyReservation
>;

interface MyReservationScreenProps {
    navigation: MyReservationScreenyNavigationProps
}

const MyReservationScreen: React.FunctionComponent<MyReservationScreenProps> = (props) => {
    const { navigation } = props;
    const [reservations, setReservations] = useState([]);
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [allReservations, setAllReservations] = useState([]);
    const [todayReservations, setTodayReservations] = useState([]);
    const [CompleteReservations, setCompleteReservations] = useState([]);
    const [filter, setFilter] = useState('today'); 
    const [isLoading, setIsLoading] = useState(true);
    const [filterreservation,setFilteredReservations]= useState([])
    

    useEffect(() => {
        console.log("all:",allReservations);
        console.log(todayReservations);
        console.log("cR :",CompleteReservations);
    }, []);
    
    ///userdata로 헤더 바꾸기
    useLayoutEffect(() => {
        navigation.setOptions({
        
            headerTitle: userData ? `${userData.username}님의 예약` : '예약 내역',
            // 헤더 스타일 설정이나 오른쪽 버튼 추가 등의 추가적인 설정이 필요하다면 여기에 추가
        });2
    }, [navigation, userData]);

    useEffect(() => {
        fetchReservations();
    }, [filter]);

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true); // 로딩 시작
            fetchReservations() // 예약 데이터를 새로고침하는 함수 호출
                .catch(console.error) // 에러 처리
                .finally(() => setIsLoading(false)); // 로딩 종료


            // 시작 날짜와 종료 날짜를 오늘 날짜로 설정
            setStartDate(moment().format('YYYY-MM-DD'));
            setEndDate('');

            // 필터를 'today'로 설정
            setFilter('today');
            }, [])
    );


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const logId = await AsyncStorage.getItem('logId');
            if (logId) {
                const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
                const response = await axios.get(`${BASE_URL}/reservationHistory/${formattedLogId}`);
                let fetchedReservations = response.data
                    // 우선 데이터 정렬
                    .sort((a, b) => {
                        const dateA = moment(a.date_of_use + ' ' + a.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                        const dateB = moment(b.date_of_use + ' ' + b.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                        return dateA.diff(dateB);
                    })
                    // 유효성 검사를 통과한 데이터만 필터링
                    .filter(reservation => reservation.date_of_use && reservation.time_of_use);
    
                // 유효한 데이터만 상태에 저장
                setAllReservations(fetchedReservations);
    
                const now = moment();
                let todayReservations = fetchedReservations.filter(reservation => {
                    const endDate = moment(reservation.date_of_use);
                    const endTimeMoment = moment(`${reservation.date_of_use.split('T')[0]} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                    return endDate.isSame(now, 'day') && endTimeMoment.isAfter(now);
                });
    
                let completedReservations = fetchedReservations.filter(reservation => {
                    const endDate = moment(reservation.date_of_use);
                    const endTimeMoment = moment(`${reservation.date_of_use.split('T')[0]} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                    return endDate.isBefore(now, 'day') || (endDate.isSame(now, 'day') && endTimeMoment.isBefore(now));
                });
    
                // 상태 업데이트
                setTodayReservations(todayReservations);
                setCompleteReservations(completedReservations);
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

    useEffect(() => {
        fetchReservations();
    }, [filter]);

    

    const fetchReservations = async () => {
    setIsLoading(true);
        try {
        const logId = await AsyncStorage.getItem('logId');
        if (logId) {
            const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
            const response = await axios.get(`${BASE_URL}/reservationHistory/${formattedLogId}`);
            let fetchedReservations = response.data
                .sort((a, b) => {
                    const dateA = moment(a.date_of_use + ' ' + a.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                    const dateB = moment(b.date_of_use + ' ' + b.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                    return dateA.diff(dateB);
                })
                .filter(reservation => reservation.date_of_use && reservation.time_of_use);

                // 후기 작성이 완료되지 않은 예약만 필터링
            // fetchedReservations = fetchedReservations.filter(reservation => reservation.rvid === null);

            const now = moment();
            let filteredReservations;

            let todayReservations = fetchedReservations.filter(reservation => {
                const endDate = moment(reservation.date_of_use, 'YYYY-MM-DD');
                const startTime = moment(`${reservation.date_of_use} ${reservation.time_of_use.split('-')[0]}`, 'YYYY-MM-DD HH:mm');
                const endTime = moment(`${reservation.date_of_use} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                // endDate가 오늘과 같고, endTime이 현재 시간 이후인 예약만 포함
                return endDate.isSame(now, 'day') && endTime.isAfter(now) && startTime.isAfter(now);
            });

            let completeReservations = fetchedReservations.filter(reservation => {
                const endDate = moment(reservation.date_of_use, 'YYYY-MM-DD');
                const endTime = moment(`${reservation.date_of_use} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                // endDate가 오늘과 같고, endTime이 현재 시간 이전인 예약만 포함
                return endDate.isSame(now, 'day') && endTime.isBefore(now);
            });
            

            // 조건 1: startDate만 있고, endDate 없으며, startDate가 오늘 이후인 경우
            if (startDate && !endDate && moment(startDate).isAfter(now, 'day')) {
                setFilter('all');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isSame(moment(startDate), 'day'));
            }
            // 조건 2: startDate만 있고, endDate 없으며, startDate가 오늘 이전인 경우
            else if (startDate && !endDate && moment(startDate).isBefore(now, 'day')) {
                setFilter('complete');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isSame(moment(startDate), 'day'));
            }
            // 조건 3: startDate만 있고, endDate 없으며, startDate가 오늘과 같은 경우
            else if (startDate && !endDate && moment(startDate).isSame(now, 'day')) {
                setFilter('today');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isSame(now, 'day'));
            }
            // 조건 4: startDate와 endDate 모두 있고, 둘 다 오늘 이전인 경우
            else if (startDate && endDate && moment(startDate).isBefore(now, 'day') && moment(endDate).isBefore(now, 'day')) {
                setFilter('complete');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isBetween(moment(startDate), moment(endDate), 'day', '[]'));
            }
            // 조건 5: startDate와 endDate 모두 있고, 둘 다 오늘 이후인 경우
            else if (startDate && endDate && moment(startDate).isAfter(now, 'day') && moment(endDate).isAfter(now, 'day')) {
                setFilter('all');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isBetween(moment(startDate), moment(endDate), 'day', '[]'));
            }
            // 조건 6: startDate는 오늘 이전이고, endDate는 오늘 이후인 경우
            else if (startDate && endDate && moment(startDate).isBefore(now, 'day') && moment(endDate).isAfter(now, 'day')) {
                setFilter('all');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isBetween(moment(startDate), moment(endDate), 'day', '[]'));
            }
            // 조건 7: startDate가 오늘과 같고, endDate가 오늘 이후인 경우
            else if (startDate && endDate && moment(startDate).isSame(now, 'day') && moment(endDate).isAfter(now, 'day')) {
                setFilter('all');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isBetween(moment(startDate), moment(endDate), 'day', '[]'));
            }
            // 조건 8: startDate가 오늘 이전이고, endDate가 오늘인 경우
            else if (startDate && endDate && moment(startDate).isBefore(now, 'day') && moment(endDate).isSame(now, 'day')) {
                setFilter('complete');
                filteredReservations = fetchedReservations.filter(reservation =>
                    moment(reservation.date_of_use).isBetween(moment(startDate), moment(endDate), 'day', '[]'));
            }
            else {
                // 기본적으로 모든 예약을 보여줍니다. 이 부분은 필요에 따라 조정하십시오.
                filteredReservations = fetchedReservations;
            }



            // 필터링된 예약을 상태에 설정
            setReservations(filteredReservations);
            setTodayReservations(todayReservations);
            setCompleteReservations(completeReservations);
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
    } finally {
        setIsLoading(false);
    }
};




    //예약 달력별 필터
    useEffect(() => {
        // 선택된 날짜 범위 내의 예약만 필터링
        const filteredReservations = allReservations.filter(reservation => {
            const reservationDate = moment(reservation.date_of_use);
            return reservationDate.isBetween(startDate, endDate, 'days', '[]');
        });

        // 필터링된 예약을 상태에 저장 또는 사용
        setReservations(filteredReservations);
        }, [startDate, endDate, allReservations]);

    //필터가 바뀔때 마다 정확하게 적용되도록 코드 추가 
    useEffect(() => {
        let filteredReservations = [];
        const todayDate = moment().format('YYYY-MM-DD'); // 오늘 날짜
        // 'today' 필터가 선택되었고, startDate 또는 endDate가 오늘 날짜가 아닌 경우
        

        switch (filter) {
            case 'all':
                filteredReservations = allReservations.filter(reservation => {
                        const reservationDate = moment(reservation.date_of_use, "YYYY-MM-DD");
                        return reservationDate.isBetween(startDate, endDate, null, '[]');
                    });
                    break;
            case 'today':
                setReservations(todayReservations);
                break;
            case 'complete':
                filteredReservations = allReservations.filter(reservation => {
                    const reservationDate = moment(reservation.date_of_use, "YYYY-MM-DD");
                  // 'complete' 상태이면서 선택된 날짜 범위 내의 예약만 필터링
                return reservation.status === 'complete' && reservationDate.isBetween(startDate, endDate, null, '[]');
                });
                break;
            default:
                setReservations(allReservations);
        }
    }, [filter, allReservations, todayReservations, CompleteReservations]);

    // useEffect(()=>{
    //     console.log("todayReservation:",todayReservations)
    // })

const cancelReservation = async (reservation) => {
    try {
        const merchant_uid = reservation.merchant_uid; 
        console.log(merchant_uid);
        const apiUrl = `${BASE_URL}/delete_reservation/${merchant_uid}`;
        const response = await axios.post(apiUrl);
        console.log(response.data);

        // 예약 취소 후 Alert 표시
        Alert.alert("예약 취소", "예약이 취소되었습니다.", [
            { text: "확인", onPress: () => fetchReservations() }
        ]);
    } catch (error) {
        console.error("에러:", error);
        Alert.alert("오류", "예약 취소 중 오류가 발생했습니다.");
    }
};

const cancelPay = async (reservation) => {
    const cancelUrl = `${BASE_URL}/payments/cancel`;
    const requestData = {
        merchant_uid: reservation.merchant_uid,
        cancel_request_amount: "", 
        reason: "주문 오류", 
    };

    try {
        const response = await axios.post(cancelUrl, requestData);
        console.log(response)
        console.log("Cancellation request successful", response.data);

        // 결제 취소 후 Alert 표시
        Alert.alert("결제 취소", "예약이 취소되었습니다.", [
            { text: "확인", onPress: () => fetchReservations() }
        ]);
    } catch (error) {
        console.error("Error cancelling payment", error);
        Alert.alert("오류", "결제 취소 중 오류가 발생했습니다.");
    }
};


const handleCancellation = (reservation) => {
    if (reservation.amount === 0) {
        // 예약 취소 함수 실행
        cancelReservation(reservation);
    } else {
        // 결제 취소 함수 실행
        cancelPay(reservation);
    }
};


const roomImages = {
    1: require('../images/rooms1.jpg'),
    2: require('../images/rooms2.jpg'),
    3: require('../images/rooms3.jpeg'),
    // 이하 생략, 필요한 모든 방 번호에 대해 반복222
};

const [isCalendarVisible, setCalendarVisible] = useState(false);
const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
const [endDate, setEndDate] = useState('');



const handleSelectDates = (start, end) => {
    const now = moment();
    const startDate = moment(start);
    const endDate = moment(end);

    setStartDate(start);
    setEndDate(end);
    setCalendarVisible(false); // 날짜 선택 후 모달 닫기

    // 조건 1: 시작날짜와 종료날짜가 오늘 이전일 경우
    if (startDate.isBefore(now, 'day') && endDate.isBefore(now, 'day')) {
        setFilter('complete');
    }
    // 조건 2: 시작날짜가 오늘 이전이고 종료날짜가 오늘 이후일 경우
    else if (startDate.isBefore(now, 'day') && endDate.isAfter(now, 'day')) {
        setFilter('all');
    }
    // 조건 3: 시작날짜가 오늘이고 종료날짜가 오늘 이후일 경우
    else if (startDate.isSame(now, 'day') && endDate.isAfter(now, 'day')) {
        setFilter('all');
    }
    // 조건 4: 시작날짜와 종료날짜가 오늘 이후일 경우
    else if (startDate.isAfter(now, 'day') && endDate.isAfter(now, 'day')) {
        setFilter('all');
    }
    // 조건 5: 시작날짜가 오늘일 경우
    else if (startDate.isSame(now, 'day')) {
        setFilter('today');
    }
    // 조건 6: 시작날짜가 오늘 이전이고 종료날짜가 오늘일 경우
    else if (startDate.isBefore(now, 'day') && endDate.isSame(now, 'day')) {
        setFilter('all');
    }
    // 조건 7: 시작날짜가 오늘 이전일 경우
    else if (startDate.isBefore(now, 'day')) {
        setFilter('complete');
    }
    else {
        // 예외 상황에 대한 처리
        setFilter('all');
    }
};

//달력기능을 이용해서 전체 예약을 주단위로 필터시키는 함수
useEffect(() => {
    const filteredReservations = allReservations.filter(reservation => {
        const reservationDate = moment(reservation.date_of_use, "YYYY-MM-DD");
        // isBetween의 마지막 인자 '[]'는 포함 관계를 나타냅니다. 즉, 시작일과 종료일도 포함하여 비교합니다.
        return reservationDate.isBetween(startDate, endDate, null, '[]');
    });

    setReservations(filteredReservations);
    console.log(startDate)
    }, [startDate, endDate, allReservations]);

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


const handleTodayUsePress = () => {
    // const todayDate = moment().format('YYYY-MM-DD');
        setStartDate(moment().format('YYYY-MM-DD')); // 시작 날짜를 오늘 날짜로 설정
        setEndDate(''); // 종료 날짜도 오늘 날짜로 설정
        setCalendarVisible(false);
    };

    const handlealldayUsePress = () => {
        const todayDate = moment().add(-7, 'days').format('YYYY-MM-DD');
        const endDate = moment().add(7, 'days').format('YYYY-MM-DD');
        setStartDate(todayDate); // 시작 날짜를 오늘 날짜로 설정
        setEndDate(endDate); // 종료 날짜도 오늘 날짜로 설정
    };


    const handleacompleteUsePress = () => {

        const firstDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        setStartDate(firstDate); // 시작 날짜를 오늘 날짜로 설정
        setEndDate(endDate); // 종료 날짜도 오늘 날짜로 설정
    };

const showChangeReservationAlert = (reservation) => {
    const processCancellationAndNavigate = async (navigateTo) => {
        try {
            if (reservation.amount !== 0) {
                // 유료 예약의 경우 결제 취소 로직 실행
                const cancelConfirmed = await showPaymentCancellationAlert(reservation);
                if (!cancelConfirmed) return; // 결제 취소를 취소한 경우 함수 종료
                await cancelPay(reservation); // 결제 취소 함수 호출
                navigation.navigate(navigateTo); 
                console.log("결제 취소 성공");
            } else {
                // 무료 예약의 경우, 예약 삭제 로직 실행
                const apiUrl = `${BASE_URL}/delete_reservation/${reservation.merchant_uid}`;
                const deleteResponse = await axios.delete(apiUrl);
                if (deleteResponse.status === 200) {
                    console.log("예약 삭제 성공");
                    navigation.navigate(navigateTo); // 지정된 페이지로 네비게이션
                } else {
                    throw new Error("예약 삭제 실패");
                }
            }
        } catch (error) {
            console.error("처리 중 오류 발생:", error);
            Alert.alert("오류", "처리 중 오류가 발생했습니다.");
        }
    };

    Alert.alert(
        "예약 변경",
        "예약을 변경하시겠어요?",
        [
            { text: "아니오", style: "cancel" },
            { text: "예", onPress: () => {
                if (reservation.amount === 0) {
                    // 무료 예약의 경우 예약 삭제 후 Membership 페이지로 이동
                    processCancellationAndNavigate(MainScreens.Membership);
                } else {
                    // 유료 예약의 경우 결제 취소 확인 알림 표시
                    processCancellationAndNavigate(MainScreens.Book);
                }
            }}
        ]
    );
};

const showPaymentCancellationAlert = (reservation) => {
    return new Promise((resolve) => {
        Alert.alert(
            "결제 취소 확인",
            `결제하신 금액 ${reservation.amount}원이 취소됩니다. 결제를 취소하시겠어요?`,
            [
                { text: "아니오", style: "cancel", onPress: () => resolve(false) },
                { text: "예", onPress: () => resolve(true) }
            ]
        );
    });
};



    return (
        <View style={styles.container}>
        <View style={{ height: 48, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <TouchableOpacity style={{flex:1,backgroundColor:'white',justifyContent:'center'}}onPress={() => setCalendarVisible(true)}>
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{ fontSize: 16, fontWeight: '500', color:'black' }}>
            {endDate ? `${startDate} - ${endDate}` : startDate}
        </Text>
        <AntDesign name="caretdown" size={12} color="black" style={{marginLeft:4}} /> 
        </View>
        </TouchableOpacity>
            <CalendarComponent
                visible={isCalendarVisible}
                onClose={() => setCalendarVisible(false)}
                onSelect={handleSelectDates}
                startDate={startDate}
                endDate={endDate}
            />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, filter === 'all' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() =>  {
                        handlealldayUsePress()
                        setFilter('all')  
                    }}>
                    <Text style={[styles.buttonText, filter === 'all' ? styles.buttonTextActive : styles.buttonTextinActive]}>전체</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, filter === 'today' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() => {
                        setReservations(todayReservations);
                        setFilter('today');
                        handleTodayUsePress()                    
                        }
                        }>
                    <Text style={[styles.buttonText,filter === 'today' ? styles.buttonTextActive : styles.buttonTextinActive]}>오늘이용 {todayReservations.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, filter === 'complete' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() => {
                        setFilter('complete')   
                        handleacompleteUsePress()                     
                        }
                        }>
                    <Text style={[styles.buttonText,filter === 'complete' ? styles.buttonTextActive : styles.buttonTextinActive]}>이용완료</Text>
                </TouchableOpacity>  
            </View>
            {reservations.length > 0 ? (
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {reservations.map((reservation) => {
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
                                <View style={{ alignItems: 'center', width: screenWidth, height: screenWidth * 0.9, justifyContent: 'center' }}>
                                <View style={{ width: '90%', height: screenWidth * 0.83, ...shadowStyle, backgroundColor: 'white', borderRadius: 15 }}>
                                    <View style={{ flex: 0.8, backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: '6%' }}>
                                        <Text style={{ color: '#C2C2C2', fontSize: 13 }}>대관 예약번호   {reservation.merchant_uid}</Text>
                                        
                                    </View>
                
                                    <View style={{ flex: 2.4, flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
                                        <View style={{ flex: 0.8, backgroundColor: 'white', justifyContent: 'center' }}>
                                        <Image
                                            style={{
                                            width: '75%',
                                            height: '75%',
                                            marginLeft: '10%',
                                            borderRadius: 8,
                                            }}
                                            source={roomImages[reservation.room_number]} />
                                    </View>
                                    <View style={{ marginLeft: 'auto', flex: 0.8, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, color: '#4F4F4F', fontWeight: 'bold' }}>
                                            짐프라이빗 대관
                                        </Text>
                                        <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>방 번호 : {reservation.room_number}</Text>
                
                                        <View style={{ marginTop: '15%' }}>
                                            <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>사용날짜 : {moment(reservation.date_of_use).format('YYYY-MM-DD')}</Text>
                                            <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>
                                            사용시간 : {reservation.time_of_use}
                                            </Text>
                                        </View>
                                        </View>
                                    </View>
                
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 0.8, backgroundColor: 'white', borderBottomRightRadius: 15, borderBottomLeftRadius: 15 ,marginBottom:'3%'}}>
                                        
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: reservation.rvid !== null || isBeforeNow ? 'lightgray' : '#4169E1',
                                                    width: '92%',
                                                    height: '73%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 8,
                                                }}
                                                onPress={() => {
                                                    if (reservation.rvid === null) {
                                                    navigation.navigate(MainScreens.Review, {
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

                                    
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                            <View style={{backgroundColor:'white',width:screenWidth*0.4,height:screenHeight*0.04,justifyContent:'center',alignItems:'center',marginLeft:'4%',marginBottom:'5%'}}>
                                                <TouchableOpacity
                                                    disabled={!isBeforeNow}
                                                    style={{ justifyContent:'center',alignItems:'center',width:screenWidth*0.4,height:screenHeight*0.04,marginLeft: 'auto',opacity: isBeforeNow ? 1 : 0.2, backgroundColor:'white',borderWidth:0.7,borderColor:'#4169E1' ,borderRadius:8}}
                                                    onPress={() => handleCancellation(reservation)}>
                                                        <Text style={{ fontSize: 13, color: 'black' }}>예약취소</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{backgroundColor:'white',width:screenWidth*0.4,height:screenHeight*0.04,justifyContent:'center',alignItems:'center',marginRight:'4%',marginBottom:'5%'}}>
                                                <TouchableOpacity
                                                    disabled={!isBeforeNow}
                                                    onPress={() => showChangeReservationAlert(reservation)}
                                                    style={{ justifyContent:'center',alignItems:'center',width:screenWidth*0.4,height:screenHeight*0.04,marginLeft: 'auto',opacity: isBeforeNow ? 1 : 0.2, backgroundColor:'white',borderWidth:0.7,borderColor:'#4169E1' ,borderRadius:8}}>
                                                        <Text style={{ fontSize: 13, color: 'black' }}>예약변경</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                                </View>   
                            );
                        }
                    })}
            </ScrollView>
                    ) : (
                        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                            <View style={{height:screenHeight*0.5,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:20}}>예약 내역이 없습니다.</Text>
                            </View>
                        </ScrollView>
                        )}
        </View>
    );
};


export default MyReservationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
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