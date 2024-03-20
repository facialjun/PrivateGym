import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View,Image } from 'react-native'
import NameScreen from '../screens/NameScreen';
import PassWordScreen from '../screens/PassWordScreen';
import LogInScreen from '../screens/LogInScreen';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Ionicons';
import MyReservationScreen from '../screens/MyReservationScreen';
import MyInfoScreen from '../screens/MyInfoScreen';
import LandingScreen from '../screens/LandingScreen';
// import YNMemberScreen from '../screens/YNMemberScreen';
import RoomSelectScreen from '../screens/RoomSelectScreen';
import RoomADetailScreen from '../screens/RoomADetailScreen';
import RoomBDetailScreen from '../screens/RoomBDetailScreen';
import RoomCDetailScreen from '../screens/RoomCDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import BookedInfoScreen from '../screens/BookedInfoScreen';
import BookingPayment from '../screens/BookingPayment';
import BookingPaymentResult from '../screens/BookingPaymentResult';
import MembershipRoomSelectScreen from '../screens/MembershipRoomSelectScreen';
import MembershipRoomADetailScreen from '../screens/MembershipRoomADetailScreen';
import MembershipRoomBDetailScreen from '../screens/MembershipRoomBDetailScreen';
import MembershipRoomCDetailScreen from '../screens/MembershipRoomCDetailScreen';
import MembershipBookScreen from '../screens/MembershipBookScreen';
import MembershipBookedInfoScreen from '../screens/MembershipBookedInfoScreen';
import MembershipPurchaseScreen from '../screens/MembershipPurchaseScreen';
import MembershipPayment from '../screens/MembershipPayment';
import MembershipPaymentResult from '../screens/MembershipPaymentResult';
import PTProfileScreen from '../screens/PTProfileScreen';
import PayPTScreen from '../screens/PayPTScreen';
import PaymentTest from '../screens/PaymentTest';
import Payment from '../screens/Payment';
import PaymentResult from '../screens/BookingPaymentResult';
import BookingHistory from '../screens/BookingHistory';
import ReviewScreen from '../screens/ReviewScreen';
import MyMembershipScreen from '../screens/MyMembershipScreen';
import PTReviewScreen from '../screens/PTReviewScreen';
import LogInformationScreen from '../screens/LogInformationScreen';
import UsingRuleScreen from '../screens/UsingRuleScreen';
import LogInLoading from '../screens/LogInLoading'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import { Dimensions } from 'react-native';
import JoinMembershipScreen from '../screens/JoinMembershipScreen';
import EventComponent from '../assets/component/event';
import { MyCouponScreen } from '../screens/MyCouponScreen';



const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;




export enum MainScreens {
    Landing = 'Landing',
    LogIn = 'LogIn',
    JoinMembership = 'JoinMembership',
    Name = 'Name',
    PassWord = 'PassWord',
    ForgotPassword = 'ForgotPassword',
    NewPassword = 'NewPassword',
    LogInLoading = 'LogInLoading',
    Home = 'Home',
    Event ='Event',
    // YNMember = 'YNMember',
    PT = 'PT',
    MyInfo = 'MyInfo',
    MyReservation = 'MyReservation',
    WishList = 'WishList',
    Cart = 'Cart',
    Main = 'Main',
    Book = 'Book',
    TRmain = 'TRmain',
    MineMembership = 'MineMembership',
    LogInfo = 'LogInfo',
    GymService = 'GymService',
    // Franchise = 'Franchise',
    Review = 'Review',
    Membership = 'Membership',
    MembershipPurchase1 = 'MembershipPurchase1',
    // LogOut = 'LogOut',
    MembershipBooking = "MembershipBooking",
    MembershipRoomSelect = "MembershipRoomSelect",
    MyCoupon="MyCoupon"
};


export type MainStackParamList = {
    Landing: undefined;
    LogIn: undefined;
    JoinMembership : undefined;
    Name: undefined;
    PassWord : undefined;
    ForgotPassword : undefined;
    NewPassword: undefined;
    LogInLoading : undefined;
    Home: undefined;
    Event: undefined;
    // YNMember: undefined;  
    PT: undefined;
    MyInfo: undefined;
    MyReservation: undefined; 
    Main: undefined;// Booking 스크린은 BookingsParams 라는 지정 타입의 파라미터가 필요함 => BookingsScreen 에서 지정할 것임.
    Book : undefined;
    TRmain: undefined;
    MineMembership: undefined;
    LogInfo: undefined;
    GymService:undefined;
    // Franchise:undefined;
    Review: undefined;
    Membership : undefined;
    MembershipPurchase1 : undefined;
    MyCoupon:undefined
    // LogOut: {data: string};
    } & BookingStackParamList & PTStackParamList;// 이런식으로 메인안에 서브 넣어서 다른 페이지에서 함께 export 가능.


type MainTabParamList= {
    Home: undefined;
    MyInfo: undefined;
    MyReservation: undefined;
};


//

export enum BookingScreens {
    RoomSelect='RoomSelect',
    RoomADetail='RoomADetail',
    RoomBDetail='RoomBDetail',
    RoomCDetail='RoomCDetail',
    Booking = 'Booking',
    BookedInfo = 'BookedInfo',
    BookingPayment = 'BookingPayment',
    BookingPaymentResult = 'BookingPaymentResult',
};

export type BookingStackParamList = {//should defined;
    RoomSelect:undefined;
    RoomADetail:undefined;
    RoomBDetail:undefined;
    RoomCDetail:undefined;
    Booking: undefined; // Booking 스크린은 BookingsParams 라는 지정 타입의 파라미터가 필요함 => BookingsScreen 에서 지정할 것임.
    BookedInfo: {
        selectedDateSlot:string,
        isMorning:boolean,
        isEvening:boolean,
        selectedDayTimeSlot:string,
        selectedNightTimeSlot:string,
        selectedRoomSlot:string,
        selectedStartTime:string,
        selectedEndTime:string,
        selectedUsingTimeSlot:string,
    };
    BookingPayment: undefined;  
    BookingPaymentResult:undefined; 
};

//

export enum MembershipScreens {
    MembershipRoomSelect = 'MembershipRoomSelect',
    MembershipRoomADetail = 'MembershipRoomADetail',
    MembershipRoomBDetail = 'MembershipRoomBDetail',
    MembershipRoomCDetail = 'MembershipRoomCDetail',
    MembershipBooking = 'MembershipBooking',
    MembershipBookedInfo = 'MembershipBookedInfo'
};

export type MembershipStackParamList = {
    MembershipRoomSelect: undefined;
    MembershipRoomADetail: undefined;
    MembershipRoomBDetail: undefined;
    MembershipRoomCDetail: undefined;
    MembershipBooking: undefined; 
    MembershipBookedInfo: {
        selectedDateSlot:string,
        isMorning:boolean,
        isEvening:boolean,
        selectedDayTimeSlot:string,
        selectedNightTimeSlot:string,
        selectedRoomSlot:string,
        selectedStartTime:string,
        selectedEndTime:string,
        selectedUsingTimeSlot:string,
    };
};

//

// export enum HistoryScreens {
//     History = 'History',
//     Review = 'Review',
// };

// export type HistoryStackParamList = {
//     History: undefined; 
//     Review: undefined;
// };

//

export enum MMScreens {
    MyMembership='MyMembership',
    PTReview='PTReview'
};

export type MMStackParamList = {
    MyMembership:undefined; 
    PTReview:undefined;
};


//


export enum LogInformationScreens {
    LogInformation='LogInformation',
    UsingRule='UsingRule'
};

export type LogInformationStackParamList = {
    LogInformation:undefined;
    UsingRule:undefined;
};


//


export enum MembershipPurchaseScreens {
    MembershipPurchase = 'MembershipPurchase',
    MembershipPayment = 'MembershipPayment',
    MembershipPaymentResult = 'MembershipPaymentResult',
};

export type MembershipPurchaseParamList = {//should defined;
    MembershipPurchase: undefined;
    MembershipPayment: undefined;
    MembershipPaymentResult:undefined
};


//



export enum PTScreens {
    PTProfile = 'PTProfile',
    PayPT = 'PayPT',
    PaymentTest ='PaymentTest',
    Payment= 'Payment',
    PaymentResult = 'PaymentResult',
};

export type PTStackParamList = {//should defined;
    PTProfile : undefined; 
    PayPT : undefined;
    PaymentTest: undefined;
    Payment: undefined; 
    PaymentResult: undefined;
};


/////////////////TR 페이지
export enum TRmainScreens {
    TRlogin ='TRlogin'
};

export type TRmainStackParamList = {
    TRlogin : undefined;
};

type TRmainTabParamList= {
    
};



const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const BookingStack = createNativeStackNavigator<BookingStackParamList>();
const MembershipStack = createNativeStackNavigator<MembershipStackParamList>();
const MembershipPurchase = createNativeStackNavigator<MembershipPurchaseParamList>();
// const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const MMStack = createNativeStackNavigator<MMStackParamList>();
const LogInformationStack = createNativeStackNavigator<LogInformationStackParamList>();
const PTStack = createNativeStackNavigator<PTStackParamList>();




function MainTabNavigator(): React.ReactElement {
    return (
        <MainTab.Navigator
            initialRouteName={MainScreens.Home}
            screenOptions={{
                tabBarActiveTintColor: 'black', // 활성 탭 아이콘 및 라벨 색상
                tabBarInactiveTintColor: 'black', // 비활성 탭 아이콘 및 라벨 색상
            }}
            // tabBarStyle={{ backgroundColor:'white',borderRadius:10,justifyContent:'center',alignItems:'center',height:screenHeight*0.055}}
            >
            <MainTab.Screen
                name={MainScreens.Home}
                component={HomeScreen}
                options={{
                headerTitleAlign: 'center',
                headerTitle: () => (
                        <Image 
                            source={require('../images/logogp1.png')}
                            style={{width:screenWidth*0.45,height:'70%'}}
                            resizeMode='cover'
                        />
                    
                ),
                    title:'홈',
                    tabBarLabel: '홈',
                    tabBarIcon: ({ focused }) => (
                        focused
                        ? <Icon4 name="home-sharp" size={23} color='black' />
                        : <Icon4 name="home-outline" size={23} color='black' />
                    )
                }}
            />
            <MainTab.Screen
                name={MainScreens.MyReservation}
                component={MyReservationScreen}
                    options={{
                        headerTitleAlign: 'center',
                        headerTitle: () => (
                            <Image 
                                source={require('../images/logogp1.png')}
                                style={{width:screenWidth*0.45,height:'70%'}}
                                resizeMode='cover'
                            /> 
                    ),
                    title:'내 예약',
                    tabBarLabel: '내 예약',
                    tabBarIcon: ({ focused }) => (
                        focused
                        ? <Icon4 name="calendar-number-sharp" size={26} color='black' />
                        : <Icon3 name="calendar-o" size={23} color='black' />
                    )
                }}
            />
    
            
            <MainTab.Screen
                name={MainScreens.MyInfo}
                component={MyInfoScreen}
                options={{
                    headerStyle: {
                        height: 60, // 헤더의 높이 값을 원하는 크기로 설정
                    },
                    headerTitle: '',
                    headerTitleAlign: 'center',
                    title:'내 정보',
                    tabBarLabel: '내 정보',
                    tabBarIcon: ({ focused,color }) => (
                        focused
                        ? <Icon4 name="person" size={23} color='black' />
                        : <Icon4 name="person-outline" size={23} color='black' />
                    )
                }}
            />
        </MainTab.Navigator>
    );
};


const MainStackNavigator: React.FunctionComponent = () => {
    return (
    <NavigationContainer >
        <MainStack.Navigator 
        initialRouteName="Landing" 
        screenOptions={{headerShown: false}}>
            <MainStack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/> 
            <MainStack.Screen name="LogIn" component={LogInScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="JoinMembership" component={JoinMembershipScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="Name" component={NameScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="PassWord" component={PassWordScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="NewPassword" component={NewPasswordScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="LogInLoading" component={LogInLoading} options={{ headerShown: false }}/>
            <MainStack.Screen name ={MainScreens.Main} component={MainTabNavigator}/>
            <MainStack.Screen name="Event" component={EventComponent} options={{ headerShown: false }}/>
            <MainStack.Screen name="Book" component={BookingStackNavigator} />
            <MainStack.Screen name={MainScreens.LogInfo} options={{headerShown:false}} component={LogInformationStackNavigator}/>
            <MainStack.Screen name={MainScreens.MyCoupon} 
             options={{
                headerShown: true,
                headerStyle: {
                    height: 60, // 헤더의 높이 값을 원하는 크기로 설정
                },
                headerTitle: '쿠폰',
                headerTitleAlign: 'center',
            }}
            component={MyCouponScreen}/>
            <MainStack.Screen name="Membership" component={MembershipStackNavigator} />
            <MainStack.Screen name="MembershipPurchase1" component={MembershipPurchaseNavigator}/>
            <MainStack.Screen name={MainScreens.Review} 
            component={ReviewScreen}
            options={{
                headerShown: true,
                headerStyle: {
                    height: 60, // 헤더의 높이 값을 원하는 크기로 설정
                },
                headerTitle: '리뷰 작성하기',
                headerTitleAlign: 'center',
            }}
            />
            <MainStack.Screen name={MainScreens.PT} component={PTStackNavigator} /> 
            <MainStack.Screen name={MainScreens.MineMembership} component={MMStackNavigator}/>
        </MainStack.Navigator>
    </NavigationContainer>
    );
}

const BookingStackNavigator: React.FunctionComponent = () => {
    return (
            <BookingStack.Navigator screenOptions={{ headerShown: true, headerBackTitleVisible: false, headerTitle: '1일권 예약하기'  }}>
                <BookingStack.Screen name="RoomSelect" component={RoomSelectScreen}/>
                <BookingStack.Screen name="RoomADetail" component={RoomADetailScreen}/>
                <BookingStack.Screen name="RoomBDetail" component={RoomBDetailScreen}/>
                <BookingStack.Screen name="RoomCDetail" component={RoomCDetailScreen}/>
                <BookingStack.Screen name="Booking" component={BookingScreen}/>
                <BookingStack.Screen name="BookedInfo" component={BookedInfoScreen}/>
                <BookingStack.Screen name="BookingPayment" component={BookingPayment} options={{ headerShown : false }}/> 
                <BookingStack.Screen name={BookingScreens.BookingPaymentResult} component={BookingPaymentResult} options={{ headerShown : false }}/> 
            </BookingStack.Navigator>
    );
};


const MembershipStackNavigator: React.FunctionComponent = () => {
    return (
            <MembershipStack.Navigator screenOptions={{ headerShown : true, headerBackTitleVisible: false, headerTitle: '예약하기' }}>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomSelect} component={MembershipRoomSelectScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomADetail} component={MembershipRoomADetailScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomBDetail} component={MembershipRoomBDetailScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomCDetail} component={MembershipRoomCDetailScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipBooking} component={MembershipBookScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipBookedInfo} component={MembershipBookedInfoScreen}/>
            </MembershipStack.Navigator>
    );
};

const MembershipPurchaseNavigator: React.FunctionComponent = () => {
    return (
            <MembershipPurchase.Navigator screenOptions={{ headerShown : true, headerBackTitleVisible: false, headerTitle: '회원권 구매하기' }}>
                <MembershipPurchase.Screen name={MembershipPurchaseScreens.MembershipPurchase} component={MembershipPurchaseScreen}/>
                <MembershipPurchase.Screen name={MembershipPurchaseScreens.MembershipPayment} component={MembershipPayment} options={{headerShown:false}}/>
                <MembershipPurchase.Screen name={MembershipPurchaseScreens.MembershipPaymentResult} component={MembershipPaymentResult} options={{headerShown:false}}/> 
            </MembershipPurchase.Navigator>
    );
};

const PTStackNavigator: React.FunctionComponent = () => {
    return (
            <PTStack.Navigator screenOptions={{ headerShown : true, headerBackTitleVisible: false, headerTitle: 'PT 이용하기' }}>
                <PTStack.Screen name={PTScreens.PTProfile} component={PTProfileScreen}/>
                <PTStack.Screen name={PTScreens.PayPT} component={PayPTScreen} options={{ headerShown : false }}/>
                <PTStack.Screen name={PTScreens.PaymentTest} component={PaymentTest} options={{headerShown:false}}/>
                <PTStack.Screen name={PTScreens.Payment} component={Payment} options={{headerShown:false}}/>
                <PTStack.Screen name={PTScreens.PaymentResult} component={PaymentResult} options={{headerShown:false}}/> 
            </PTStack.Navigator>
    );
};

// const BookingHistoryStackNavigator: React.FunctionComponent = () => {
//     return (
//             <HistoryStack.Navigator screenOptions={{ headerShown : true }}>
//                 <HistoryStack.Screen name={HistoryScreens.History} component={BookingHistory}/>
//                 <HistoryStack.Screen name={HistoryScreens.Review} component={ReviewScreen}/>
//             </HistoryStack.Navigator>
//     );
// }

const MMStackNavigator: React.FunctionComponent = () => {
    return (
            <MMStack.Navigator screenOptions={{ headerShown : true , headerBackTitleVisible: false, headerTitle: '내 이용권'}}>
                <MMStack.Screen name={MMScreens.MyMembership} component={MyMembershipScreen}/>
                <MMStack.Screen name={MMScreens.PTReview} component={PTReviewScreen}/> 
            </MMStack.Navigator>
    );
};

const LogInformationStackNavigator: React.FunctionComponent = () => {
    return (
            <LogInformationStack.Navigator screenOptions={{ headerShown : true, headerBackTitleVisible: false, headerTitle: '내 정보' }}>
                <LogInformationStack.Screen name={LogInformationScreens.LogInformation} component={LogInformationScreen}/>
                <LogInformationStack.Screen name={LogInformationScreens.UsingRule} component={UsingRuleScreen}/>
            </LogInformationStack.Navigator>
    );
}



export default MainStackNavigator;