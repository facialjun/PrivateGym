import { ConsoleLogger } from '@aws-amplify/core';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal,Image, Linking } from 'react-native';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


type eventNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
      'Membership' | 'MembershipPurchase1' 
>;

interface eventProps {
    route: RouteProp<MainStackParamList, 'Event'>;
    navigation: eventNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};



export const ReviewEventComponent: React.FunctionComponent<eventProps>  = ({ visible,onClose }) =>  {
   const navigation= useNavigation();

    return (
        <Modal visible={visible} transparent={true} animationType="slide" >
                <View style={styles.modalContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity style={{right:'auto'}} onPress={()=>onClose()}>
                            <MaterialIcons name="close" size={24} color="#868E96" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>REVIEW EVENT</Text>
                            <MaterialIcons name="close" size={24} color="white" />
                    </View>
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <ScrollView>
                     <View>
                      <Image 
                      source={require('../../images/ReviewEventDetail.png')}
                      style={{width:screenWidth,height:screenWidth}}
                      />
                     </View>
                      <View style={{width:screenWidth,backgroundColor:'white'}}>
                        <View style={{paddingHorizontal:24,marginTop:60}}>
                            <Text style={{color:'#4169E1',fontSize:26,fontWeight:'bold'}}>참여방법</Text>
                            <Text style={{color:'black',fontSize:20,fontWeight:'600',marginTop:40}}>1.네이버 짐프라이빗 검색</Text>
                            <View style={{marginTop:24,backgroundColor:'#FFFFFF',width:'100%',height:48,borderRadius:8,alignItems:'center',borderColor:'#1EC800',borderWidth:2,justifyContent:'center',paddingHorizontal:10}}>
                              <View style={{justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
                                <AntDesign name="search1" size={24} color="#1EC800" />
                                <Text style={{fontSize:16,fontWeight:'600',marginLeft:10}}>짐프라이빗</Text>
                              </View>
                            </View>
                          </View>
                      </View>
                      <View style={{paddingHorizontal:24,height:300}}>
                        <Text style={{color:'black',fontSize:20,fontWeight:'600',marginTop:40}}>2.네이버 짐프라이빗 예약</Text>
                        <Image 
                        source={require('../../images/NaverReservation.png')}
                        style={{width:screenWidth-48,height:(screenWidth-48)/1.6,marginTop:24}}
                        />
                      </View>
                      <View style={{paddingHorizontal:24}}>
                        <Text style={{color:'black',fontSize:20,fontWeight:'600',marginTop:40}}>3.리뷰 남기기</Text>
                        <Text style={{color:'#868E96',fontSize:16,fontWeight:'600',marginTop:4}}>(리뷰작성은 네이버 myplace에서 가능합니다!)</Text>
                        
                      <View>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:24}}>
                          <Text style={{fontSize:16,fontWeight:'600'}}>짐프라이빗</Text>
                          <Text style={{color:'#A8A8AB',marginLeft:4,fontSize:12}}>헬스장·서울봉천동</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:4}}>
                          <Text style={{fontSize:13,fontWeight:'600',color:'#555558'}}>오후 9:00 예약</Text>
                          <Text style={{color:'#A8A8AB',marginLeft:4,fontSize:12}}>·1번째 방문</Text>
                        </View>
                        <View style={{backgroundColor:'#FFFFFF',width:'100%',height:36,alignItems:'center',borderColor:'red',borderWidth:2,justifyContent:'center',paddingHorizontal:10,marginTop:8}}>
                              <View style={{justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
                                <Entypo name="pencil" size={18} color="#287CFF" />
                                <Text style={{fontSize:14,fontWeight:'600',marginLeft:10}}>리뷰 쓰기</Text>
                              </View>
                            </View>
                      </View>
                      </View>
                      <View style={{paddingHorizontal:24,paddingBottom:24}}>
                        <Text style={{color:'black',fontSize:20,fontWeight:'600',marginTop:40}}>4.연락처 남기기</Text>
                        <Text style={{color:'#868E96',fontSize:16,fontWeight:'600',marginTop:4}}>(홈화면 1:1문의하기를 이용해주세요)</Text>
                        <Text style={{color:'black',fontSize:20,fontWeight:'500',marginTop:24}}>리뷰 작성후 {'\n'}1.리뷰캡쳐 2.페이백 받을 계좌와 함께 연락처를 남겨주세요🔥</Text>
        
                      </View>
                      
                      </ScrollView>
                    </View>
                </SafeAreaView>
                <View style={styles.Bottombox}>
                   <TouchableOpacity 
                   style={styles.BottomboxContent} 
                   onPress={async () =>  {
                    const url = 'https://naver.me/G1stqNGO';
                    Linking.canOpenURL(url)
                    .then((supported) => {
                        if (supported) {
                        Linking.openURL(url);
                        } else {
                        console.log("Can't handle URL: " + url);
                        }
                    })
                    .catch((err) => console.error('An error occurred', err));
                }
                    // onClose를 Promise로 감싼다
                    
                  }
                   >
                     <Text style={styles.BottomboxText}>네이버 리뷰 남기기</Text>
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
  

export default ReviewEventComponent;
