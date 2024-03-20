import React, { useEffect } from 'react';
import {NativeBaseProvider} from 'native-base'
import { Amplify } from 'aws-amplify';
import config from './src/amplifyconfiguration.json';
import Navigator from './stacks/Navigator';
import 'react-native-gesture-handler';

Amplify.configure(config);


const App: React.FC = () => {

  return (
    <NativeBaseProvider>
      <Navigator />
    </NativeBaseProvider>
  );
};



export default App;