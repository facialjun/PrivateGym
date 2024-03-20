import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions,Image,TextInput, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BookingScreens, BookingStackParamList, PTScreens } from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'
import { height,width } from './HomeScreen';
import UsingCouponComponent from '../assets/component/UsingCoupon';

const BASE_URL = config.SERVER_URL;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type BookedInfoScreenNavigationProps = StackNavigationProp<
    BookingStackParamList,
    BookingScreens.BookedInfo
>;

interface BookedInfoScreenProps {
    route: RouteProp<BookingStackParamList, 'BookedInfo'>;
    navigation: BookedInfoScreenNavigationProps;
}

const BookedInfoScreen: React.FunctionComponent<BookedInfoScreenProps> = ({navigation,route}) => {
  const roomImages = {
    1: require('../images/rooms1.jpg'),
    2: require('../images/rooms2.jpg'),
    3: require('../images/rooms3.jpeg'),
    // 이하 생략, 필요한 모든 방 번호에 대해 반복
  };

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

    const [Price, setPrice] = useState(0);



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

        fetchPrice();
    }, [selectedUsingTimeSlot]);

    const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('logId')
      .then((logId) => {
        // Remove quotes from logId, if present
        logId = logId.replace(/^['"](.*)['"]$/, '$1');
        
        console.log(logId);

        if (logId) {
          setLogId(logId);
        }
      })
      .catch((error) => {
        console.log('Error retrieving logId:', error);
      });
  }, []);


  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${logId}`);
    
      if (response.status === 200) {
        setUserData(response.data);
        console.log('Fetched User Data:', response.data);
      } else {
        console.log('Error fetching user data. Status:', response.status);
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  fetchUserData();

},[logId]); 
    const name = '짐프라이빗 대관'
    const [merchantUid, setMerchantUid] = useState(`mid_${new Date().getTime()}`);
    const [buyerName, setBuyerName] = useState(null);
    const [buyerTel, setBuyerTel] = useState(null);
    const [buyerEmail, setBuyerEmail] = useState(null);
    

  useEffect(() => {
    if (userData) {
      setBuyerName(userData.username);
      setBuyerTel(userData.phone_number);
      setBuyerEmail(userData.email);
    }
  }, [userData]);
    

    //결제 요청
  const handlePayment = async () => {
    const totalAmount = Price - discountAmount;
    const data = {
      params: {
        pg: 'html5_inicis',
        pay_method: 'card',
        currency: undefined,
        //웹훅 수신 url
        notice_url:`${BASE_URL}/portone-webhook`,
        display: undefined,
        merchant_uid: merchantUid,
        name,
        amount:totalAmount,
        app_scheme: 'exampleformanagedexpo',
        tax_free: undefined,
        buyer_name: buyerName,
        buyer_tel: buyerTel,
        buyer_email: buyerEmail,
        buyer_addr: undefined,
        buyer_postcode: undefined,
        custom_data: undefined,
        vbank_due: undefined,
        popup: undefined,
        digital: undefined,
        language: undefined,
        biz_num: undefined,
        customer_uid: undefined,
        naverPopupMode: undefined,
        naverUseCfm: undefined,
        naverProducts: undefined,
        m_redirect_url: undefined,
        escrow: false,
      },
      tierCode: undefined,
      
    };

    try {
      // 백엔드로 결제 요청 정보 전송
      await axios.post(`${BASE_URL}/payment/requests`, data);
      console.log(data)
      navigation.navigate(BookingScreens.BookingPayment, data.params,);
      console.log(data)
    } catch (error) {
      console.error('결제 요청 중 오류가 발생했습니다.', error.response);
      
    }
  };
  
  //다운로드된 쿠폰 적용
  const [usingCouponVisible,setUsinCouponVisible] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0);
  const [dwonloadedcouponid , setDownloadedCouponId] = useState(null)

  const handleDiscountChange = async (amount,downloadId) => {
    setDiscountAmount(amount);
    setDownloadedCouponId(downloadId);
    console.log("부모 컴포넌트에서 설정된 할인 금액:", amount);
    console.log("부모 컴포넌트에서 설정된 다운로드 쿠폰 아이디:",downloadId)

   // downloadId가 유효한 경우에만 AsyncStorage에 저장
  if (downloadId) {
    try {
      await AsyncStorage.setItem('downloadedCouponId', downloadId.toString());
    } catch (error) {
      // 저장 실패 시 처리
      console.log("AsyncStorage 저장 오류:", error);
    }
  } else {
    // downloadId가 없는 경우, 기존 저장된 값을 삭제하거나 다른 처리를 할 수 있습니다.
    console.log("유효한 downloadId가 없어 저장하지 않습니다.");
  }

  if (amount !== 0 && amount >= Price) {
    Alert.alert("쿠폰 적용 불가", '최소 15,000원 이상 결제 시 이용 가능합니다.');
    setDiscountAmount(0); // 할인 금액을 0으로 재설정
  }
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

        <View style={styles.priceContainer}>
            <Text style={styles.subtitle}>
              쿠폰 적용하기
            </Text>
            <View style={{flexDirection:'row',width:'100%',alignItems:'center',marginTop:16}}>
              <Image source={require('../images/CouponIcon.png')} style={{width:44,height:24}}/>
              <Text style={{fontSize:18,fontWeight:'600',marginLeft:8}}>{discountAmount === 0 ? '미적용' : `${discountAmount.toLocaleString()}원`}</Text>
              <TouchableOpacity style={{marginLeft:'auto'}} onPress={()=>{setUsinCouponVisible(true)}}>
                <Text style={styles.captionprimary2}>사용</Text>
              </TouchableOpacity>
              <UsingCouponComponent
                visible={usingCouponVisible}
                onClose={() => setUsinCouponVisible(false)} onDiscountChange={handleDiscountChange}/>
            </View>
          </View>
          
        <View style={styles.priceContainer}>
            <Text style={styles.subtitle}>
              결제 예정내역
            </Text>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:8}}>
            <Text style={styles.caption1gray}>총 상품가격</Text>
            <Text  style={styles.caption1black}>{Price.toLocaleString()}원</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.caption1gray}>쿠폰할인</Text>
            <Text style={styles.captionprimary2}>{discountAmount > 0 ?
              ('-' + (discountAmount).toLocaleString()) +'원': 
              '-'}</Text>
          </View>
          </View>
          
      </View>


      <View style={{backgroundColor:'transparent'}}>
        <TouchableOpacity
        style={{
            backgroundColor:  '#4169E1',
            padding: 15,
            marginHorizontal: 16,
            borderRadius: 20,
            alignItems: 'center',
            marginBottom:30
          }}
          onPress={handlePayment}
>
            <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {discountAmount > 0 ? ((Price - discountAmount).toLocaleString() + '원 결제하기') : (Price.toLocaleString() + '원 결제하기')}
          </Text>
        </TouchableOpacity>
        
      </View>
      </>

      
    );
    };

export default BookedInfoScreen;

const styles = StyleSheet.create({
    priceContainer:{
      backgroundColor:'white',
      marginTop:16,
      paddingHorizontal:24,
      paddingBottom:24,
    },
    subtitle:{
      fontSize:20,
      color:'black',
      fontWeight:'bold',
      marginTop:36
    },

    image:{
      width: 120/height,
      height: 112/height,
      borderRadius:8,
    },
    caption1black:{
      fontSize:18,
      fontWeight:'600',
      color:'black',
      marginTop:8/height
    },
    caption1gray:{
      fontSize:18,
      fontWeight:'600',
      color:'#868E96',
      marginTop:8/height
    },
    captionprimary2:{
      fontSize:18,
      fontWeight:'600',
      color:'#4169E1',
      marginTop:8/height,
    
    }
  });