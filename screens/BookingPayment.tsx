import React,{useEffect, useState} from 'react';
import IMP from 'iamport-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../Loading';
import { BookingScreens, BookingStackParamList } from '../stacks/Navigator';
import axios from 'axios';
import { getUserCode } from '../src/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'

const BASE_URL = config.SERVER_URL;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BookingPayment = ({ navigation, route }) => {

    const [selectedUsingTimeSlot, setSelectedUsingTimeSlot] = useState(null);
    const [selectedDateSlot, setSelectedDateSlot] = useState(null);
    const [isMorning, setIsMorning] = useState(false);
    const [isEvening, setIsEvening] = useState(false);
    const [selectedDayTimeSlot, setSelectedDayTimeSlot] = useState(null);
    const [selectedNightTimeSlot, setSelectedNightTimeSlot] = useState(null);
    const [selectedRoomSlot, setSelectedRoomSlot] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);

    const loadData = async () => {
    try {
        const data = await AsyncStorage.getItem('bookingData');
        if (data) {
        const parsedData = JSON.parse(data);
        setSelectedUsingTimeSlot(parsedData.selectedUsingTimeSlot);
        setIsMorning(parsedData.isMorning);
        setIsEvening(parsedData.isEvening);
        setSelectedDayTimeSlot(parsedData.selectedDayTimeSlot);
        setSelectedNightTimeSlot(parsedData.selectedNightTimeSlot);
        setSelectedEndTime(parsedData.selectedEndTime);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    };

    useEffect(() => {
        loadData();
    }, []);

      // contains order history information
const params = route.params; // route.params에서 params 직접 가져오기
console.log(params);

const fetchUpdatedPaymentRequest = async (merchantUid) => {
    try {
        await delay(1000); // 나중에 변경합시다.
        const response = await axios.get(
        `${BASE_URL}/payment/requests/${merchantUid}`
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('결제 요청을 업데이트하는 데 실패했습니다.');
    }
};

//앞에서 저장한 사용한 쿠폰의 다운로드 id 값을 불러옴
const getDownloadId = async () => {
    try {
        const downloadId = await AsyncStorage.getItem('downloadedCouponId');
        // downloadId가 실제로 존재하는지 확인하고, 존재하지 않는 경우 null을 반환
        return downloadId ? downloadId : null;
    } catch (error) {
        console.error("AsyncStorage에서 downloadId를 불러오는 데 실패했습니다.", error);
        return null;
    }
};

const updateCouponStatus = async (downloadId) => {
    try {
        const response = await axios.post(`${BASE_URL}/updateCouponStatus`, {
            downloadId: downloadId,
            status: 0, // 쿠폰을 사용 처리하기 위한 상태 값
        });

        console.log("쿠폰 상태가 성공적으로 업데이트 되었습니다:", response.data);
    } catch (error) {
        console.error("쿠폰 상태 업데이트 중 오류 발생:", error.response || error.message);
    }
};


const handlePaymentComplete = async (response) => {
    try {
        const merchantUid = response.merchant_uid;
        const paymentRequest = await fetchUpdatedPaymentRequest(merchantUid);
        const amount = paymentRequest[0].amount
        console.log(paymentRequest[0].state);

        if (paymentRequest[0].state === 'paid') {
        const downloadId = await getDownloadId();
        if (downloadId) {
                await updateCouponStatus(downloadId);
        }
        await handleSubmit(merchantUid, amount);
        console.log(paymentRequest[0].state);
        navigation.replace(BookingScreens.BookingPaymentResult, response);
        } else {
        navigation.replace(BookingScreens.BookingPaymentResult, response);
        }
    } catch (error) {
        console.error(error.response);
    }
};

// 결제 요청 데이터를 가져오기 위한 새로운 함수 생성

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


////////////////////////////////////////////////////////////////  
const handleSubmit = async (merchantUid, amount) => {
    try {
        let logId = await AsyncStorage.getItem('logId')
        
        if (logId) {
            logId = logId.replace(/^['"]+|['"]+$/g, '');
        }
        

        let startTime, endTime;

        if (isMorning && selectedDayTimeSlot) {
            startTime = selectedDayTimeSlot;
            endTime = selectedEndTime
            } else if (isEvening && selectedNightTimeSlot) {
            startTime = selectedNightTimeSlot;
             endTime = selectedEndTime === '24:00' ? '23:59' : selectedEndTime; // 24:00이면 23:59로 변경
            } else {
            return; // 시간 슬롯이 올바르게 선택되지 않은 경우 처리
            }

    await axios.post(`${BASE_URL}/reservation`, {
        room: selectedRoomNumber,
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        usingTime: selectedUsingTimeSlot,
        logId: logId,
        merchantUid: merchantUid,
        amount: amount,
        });

        console.log('Reservation created successfully');
    // 응답에 대한 처리
    } catch (error) {
        console.error(error);
    }
};

    return (
        <SafeAreaView style={{ flex: 1}}>
        <IMP.Payment
            userCode="imp11480521"
            loading={<Loading />}
            data={params}
            callback={handlePaymentComplete} // handlePaymentComplete 함수로 변경
        />
        </SafeAreaView>
    )
}

export default BookingPayment