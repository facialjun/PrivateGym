import React,{useEffect, useState} from 'react';
import { View, Text,ScrollView,Dimensions,StyleSheet,TextInput,Alert,TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import config from '../config'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'native-base';

const BASE_URL = config.SERVER_URL;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

////////////////////////////////////////////////////////////////

type ReviewScreenNavigationProps = StackNavigationProp<
    MainStackParamList,
    MainScreens.Review
    >

interface ReviewScreenProps {
    route: RouteProp<MainStackParamList, 'Review'>;
    navigation: ReviewScreenNavigationProps;
}

////////////////////////////////////////////////////////////////
const ReviewScreen:React.FunctionComponent<ReviewScreenProps> = ({ route,navigation}) => {

    const { merchant_uid,room_number,date_of_use,time_of_use } = route.params;
    const [reviewtext,setReviewText] = useState('');
    const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);

    useEffect(() => {
        console.log("Received:",room_number,date_of_use,time_of_use,merchant_uid);
    }, []);


    useEffect(() => {
                const fetchData = async () => {
                    try {
                        // AsyncStorage에서 logId 가져오기
                        let logId = await AsyncStorage.getItem('logId');
                        if (logId) {
                            // Remove quotes from logId, if present
                            logId = logId.replace(/^['"](.*)['"]$/, '$1');
                            console.log(logId);
                            setLogId(logId); //아래에서 보낼때 로그아이디 셋팅

                            // logId를 사용하여 사용자 UID 가져오기
                            const uidResponse = await fetch(`${BASE_URL}/user/${logId}`);
                            const uidData = await uidResponse.json();
                            const uid = uidData.uid;
                            setUserData(uidData)
                            console.log(uid);
                                    
                        }
                    } catch (error) {
                        console.log('Error:', error);
                    }
                };

                fetchData();
            }, []);

//텍스트 인풋 5자이상 , 1000자 미만조절
    const MAX_CHARACTER_LIMIT = 1000;
    const MIN_CHARACTER_LIMIT = 5;
    
    const characterCount = reviewtext.length;
    const characterLimit = `${characterCount}/${MAX_CHARACTER_LIMIT}`;

  //별점 기능
    const [rating, setRating] = useState(0); // 사용자가 선택한 별점 값
    const handleRatingPress = (selectedRating) => {
        setRating(selectedRating); // 사용자가 선택한 별점 값 업데이트
        // console.log(selectedRating)
    };


  //별점,리뷰 제출하기 
const handleSubmit = () => {
    if (reviewtext.length >= MIN_CHARACTER_LIMIT) {
        if (rating === 0) {
        alert('별점을 선택해주세요.');
        return;
        }

        const data = {
            rating: rating,
            reviewText: reviewtext,
            logId: logId, // 수정된 부분
            merchant_uid: merchant_uid, // 수정된 부분
            room_number:room_number
        };

    console.log(data);
    axios.post(`${BASE_URL}/review`, data)
        .then(response => {
            console.log(response.data);
            if (response.data.message === 'Review inserted successfully') {
                Alert.alert('알림!', '리뷰가 작성되었습니다');
                navigation.navigate(MainScreens.MyReservation); 
            } else {
            Alert.alert('알림!', '리뷰 작성에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        Alert.alert('알림!', '리뷰는 최소 5자 이상으로 작성해야 합니다.');
    }
};

return (
    <>
        <ScrollView>
        <KeyboardAvoidingView style={{backgroundColor:'black'}}>
        <View style={{height:screenHeight*1,backgroundColor:'white',width:screenWidth,paddingHorizontal:24}}>
            {userData && (
            <View style={{height:screenHeight*0.18,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#E5E5E5',justifyContent:'center'}}>
                <Text style={{fontSize:16,color:'#797676',fontWeight:'bold'}}>예약정보:  짐프라이빗대관</Text>
                <Text style={{fontSize:16,color:'#797676',fontWeight:'bold',marginTop:screenWidth*0.02}}>작성자명:  {userData.username}</Text>
            </View>
            )}
            <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'white',marginTop:24}}>
            <Text style={{fontSize:17,color:'black',fontWeight:'bold'}}>이곳에서의 경험은 어떠셨어요?</Text>
            <View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',marginTop:screenWidth*0.04}}>
                {/* 별점 컴포넌트 */}
                <TouchableOpacity onPress={() => handleRatingPress(1)}>
                <FontAwesome
                    name={rating >= 1 ? 'star' : 'star-o'}
                    size={40}
                    color='#4169E1'
                    style={styles.star}
                />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(2)}>
                <FontAwesome
                    name={rating >= 2 ? 'star' : 'star-o'}
                    size={40}
                    color='#4169E1'
                    style={styles.star}
                />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(3)}>
                <FontAwesome
                    name={rating >= 3 ? 'star' : 'star-o'}
                    size={40}
                    color='#4169E1'
                    style={styles.star}
                />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(4)}>
                <FontAwesome
                    name={rating >= 4 ? 'star' : 'star-o'}
                    size={40}
                    color='#4169E1'
                    style={styles.star}
                />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(5)}>
                <FontAwesome
                    name={rating >= 5 ? 'star' : 'star-o'}
                    size={40}
                    color='#4169E1'
                    style={styles.star}
                />
                </TouchableOpacity>
            </View>
            </View>
            <View style={{backgroundColor:'white',justifyContent:'center',marginTop:40}}>
            <Text style={{fontSize:16,color:'black',fontWeight:'bold'}}>후기를 작성해주세요.</Text>
            <View style={{marginTop:8}}>
                <TextInput
                style={styles.input}
                placeholder={`정확한 리뷰를 위해 5자 이상으로 작성해주세요!`}
                value={reviewtext}
                onChangeText={setReviewText}
                multiline={true}
                />
                <Text style={styles.characterCount}>{characterLimit}</Text>
            </View>
            </View>
        </View>
       </KeyboardAvoidingView>
        </ScrollView>
        <View
        style={{
        position: 'absolute',
        bottom: 20,
        width: '100%',
        }}
    >
        <TouchableOpacity
        style={{
            backgroundColor: '#4169E1',
            padding: 15,
            marginHorizontal: 16,
            borderRadius: 20,
            alignItems: 'center',
        }}
        onPress={handleSubmit} >
        <Text
            style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            }}
        >
            리뷰 제출하기
        </Text>
        </TouchableOpacity>
    </View>

    </>
    
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    star: {
        marginHorizontal: 8, // 별들 사이의 가로 간격 조정
    },
    input: {
        marginTop:screenWidth * 0.03,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 5,
        width: screenWidth * 0.9,
        height: screenWidth * 0.2,
        paddingHorizontal:20,
        backgroundColor:'white', 
    },
    characterCount: {
        alignSelf: 'flex-end',
        marginRight: screenWidth * 0.03,
        marginTop:screenWidth * 0.03,
        color: 'gray',
    },
});

export default ReviewScreen;
