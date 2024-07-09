import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './main.page';
import DetailPage from './detail.page';
import CharacterPage from './character.page';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MainPage">
                <Stack.Screen name="MainPage" component={MainPage} options={{ title: 'Rick and Morty Episodes' }} />
                <Stack.Screen name="DetailPage" component={DetailPage} options={{ title: 'Episode Details' }} />
                <Stack.Screen name="CharacterPage" component={CharacterPage} options={{ title: 'Character Details' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
