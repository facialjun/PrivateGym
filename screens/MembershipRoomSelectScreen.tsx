import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { View,Text,TouchableOpacity,StyleSheet,ScrollView, Dimensions, Platform,Image } from 'react-native'
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MembershipScreens, MembershipStackParamList } from '../stacks/Navigator';
import config from '../config'
import LottieView from 'lottie-react-native';
import { BackHandler } from 'react-native';

////////////////////////////////////////////////////////////////

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const BASE_URL = config.SERVER_URL;

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    android: {
        elevation: 10,
    },
})

////////////////////////////////////////////////////////////////////////


type MembershipRoomSelectScreenNavigationProps = StackNavigationProp<
    MembershipStackParamList,
    MembershipScreens.MembershipRoomSelect
>;

interface MembershipRoomSelectScreenProps {
    navigation: MembershipRoomSelectScreenNavigationProps;
};

////////////////////////////////////////////////////////////////////////

const saveRoomTypeToAsyncStorage = async (roomNumber: number) => {
    try {
        // roomType에 대한 정보를 AsyncStorage에 저장
        await AsyncStorage.setItem('selectedRoomNumber', JSON.stringify(roomNumber));
        console.log('Saved selected room number');
        console.log(roomNumber);

        // Send a POST request to the backend using axios
        await axios.post(`${BASE_URL}/reservations`, { roomNumber: roomNumber });

        console.log('POST request sent successfully');
    } catch (error) {
        // AsyncStorage 저장 중 오류 발생 시 처리
        console.log('Error saving room type to AsyncStorage:', error);
    }
};

const MembershipRoomSelectScreen:React.FunctionComponent<MembershipRoomSelectScreenProps> = (props) => {
const { navigation } = props;
const [averageRatings, setAverageRatings] = useState([]);
const [isLoading, setIsLoading] = useState(true);

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
      const roomNumbers = [1, 2, 3]; // 가져올 방번호들을 배열로 설정

      const fetchAverageRatings = async () => {
        setIsLoading(true); // 데이터 로딩 시작 전에 isLoading을 true로 설정
        try {
          const promises = roomNumbers.map((roomNumber) =>
            fetch(`${BASE_URL}/average_rating/${roomNumber}`)
              .then((response) => response.json())
              .then((data) => (data.average_rating !== null ? data.average_rating.toFixed(2) : "0.00")) // 리뷰값이 없을 경우 "0.00"으로 표현
          );

          const ratings = await Promise.all(promises);
          setAverageRatings(ratings);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false); // 데이터 로딩 완료 또는 에러 발생 후에 isLoading을 false로 설정
        }
      };

      fetchAverageRatings();
    }, []);

    //데이터 로딩이 끝날때 까지 로딩화면 재생
    if (isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <LottieView
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
            source={require('../src/lottie/loading.json')}
          />
        </View>
      );
    }
    
    return (
  <ScrollView>
        <View style={{justifyContent:'center', alignItems:'center',height:'auto',backgroundColor:'white'}}>
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(MembershipScreens.MembershipRoomADetail)
                    saveRoomTypeToAsyncStorage(1);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={styles.roomImage}
                        source = {require('../images/rooms1.jpg')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06, }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 1번방</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[0]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../images/placeholder.png')}
                style={{ width: screenWidth * 0.037, height: screenWidth * 0.04 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>봉천역 1번출구 도보 5분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩5,000/30분</Text>
            
              </View>
            </View>
            </View>
          
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(MembershipScreens.MembershipRoomBDetail)
                        saveRoomTypeToAsyncStorage(2);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={{width:'100%',height:'100%',borderRadius:20}}
                        source = {require('../images/rooms2.jpg')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 2번방</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[1]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../images/placeholder.png')}
                style={{ width: screenWidth * 0.035, height: screenWidth * 0.045 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>봉천역 1번출구 도보 5분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩5,000/30분</Text>
                
              </View>
              </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(MembershipScreens.MembershipRoomCDetail)
                        saveRoomTypeToAsyncStorage(3);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={{width:'100%',height:'100%',borderRadius:20}}
                        source = {require('../images/rooms3.jpeg')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 3번방</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[2]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../images/placeholder.png')}
                style={{ width: screenWidth * 0.035, height: screenWidth * 0.045 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>봉천역 1번출구 도보 5분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩5,000/30분</Text>
                  
              </View>
              </View>
            </View>
      </View>
    </ScrollView>
    );
}

export default MembershipRoomSelectScreen

const styles = StyleSheet.create({
    roomContainer: {
        ...shadowStyle,
        height:'80%',
        width:'90%',
        borderRadius:20,
        backgroundColor: 'white',
    },
    roomImage:{
        width:'100%',
        height:'100%',
        borderRadius:20
    }
    
})