import React from 'react';
import IMP from 'iamport-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../Loading'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MembershipPurchaseParamList, MembershipPurchaseScreens  } from '../stacks/Navigator';
import config from '../config'
import { View } from 'react-native';


const BASE_URL = config.SERVER_URL;

type MembershipPurchaseScreenNavigationProps = StackNavigationProp<
  MembershipPurchaseParamList,
  MembershipPurchaseScreens.MembershipPurchase
>;

interface MembershipPurchaseScreenProps {
  route: RouteProp<MembershipPurchaseParamList, 'MembershipPurchase'>;
  navigation: MembershipPurchaseScreenNavigationProps;
}


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

const handlePaymentComplete= (navigation) =>  async (response) => {
  try {
    const merchantUid = response.merchant_uid;
    const paymentRequest = await fetchUpdatedPaymentRequest(merchantUid);
    console.log(paymentRequest[0].state);

    if (paymentRequest[0].state === 'paid') {
      await handleSubmit(merchantUid);
      console.log(paymentRequest[0].state);
      navigation.replace(MembershipPurchaseScreens.MembershipPaymentResult, response);
    } else {
      navigation.replace(MembershipPurchaseScreens.MembershipPaymentResult, response);
    }
  } catch (error) {
    console.error(error.response);
  }
};

// 결제 요청 데이터를 가져오기 위한 새로운 함수 생성
const handleSubmit = async (merchantUid) => {
    try {
        const logId = await AsyncStorage.getItem('logId');
        const productName = await AsyncStorage.getItem('productName');
        const productDuration = await AsyncStorage.getItem('productDuration');
        const productType = await AsyncStorage.getItem('type');
        const productTotaltime = await AsyncStorage.getItem('productTotaltime');

     await axios.post(`${BASE_URL}/period_membership`, {
        name: productName,
        duration: productDuration,
        logId: logId,
        merchantUid: merchantUid,
        pstate: 1,
        type:productType,
        productTotaltime:productTotaltime
        });
        console.log(productType)
        console.log('created successfully');
    // 응답에 대한 처리
    } catch (error) {
        console.error(error);
    }
};


const MembershipPayment= ({ navigation, route }) => {
  // 주문내역 정보가 들어있음
  const params = route.params; // Get the params directly from route.params
  console.log(params);
  
  return (
    <SafeAreaView style={{ flex: 1}}>
      <IMP.Payment
        userCode="imp11480521"
        loading={<Loading />}
        data={params}
        callback={handlePaymentComplete(navigation)}
      />
    </SafeAreaView>
  );
};

export default MembershipPayment;



