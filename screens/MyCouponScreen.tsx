import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View ,TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const MyCouponScreen = () => {
  const BASE_URL = config.SERVER_URL;
  const navigation= useNavigation();
  const [uid, setUid] = useState(null);
  const [downloadedCoupons, setDownloadedCoupons] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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

   // 만료 날짜가 몇 일 남았는지 계산하는 함수
   const calculateDaysLeft = (expirationDate) => {
    const today = new Date(); // 현재 날짜와 시간
    const expDate = new Date(expirationDate); // 만료 날짜
    const timeDiff = expDate.getTime() - today.getTime(); // 밀리초 단위의 차이
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 일 단위로 변환
    return daysLeft;
  };


  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={{flex:1,paddingHorizontal:24,paddingBottom:24}}>
      <Text style={{fontSize: 18,fontWeight:'700'}}>보유쿠폰 {downloadedCoupons.length}개</Text>
      <ScrollView>
        {downloadedCoupons.map((coupon, index) => (
          <View key={index} style={{ backgroundColor: 'white',borderRadius:8,width:'100%',paddingHorizontal:16,paddingTop:16,marginTop:24}}>
            <View style={{width:52,height:18,backgroundColor:'#C0D7FB',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'#4169E1',fontWeight:'bold',fontSize:11}}>발급쿠폰</Text>
            </View>
            <Text style={{fontSize: 22,fontWeight:'600',marginTop:8}}>{coupon.title}</Text>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:4,borderBottomWidth:0.5,borderBottomColor:'#A5A5A8',paddingBottom:16}}>  
              <Text style={{color:'#4169E1',fontWeight:'700'}}>{calculateDaysLeft(coupon.expiration_date)}일 남음 </Text>
              <Text style={{color:'#A5A5A8',fontWeight:'700'}}>{new Date(coupon.expiration_date).toLocaleDateString()}까지</Text>
            </View>
            {!showDetails && (
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center', height: 40}}
              onPress={() => setShowDetails(true)} // 버튼 클릭 시 showDetails를 true로 설정
            >
              <Text style={{color: '#A5A5A8', fontWeight: 'bold'}}>자세히보기</Text>
            </TouchableOpacity>
          )}

          {/* 이용 조건 텍스트 (showDetails가 true일 때 표시) */}
          {showDetails && (
          <View style={{height:68,justifyContent:'center'}}>
            <Text style={{fontWeight:'bold',color: '#A5A5A8',fontSize:11}}>사용조건</Text>
            <Text style={{marginTop:4,fontWeight:'500',fontSize:13}}>{coupon.terms_and_conditions}</Text>
          </View>
          )}
     </View>
            ))}
      </ScrollView>
    </View>
  </SafeAreaView>
);
}

