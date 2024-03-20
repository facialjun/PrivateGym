import React, { useState ,useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal, Dimensions } from 'react-native';
import moment from 'moment-timezone';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


export const CalendarComponent = ({ visible, onClose,onSelect }) =>  {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);



const swipingRef = useRef(false);

    const changeMonth = (num) => {
        if (swipingRef.current) return; // 이미 스와이프 처리 중이라면 실행하지 않음

        swipingRef.current = true; // 스와이프 처리 중으로 설정
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + num, 1);
        setCurrentMonth(newMonth);

        // 일정 시간 후에 swipingRef를 false로 설정하여 다시 스와이프를 허용
        setTimeout(() => {
            swipingRef.current = false;
        }, 200); // 0.2초 후에 스와이프 재활성화
    };

  
  const handleSelectDate = () => {
      console.log('Selected Start Date:', selectedStartDate);
      console.log('Selected End Date:', selectedEndDate);
      onSelect(selectedStartDate, selectedEndDate);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onClose();
  };

  const selectDate = (day) => {
    const newSelectedDate = moment(currentMonth).startOf('month').add(day - 1, 'days').format("YYYY-MM-DD");

    if (newSelectedDate === selectedStartDate && !selectedEndDate) {
        // 이미 선택된 시작 날짜를 다시 선택한 경우, 선택 취소
        setSelectedStartDate(null);
    } else if (newSelectedDate === selectedEndDate) {
        // 이미 선택된 종료 날짜를 다시 선택한 경우, 선택 취소
        setSelectedEndDate(null);
    } else if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // 시작 날짜 설정 (이전에 선택된 종료 날짜가 있거나 시작 날짜가 없는 경우)
        setSelectedStartDate(newSelectedDate);
        setSelectedEndDate(null); // 사용자가 종료 날짜를 직접 선택할 수 있도록 종료 날짜 초기화
    } else if (moment(newSelectedDate).isAfter(selectedStartDate)) {
        // 사용자가 시작 날짜 이후의 날짜를 선택한 경우, 해당 날짜를 종료 날짜로 설정
        setSelectedEndDate(newSelectedDate);
    } else {
        // 사용자가 시작 날짜 이전의 날짜를 선택한 경우, 해당 날짜를 새로운 시작 날짜로 설정
        setSelectedStartDate(newSelectedDate);
        setSelectedEndDate(null);
    }
};


const isDateSelected = (day) => {
    const dateToCheck = moment(currentMonth).startOf('month').add(day - 1, 'days').format("YYYY-MM-DD");
    if (selectedStartDate && selectedEndDate) {
        // 시작 날짜와 종료 날짜 사이에 있는 날짜인지 확인
        return moment(dateToCheck).isBetween(selectedStartDate, selectedEndDate, 'day', '[]') ||
            dateToCheck === selectedStartDate || dateToCheck === selectedEndDate;
    } else if (selectedStartDate) {
        // 오직 시작 날짜만 선택된 경우
        return dateToCheck === selectedStartDate;
    }
    return false;
};


  const renderDaysOfWeek = () => {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    return daysOfWeek.map(day => (
    <View key={day} style={{width:'14.28%',
    height:56,
    alignItems:'center',
    justifyContent:'center',
    marginVertical: 2,
    padding:8,
    backgroundColor:'white',}}>
    <View style={{flex:1}}>
      <Text style={{fontSize:16}}>{day}</Text>
    </View>
    </View>
    ));
  };

  //달력에서 요일을 가져오는 렌더링 파트
  const renderDays = () => {
    const days = [];
    const firstDayOfMonth = moment(currentMonth).startOf('month').toDate();
    const daysInMonth = moment(currentMonth).endOf('month').date();

    // 달의 첫 날이 시작하는 요일 (0: 일요일, 1: 월요일, ...)
    let dayOfWeek = firstDayOfMonth.getDay();
    for (let i = 0; i < dayOfWeek; i++) {
        // 달의 첫 날 이전을 비우기 위한 빈 셀
        days.push(<View key={`empty-start-${i}`} style={styles.day} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        // 실제 날짜를 표시
        days.push(

            <TouchableOpacity 
            key={`day-${i}`} 
            activeOpacity={1} // 터치 시 투명도 변화 없
            style={[
                styles.day, 
                isDateSelected(i) ? styles.selectedDay : null,
            ]}
            onPress={() => selectDate(i)}
        >
            <Text style={isDateSelected(i) ? styles.selectedDayText : null}>{i}</Text>
        </TouchableOpacity>
        );
    }

    // 달의 마지막 날이 끝나는 요일을 계산하고, 7개의 셀이 항상 유지되도록 빈 셀 추가
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), daysInMonth).getDay();
    const emptyCellsAfter = 6 - lastDayOfMonth; // 마지막 주의 빈 셀 수 계산 (토요일 - 마지막 날의 요일)
    for (let i = 0; i < emptyCellsAfter; i++) {
        days.push(<View key={`empty-end-${i}`} style={styles.day} />);
    }

    return days;
};

  return (
    <Modal visible={visible} transparent={true} animationType="slide" >
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
    <GestureHandlerRootView style={{ justifyContent:'center',alignItems:'center' }}>
      <PanGestureHandler
          onGestureEvent={(event) => {
            const { velocityX } = event.nativeEvent;

            if (velocityX > 0) {
                // 오른쪽으로 스와이프: 이전 달로 이동
                changeMonth(-1);
            } else if (velocityX < 0) {
                // 왼쪽으로 스와이프: 다음 달로 이동
                changeMonth(1);
            }
        }}>
        <Animated.View style={{ 
          backgroundColor: 'white', borderRadius: 8, padding: 20, width: screenWidth*0.9, height:'auto'
          }}>
      
      <View style={{
        backgroundColor: 'white', borderTopLeftRadius: 8,borderTopRightRadius:8
        }}>
    <View >
      
      <View style={{flexDirection:'row',justifyContent:'space-between',height:screenHeight*0.07,backgroundColor:'white',alignItems:'center'}}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <MaterialIcon name="keyboard-double-arrow-left" size={23} color='black' />
          </TouchableOpacity>
          <Text style={{fontSize: 18,}}>
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <MaterialIcon name="keyboard-double-arrow-right" size={23} color='black' />
          </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',height:screenHeight*0.05,backgroundColor:'white'}}>
        {renderDaysOfWeek()}
      </View>
      <View style={{justifyContent:'center',height:screenHeight*0.45,alignItems:'center',backgroundColor:'white',flexDirection:'row',flexWrap: 'wrap'}}>
        {renderDays()}
      </View>
      
      <View style={{
        flexDirection:'row',justifyContent:'space-between',width:screenWidth*0.8
        }}>

            <TouchableOpacity 
              style={{width:screenWidth*0.35,height:screenHeight*0.06,backgroundColor: 'white', borderRadius: 8, borderWidth:1, borderColor:'gray'}}
              onPress={() => onClose()}
              >
              <View style={{
                flex:1,justifyContent:'center',alignItems:'center'
                }}>
                <Text style={{
                  color: 'gray',
                  fontSize: 18,
                  fontWeight: 'bold'}}>취소</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{width:screenWidth*0.35,height:screenHeight*0.06,borderRadius: 8, backgroundColor: '#4169E1', borderWidth:1, borderColor:'#4169E1'}}
              onPress={() => handleSelectDate(selectedDates)}
              >
              <View style={{
                justifyContent:'center',alignItems:'center',flex:1
                }}>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold'}}>적용</Text>
              </View>
            </TouchableOpacity>

          </View>
          
    </View>
    </View>
      </Animated.View>
      </PanGestureHandler>
      </GestureHandlerRootView>
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
      marginHorizontal:16,
    },
    headerText: {
      fontSize: 18,
    },
    headerText2: {
      fontSize: 14,
    },
    calendar: {
      width: screenWidth,
      height:'auto',
      flexDirection: 'row',
      flexWrap: 'wrap', 
      justifyContent: 'space-between', 
      backgroundColor:'white',
      paddingHorizontal:24,
      paddingBottom:16
    },
    day: {
      width: '14.28%',
      height:56,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 2,
      backgroundColor:'white',
    },
    dayOfWeek: {
        width:`14.28%`,
        height:56,
        alignItems:'center',
        justifyContent:'center',
        marginVertical: 2,
        padding:8,
        backgroundColor:'white',
    },
    selectedDay: {
        backgroundColor: '#4169E1', // 선택된 날짜의 배경색을 파란색으로 설정
    },
    selectedDayText: {
        color: 'white', // 선택된 날짜의 텍스트 색상을 흰색으로 설정
    },
    cancelbox1:{
      width:'44%',
        height:'100%',
      backgroundColor: 'white',
        borderRadius: 8,
        borderWidth:1,
        borderColor:'gray'
      },
      selectbox1:{
        width:'44%',
        height:'100%',
        borderRadius: 8,
        backgroundColor: '#4169E1',
        borderWidth:1,
        borderColor:'#4169E1'
      }

  });
  

export default CalendarComponent;
function onApply(startDate: null, endDate: null) {
    throw new Error('Function not implemented.');
}

function setModalVisible(arg0: boolean) {
    throw new Error('Function not implemented.');
}

