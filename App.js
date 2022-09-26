import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginPage } from './src/pages/Login';
import { PrincipalPage } from './src/pages/Principal';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ headerShown:false }} component={LoginPage}/>
        <Stack.Screen name="Principal" options={{ title:"Minha Conta",headerStyle:{backgroundColor:"#0275d8"},headerTintColor:"white" }} component={PrincipalPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
