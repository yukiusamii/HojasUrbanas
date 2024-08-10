import 'react-native-gesture-handler';
import {SafeAreaView, Text} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
// import {CamaraAreaScreen} from './presentation/screens/CamaraAreaScreen';
import {MyTheme} from './presentation/theme/global.styles';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './presentation/routes/StackNavigator';
import {MainStackNavigator} from './presentation/routes/BottomTabsNavegator';
export const App = () => {
  return (
    <PaperProvider
      theme={MyTheme}
      settings={{
        icon: props => <IonIcon {...props} />,
      }}>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1}}>
          {/* <StackNavigator /> */}
          <MainStackNavigator />

          {/* <CamaraAreaScreen /> */}
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
};
