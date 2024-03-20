import React from 'react';
import IMP from 'iamport-react-native';
import Loading from '../Loading';
import { StackNavigationProp } from '@react-navigation/stack';
import { PTScreens, PTStackParamList } from '../stacks/Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView, View } from 'react-native';
import config from '../config';
////////////////////////////////////////////////////////////////////////

type PaymentTestNavigationProps = StackNavigationProp<
    PTStackParamList,
    PTScreens.Payment
    >

    interface PaymentTestProps {
      navigation: PaymentTestNavigationProps;
    }


////////////////////////////////////////////////////////////////

 



const Payment= ({ navigation, route }) => {
  // 주문내역 정보가 들어있음
  const params = route.params; // Get the params directly from route.params
  console.log(params);
  const BASE_URL = config.SERVER_URL;
  
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  
  
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
  
  const handlePaymentComplete = async (response) => {
    try {
      const merchantUid = response.merchant_uid;
      const paymentRequest = await fetchUpdatedPaymentRequest(merchantUid);
      console.log(paymentRequest[0].state);
  
      if (paymentRequest[0].state === 'paid') {
        await handleSubmit(merchantUid);
        console.log(paymentRequest[0].state);
        navigation.replace(PTScreens.PaymentResult, response);
      } else {
        navigation.replace(PTScreens.PaymentResult, response);
      }
    } catch (error) {
      console.error(error.response);
    }
  };
  
  // 결제 요청 데이터를 가져오기 위한 새로운 함수 생성
  const handleSubmit = async (merchantUid) => {
    try {
        let logId = await AsyncStorage.getItem('logId');

        // logId가 존재하면 양쪽의 따옴표 제거
        if (logId) {
            logId = logId.replace(/^['"](.*)['"]$/, '$1');
            console.log(logId);
        }

        const productName = await AsyncStorage.getItem('productName');
        const Gender = await AsyncStorage.getItem('Gender');
        const Session = await AsyncStorage.getItem('Session');
        const TrainerId = await AsyncStorage.getItem('TrainerId');

        await axios.post(`${BASE_URL}/training_membership`, {
            name: productName,
            logId: logId,
            merchantUid: merchantUid,
            pstate: 1,
            Gender: Gender,
            Session: Session,
            TrainerId: TrainerId
        });

        console.log('Reservation created successfully');
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
        callback={handlePaymentComplete}
      />
    </SafeAreaView>
  );
};

export default Payment;
