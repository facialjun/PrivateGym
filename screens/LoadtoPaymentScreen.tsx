import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { PTStackParamList } from '../stacks/Stacks';


const MyWebView = () => {
  return (
    <View>
      <TouchableOpacity
        style={{ width: 200, height: 200, backgroundColor: 'red' }}
      >
        <Text>정기권 오패시티입니다.</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyWebView;
