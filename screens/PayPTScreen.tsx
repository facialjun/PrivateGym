import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Animated,
  Easing,
  Image,
  FlatList
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import axios from 'axios';
import {PTScreens, PTStackParamList } from '../stacks/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenWidth } from './RoomADetailScreen';
// import id from 'date-fns/esm/locale/id/index.js';
import config from '../config'
import { height,width } from './HomeScreen';
import LottieView from 'lottie-react-native';



const BASE_URL = config.SERVER_URL;



type PayPTScreenNavigationProps = StackNavigationProp<
    PTStackParamList,
    PTScreens.PayPT
    >

interface PayPTScreenProps {
    navigation: PayPTScreenNavigationProps;
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


const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;




const PayPtScreen:React.FunctionComponent<PayPTScreenProps> = ({ route, navigation }) => {
  const scrollViewRef = useRef(null);

  const handleScrollToView = (index) => {
    if (scrollViewRef.current) {
      const viewHeight = screenWidth * 0.32;
      const spacing = 15;
      const y = index * (viewHeight + spacing);
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
  };
  
  const { id }  = route.params;
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ptproducts,setptPtoducts] = useState([])

  const [isWishlist, setIsWishlist] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [averageRating, setAverageRating] = useState("0.00");

  useEffect(() => {
    console.log(id)
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`${BASE_URL}/trainer_averagerating/${id}`);
        const data = await response.json();
        const rating = data.average_rating !== null ? data.average_rating.toFixed(2) : "0.00";
        setAverageRating(rating);
      } catch (error) {
        console.error('Error:', error);
        setAverageRating('N/A');
      }
    };
  
    fetchAverageRating();
  }, []);
  
  useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${BASE_URL}/trainer_reviews/${id}`);
          const data = await response.json();
          
          setReviews(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchReviews();
    }, []);

  useEffect(() => {
    fetchTrainerData(); 
  }, [id]);

  const fetchTrainerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trainer/${id}`);
      console.log(response.data[0])
      setData(response.data[0]); 
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const fetchPTproduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/PTproduct/${id}`);
        const data = await response.json();
        
        setptPtoducts(data);
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchPTproduct();
  }, []);

  if (!data) {
    return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <LottieView
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
        source={require('../src/lottie/loading.json')}
      />      
    </View>
   )
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [250, 400],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <>
      <View style={{ flex: 1, position: 'relative' }}>
        <ImageBackground
          source={{ uri: data.uri }}
          style={{
            width: '100%',
            height: WIDTH*1.2,
            position: 'absolute',
          }}
        >
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop:WIDTH*0.123,
                backgroundColor:'transparent'
              }}
            >
              <TouchableOpacity
                style={{
                  width: 10 * 4,
                  height: 10 * 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                }}
                onPress={() => navigation.navigate(PTScreens.PTProfile)}
              >
                <AntDesign name="left" size={10 * 3} color="#131515" />
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  style={{
                    width: 10 * 4,
                    height: 10 * 4,
                  
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                >
                </TouchableOpacity>
              </View>
            </View>
        </ImageBackground>
        <Animated.View
            style={{
              opacity: headerOpacity,
              backgroundColor: "white",
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height:WIDTH*0.225,
              zIndex: 2,
            }}
          >
            <View
                style={{
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop:WIDTH*0.123,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 10 * 4,
                    height: 10 * 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                  onPress={() => navigation.navigate(PTScreens.PTProfile)}
                >
                  <AntDesign name="left" size={10 * 3} color="#7f7f7f" />
                </TouchableOpacity>
                <Text style={{marginTop:8,fontSize:20,fontWeight:'bold',color:'#797676'}}>{data.name} 트레이너</Text>
                <View>
                  <TouchableOpacity
                    style={{
                      width: 10 * 4,
                      height: 10 * 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1,
                    }}
                  >
                  
                  </TouchableOpacity>
                </View>
              </View>
          </Animated.View>
        
      
        <Animated.ScrollView ref={scrollViewRef}
          style={{ marginTop: HEIGHT*0.1, flex: 1 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View
            style={{
              backgroundColor: "white",
              height:'auto',
              borderRadius:20,
              marginTop: WIDTH*0.7,
            }}
          >
           

            <View style={{width:WIDTH,height:WIDTH*0.9,backgroundColor:'white',marginTop:WIDTH*0.13}}>
              <View style={{flex:1,justifyContent:'center',backgroundColor:'white',flexDirection:'row',paddingHorizontal:'7%',alignItems:'center'}}>
                <Text style={{fontSize:23,color:'black',fontWeight:'bold'}}>{data.name} 트레이너</Text>
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRating}</Text>
              </View>
              <View style={{flex:4,backgroundColor:'white',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#EEEDED'}}>
                <View style={{width:'90%',height:'65%',backgroundColor:'white',borderRadius:15,...shadowStyle,justifyContent:'center',paddingHorizontal:'5%'}}>
                  <View
                    style={{
                      height: '30%',
                      width: '17.5%',
                      position: 'absolute',
                      top: '-15%',
                      backgroundColor: 'white',
                      borderRadius:60,
                      left: '5%',
                      ...shadowStyle,
                      justifyContent: 'center',
                      alignItems:'center'
                    }}
                  >
                    <Image
                      source={{ uri: data.uri }}
                      style={{width:'100%',height:'100%',borderRadius:60}}
                    />
                  </View> 

                    <Text style={{alignSelf:'center',color:'#797676',fontSize:16}}>
                    {data.introduction}
                    </Text>
                </View>
              </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.25,backgroundColor:'white'}}>
                <View style={{flex:1,paddingHorizontal:'7%',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#EEEDED'}}>
                    <Text style={{fontSize:23,fontWeight:'bold',marginTop:'10%'}}>수업가능시간</Text>
                    <View style={{marginLeft:'auto',marginTop:'10%'}}>
                      <Text style={{fontSize:16,color:'#797676'}}>1차 : {data.available_time1}</Text>
                      <Text style={{ fontSize: 15, color: 'gray' }}>{data.available_time2 ? `2차 : ${data.available_time2}` : null}</Text>
                    </View>
                  </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.2,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={{fontSize:23,fontWeight:'bold',marginLeft:'7%'}}>PT</Text>
            </View>
              <View style={{width:screenWidth,height:'auto',backgroundColor:'white',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#EEEDED',paddingHorizontal:24}}>
                {ptproducts.map((item, index) => (
                 <TouchableOpacity 
                 key={index} 
                 style={styles.MemberShipContainer}
                 onPress={() => handlePayment(product.name, product.amount, product.duration)} onPress={() => {
                 navigation.push('PaymentTest', {
                  amount:item.session*item.price ,                 
                  trainerId: item.trainer_id,
                  name: item.trainer_name,
                  session:item.session,
                  uri:data.uri
                 });
             }} >
                 <View style={{flex:1,paddingHorizontal:24,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                   <View>
                     <Text style={styles.Body1}>1:1PT {item.session}회</Text>
                     <Text style={styles.caption2}>10% 할인가</Text>
                   </View>
                   <TouchableOpacity style={styles.PriceContainer}>
                     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                       <Text style={styles.caption1}>{(item.price*item.session).toLocaleString()}원</Text>
                     </View>
                   </TouchableOpacity>
                 </View>
                 </TouchableOpacity>
                  
                ))}
              </View>
            
    
            <View style={{width:WIDTH,height:WIDTH*0.8,backgroundColor:'white',borderBottomColor:'#EEEDED',borderBottomWidth:1}}>
              <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={{fontSize: 23,fontWeight:'bold',marginLeft:'7%',}}>이용후기</Text>  
              </View>

              {reviews.length > 0 ? (
                <View style={{ flex: 3 }}>
                <FlatList
                  horizontal
                  keyExtractor={(item) => item.rvid}
                  data={reviews}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={WIDTH}
                  decelerationRate="fast"
                  renderItem={({ item }) => {
                    return(
                        <View style={{width:WIDTH,height:'100%',backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:WIDTH*0.9,height:'80%',borderRadius:20,backgroundColor:'white',...shadowStyle}}>
                              <View style={{flex:1,backgroundColor:'white',flexDirection:'row',alignItems:'center',borderTopRightRadius:20,borderTopLeftRadius:20}}>
                                <Image 
                                  source={item.gender === 'male' ? require('../images/Man.png') : require('../images/woman.png')}
                                  style={{ width: '13%', height: '67%', marginLeft: '5%' }}
                                />
                                <Text style={{fontSize:16,fontWeight:'bold',marginLeft:'3%',color:'#797676'}}>{item.username}</Text>
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
        <View style={{width:WIDTH,height:WIDTH,backgroundColor:'white'}}>
                  <View style={{backgroundColor:'white',flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize: 21,marginLeft:'6%'}}>자격 및 이력사항</Text>  
                  </View>

                  <View style={{backgroundColor:'white',flex:3,marginLeft:'6%'}}>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>1</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>유원대학교 스포츠과학과 졸업</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>2</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>현)가평웨일스 트레이너겸 선수</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>3</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>바디스짐 퍼스널 트레이너</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>4</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>에일린 휘트니스 트레이너(여성전용)</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>5</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>용인시 독립야군단 트레이너 선수.</Text>
                    </View>
                
                  </View>
            </View>


          </View>  
        </Animated.ScrollView>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
        }}
      >
       <TouchableOpacity
       onPress={() => handleScrollToView(4)}
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
                PT 구매하기
            </Text>
            </TouchableOpacity>
    </View>

    </>
  );
};

export default PayPtScreen;

const styles = StyleSheet.create({
  subtitle:{
    fontSize:24,
    fontWeight:'bold',
    marginTop:40
},
  membershipContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  PriceContainer:{
   width:100,
   height:40/height,
   borderRadius:8,
   backgroundColor:'#F1F3F5'
  },
  MemberShipContainer: {
    ...shadowStyle,
    height:88/height,
    width: '100%',
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom:12
  },
  Body1:{
   fontSize:20,
   color:'black',
   fontWeight:'bold'
  },
  caption1:{
    fontSize:16,
    fontWeight:'500'
  },
  caption2:{
    fontSize:12,
    color:'#4169E1'
  }
});