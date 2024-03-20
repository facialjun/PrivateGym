import React from 'react';
import { Text, View } from 'react-native';

export default function Loading() {
  return (
    <View flex={1} alignItems={'center'} justifyContent={'center'}>
      <Text fontSize={20}>잠시만 기다려주세요...</Text>
    </View>
  );
}
