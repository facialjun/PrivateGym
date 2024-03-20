import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform,ScrollView, TouchableOpacity,Modal } from 'react-native';
import { MembershipPurchaseScreens, MembershipPurchaseParamList} from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'
import { height,width } from './HomeScreen';
import { background } from 'native-base/lib/typescript/theme/styled-system';
import LottieView from 'lottie-react-native';
import EventComponent from '../assets/component/event';
import { LinearGradient } from 'expo-linear-gradient'; 
import { BackHandler } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';



const BASE_URL = config.SERVER_URL;


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type MembershipPurchaseScreenNavigationProps = StackNavigationProp<
  MembershipPurchaseParamList,
  MembershipPurchaseScreens.MembershipPurchase
>;

interface MembershipPurchaseScreenProps {
  route: RouteProp<MembershipPurchaseParamList, 'MembershipPurchase'>;
  navigation: MembershipPurchaseScreenNavigationProps;
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  android: {
    elevation: 3,
  },
});

/////////////////////////////////////////////////////////

const MembershipPurchaseScreen: React.FunctionComponent<MembershipPurchaseScreenProps> = (props) => {
  const { navigation } = props;
  const [userData, setUserData] = useState(null);
  const [logId, setLogId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [eventVisible, setEventVisible] = useState(false);
  const [showMethod, setShowMethod] = useState(false);

  
  useEffect(() =>{
    setEventVisible(false);
  })
  
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home'); // 홈 스크린으로 이동
      return true; // 이벤트를 소비하여 앱 종료를 막음
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 리스너 제거

  }, [navigation]);



    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          let logId = await AsyncStorage.getItem('logId');
          if (logId) {
            logId = logId.replace(/^['"](.*)['"]$/, '$1');
            const response = await axios.get(`${BASE_URL}/user/${logId}`);
            if (response.status === 200) {
              setUserData(response.data);
            }
          }
          const response = await axios.get(`${BASE_URL}/period_membership_product`);
          setMembershipProducts(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
        setIsLoading(false); 
      };
  
      fetchData();
    }, []);

  //고유한 주문번호 생성
    const now = new Date();
    const timestamp = now.getTime(); // 밀리초 단위 타임스탬프
    const milliseconds = now.getMilliseconds(); // 현재 밀리초
    const [merchantUid, setMerchantUid] = useState(`mid_${timestamp}_${milliseconds}`);
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


  const handlePayment = async (productName ,productAmount,productDuration,producttype,productTotaltime)=> {
    const data = {
      params: {
        pg: 'html5_inicis.INIpayTest',
        pay_method: 'card',
        notice_url:`${BASE_URL}/portone-webhook`,
        currency: undefined,
        display: undefined,
        merchant_uid: merchantUid,
        name: productName, // Set the value directly
        amount: productAmount,
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
        escrow: false,
      },
      tierCode: undefined,
    };
    
    try {
      await AsyncStorage.setItem('productName', productName);
      await AsyncStorage.setItem('productDuration', String(productDuration));
      await AsyncStorage.setItem('type', producttype);
      await AsyncStorage.setItem('productTotaltime',String(productTotaltime));
      // 백엔드로 결제 요청 정보 전송
      await axios.post(`${BASE_URL}/payment/requests`, data); //// / ? _
      console.log(producttype)
      navigation.navigate(MembershipPurchaseScreens.MembershipPayment, data.params);
      console.log(data)
    } catch (error) {
      console.error('결제 요청 중 오류가 발생했습니다.', error);
    }
  };


  const [membershipProducts, setMembershipProducts] = useState([]);
    
  useEffect(() => {
    const fetchMembershipProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/period_membership_product`);
        setMembershipProducts(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching membership products:', error);
      }
    };

    fetchMembershipProducts();
    
  }, []);
  
  
  return (
    isLoading ?(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <LottieView
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
            source={require('../src/lottie/loading.json')}
          />      
      </View>
    ) : (
      <ScrollView>
        <View style={{ height: 'auto', backgroundColor: '#F8F9FA', paddingHorizontal: 24 }}>
          
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <View>
            <Text style={styles.subtitle}>짐프라이빗 이용권</Text>
          </View>

          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {[3].map((productId) => {
              const product = membershipProducts.find(product => product.id === productId);
              return (
                <TouchableOpacity key={product.id} style={styles.MemberShipContainer} onPress={() => handlePayment(product.name, product.amount, product.duration, product.type, product.total_time)}>
                  <View style={{ flex: 1, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.Body1}>{product.name}</Text>
                      <Text style={styles.caption2}>10% 할인</Text>
                    </View>
                    <TouchableOpacity style={styles.PriceContainer}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.caption1}>{product.amount.toLocaleString()}원</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
        {membershipProducts.map((product) => {
          if (product.id === 4) {
            return (
              <TouchableOpacity key={product.id}
                style={{
                  ...shadowStyle,
                  height: 88,
                  width: '100%',
                  borderRadius: 16,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  marginTop:'3%',
                  borderColor: '#4169E1',
                  position: 'relative', // 탭을 오버레이하기 위한 설정
                }} 
                onPress={() => handlePayment(product.name, product.amount, product.duration, product.type, product.total_time)}>

                <View style={{ flex: 1, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* 탭 디자인 */}
                  <LinearGradient
                      colors={['#FF4500', '#FFA500']} // 그라디언트 색상 배열
                      start={{ x: 0, y: 0 }} // 그라디언트 시작점
                      end={{ x: 1, y: 0 }} // 그라디언트 끝점
                      style={{
                        position: 'absolute',
                        width: screenWidth * 0.22,
                        top: -16,
                        left: -1,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 15,
                        zIndex: 1, // 이 탭이 다른 요소 위에 나타나도록 설정
                        ...shadowStyle
                      }}
                    >
                    <Text style={{ color: 'white', fontWeight: 'bold' ,fontSize:14/height,justifyContent:'center',alignItems:'center'}}>추천해요!</Text>
                  </LinearGradient>

                  {/* 내부 텍스트 컨테이너 */}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.Body1}>{product.name}</Text>
                    <Text style={styles.caption2}>20% 할인</Text>
                  </View>

                  {/* 가격 컨테이너 */}
                  <TouchableOpacity style={styles.PriceContainer}>
                    <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={styles.caption1}>{product.amount.toLocaleString()}원</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }
          // 다른 id에 대한 컴포넌트 렌더링을 계속할 수 있습니다.
        })}
      </View>


          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {[5].map((productId) => {
              const product = membershipProducts.find(product => product.id === productId);
              return (
                <TouchableOpacity key={product.id} style={styles.MemberShipContainer} onPress={() => handlePayment(product.name, product.amount, product.duration, product.type, product.total_time)}>
                  <View style={{ flex: 1, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.Body1}>{product.name}</Text>
                      <Text style={styles.caption2}>10% 할인</Text>
                    </View>
                    <TouchableOpacity style={styles.PriceContainer}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.caption1}>{product.amount.toLocaleString()}원</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          

{/* 트레이너 이용권 */}


          <View >
            <Text style={{fontSize:22,fontWeight:'bold',marginTop:30}}>트레이너 이용권</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {[6].map((productId) => {
              const product = membershipProducts.find(product => product.id === productId);
              return (
                <TouchableOpacity key={product.id} style={styles.MemberShipContainer} onPress={() => handlePayment(product.name, product.amount, product.duration, product.type, product.total_time)}>
                  <View style={{ flex: 1, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.Body1}>{product.name}</Text>
                      {/* <Text style={styles.caption2}>10% 할인</Text> */}
                    </View>
                    <TouchableOpacity style={styles.PriceContainer}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.caption1}>{product.amount.toLocaleString()}원</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {[7].map((productId) => {
              const product = membershipProducts.find(product => product.id === productId);
              return (
                <TouchableOpacity key={product.id} style={styles.MemberShipContainer} onPress={() => handlePayment(product.name, product.amount, product.duration, product.type, product.total_time)}>
                  <View style={{ flex: 1, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.Body1}>{product.name}</Text>
                      <Text style={styles.caption2}>3% 할인</Text>
                    </View>
                    <TouchableOpacity style={styles.PriceContainer}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.caption1}>{product.amount.toLocaleString()}원</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 24 ,paddingBottom:40}}>
        {membershipProducts.map((product) => {
          if (product.id === 8) {
            return (
              <TouchableOpacity key={product.id}
                style={{
                  ...shadowStyle,
                  height: 88,
                  width: '100%',
                  borderRadius: 16,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  marginTop:'3%',
                  borderColor: '#4169E1',
                  position: 'relative', // 탭을 오버레이하기 위한 설정
                }} 
                onPress={() => handlePayment(product.name, product.amount, product.duration, product.type, product.total_time)}>

                <View style={{ flex: 1, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* 탭 디자인 */}
                  <LinearGradient
                      colors={['#4169E1', '#6026fe']} // 그라디언트 색상 배열
                      start={{ x: 0, y: 0 }} // 그라디언트 시작점
                      end={{ x: 1, y: 0 }} // 그라디언트 끝점
                      style={{
                        position: 'absolute',
                        width: screenWidth * 0.22,
                        top: -16,
                        left: -1,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 15,
                        zIndex: 1, // 이 탭이 다른 요소 위에 나타나도록 설정
                        ...shadowStyle
                      }}
                    >
                    <Text style={{ color: 'white', fontWeight: 'bold' ,fontSize:14/height,justifyContent:'center',alignItems:'center'}}>추천해요!</Text>
                  </LinearGradient>

                  {/* 내부 텍스트 컨테이너 */}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.Body1}>{product.name}</Text>
                    <Text style={styles.caption2}>7% 할인</Text>
                  </View>

                  {/* 가격 컨테이너 */}
                  <TouchableOpacity style={styles.PriceContainer}>
                    <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={styles.caption1}>{product.amount.toLocaleString()}원</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }
          // 다른 id에 대한 컴포넌트 렌더링을 계속할 수 있습니다.
        })}
      </View>
          <EventComponent
                visible={eventVisible}
                onClose={() => setEventVisible(false)}
            />
        </View>
      <View style={{width:screenWidth,backgroundColor:'#F8F9FA',paddingBottom:40,paddingHorizontal:24}}>
      <Text style={{color:'#4D79FF',fontWeight:'bold',fontSize:20,marginTop:40}}>꼭 확인하세요!</Text>
        <Text style={{color:'#868E96',fontWeight:'bold',fontSize:12,marginTop:24}}>· 구매시점을 기준으로 유효기간이 차감됩니다.</Text>
        <Text style={{color:'#868E96',fontWeight:'bold',fontSize:12,marginTop:8}}>· 1개월 기간권의 경우 일일 최대 이용가능 시간은 1시간 30분 입니다.</Text>
        <Text style={{color:'#868E96',fontWeight:'bold',fontSize:12,marginTop:8}}>· 해피타임 이용권의 경우 오후 6~10시 예약의 경우 최대 1시간 예약이 가능합니다</Text>
        <Text style={{color:'#868E96',fontWeight:'bold',fontSize:12,marginTop:8}}>· 트레이너 대관 상품의 경우 1:1PT를 진행하는 트레이너분들을 위한 상품입니다.</Text>
        <Text style={{color:'#868E96',fontWeight:'bold',fontSize:12,marginTop:8}}>· 2:1PT를 진행하는 트레이너 분들은 추가요금 문의 부탁드립니다.</Text>
      </View>
      </ScrollView>
    )
  );
};



export default MembershipPurchaseScreen;

const styles = StyleSheet.create({
  subtitle:{
    fontSize:22,
    fontWeight:'bold',
    marginTop:30
},
  membershipContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  PriceContainer:{
    width:100/width,
    height:40/height,
    borderRadius:8,
    backgroundColor:'#F1F3F5'
  },
  MemberShipContainer: {
    ...shadowStyle,
    height:88/height,
    width: '100%',
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  Body1:{
    fontSize:17,
    color:'black',
    fontWeight:'bold'
  },
  caption1:{
    fontSize:14,
    fontWeight:'500'
  },
  caption2:{
    fontSize:12,
    color:'#4169E1'
  },
  // svgContainer: {
  //   position: 'absolute', // 대각선을 배경 위에 오버레이하기 위해 절대 위치 사용
  //   top: 0,
  //   left: 140,
  //   right: 0,
  //   bottom: 0,
  // },
});
