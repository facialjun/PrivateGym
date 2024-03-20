import { ScrollView } from 'native-base';
import { border } from 'native-base/lib/typescript/theme/styled-system';
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';


const Signup = () => {
  const navigation = useNavigation();
  const [agreements, setAgreements] = useState({
    personalInfo: false,
    termsOfService: false,
    overFourteen: false,
    marketing: false,
  });

  const [allAgreed, setAllAgreed] = useState(false);


  const handleAgreementChange = (key) => {
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    setAgreements(newAgreements);
    // 전체 동의 체크박스 상태 업데이트
    setAllAgreed(Object.values(newAgreements).slice(0, 4).every(Boolean)); // 마케팅을 제외한 나머지 체크
  };

  const handleAllAgree = () => {
    const newState = !allAgreed;
    setAgreements({
      personalInfo: newState,
      termsOfService: newState,
      overFourteen: newState,
      marketing: newState // 마케팅 동의는 상태를 유지합니다.
    });
    setAllAgreed(newState);
  };

   // 필수 항목이 모두 동의되었는지 확인
   const isAllMandatoryAgreed = useMemo(() => {
    return agreements.personalInfo && agreements.termsOfService && agreements.overFourteen;
  }, [agreements]);

  const handleConfirmAgreement = () => {
    if (isAllMandatoryAgreed) {
      // 모든 필수 항목에 동의했을 때 MainScreens.Name으로 이동
      navigation.navigate(MainScreens.Name); // 'MainScreens.Name'은 실제 네비게이션 대상 이름으로 변경해야 함
    }
  };

  return (
  <View style={{flex:1}}>
    <ScrollView style={{backgroundColor:'white'}}>
    <SafeAreaView>
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 24 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 24 , marginTop:40}}>이용약관동의</Text>
        <TouchableOpacity onPress={handleAllAgree} style={styles.AllcheckContainer}>
            <View style={[styles.checkbox, allAgreed && styles.checkedCheckbox]}>
            {allAgreed &&  <Icon name="check" size={18} color="white" />}
            </View>
            <Text style={styles.AllcheckboxLabel}>전체 이용약관에 동의합니다</Text>
        </TouchableOpacity>
        {Object.keys(agreements).map((key, index) => (
        <TouchableOpacity key={index} onPress={() => handleAgreementChange(key)} style={styles.checkboxContainer}>
            <View style={[styles.checkbox2, agreements[key] && styles.checkedCheckbox]}>
            {agreements[key] && <Icon name="check" size={16} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>
            {key === 'personalInfo' && '(필수) 개인정보 수집·이용에 동의합니다.'}
            {key === 'termsOfService' && '(필수) 이용약관에 동의합니다.'}
            {key === 'overFourteen' && '(필수) 만 14세 이상입니다.'}
            {key === 'marketing' && '(선택) 마케팅 정보수신에 동의합니다.'}
            </Text>
            {/* 오른쪽 화살표를 눌렀을 때의 링크 처리 */}
            {(key === 'personalInfo' || key === 'termsOfService') && (
            <TouchableOpacity
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                const url = key === 'personalInfo'
                    ? 'https://sites.google.com/view/gymprivate/%ED%99%88'
                    : 'https://sites.google.com/view/using-gymprivate/%ED%99%88';
                Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
                }}
            >
                <Icon name="right" size={16} color='#868E96'/>
            </TouchableOpacity>
            )}
        </TouchableOpacity>
        ))}
        </View>
    </SafeAreaView>
    </ScrollView>
    <View style={{paddingHorizontal:24,backgroundColor:'white'}}>
    <TouchableOpacity
          onPress={handleConfirmAgreement}
          disabled={!isAllMandatoryAgreed} // 필수 항목이 모두 체크되지 않았으면 비활성화
          style={[
            styles.BottomcheckContainer,
            !isAllMandatoryAgreed && styles.disabledButton, // 조건부 스타일 적용
          ]}
        >
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={styles.checkboxLabelWhite}>동의하기</Text>
            </View>
        </TouchableOpacity>
    </View>
    
    </View>
    
  );
  
};

const styles = StyleSheet.create({

    disabledButton: {
        backgroundColor: '#4169E1', // 비활성화 상태의 배경색
        opacity: 0.5, // 비활성화 상태에서의 투명도
      },
    BottomcheckContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#4169E1',
        height:56,
        bottom:20,
        borderRadius:8
      },
    AllcheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor:'#C0D7FB',
    height:64,
    borderRadius:8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#868E96',
    backgroundColor: 'transparent',
    marginRight: 8,
    borderRadius:4,
    marginLeft:16
  },
  checkbox2: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#868E96',
    backgroundColor: 'transparent',
    marginRight: 8,
    borderRadius:4,
    marginLeft:16
  },
  checkedCheckbox: {
    backgroundColor: '#4169E1', // 체크 상태일 때의 배경 색상을 밝은 파란색으로 변경합니다.
    borderColor: '#4169E1', // 체크 상태일 때의 테두리 색상도 동일하게 맞춥니다.
  },
  checkmark: {
    fontSize: 18,
    color: 'white',
  },
  AllcheckboxLabel:{
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#868E96',
  },
  checkboxLabelWhite: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
});

export default Signup;

