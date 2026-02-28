import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import LogMoodScreen from './screens/LogMoodScreen';
import InsightsScreen from './screens/InsightsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { AuthContext } from './context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LogMood') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Insights') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="LogMood" component={LogMoodScreen} options={{ title: 'Log Mood' }} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error(e);
      }

      dispatch({ type: 'RESTORE_TOKEN', token });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (token) => {
        await AsyncStorage.setItem('userToken', token);
        dispatch({ type: 'SIGN_IN', token });
      },
      signUp: async (token) => {
        await AsyncStorage.setItem('userToken', token);
        dispatch({ type: 'SIGN_IN', token });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {state.isLoading ? null : state.userToken == null ? (
          <Stack.Navigator
            screenOptions={{
              animationEnabled: false,
              headerShown: false,
            }}
          >
            <Stack.Screen name="Auth" component={AuthScreen} />
          </Stack.Navigator>
        ) : (
          <MainApp />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
