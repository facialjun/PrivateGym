import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, FlatList, Image, Platform,RefreshControl, Alert} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MembershipStackParamList } from '../stacks/Navigator';
import { roomPictures } from '../slots/roomPictures';
import moment from 'moment';
import { MembershipUsingTimeSlots } from '../slots/MembershipUsingTimeSlots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config'
import 'moment/locale/ko';


moment.locale('ko');

////////////////////////////////////////////////////////////////////////타입정의


const BASE_URL = config.SERVER_URL;


interface MembershipScreenProps {
  navigation: StackNavigationProp<MembershipStackParamList, 'MembershipBooking'>; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};



////////////////////////////////////////////////////////////////////////.

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




////////////////////////////////////////////////////////////////////////

const MembershipBookScreen: React.FunctionComponent<MembershipScreenProps> = (props) => {
    const {navigation} = props;
    const [isMorning, setIsMorning] = useState<boolean>(false);
    const [isEvening, setIsEvening] = useState<boolean>(false);
    const [selectedUsingTimeSlot, setSelectedUsingTimeSlot] = useState<string>('');
    const [selectedDateSlot, setSelectedDateSlot] = useState<string>('');
    const [selectedDayTimeSlot, setSelectedDayTimeSlot] = useState<string>('');
    const [selectedNightTimeSlot, setSelectedNightTimeSlot] = useState<string>('');
    const [selectedRoomSlot, setSelectedRoomSlot] = useState<string>('');
    const [allSlotSelected, setAllSlotSelected] = useState<boolean>(false);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableDayTimeSlots, setAvailableDayTimeSlots] = useState<string[]>([]);
    const [availableNightTimeSlots, setAvailableNightTimeSlots] = useState<string[]>([]);
    const [selectedEndTime, setSelectedEndTime] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [reservationHistory, setReservationHistory] = useState([]);

        const saveDayTimeData = async () => {
            const startTime = moment(selectedDayTimeSlot, 'HH:mm');
            const duration = parseInt(selectedUsingTimeSlot, 10);
            const endTime = startTime.clone().add(duration, 'minutes').format('HH:mm');

            try {
                const data = {
                    selectedUsingTimeSlot,
                    isMorning,
                    isEvening,
                    selectedDayTimeSlot,
                    selectedNightTimeSlot,
                    selectedStartTime: selectedDayTimeSlot,
                    selectedEndTime: endTime,
                };

            await AsyncStorage.setItem('bookingData', JSON.stringify(data));
            console.log(data);
            } catch (error) {
            console.error('Error saving data:', error);
            }
            console.log(startTime);
            console.log(endTime);
        };

        const saveNightTimeData = async () => {
            const startTime = moment(selectedNightTimeSlot, 'HH:mm');
            const duration = parseInt(selectedUsingTimeSlot, 10);
            const endTime = startTime.clone().add(duration, 'minutes').format('HH:mm');

            try {
                const data = {
                    selectedUsingTimeSlot,
                    isMorning,
                    isEvening,
                    selectedDayTimeSlot,
                    selectedNightTimeSlot,
                    selectedStartTime: selectedNightTimeSlot,
                    selectedEndTime: endTime,
                };

            await AsyncStorage.setItem('bookingData', JSON.stringify(data));
            console.log("bookingData:",data);
            } catch (error) {
            console.error('Error saving data:', error);
            }
            console.log(startTime);
            console.log(endTime);
        };

    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const calculateEndTime = () => {
    const startTime = moment(selectedDayTimeSlot || selectedNightTimeSlot, 'HH:mm');
    const duration = parseInt(selectedUsingTimeSlot, 10); // 문자열을 숫자로 변환, 10진법
    const endTime = startTime.clone().add(duration, 'minutes').format('HH:mm');
    console.log("사용종료시간:",endTime)
    setSelectedEndTime(endTime);
};

// useEffect(() => {
//     calculateEndTime();
// }, [selectedDayTimeSlot, selectedNightTimeSlot, selectedUsingTimeSlot]);




////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const handleReserveDaytime = () => {
    const startTime = moment(selectedDayTimeSlot, 'HH:mm');
    const duration = parseInt(selectedUsingTimeSlot, 10); // 문자열에서 숫자로 변환
    let endTime = startTime.clone().add(duration, 'minutes');

    
    navigation.navigate('MembershipBookedInfo', {
        selectedUsingTimeSlot,
        selectedDateSlot,
        isMorning: true,
        isEvening: false,
        selectedDayTimeSlot,
        selectedNightTimeSlot: '',
        selectedRoomSlot,
        selectedStartTime: selectedDayTimeSlot,
        selectedEndTime: endTime.format('HH:mm'),
    });
};


const handleReserveNighttime = () => {
  // Calculate the end time based on the selected duration
    const startTime = moment(selectedNightTimeSlot, 'HH:mm');
    const duration = parseInt(selectedUsingTimeSlot, 10);
    let endTime = startTime.clone().add(duration, 'minutes');

    // 예약 시간이 30분이고 선택한 시간이 23:30인 경우, 종료 시간을 23:59로 설정
    if (duration === 30 && startTime.format('HH:mm') === '23:30') {
        endTime = moment(startTime).set({ hour: 23, minute: 59 });
    }

    if (duration === 60 && startTime.format('HH:mm') === '23:00') {
        endTime = moment(startTime).set({ hour: 23, minute: 59 });
    }

    if (duration === 90 && startTime.format('HH:mm') === '22:30') {
        endTime = moment(startTime).set({ hour: 23, minute: 59 });
    }

    if (duration === 120 && startTime.format('HH:mm') === '22:00') {
        endTime = moment(startTime).set({ hour: 23, minute: 59 });
    }

    if (duration === 150 && startTime.format('HH:mm') === '21:30') {
        endTime = moment(startTime).set({ hour: 23, minute: 59 });
    }

    if (duration === 180 && startTime.format('HH:mm') === '21:00') {
        endTime = moment(startTime).set({ hour: 23, minute: 59 });
    }

    // 예약 시간이 60분 초과이고 자정을 넘는 경우, 예약 불가
    if (endTime.format('HH:mm') === '00:00' || endTime.isAfter(moment(startTime).endOf('day'))) {
        Alert.alert("예약 불가", "자정이후는 예약 이후 다음날의 슬롯에서 추가해주세요!");
        return; // 함수 종료
    }

    navigation.navigate('MembershipBookedInfo', {
        selectedUsingTimeSlot,
        selectedDateSlot,
        isMorning: false,
        isEvening: true,
        selectedDayTimeSlot: '',
        selectedNightTimeSlot,
        selectedRoomSlot,
        selectedStartTime: selectedNightTimeSlot,
        selectedEndTime: endTime.format('HH:mm'),
    });
};

// const handleReserve = () => {
//     if (isMorning && selectedDayTimeSlot) {
//         handleReserveDaytime();
//         saveDayTimeData(); // Add this line to execute the saveDayTimeData function
//     } else if (isEvening && selectedNightTimeSlot) {
//         handleReserveNighttime();
//         saveNightTimeData(); // Add this line to execute the saveNightTimeData function
//     }
// };

const handleReserve = () => {
    // 시간 슬롯이 중복되는지 확인
    const isTimeSlotOverlapped = () => {
        const selectedStartTime = isMorning ? selectedDayTimeSlot : selectedNightTimeSlot;
        const startTime = moment(selectedStartTime, 'HH:mm');
        const duration = parseInt(selectedUsingTimeSlot, 10); // 문자열을 숫자로 변환, 10진법
        const endTime = startTime.clone().add(duration, 'minutes');


        // 선택된 시간대가 예약된 시간대와 중복되는지 확인
        const reservedTimeSlots = isMorning ? availableDayTimeSlots : availableNightTimeSlots;
        for (const slot of reservedTimeSlots) {
            const slotStartTime = moment(slot.time, 'HH:mm');
            const slotEndTime = slotStartTime.clone().add(30, 'minutes'); // 각 슬롯은 30분 간격으로 설정됨

            if (startTime.isBefore(slotEndTime) && endTime.isAfter(slotStartTime) && slot.disabled) {
                return true; // 중복됨
            }
        }
        return false; // 중복되지 않음
    };

    if (isTimeSlotOverlapped()) {
        // 시간 슬롯이 중복되면 경고 메시지 표시
        Alert.alert("예약불가", "예약 시간이 중복됩니다!");
    } else {
        // 중복되지 않는 경우 예약 처리
        if (isMorning && selectedDayTimeSlot) {
            handleReserveDaytime();
            saveDayTimeData();
        } else if (isEvening && selectedNightTimeSlot) {
            handleReserveNighttime();
            saveNightTimeData();
        }
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////모든 슬롯이 선택되었을때 '예약하기' 버튼이 활성화되도록하는 코드


    useEffect(() => {
        if (selectedUsingTimeSlot && selectedDateSlot && ((isMorning && selectedDayTimeSlot) || (isEvening && selectedNightTimeSlot))) {
            setAllSlotSelected(true);
        } else {
            setAllSlotSelected(false);
        }
    }, [isMorning, isEvening, selectedUsingTimeSlot, selectedDateSlot, selectedDayTimeSlot, selectedNightTimeSlot]);


//////////////////////////////////// 날짜   /////////////////////////////////////////////////////////////////////////////


    useEffect(() => {
        const dates = [];
        const currentDate = moment();
        for (let i = 0; i < 7; i++) {
            dates.push(currentDate.clone().add(i, 'days').format('YYYY-MM-DD'));
        }
        setAvailableDates(dates);
    }, []);


////////////////////////////////////////////////////////////////////////////////////////////////모든 슬롯이 선택되었을때 '예약하기' 버튼이 활성화되도록하는 코드

    useEffect(() => {
        if (selectedUsingTimeSlot && selectedDateSlot && ((isMorning && selectedDayTimeSlot) || (isEvening && selectedNightTimeSlot))) {
            setAllSlotSelected(true);
        } else {
            setAllSlotSelected(false);
        }
    }, [isMorning, isEvening, selectedUsingTimeSlot, selectedDateSlot, selectedDayTimeSlot, selectedNightTimeSlot]);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

useEffect(() => {
    const fetchPrice = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/booking_price/price`, {
                usingTime: selectedUsingTimeSlot,
            });

        if (response.status === 200) {
            const priceData = response.data;
            setPrice(priceData.price);
        } else {
            console.error('Failed to fetch price');
        }
        } catch (error) {
        console.error('Error fetching price:', error);
        }
    };

    if (selectedUsingTimeSlot) {
        fetchPrice();
    }
}, [selectedUsingTimeSlot]);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const fetchSelectedDate = async () => {
    try {
        const savedDate = await AsyncStorage.getItem('selectedDateSlot');
        const convertedDate = convertToValidDateFormat(savedDate); // 날짜 값을 'YYYY-MM-DD' 형식으로 변환
        await axios.post(`${BASE_URL}/reservations`, { date: convertedDate });
        console.log(convertedDate);
        setSelectedDateSlot(savedDate || '');
        return savedDate;
    } catch (error) {
        console.error('Failed to fetch/saved date:', error);
        return null;
    }
};

const convertToValidDateFormat = (dateString) => {
    const date = moment(dateString, 'YYYY년 M월 D일').startOf('day');
    const formattedDate = date.format('YYYY-MM-DD');
    console.log(formattedDate);
    return formattedDate;
};


const fetchReservationData = async (convertedDate) => {
    try {
        const roomNumber = await AsyncStorage.getItem('selectedRoomNumber');
        const response = await axios.get(`${BASE_URL}/reservations`, { params: { date: convertedDate, roomNumber} });
        const data = response.data;
        const reservedDateSlots = data.map((reservation) =>
        moment(reservation.date_of_use).format('YYYY-MM-DD')
        );

        console.log(response.data);
        
        return reservedDateSlots; // 반환하여 다음 단계에서 사용
    } catch (error) {
        console.error('Failed to fetch reservation data:', error);
        return null;
    }
};

const fetchReservationTime = async (convertedDate) => {
    try {
        const roomNumber = await AsyncStorage.getItem('selectedRoomNumber');
        const response = await axios.get(`${BASE_URL}/reservations`, { params: { date: convertedDate,roomNumber} });
        const data = response.data;
        const reservedTimeSlots = data.map((reservation) => {
            const timeRange = reservation.time_of_use.split('-');
            const startTime = moment(timeRange[0], 'HH:mm').format('HH:mm');
            const endTime = moment(timeRange[1], 'HH:mm').format('HH:mm');
            return `${startTime}-${endTime}`;
    });

    console.log(reservedTimeSlots);
    console.log(response.data);
        return reservedTimeSlots; // 반환하여 다음 단계에서 사용
    } catch (error) {
    console.error('Failed to fetch reservation data:', error);
        return null;
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const checkMorningTime = async () => {
    setIsMorning(true);
    setIsEvening(false);
    setSelectedNightTimeSlot('');

    const selectedDate = await fetchSelectedDate();
    const convertedDate = convertToValidDateFormat(selectedDate);
    const roomNumber = await AsyncStorage.getItem('selectedRoomNumber');
    const reservedDateSlots = await fetchReservationData(convertedDate, roomNumber);

    const isDateMatched = reservedDateSlots.some((reservedDate) => reservedDate === convertedDate);

    if (isDateMatched) {
        console.log('Morning and date is matched');
        generateDayTimeSlots(selectedDate);
    };
    
    if (!isDateMatched) {
        console.log('Morning, but date is not matched');
        DayTimeSlots(selectedDate);
    };
};

const checkEveningTime = async () => {
    setIsMorning(false);
    setIsEvening(true);
    setSelectedDayTimeSlot('');

    const selectedDate = await fetchSelectedDate();
    const convertedDate = convertToValidDateFormat(selectedDate);
    const roomNumber = await AsyncStorage.getItem('selectedRoomNumber');
    const reservedDateSlots = await fetchReservationData(convertedDate,roomNumber);

    const isDateMatched = reservedDateSlots.some((reservedDate) => reservedDate === convertedDate);

    if (isDateMatched) {
        console.log('Morning and date is matched');
        generateNightTimeSlots(selectedDate);
    };
    
    if (!isDateMatched) {
        console.log('Morning, but date is not matched');
        NightTimeSlots(selectedDate);
    };
};


const sendSelectedDateToStorage = async (date: string) => {
    setIsMorning(false);
    setIsEvening(false);
    setSelectedDateSlot(date);
    await AsyncStorage.setItem('selectedDateSlot', date);
    console.log(date);
};


const handleDateSlotSelect = async (date: string) => {
    await sendSelectedDateToStorage(date);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const generateDayTimeSlots = async (date) => {
    const timeSlots = [];
    const currentTime = moment(date, 'YYYY-MM-DD').startOf('day');
    const endTimeLimit = moment(date, 'YYYY-MM-DD').startOf('day').add(12, 'hours').add(30, 'minutes').subtract(30, 'minutes');

  // 예약된 시간 가져오기
    const reservedTimeSlots = await fetchReservationTime(date);

    while (currentTime.isBefore(endTimeLimit)) {
        const startTime = currentTime.clone();
        const endTime = currentTime.clone().add(30, 'minutes');

    const reservedStartTimes = reservedTimeSlots.map((time) => {
        const [start] = time.split('-');
        return start;
    });

    const reservedEndTimes = reservedTimeSlots.map((time) => {
        const [_, end] = time.split('-');
        return end;
    });

    const reservedBetweenTimes = disableBetweenDayTimeSlots(reservedTimeSlots);

    const isDisabled = startTime.isBefore(moment());
    const isStartReserved = reservedStartTimes.includes(startTime.format('HH:mm'));
    const isBetweenReserved = reservedBetweenTimes.includes(startTime.format('HH:mm'));
    const isEndReserved = reservedEndTimes.includes(endTime.format('HH:mm'));

    const isReserved = isStartReserved || isBetweenReserved || isEndReserved;

    timeSlots.push({
        time: startTime.format('HH:mm'),
        disabled: isDisabled || isReserved
        });

        currentTime.add(30, 'minutes');
    }

    console.log(timeSlots);

    setAvailableDayTimeSlots(timeSlots);
};



const disableBetweenDayTimeSlots = (disabledDayTimeSlots) => {
    const betweenTimeSlots = [];
    
    disabledDayTimeSlots.forEach((time) => {
        const [start, end] = time.split('-');
        const startTime = moment(start, 'HH:mm');
        const endTime = moment(end, 'HH:mm');
        
        while (startTime.isBefore(endTime)) {
        betweenTimeSlots.push(startTime.format('HH:mm'));
        startTime.add(30, 'minutes');
        }
    });
    
    return betweenTimeSlots;
};



const DayTimeSlots = (date) => {
    const timeSlots = [];
    const currentTime = moment(date, 'YYYY-MM-DD').startOf('day');
    const endTimeLimit = moment(date, 'YYYY-MM-DD').startOf('day').add(12, 'hours').add(30, 'minutes').subtract(30, 'minutes');
    
    while (currentTime.isBefore(endTimeLimit)) {
        const startTime = currentTime.clone();
        
        const isDisabled = startTime.isBefore(moment());

        timeSlots.push({
        time: startTime.format('HH:mm'),
        disabled: isDisabled
        });

        currentTime.add(30, 'minutes');
    }

    console.log(timeSlots);

    setAvailableDayTimeSlots(timeSlots);
};





const generateNightTimeSlots = async (date) => {
    const timeSlots = [];
    const currentTime = moment(date, 'YYYY-MM-DD').startOf('day').hour(12).minute(0);
    const endTimeLimit = moment(date, 'YYYY-MM-DD').startOf('day').hour(24).minute(0).add(30, 'minutes').subtract(30, 'minutes');

    // 예약된 시간 가져오기
    const reservedTimeSlots = await fetchReservationTime(date);

    while (currentTime.isBefore(endTimeLimit)) {
        const startTime = currentTime.clone();
        let endTime = currentTime.clone().add(30, 'minutes');

        if (endTime.isAfter(endTimeLimit)) {
            endTime = moment(date, 'YYYY-MM-DD').startOf('day').hour(23).minute(59);
        }


        const reservedStartTimes = reservedTimeSlots.map((time) => {
        const [start] = time.split('-');
        return start;
    });

    const reservedEndTimes = reservedTimeSlots.map((time) => {
        const [_, end] = time.split('-');
        return end;
    });

    const reservedBetweenTimes = disableBetweenNightTimeSlots(reservedTimeSlots);

    const isDisabled = startTime.isBefore(moment());
    const isStartReserved = reservedStartTimes.includes(startTime.format('HH:mm'));
    const isBetweenReserved = reservedBetweenTimes.includes(startTime.format('HH:mm'));
    const isEndReserved = reservedEndTimes.includes(endTime.format('HH:mm'));

    const isReserved = isStartReserved || isBetweenReserved || isEndReserved;

    timeSlots.push({
        time: startTime.format('HH:mm'),
        disabled: isDisabled || isReserved
    });

    currentTime.add(30, 'minutes');
    }

    console.log(timeSlots);

    setAvailableNightTimeSlots(timeSlots);
    };

const disableBetweenNightTimeSlots = (disabledNightTimeSlots) => {
    const betweenTimeSlots = [];
    
    disabledNightTimeSlots.forEach((time) => {
        const [start, end] = time.split('-');
        const startTime = moment(start, 'HH:mm');
        const endTime = moment(end, 'HH:mm');
        
        while (startTime.isBefore(endTime)) {
        betweenTimeSlots.push(startTime.format('HH:mm'));
        startTime.add(30, 'minutes');
    }
    });
    
    return betweenTimeSlots;
};

const NightTimeSlots = (date) => {
    const timeSlots = [];
    const currentTime = moment(date, 'YYYY-MM-DD').startOf('day').hour(12).minute(0);
    const endTimeLimit = moment(date, 'YYYY-MM-DD').startOf('day').hour(24).minute(0).add(30, 'minutes').subtract(30, 'minutes');;

    while (currentTime.isBefore(endTimeLimit)) {
        const startTime = currentTime.clone();

        const isDisabled = startTime.isBefore(moment());

        timeSlots.push({
        time: startTime.format('HH:mm'),
        disabled: isDisabled
        });

        currentTime.add(30, 'minutes');
    }

    console.log(timeSlots);

    setAvailableNightTimeSlots(timeSlots);
};

function chunkArray(arr, size) {
    let result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

const [refreshing, setRefreshing] = useState(false);

        const onRefresh = () => {
            setRefreshing(true)

            setIsMorning(false);
            setIsEvening(false);
            setSelectedUsingTimeSlot('');
            setSelectedDateSlot('');
            setSelectedDayTimeSlot('');
            setSelectedNightTimeSlot('');
            setPrice(0);
            
            setRefreshing(false)
        }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

return (
        <ScrollView style={{backgroundColor:'white'}}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>

            <View style={styles.Date}>
                <View style={{flex:0.6,backgroundColor:'white',justifyContent:'center',paddingHorizontal:'5%'}}>
                    <Text style={styles.dateTitle}>{moment().format('M월 D일')}</Text>
                </View>

                <View style={{flex:1.3, justifyContent:'center',alignItems:'center'}}>
                    <FlatList
                        // style={{}}
                        horizontal
                        data={availableDates}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => (
                        <>

                        <View style={{backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                            <View style={{backgroundColor:'white',bottom:'8%'}}>
                                <TouchableOpacity
                                style={[styles.DateSlots, selectedDateSlot === item && { backgroundColor: '#4A7AFF' }]}
                                onPress={() => handleDateSlotSelect(item)}
                                >
                                <Text style={[styles.dateSlotsTitle, selectedDateSlot === item && { color: 'white' }]}>
                                    {moment(item).format('D일')}
                                </Text>
                                </TouchableOpacity>
                            </View>
                            

                            <View style={{left:'11%'}}>
                                {index === 0 && (
                                <View style={styles.dayOfWeekContainer}>
                                    <Text style={{color:'#4A7AFF',fontWeight:'600'}}>오늘</Text>
                                </View>
                                )}
                                {index !== 0 && (
                                <View style={styles.dayOfWeekContainer}>
                                    <Text >{moment(item).format('ddd')}</Text>
                                </View>
                                )}
                            </View>

                        </View>
                            
                        
                            
                        </>

                        )}
                    />
                </View>
                </View>




            <View style={styles.startingTimeContainer}>

                <View style={{backgroundColor:'white',justifyContent:'center',paddingHorizontal:'5%',height:screenWidth*0.17}}>
                        <Text style={styles.timeTitle}>시작 시간</Text>
                </View>

                <View style={styles.startingTime}>
                    <View style={{flexDirection:'row',backgroundColor:'white',width:screenWidth,height:screenWidth*0.2}}>
                        <TouchableOpacity 
                        style={[styles.TimeSlots, isMorning && { backgroundColor: '#4A7AFF' }]}
                        onPress={checkMorningTime}>
                            <Text style={isMorning && { color:'white' }}>오전</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity 
                            style={[styles.TimeSlots, isEvening && { backgroundColor: '#4A7AFF' }]}
                            onPress={checkEveningTime}>
                                <Text style={isEvening && { color:'white' }}>오후</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>


    <View style={{height:'auto',justifyContent:'center',alignItems:'center'}}>
        {isMorning ? (
<View style={{justifyContent:'center',alignItems:'center',right:'8%'}}>
        <ScrollView>
    {chunkArray(availableDayTimeSlots, 4).map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row' }}>
        {row.map((item, columnIndex) => (
            <TouchableOpacity
            key={item.time.toString()}
            style={[
                styles.dayTimeSlots,
                selectedDayTimeSlot === item.time && { backgroundColor: '#4A7AFF' },
                item.disabled && { opacity: 0.5, backgroundColor: 'lightgray', borderColor: 'lightgray' },
            ]}
            onPress={() => {
                setSelectedDayTimeSlot(item.time);
                calculateEndTime();
            }}
            disabled={item.disabled}
            >
            <Text
                style={[
                styles.usingTimeSlotsTitle,
                selectedDayTimeSlot === item.time && { color: 'white' },
                item.disabled && { color: 'gray' },
                ]}
            >
                {item.time}
            </Text>
            </TouchableOpacity>
        ))}
        </View>
    ))}
        </ScrollView>

</View>
        ) : null}

        {isEvening ? (
            <View style={{justifyContent:'center',alignItems:'center',right:'8%'}}>
        <ScrollView>
    {chunkArray(availableNightTimeSlots, 4).map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row' }}>
        {row.map((item, columnIndex) => (
            <TouchableOpacity
            key={item.time.toString()}
            style={[
                styles.nightTimeSlots,
                selectedNightTimeSlot === item.time && { backgroundColor: '#4A7AFF' },
                item.disabled && { opacity: 0.5, backgroundColor: 'lightgray', borderColor: 'lightgray' },
            ]}
            onPress={() => {
                setSelectedNightTimeSlot(item.time);
                calculateEndTime();
            }}
            disabled={item.disabled}
            >
            <Text
                style={[
                styles.usingTimeSlotsTitle,
                selectedNightTimeSlot === item.time && { color: 'white' },
                item.disabled && { color: 'gray' },
                ]}
            >
                {item.time}
            </Text>
            </TouchableOpacity>
        ))}
        </View>
    ))}
        </ScrollView>

</View>
        ) : null}
    </View>

            </View>
        
        <View style={styles.usingTime}>
            <View style={{height:screenWidth*0.2,justifyContent:'center',backgroundColor:'white',paddingHorizontal:'5%'}}>
                    <Text style={styles.usingTimeTitle}>사용시간</Text>
                    <Text style={styles.usingTimeTitle2}>(30분단위)</Text>
            </View>
            
                    <FlatList
                        horizontal
                        data={MembershipUsingTimeSlots}
                        keyExtractor={(item)=>item.name}
                        renderItem={({item})=>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity 
                            style={[styles.usingTimeSlots, selectedUsingTimeSlot === item.name && {backgroundColor:'#4A7AFF'}]}
                            onPress={()=>setSelectedUsingTimeSlot(item.name)}
                        >
                        
                            <Text style={[styles.usingTimeSlotsTitle, selectedUsingTimeSlot === item.name && {color:'white'}]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                        </View>
                        
                    }
                />
        </View>


            <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'white',height:screenWidth*0.4}}>
                    <TouchableOpacity
                        disabled={!allSlotSelected}
                        onPress={handleReserve}
                        style={[styles.tabBarContainer,
                            !allSlotSelected && { backgroundColor:'#797676',opacity:0.5 },
                            allSlotSelected && { backgroundColor: '#4169E1', }
                        ]}
                    >
                        <Text style={{fontSize:18,fontWeight:'bold',color:'white'}}>예약하기</Text>
                    </TouchableOpacity>
                
            </View>

        </View>
        </ScrollView>
    );  
};


export default MembershipBookScreen;

const styles = StyleSheet.create({

container: {
    height: 'auto'
},

Date: {
    backgroundColor:'white',
    width: screenWidth,
    height: screenWidth*0.55,
    borderBottomColor:'lightgray',
    borderBottomWidth:1
},

usingTime: {
    backgroundColor:'white',
    width: screenWidth,
    height: screenWidth*0.37,
},

startingTimeContainer: {
    backgroundColor:'white',
    width: screenWidth,
    minHeight: screenWidth*0.4,
    maxHeight: screenWidth*1.3,
    borderBottomColor:'lightgray',
    borderBottomWidth:1
},

dateTitle:{
    fontSize:20,
    fontWeight:'bold',
},


startingTime:{
    flexDirection:'row',
},

TimeSlots:{
    height: 40,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems:'center',
    marginTop: 15,
    marginLeft:20,
    borderWidth:2,
    borderColor:'#1E90FF',  
},

DateSlots:{
    height: 60,
    width: 60,
    backgroundColor: '#FCF8F8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems:'center',
    marginLeft:20,
    borderWidth:2,
    borderColor:'#1E90FF',  
},

usingTimeSlots:{
    height: 60,
    width: 60,
    backgroundColor: '#FCF8F8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems:'center',
    marginLeft:20,
    borderWidth:2,
    borderColor:'#1E90FF',  
},

usingTimeTitle:{
    fontSize:20,
    fontWeight:'bold',
},
usingTimeTitle2:{
    fontSize:13,
    color:'gray',
    fontWeight:'bold',
},

timeTitle:{
    fontSize:20,
    fontWeight:'bold',
},

dayTimeSlots:{
    height: 40,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems:'center',
    marginTop: 15,
    marginLeft:20,
    borderWidth:2,
    borderColor:'#1E90FF',  
},

nightTimeSlots:{
    height: 40,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems:'center',
    marginTop: 15,
    marginLeft:20,
    borderWidth:1,
    borderColor:'#1E90FF',  
},


dayOfWeekContainer:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    height:screenWidth*0.07,
    width:screenWidth*0.075
},

tabBarContainer:{
    height:screenWidth*0.15,
    width:screenWidth*0.9,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    marginBottom:'3%'
},
});
