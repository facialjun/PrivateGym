import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal ,Image} from 'react-native';
import moment from 'moment-timezone';
import { screenWidth } from '../../screens/RoomADetailScreen';
import config from '../../config';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign  from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'native-base';
import { height, width } from '../../screens/HomeScreen';
 



export const UsingCouponComponent = ({ visible, onClose, onDiscountChange  }) =>  {
  const BASE_URL = config.SERVER_URL;
  const navigation= useNavigation();
  const [uid, setUid] = useState(null);
  const [downloadedCoupons, setDownloadedCoupons] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [discountamount,setDiscountAmount]= useState([])

  //Uid값을 들고온 후에 쿠폰 다운로드 정보에서 쿠폰아이디를 통해 쿠론의 정보를 함께 들고옴
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {

          let storedLogId = await AsyncStorage.getItem('logId');
          if (storedLogId) {
            storedLogId = storedLogId.replace(/^['"](.*)['"]$/, '$1');
            console.log("데이터를 성공적으로 가져왔습니다.");
            
   
            const uidResponse = await fetch(`${BASE_URL}/user/${storedLogId}`);
            const uidData = await uidResponse.json();
            setUid(uidData.uid);
            
            // 가져온 UID를 사용하여 쿠폰 다운로드 정보의 couponid값으로 쿠폰정보를 함께 leftjoin으로 가져옴 
            // 유효한 다운로드 쿠폰만을 가져옴 (staus = '1' )
            const response = await axios.get(`${BASE_URL}/downloadcoupons/${uidData.uid}`);
            setDownloadedCoupons(response.data);
            console.log(response.data); // 콘솔에 쿠폰 정보 출력
          }
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생: ", error);
        }
      };

      fetchData().catch(console.error);
    }, [])
  );
  
const handlePress = (index) => {
    const currentIsSelected = !isSelected; // 현재의 선택 상태를 반전
    setIsSelected(currentIsSelected); // 상태 업데이트
    let selectedAmount = 0;
    let downloadId = null;

    if (currentIsSelected) {
        // 새로운 상태가 '선택됨'일 때
        if (downloadedCoupons.length > 0) {
            selectedAmount = downloadedCoupons[index].discount_amount;
            downloadId = downloadedCoupons[index].download_id;
        }
    } else {
        // 새로운 상태가 '선택되지 않음'일 때
        // 필요한 경우 여기에 로직 추가
    }
    // 선택된 할인 금액과 downloadId를 부모 컴포넌트에 알림
    onDiscountChange(selectedAmount, downloadId);
 
  
    onClose(); // 모달 닫기 또는 추가 액션
};

  
  
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
      <View style={{width:screenWidth/7,height:8,borderRadius:16,backgroundColor:'white',marginBottom:10}}></View>
        <View style={{backgroundColor: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Text style={styles.headerText1}>쿠폰</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>onClose()}>
              <MaterialIcons name="close" size={24} color="#868E96" />
            </TouchableOpacity>
          </View>

            <View style={styles.coupon}>
              {downloadedCoupons.length > 0 ? (
                downloadedCoupons.map((coupon, index) => (
                  <View key={coupon.id || index} style={{ backgroundColor: 'white', borderRadius: 8, width: '100%', marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{backgroundColor: 'white'}}>
                      <Text style={{fontSize: 20, fontWeight: '400'}}>{coupon.title}</Text>
                      <Text style={{fontSize: 22, fontWeight: '700', marginTop: 4}}>{coupon.discount_amount.toLocaleString()}원</Text>
                      <Text style={{color: '#A5A5A8', fontWeight: '700', marginTop: 4}}>{new Date(coupon.expiration_date).toLocaleDateString()}까지</Text>
                      <Text style={{color: '#A5A5A8', fontWeight: '700', marginTop: 4}}>{coupon.terms_and_conditions}</Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        height: 32,
                        width: 32,
                        borderRadius: 100,
                        backgroundColor: isSelected ? 'white' : '#DEE2E6',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => handlePress(index)} // onPress 이벤트에 handlePress 함수를 연결
                    >
                      {isSelected && (
                        <MaterialIcons name="check-circle" size={34} color="#4169E1" />
                      )}
                    </TouchableOpacity>
                  </View>
                ))
                ) : (
                  <View style={{flex:1,backgroundColor:'white'}}>
                    <Text style={{fontSize:18,fontWeight:'700'}}>나의 보유쿠폰 {downloadedCoupons.length}개 </Text>
                    <View style={{width:'100%',justifyContent:'center',alignItems:'center',flex:1,backgroundColor:'white'}}>
                      <Image source={require('../../images/noCouponIcon.png')} style={{width:148/height,height:80/height}}/>
                      <Text style={{fontSize: 16,color:'#868E96',marginTop:24}}>*적용가능한 쿠폰이 없습니다.</Text>
                    </View>
                  </View>
                )}
            </View>
        </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'center',
      padding: 16,
      backgroundColor:'white',
      marginHorizontal:8,
    },
    headerText1: {
      fontSize: 20,
      fontWeight:'600'
    },
    headerText2: {
      fontSize: 14,
    },
    coupon: {
      width: screenWidth,
      height:300,
      flexDirection: 'row',
      flexWrap: 'wrap', 
      justifyContent: 'space-between', 
      backgroundColor:'white',
      paddingHorizontal:24,
      paddingBottom:16
    },
    modalContainer: {
      maxHeight: '80%', // 모달의 최대 높이를 설정
      width: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: 'white',
      overflow: 'hidden', // ScrollView 스크롤이 모달 범위를 넘어가지 않도록 설정
    },
   
   
  });
  

export default UsingCouponComponent


