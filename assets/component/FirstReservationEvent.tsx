import { ConsoleLogger } from '@aws-amplify/core';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal,Image, Linking, Alert } from 'react-native';
import moment from 'moment-timezone';
import { screenWidth } from '../../screens/RoomADetailScreen';
import { screenHeight } from '../../screens/MembershipRoomCDetailScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { height } from '../../screens/HomeScreen';
import { MainScreens, MainStackParamList } from '../../stacks/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import config from '../../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = config.SERVER_URL;



type eventNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
      'Membership' | 'MembershipPurchase1' 
>;

interface eventProps {
    route: RouteProp<MainStackParamList, 'Event'>;
    navigation: eventNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};






export const FirstReservationEventComponent: React.FunctionComponent<eventProps>  = ({ visible,onClose }) =>  {
  const navigation= useNavigation();
  const [coupons, setCoupons] = useState([]); // 쿠폰 정보를 저장할 상태
  const [uid, setUid] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [duration,setDuration]= useState(null)
   
   
   useEffect(() => {
    const getCoupons = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/coupons`);
        console.log(response.data); // 콘솔에 쿠폰 정보 출력
        setCoupons(response.data); // 쿠폰 정보를 상태로 저장
        console.log(response.data[0].coupon_id)
        setSelectedCouponId(response.data[0].coupon_id)
        setDuration(response.data[0].duration)
      } catch (error) {
        console.error('쿠폰 정보를 불러오는 데 실패했습니다:', error);
      }
    };

    getCoupons(); // 함수 호출
  }, []); // 빈 배열을 의존성 목록으로 전달하여 컴포넌트 마운트 시에만 호출되도록 함

  useFocusEffect(
    React.useCallback(() => {
        async function fetchData() {
            try {
                let storedLogId = await AsyncStorage.getItem('logId');
                if (storedLogId) {
                    storedLogId = storedLogId.replace(/^['"](.*)['"]$/, '$1');
                    console.log("데이터를 성공적으로 가져왔습니다.");
                    const uidResponse = await fetch(`${BASE_URL}/user/${storedLogId}`);
                    const uidData = await uidResponse.json();
                    setUid(uidData.uid)
                }
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생: ", error);
            } 
        }


        fetchData().catch(console.error);
    }, [])
);

const downloadCoupon = async (uid, selectedCouponId,duration) => {
  console.log(uid,selectedCouponId)
  if (!uid || !selectedCouponId) {
    alert('사용자 정보 또는 쿠폰 정보가 누락되었습니다.');
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/downloadcoupon`, {
      uid,
      coupon_id: selectedCouponId,
      duration: duration
    });
    console.log(response.data); // 성공 메시지 출력
    Alert.alert("쿠폰 발급",'쿠폰이 성공적으로 다운로드되었습니다.');
  } catch (error) {
    // 서버로부터 오류 응답을 받았을 경우
    if (error.response) {
      // 서버가 반환한 오류 메시지를 사용자에게 보여줌
      Alert.alert("쿠폰 발급 실패" , error.response.data);
    } else {
      // 요청이 서버에 도달하기 전에 오류가 발생한 경우
      Alert.alert("쿠폰 발급" ,'쿠폰 다운로드 요청 중 오류가 발생했습니다.');
    }
  }
};
   return (
        <Modal visible={visible} transparent={true} animationType="slide" >
                <View style={styles.modalContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity style={{right:'auto'}} onPress={()=>onClose()}>
                            <MaterialIcons name="close" size={24} color="#868E96" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>EVENT</Text>
                            <MaterialIcons name="close" size={24} color="white" />
                    </View>
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <ScrollView>
                        <View>
                          <Image 
                          source={require('../../images/FirstReservationEventDetail.png')}
                          style={{width:screenWidth,height:screenWidth}}
                          />
                        </View>
                        <View style={{width:screenWidth,backgroundColor:'#F58554',alignItems:'center',paddingBottom:40}}> 
                          <View style={{width:60,height:30,backgroundColor:'#4169E1',borderRadius:16,justifyContent:'center',alignItems:'center',marginTop:40}}>
                            <Text style={{fontWeight:'600',color:'white'}}>혜택 1</Text>
                          </View>
                          <Text style={{fontWeight:'700',color:'#4169E1',fontSize:24,marginTop:24}}>신규 회원가입 고객 모두</Text>
                          <Text style={{fontWeight:'700',color:'white',fontSize:28,marginTop:8}}>첫 1시간 이용은</Text>
                          <Text style={{fontWeight:'700',color:'white',fontSize:28}}>무료 이용!</Text>
                          <Image 
                          source={require('../../images/FirstReservationEventCoupon.png')}
                          style={{width:screenWidth*0.6,height:screenWidth*0.3,marginTop:40}}
                          />
                          <TouchableOpacity 
                          onPress={() => downloadCoupon(uid, selectedCouponId,duration)}
                          style={{width:screenWidth-48,height:48,backgroundColor:'#4169E1',borderRadius:8,justifyContent:'center',alignItems:'center',marginTop:40}}
                          >
                            <Text style={{fontSize:18,color:'white',fontWeight:'bold'}}>쿠폰 다운로드 받기</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor:'black',paddingHorizontal:24,paddingBottom:40}}>
                          <Text style={{color:'#4D79FF',fontWeight:'bold',fontSize:20,marginTop:40}}>꼭 확인하세요!</Text>
                           <Text style={{color:'#F8F9FA',fontWeight:'bold',fontSize:12,marginTop:24}}>· 신규 회원가입 유저에 한해 사용할 수 있는 쿠폰입니다.</Text>
                           <Text style={{color:'#F8F9FA',fontWeight:'bold',fontSize:12,marginTop:8}}>· 신규 예약 1건에 적용가능합니다.</Text>
                           <Text style={{color:'#F8F9FA',fontWeight:'bold',fontSize:12,marginTop:8}}>· 총 예약금액이 10,000원을 넘을 경우 적용가능합니다.</Text>
                           <Text style={{color:'#F8F9FA',fontWeight:'bold',fontSize:12,marginTop:8}}>· 다운로드 된 쿠폰은 30일 동안 유효합니다.</Text>
                           <Text style={{color:'#F8F9FA',fontWeight:'bold',fontSize:12,marginTop:8}}>· 본 이벤트 내용은 당사 사정에 따라 예고 없이 변경 또는 중단 될 수 있습니다.</Text>
                        </View>
                      </ScrollView>
                    </View>
                </SafeAreaView>
               
                </View>
        </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,

      backgroundColor: 'white',
    },
    header: {
      marginTop:10,
      width:screenWidth,
      height:60,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
      paddingHorizontal:10,
      flexDirection:'row'
    },
    closeButton: {
      fontSize: 16,
      color: '#0000ff',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    content: {
      padding: 20,
      // Additional content styles
    },
    Bottombox:{
        backgroundColor:'white',
        height:80,
        width:screenWidth,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:24
    },
    BottomboxContent:{
        backgroundColor:'#4169E1',
        height:48,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8
    },
    BottomboxText:{
        fontSize: 16,
        color: 'white',
        fontWeight:'600'
    }
  });
  

export default FirstReservationEventComponent;
