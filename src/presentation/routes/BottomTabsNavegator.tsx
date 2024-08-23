import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PruebasScreen} from '../screens/PruebasScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {PlantsScreen} from '../screens/PlantsScreen';
import {CartScreen} from '../screens/CartScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {AuthScreen} from '../screens/AuthScreen';
import {MyTheme, globalStyles} from '../theme/global.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {InfoProfileScreen} from '../screens/InfoProfileScreen';
import {EditProfileScreen} from '../screens/EditProfileScreen';
import {MyPlantsScreen} from '../screens/MyPlantsScreen';
import {NameScreen} from '../screens/NameScreen';
import {AddPlantByNameScreen} from '../screens/AddPlantByNameScreen';
import {DetailScreen} from '../screens/DetailScreen';
import {ResponseScreen} from '../screens/ResponseScreen';
export type RootStackParamList = {
  Home: undefined;
  Plants: undefined;
  Cart: undefined;
  Profile: undefined;
  MainTabs: undefined;
  Prueba: undefined;
  Auth: undefined;
  InfoProfile: undefined;
  EditProfile: {firstTime: boolean};
  MyPlants: undefined;
  ProfileTab: undefined;
  Name: undefined;
  AddPlantByName: undefined;
  Detail: {id: string; type: string | null | undefined};
  Response: {uri: string};
};

// Crear el Stack Navigator global
const MainStack = createNativeStackNavigator<RootStackParamList>();

// Crear el Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.background,
      },
      headerShadowVisible: false,
      headerTintColor: MyTheme.colors.black, // Cambia el color del texto del header
      headerTitleStyle: {
        ...globalStyles.headlineMedium,
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
        title: 'Inicio',
      }}
    />
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
        backgroundColor: MyTheme.colors.background,
      },
      headerShadowVisible: false,
      headerTintColor: MyTheme.colors.black, // Cambia el color del texto del header
      headerTitleStyle: {
        ...globalStyles.headlineMedium,
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen
      name="Plants"
      component={PlantsScreen}
      options={{
        title: 'Mis Plantas',
      }}
    />
    <MainStack.Screen
      name="MyPlants"
      component={MyPlantsScreen}
      options={{
        title: 'Mis Plantas',
      }}
    />
    {/* Agrega aquí más pantallas específicas del stack de Plants si las tienes */}
  </MainStack.Navigator>
);

const CartStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.background,
      },
      headerShadowVisible: false,
      headerTintColor: MyTheme.colors.black, // Cambia el color del texto del header
      headerTitleStyle: {
        ...globalStyles.headlineMedium,
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Mi Carrito',
      }}
    />
    {/* Agrega aquí más pantallas específicas del stack de Cart si las tienes */}
  </MainStack.Navigator>
);

const ProfileStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.background,
      },
      headerShadowVisible: false,
      headerTintColor: MyTheme.colors.black, // Cambia el color del texto del header
      headerTitleStyle: {
        ...globalStyles.headlineMedium,
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen
      name="Profile"
      component={InfoProfileScreen}
      options={{
        title: 'Mi Perfil',
        headerShown: false,
      }}
    />
    <MainStack.Screen
      name="InfoProfile"
      component={InfoProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    {/* Agrega aquí más pantallas específicas del stack de Profile si las tienes */}
  </MainStack.Navigator>
);

// Crear el Tab Navigator dentro del Stack Navigator global
const BottomTabsNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: MyTheme.colors.navBar, // Color de fondo del Tab Navigator (verde claro)
        height: 70, // Ajuste de la altura
        paddingBottom: 10, // Espaciado inferior adicional
        paddingTop: 10, // Espaciado superior adicional
      },
      tabBarActiveTintColor: '#34a110', // Color del icono y texto activo
      tabBarInactiveTintColor: '#696767', // Color del icono y texto inactivo
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      tabBarIconStyle: {
        marginTop: -5, // Ajuste para centrar mejor el icono
      },
      tabBarItemStyle: {
        justifyContent: 'center',
      },
    }}>
    <Tab.Screen
      name="HomeTab"
      component={HomeStackScreen}
      options={{
        headerShown: false,
        title: 'Inicio',
        tabBarIcon: ({color}) => (
          <Icon name="home-outline" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="PlantsTab"
      component={PlantsStackScreen}
      options={{
        headerShown: false,
        title: 'Mis plantas',
        tabBarIcon: ({color}) => (
          <Icon name="leaf-outline" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="CartTab"
      component={CartStackScreen}
      options={{
        headerShown: false,
        title: 'Mi Carrito',
        tabBarIcon: ({color}) => (
          <Icon name="cart-outline" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackScreen}
      options={{
        headerShown: false,
        title: 'Mi Perfil',
        tabBarIcon: ({color}) => (
          <Icon name="person-outline" color={color} size={24} />
        ),
      }}
    />
  </Tab.Navigator>
);

// El Stack Navigator global que incluye los Tabs como una pantalla más
export const MainStackNavigator = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: MyTheme.colors.background,
      },
      headerShadowVisible: false,
      headerTintColor: MyTheme.colors.black, // Cambia el color del texto del header
      headerTitleStyle: {
        ...globalStyles.headlineMedium,
      },
      animation: 'slide_from_right',
    }}>
    <MainStack.Screen
      name="Name"
      component={NameScreen}
      options={{headerShown: false}}
    />
    <MainStack.Screen
      name="Auth"
      component={AuthScreen}
      options={{title: 'Iniciar Sesión'}}
    />
    <MainStack.Screen
      name="MainTabs"
      component={BottomTabsNavigator}
      options={{headerShown: false}}
    />

    <MainStack.Screen name="Prueba" component={PruebasScreen} />

    <MainStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <MainStack.Screen
      name="AddPlantByName"
      component={AddPlantByNameScreen}
      options={{
        // headerShown: false,
        title: 'Añadir Planta',
      }}
    />

    <MainStack.Screen
      name="Detail"
      component={DetailScreen}
      options={{
        headerShown: false,
        title: '',
      }}
    />

    <MainStack.Screen
      name="Response"
      component={ResponseScreen}
      options={{
        // headerShown: false,
        title: '',
      }}
    />

    {/* Aquí puedes agregar más pantallas globales que estén fuera del TabNavigator */}
  </MainStack.Navigator>
);
