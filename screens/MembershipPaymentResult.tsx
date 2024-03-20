import React, { useEffect } from 'react';
import { Icon, IconButton, List, Text,View,Image } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { BackHandler } from 'react-native';
import { MainScreens } from '../stacks/Navigator';




function getBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return undefined;
}


const PaymentResult = ({ route, navigation }) =>{
  const imp_success = route.params?.imp_success;
  const success = route.params?.success;
  const imp_uid = route.params?.imp_uid;
  const tx_id = route.params?.txId;
  const merchant_uid = route.params?.merchant_uid;
  const payment_id = route.params?.paymentId;
  const error_code = route.params?.error_code;
  const code = route.params?.code;
  const message = route.params?.message;
  const error_msg = route.params?.error_msg;

  const isSuccess =
    getBoolean(imp_success) ??
    getBoolean(success) ??
    (error_code == null && code == null);

    useEffect(() => {
    const handleBackPress = () => {
      return true; // 이벤트 처리 완료를 알리기 위해 true를 반환합니다.
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너를 제거합니다.
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
      }}
    >
      {isSuccess ? (
        <View style={{borderRadius:10,}}>
          <Image 
          style={{width:200,height:200,marginBottom:'7%'}}
          source={require('../images/Paid.png')}
          alt="Paid"
          />
          
        </View>
      ) : (

        <View style={{borderRadius:10,}}>
          <Image 
          style={{width:230,height:180,}}
          source={require('../images/notPaid.png')}
          alt="Not Paid"
          />
          
        </View>
        

      )}
      <Text fontSize={22} fontWeight={'bold'} mb={20} color={isSuccess ? '#4A7AFF' : 'red'}>{`${
        isSuccess ? '결제가 완료되었습니다!' : '결제에 실패하였습니다.'
      }`}</Text>
      <List width={'90%'} mb={50} >
        {isSuccess ? (
          <><List.Item>
            <Text style={{left:'90%'}} w={'40%'}>상품명</Text>
            <Text style={{left:'90%'}} w={'60%'}>{imp_uid ?? tx_id}</Text>
          </List.Item>
          <List.Item>
              <Text style={{left:'90%'}} w={'40%'}>주문번호</Text>
              <Text style={{left:'90%'}} w={'60%'}>{merchant_uid ?? payment_id}</Text>
            </List.Item></>
        ) : (
          <List.Item>
            <Text style={{left:'90%'}} w={'40%'}>ERROR CODE</Text>
            <Text style={{left:'90%'}} w={'60%'}>{'결제에 실패하셨습니다.'}</Text>
          </List.Item>
        )}
      </List>
      <IconButton
        icon={<Icon as={FontAwesome} name={'arrow-left'} size={20} />}
        onPress={() => navigation.navigate(MainScreens.MyInfo)} //// reload 되면서 내 정보로 갈수 있도록 코드 수정 
      >
        <Text>돌아가기</Text>
      </IconButton>
    </View>
  );
}

  

export default PaymentResult