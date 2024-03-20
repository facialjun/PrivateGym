import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text,Image,StyleSheet, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { PTScreens, PTStackParamList } from '../stacks/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { RouteProp } from '@react-navigation/native';
import { Dimensions, TextInput, TouchableOpacity, View } from 'react-native';
import {Linking} from 'react-native';
import config from '../config';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
const BASE_URL = config.SERVER_URL;
const WIDTH = Dimensions.get("screen").width


//////////////////////////////////////////////////////////////// 코드 타입정의


type PaymentTestNavigationProps = StackNavigationProp<
    PTStackParamList,
    PTScreens.Payment
    >

    interface PaymentTestProps {
      navigation: PaymentTestNavigationProps;
      route: RouteProp<PTStackParamList, PTScreens.Payment>;
    }
    

const PaymentTest: React.FunctionComponent<PaymentTestProps> = ({ route,navigation }) => {
   const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);
  
    useEffect(() => {
      AsyncStorage.getItem('logId')
      .then((data) => {
          if (data) {
              // logId에서 따옴표 제거
              const cleanedLogId = data.replace(/^['"](.*)['"]$/, '$1');
              setLogId(cleanedLogId);
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
              const userData = response.data;
              console.log(userData);
              console.log(logId);
              console.log(response.data);
              setUserData(userData);
          } catch (error) {
              console.log('Error fetching user data:', error);
          }
      };
  
      if (logId) {
          fetchUserData();
      }
  }, [logId]);
  




 
  //고유한 주문번호 생성
  const now = new Date();
  const timestamp = now.getTime(); // 밀리초 단위 타임스탬프
  const milliseconds = now.getMilliseconds(); // 현재 밀리초
  const [merchantUid, setMerchantUid] = useState(`mid_${timestamp}_${milliseconds}`);

  const [buyerName, setBuyerName] = useState(null);
  const [buyerTel, setBuyerTel] = useState('');
  const [buyerEmail, setBuyerEmail] = useState(null);
  const { name, amount,session,trainerId,uri } = route.params || {};
  


    useEffect(() => {
    if (userData) {
      setBuyerName(userData.username);
      setBuyerTel(userData.phone_number);
      setBuyerEmail(userData.email);
    }
  }, [userData]);


  

  const handlePayment = async (name) => {
    const data = {
      params: {
        pg: 'html5_inicis',
        pay_method: 'card',
        notice_url:`${BASE_URL}/portone-webhook`,
        currency: undefined,
        display: undefined,
        merchant_uid: merchantUid,
        name,
        amount,
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
      await AsyncStorage.setItem('productName', name)
      const stringifiedSession = String(session);
      await AsyncStorage.setItem('Session', stringifiedSession);
      const stringifeiedTrainerID=String(trainerId)
      console.log(stringifeiedTrainerID)
      await AsyncStorage.setItem('TrainerId', stringifeiedTrainerID);
      await axios.post(`${BASE_URL}/payment/requests`, data); //// / ? _

      navigation.navigate(PTScreens.Payment, data.params);
      console.log(data)
    } catch (error) {
      console.error('결제 요청 중 오류가 발생했습니다.', error);
    }
  };

  return (
  <>
    <ScrollView>
     <View style={{height:1000,backgroundColor:'white'}}>
      <View style={{width:WIDTH,height:WIDTH*0.6,backgroundColor:'white'}}>
        <View style={{flex:1,backgroundColor:'white',flexDirection:'space-between'}}>
          <Text style={{fontSize:23 ,fontWeight:'bold',color:'#4F4F4F',marginLeft:'7%',marginTop:'auto'}}>
          상품 정보
          </Text>
        </View>
        <View style={{flex:3,backgroundColor:'white'}}>
          <View style={{flexDirection:'row',flex:1,backgroundColor:'white'}}>
           <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
              <Image
                style={{
                  width: '68%',
                  height: '71%',
                  borderRadius:15,
                  
                }}
              source={{uri:uri}}/>
           </View>
          <View style={{justifyContent:'center',flex:1}}>
              <Text style={{fontSize:19,color:'#4F4F4F',fontWeight:'bold'}}>
                {name} 트레이너
              </Text>
              <Text style={{color:'#797676',fontSize:14}}>짐프라이빗</Text>
              <Text style={{color:'#4169E1',fontSize:15,fontWeight:'bold',marginTop:'30%'}}>1:1PT {session}회 {amount.toLocaleString()}원</Text>
          </View>
          </View>
        </View>
      </View>
     </View>
    </ScrollView>
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        width: '100%',
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: '#4169E1',
          padding: 15,
          marginHorizontal: 16,
          borderRadius: 20,
          alignItems: 'center',
        }}
        onPress={() => handlePayment(name)}
      >

        <Text
          style={{
            color:'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {amount.toLocaleString()}원 결제하기
        </Text>
      </TouchableOpacity>
    </View>
  </>


  );

}


const styles = StyleSheet.create({
  input: {
    marginTop:15,
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderRadius: 5,
    width: WIDTH * 0.85,
    height: WIDTH * 0.12,
    paddingHorizontal:10,
    backgroundColor:'#FCF8F8'
  },
  inputText:{
    marginTop:20,
    fontSize:14,
    fontWeight:'bold',
    color:'#797676'
  }
})

export default PaymentTest