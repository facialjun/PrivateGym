import { ConsoleLogger } from '@aws-amplify/core';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal,Image } from 'react-native';
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
import { RouteProp, useNavigation } from '@react-navigation/native';


type eventNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
      'Membership' | 'MembershipPurchase1' 
>;

interface eventProps {
    route: RouteProp<MainStackParamList, 'Event'>;
    navigation: eventNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};



export const EventComponent: React.FunctionComponent<eventProps>  = ({ visible,onClose }) =>  {
   const navigation= useNavigation();

    return (
        <Modal visible={visible} transparent={true} animationType="slide" >
                <View style={styles.modalContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity style={{right:'auto'}} onPress={()=>onClose()}>
                            <MaterialIcons name="close" size={24} color="#868E96" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>SERVICE</Text>
                            <MaterialIcons name="close" size={24} color="white" />
                    </View>
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <ScrollView>
                      <LinearGradient
                        colors={['#3454B4', '#3454B4', '#4169E1', 'rgba(65, 105, 225, 0.8)']}
                        locations={[0, 0.2, 0.7, 1.0]}
                        style={{height: 400, width: screenWidth}}>
                            <View style={{flex:1}}>
                                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text style={{color:'white',fontSize:28,fontWeight:'600'}}>나만 알기 아까운</Text>
                                    <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                                      <View style={{width:'40%',height:'100%',borderRadius:16,backgroundColor:'white',alignItems:'center'}}>
                                        <Text style={{color:'#4169E1',fontSize:28,fontWeight:'bold'}}>월정액 혜택</Text>
                                      </View>
                                       <Text style={{color:'white',fontSize:28,fontWeight:'600',marginLeft:10}}>모아보기</Text>
                                    </View>
                                </View>
                                <View style={{flex:1.3}}>
                                  <View style={{flexDirection:'row',height:'50%',justifyContent:'center',alignItems:'center',marginTop:8}}>
                                        <View style={{width:'35%',backgroundColor:'rgba(0, 0, 0, 0.18)',height:30,borderRadius:16,borderWidth:0.5,borderColor:'white',marginRight:10,justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>최대 30% 대관 할인</Text>
                                        </View>
                                        <View style={{width:'50%',backgroundColor:'rgba(0, 0, 0, 0.18)',height:30,borderRadius:16,borderWidth:0.5,borderColor:'white',justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>PT 등록시 10% 할인</Text>
                                        </View>
                                        </View>
                                        <View style={{flexDirection:'row',height:'50%',justifyContent:'center',alignItems:'center'}}>
                                            <View style={{marginRight:10,width:'54%',backgroundColor:'rgba(0, 0, 0, 0.18)',height:30,borderRadius:16,borderWidth:0.5,borderColor:'white',justifyContent:'center',alignItems:'center'}}>
                                                <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>지인과 함께 등록시 최대 20% 할인</Text>
                                            </View>
                                        <View style={{width:'30%',backgroundColor:'rgba(0, 0, 0, 0.18)',height:30,borderRadius:16,borderWidth:0.5,borderColor:'white',justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>PT 무료체험</Text>
                                        </View>
                                    </View>
                                  <View>
                                </View>       
                                </View>
                                <View style={{flex:1.8,alignItems:'center',justifyContent:'flex-end'}}>
                                    <Image 
                                    source={require('../../images/detailpageperson.png')}
                                    style={{width:screenWidth *0.8,height:'90%'}}
                                    />
                                </View>
                            </View>
                      </LinearGradient>
                      <View style={{width:screenWidth,backgroundColor:'white'}}>
                        <View style={{paddingHorizontal:24,marginTop:60}}>
                            <Text style={{color:'black',fontSize:26,fontWeight:'600'}}>안쓰면 매월 2만원 이상 손해!</Text>
                            <Text style={{color:'black',fontSize:26,fontWeight:'600',marginTop:24}}>월 정기권 서비스의</Text>
                            <Text style={{color:'black',fontSize:26,fontWeight:'600'}}>강력한 할인 혜택</Text>
                            <View style={{marginTop:40,backgroundColor:'rgba(65, 105, 225, 0.27)',width:'100%',height:320,borderRadius:16,alignItems:'center',paddingVertical:40,justifyContent:'space-between'}}>
                              <Text style={{fontSize:14,color:'rgba(65, 105, 225, 100)',fontWeight:'bold'}}>주 3회 이용고객 평균 할인 금액 예시</Text>
                              <View style={{flexDirection:'row',justifyContent:'space-between',width:'80%',alignItems:'center'}}> 
                                <View style={{alignItems:'center'}}>
                                    <Text style={{fontSize:16,fontWeight:'600',color:'#868E96'}}>일권 이용시</Text>
                                    <Text style={{fontSize:18,fontWeight:'600',color:'#868E96',marginTop:20}}>120,000원</Text>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>'월 정기권 이용시'</Text>
                                    <Text style={{fontSize:22,fontWeight:'bold',color:'black',marginTop:20,position: 'relative'}}>99,000원</Text>
                                </View>
                              </View>
                              <View style={{width:'80%',backgroundColor:'rgba(65, 105, 225, 100)',height:40,borderRadius:8,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontWeight:'bold',color:'white',fontSize:18}}>매월 2만원 이상 저렴한 이용!</Text>
                              </View>
                            </View>
                        </View>
                      </View>
                      <View style={{width:screenWidth,backgroundColor:'white',paddingHorizontal:24,paddingBottom:40}}>
                      <View style={{marginTop:60}}>
                        <Text style={{color:'black',fontSize:26,fontWeight:'600'}}>뿐만 아니라</Text>
                        <Text style={{color:'black',fontSize:26,fontWeight:'600'}}>PT 체험,등록시 할인혜택까지!</Text>
                      </View>
                      <View style={{marginTop:24}}>
                        <Text style={{color:'#868E96',fontWeight:'500'}}>운동이 처음이라도 걱정하지마세요.</Text>
                        <Text style={{color:'#868E96',fontWeight:'500'}}>PT체험은 무료로! </Text>
                        <Text style={{color:'#868E96',fontWeight:'500'}}>등록시 할인가로 이용할 수 있습니다.</Text>
                      </View>
                      <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:40}}>
                        <View style={{backgroundColor:'#DEE2E6',width:'48%',height:88,borderRadius:8,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/PTicon.png')} style={{width:34,height:38,marginRight:14}}/>
                        <View>
                            <Text>PT 1회</Text>
                            <Text>무료체험 혜택</Text>
                        </View>
                        </View>
                        <View style={{backgroundColor:'#DEE2E6',width:'48%',height:88,borderRadius:8,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/registericon.png')} style={{width:34,height:38,marginRight:14}}/>
                        <View>
                            <Text>PT 등록시</Text>
                            <Text>10% 할인</Text>
                        </View>
                        </View>
                      </View>
                      </View>
                      </ScrollView>
                    </View>
                </SafeAreaView>
                <View style={styles.Bottombox}>
                   <TouchableOpacity 
                   style={styles.BottomboxContent} 
                   onPress={async () => {
                    // onClose를 Promise로 감싼다
                    await new Promise((resolve) => {
                      onClose(); // 모달을 닫는 함수 호출
                      resolve(); // Promise가 성공적으로 완료되었음을 알린다
                    });
                    
                    // 모달이 닫힌 후, 네비게이션 실행
                    navigation.navigate(MainScreens.MembershipPurchase1);
                  }}
                   >
                     <Text style={styles.BottomboxText}>월 정기권 요금 둘러보기</Text>
                   </TouchableOpacity>
                </View>
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
  

export default EventComponent;
