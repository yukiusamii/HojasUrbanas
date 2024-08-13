import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PruebasScreen} from '../screens/PruebasScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {PlantsScreen} from '../screens/PlantsScreen';
import {CartScreen} from '../screens/CartScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {AuthScreen} from '../screens/AuthScreen';
import {MyTheme, globalStyles} from '../theme/global.styles';

export type RootStackParamList = {
  Home: {id: string};
  Plants: undefined;
  Cart: undefined;
  Profile: undefined;
  MainTabs: undefined;
  Prueba: undefined;
  Auth: undefined;
};

// Crear el Stack Navigator global
const MainStack = createNativeStackNavigator<RootStackParamList>();

// Crear el Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.primary, // Cambia el color de fondo del header
      },
      headerTintColor: '#fff', // Cambia el color del texto del header
      headerTitleStyle: {
        fontWeight: 'bold', // Cambia el estilo del título del header
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen name="Home" component={HomeScreen} />
    {/* <MainStack.Screen
      name="Prueba"
      component={PruebasScreen}></MainStack.Screen> */}
    {/* Agrega aquí más pantallas específicas del stack de Home si las tienes */}
  </MainStack.Navigator>
);

const PlantsStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.primary, // Cambia el color de fondo del header
      },
      headerTintColor: '#fff', // Cambia el color del texto del header
      headerTitleStyle: {
        fontWeight: 'bold', // Cambia el estilo del título del header
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen name="Plants" component={PlantsScreen} />
    {/* Agrega aquí más pantallas específicas del stack de Plants si las tienes */}
  </MainStack.Navigator>
);

const CartStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.primary, // Cambia el color de fondo del header
      },
      headerTintColor: '#fff', // Cambia el color del texto del header
      headerTitleStyle: {
        fontWeight: 'bold', // Cambia el estilo del título del header
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen name="Cart" component={CartScreen} />
    {/* Agrega aquí más pantallas específicas del stack de Cart si las tienes */}
  </MainStack.Navigator>
);

const ProfileStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.primary, // Cambia el color de fondo del header
      },
      headerTintColor: '#fff', // Cambia el color del texto del header
      headerTitleStyle: {
        fontWeight: 'bold', // Cambia el estilo del título del header
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen name="Profile" component={ProfileScreen} />
    {/* Agrega aquí más pantallas específicas del stack de Profile si las tienes */}
  </MainStack.Navigator>
);

// Crear el Tab Navigator dentro del Stack Navigator global
const BottomTabsNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="HomeTab"
      component={HomeStackScreen}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="PlantsTab"
      component={PlantsStackScreen}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="CartTab"
      component={CartStackScreen}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackScreen}
      options={{headerShown: false}}
    />
  </Tab.Navigator>
);

// El Stack Navigator global que incluye los Tabs como una pantalla más
export const MainStackNavigator = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.primary, // Cambia el color de fondo del header
      },
      headerTintColor: '#fff', // Cambia el color del texto del header
      headerTitleStyle: {
        fontWeight: 'bold', // Cambia el estilo del título del header
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen
      name="MainTabs"
      component={BottomTabsNavigator}
      options={{headerShown: false}}
    />

    <MainStack.Screen name="Prueba" component={PruebasScreen} />

    {/* Aquí puedes agregar más pantallas globales que estén fuera del TabNavigator */}

    <MainStack.Screen name="Auth" component={AuthScreen} />
  </MainStack.Navigator>
);
