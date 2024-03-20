import { StackNavigationProp } from '@react-navigation/stack';
import React,{useEffect,useState} from 'react'
import { View,ScrollView,Text,StyleSheet,TouchableOpacity, Dimensions, Platform,RefreshControl,FlatList,Image } from 'react-native'
import { BookingScreens, BookingStackParamList } from '../stacks/Navigator';
import { roomPictures } from '../slots/roomPictures';
import config from '../config'
import LottieView from 'lottie-react-native';
import { height } from './HomeScreen';

const BASE_URL = config.SERVER_URL;
export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;

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

type RoomBDetailScreenNavigationProps = StackNavigationProp<
    BookingStackParamList,
    BookingScreens.RoomBDetail
>;

interface RoomBDetailScreenProps {
    navigation: RoomBDetailScreenNavigationProps;
};

////////////////////////////////////////////////////////////////////////

const RoomBDetailScreen:React.FunctionComponent<RoomBDetailScreenProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true); 
  const roomNumber= 2;
    const { navigation } = props;
    const [reviews, setReviews] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    const fetchReviews = async () => {
    try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/reviews/${roomNumber}`);
        const data = await response.json();
        console.log(data);
        setReviews(data);
    } catch (error) {
        console.error(error);
    }finally {
      setIsLoading(false); 
  }
};

useEffect(() => {
    // 서버에서 리뷰 데이터를 가져오는 함수
    fetchReviews();
}, []);

const onRefresh = () => {
    setRefreshing(true);
    
    // Call fetchReviews here
    fetchReviews();

    setRefreshing(false);
};
    
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
  <>
    <ScrollView
     refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{justifyContent:'center', alignItems:'center',height:'auto',backgroundColor:'white'}}>
            <View style={{width:screenWidth,height:screenWidth,backgroundColor:'red'}}>
                <View style={{flex:3,backgroundColor:'white'}}>
                <FlatList
                    horizontal
                    data={roomPictures}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={screenWidth}
                    decelerationRate='fast'
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      if (item.id === '2') {
                        return (
                          <Image
                            source={item.source}
                            style={{ width: screenWidth, height: '100%' }}
                            resizeMode='cover'
                          />
                        );
                      }
                      return null; // 다른 항목은 null을 반환하여 렌더링하지 않음
                    }}
                  />

                </View>
                <View style={{flex:1,backgroundColor:'white',justifyContent:'center',borderBottomWidth:5,borderBottomColor:'#E5E5E5'}}>
                    <Text style={{ fontSize: 21,marginLeft:'6%',marginTop:'1%' }}>짐프라이빗 2번방</Text>  
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%' }}>
                    <Image
                    source={require('../images/placeholder.png')}
                    style={{ width: screenWidth * 0.037, height: screenWidth * 0.04 }}
                    />
                    <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>봉천역 1번출구 도보 5분</Text>
                </View>
                </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth,backgroundColor:'white'}}>
                <View style={{flex:1.5,backgroundColor:'white'}}>
                  <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize: 21,marginLeft:'6%',top:'1%' }}>편의시설</Text>  
                  </View>
                  <View style={{flexDirection:'row',flex:2}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Image
                        source={require('../images/wifi.png')}
                        style={{width:'37%',height:'44%'}}
                        />
                        <Text style={{color:'#797676',fontSize:10}}>와이파이</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Image
                        source={require('../images/radio.jpeg')}
                        style={{width:'37%',height:'44%'}}
                        />
                        <Text style={{color:'#797676',fontSize:10}}>블루투스스피커</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Image
                        source={require('../images/parking.png')}
                        style={{width:'37%',height:'44%'}}
                        />
                        <Text style={{color:'#797676',fontSize:10}}>무료주차</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Image
                        source={require('../images/toilet.png')}
                        style={{width:'37%',height:'44%'}}
                        />
                        <Text style={{color:'#797676',fontSize:10}}>화장실</Text>
                    </View>
                  </View>
                </View>

                <View style={{flex:3.5,backgroundColor:'white'}}>
                  <View style={{backgroundColor:'white',flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize: 21,marginLeft:'6%'}}>시설안내</Text>  
                  </View>
                  <View style={{backgroundColor:'white',flex:4,marginLeft:'6%',justifyContent:'center'}}>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>1</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>프리 렉</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>2</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>덤벨 세트 4,6,8,10,12,14,16,20kg</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>3</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>데드 슬링랙</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>4</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>중량봉 10,20 kg</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>5</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>폼롤러2개, 요가매트2개, 스텝박스 2개</Text>
                    </View>
                    {/* <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>6</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>케이블 크로스오버 머신 </Text>
                    </View> */}
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontSize:15,color:'black'}}>7</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>모니터 1대(유튜브,운동프로그램 시청가능)</Text>
                    </View>
                  </View>
                </View>
            </View>

            <View style={{width:screenWidth,height:screenWidth*0.8,backgroundColor:'white'}}>
              <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={{fontSize: 21,marginLeft:'6%'}}>이용후기</Text>  
              </View>

              {reviews.length > 0 ? (
                <View style={{ flex: 3 }}>
                <FlatList
                  horizontal
                  keyExtractor={(item) => item.rvid.toString()}
                  data={reviews}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={screenWidth}
                  decelerationRate="fast"
                  renderItem={({ item }) => {
                    return(
                        <View style={{width:screenWidth,height:'100%',backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:screenWidth*0.9,height:'90%',borderRadius:20,backgroundColor:'white',...shadowStyle}}>
                              <View style={{flex:1,backgroundColor:'white',flexDirection:'row',alignItems:'center',borderTopRightRadius:20,borderTopLeftRadius:20}}>
                              <Image 
                                    source={
                                        item.gender === 'male' ? require('../images/Man.png') :
                                        item.gender === 'woman' ? require('../images/woman.png') :
                                        require('../images/profile.png') // gender가 null이거나 다른 값일 때 기본 이미지
                                    }
                                    style={{ width: 48/height, height: 48/height, marginLeft: '5%' }}
                                    />
                                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:'3%'}}>{item.username}</Text>
                              </View>
                              <View style={{flex:1.7,backgroundColor:'white',justifyContent:'center',alignItems:'center',borderTopWidth:1,borderTopColor:'#E5E5E5',borderBottomRightRadius:20,borderBottomLeftRadius:20}}>
                                <Text style={{fontSize:16,color:'#797676'}}>{item.review}</Text>
                              </View>
                            </View>
                        </View>
                    );
                  }}
                />
              </View>
          ) : (
            // 리뷰가 없는 경우
            <View style={{ flex: 3, backgroundColor: 'white' }}>
              <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={require('../images/negative-review.png')}
                  style={{ width: '30%', height: '80%' }}
                />
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#C2C2C2', fontSize: 22 }}>아직 작성된 리뷰가 없습니다.</Text>
              </View>
            </View>
          )}
        </View>

            <View style={{width:screenWidth,height:screenWidth*0.8,backgroundColor:'white'}}>
                  <View style={{backgroundColor:'white',flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize: 21,marginLeft:'6%'}}>예약시 주의사항</Text>  
                  </View>

                  <View style={{backgroundColor:'white',flex:3,marginLeft:'6%'}}>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>1</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>시설 파손 및 분실의 경우 구매당시 가격으로 청구됩니다.</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>2</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>분실 파손 및 사고나 화재 예방을 위해 내부 CCTV가{'\n'}설치되어 있습니다.</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>3</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>퇴실 시 사용한 기구는 정리정돈 부탁드립니다.</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>4</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>내부 샤워시설은 존재하지 않습니다.</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>5</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>공용운동복은 제공되지 않습니다.</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>6</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>운동 전용화를 꼭 지참하여 주셔야합니다.</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontSize:15,color:'black'}}>7</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>당일 환불 건은 결제금액의 70% 환불이 됩니다.</Text>
                    </View>
                  </View>
            </View>
            
            <View style={{width:screenWidth,height:screenWidth*0.4,backgroundColor:'white'}}></View>
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
            onPress={()=>{navigation.navigate(BookingScreens.Booking)}}
            style={{
                backgroundColor: '#4169E1',
                padding: 15,
                marginHorizontal: 16,
                borderRadius: 20,
                alignItems: 'center',
            }}
            >
            <Text
                style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                }}
            >
                대관 예약하기
            </Text>
            </TouchableOpacity>
    </View>
  </>
  )
}

export default RoomBDetailScreen
