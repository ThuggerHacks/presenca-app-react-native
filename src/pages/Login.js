import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { View,StyleSheet,Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import fp from "../../public/img/fingerprint-solid.png"
import logo from "../../public/img/logo.jpg";
import * as Device from "expo-device";
import * as LocalAuthentication from 'expo-local-authentication';
import { TextInput } from "react-native-gesture-handler";
import { signInWithApi } from "../service/login.service";
import { append } from "../utils/Storage";



export const LoginPage = ({ navigation }) => {
    const[fingerprint,setFingerPrint] = useState(false);
    // wherever the useState is located 
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [error,setError] = useState("");
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
            let fingerprints = await LocalAuthentication.isEnrolledAsync();
         setFingerPrint( fingerprints );
                if(fingerprint == false){
                    // alert("Por favor registe o leitor de impressão digital")
                    // setError("Por favor registe o leitor de impressão digital");
                }
            })();     
    },[])  


    const loginUser = async () => {
 
        // props.navigation.navigate('FLayout',{screen:'Home'})
        // console.log(res)
        // setError(res);
        if(email.trim().length > 0 && password.trim().length > 0 ){

            const user = await signInWithApi(email,password);
            
            if(user.data){
                if(user.data.error){
                    setError(user.data.error);
                }else{
                    append(user.data.data)
                    navigation.push("Principal");
                    setError("");
                    
                }
            }else{
                setError("Houve um erro");
            }

        }else{
            setError("Por favore preencha os campos")
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#0275d8"} />
            <View style={styles.div}>
                <View style={styles.divLogo}>
                    <Image source={logo} style={styles.logo}  />
                    <Text style={styles.logoText}>Universidade Zambeze</Text>
                </View>
                { error !="" ?<Text style={styles.error}>{error}</Text>:""}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput autoCapitalize={"none"} onChangeText={(text) => setEmail(text)} keyboardType={"email-address"} placeholder={"Seu email"} style={styles.search}/>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput  onChangeText={(text) => setPassword(text)} keyboardType={"default"} secureTextEntry placeholder={"Sua senha"} style={styles.search}/>
                </View>
                <TouchableOpacity  style={styles.divFinger} onPress={loginUser}>
                    <Text style={styles.finger}>Entrar</Text>
                </TouchableOpacity>
            </View>  
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo:{
        width:100,
        height:100
    },
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#fff",
    },
    div:{
        width:"88%",
        padding:15,
        margin:20,
        alignItems:"center",
        borderRadius:8,
        backgroundColor:"white"
       

    },
    divLogo:{
        width:"100%",
        alignItems:"center",
        marginBottom:30
    },
    divFinger:{
        padding:15,
        backgroundColor:"#0275d8",
        width:"50%",
        marginTop:25,
        borderRadius:50
    },
    finger:{
        color:"white",
        textAlign:"center",
        fontSize:18
    },
    error:{
        color:"red",
        fontSize:13,
        width:"100%",
    },

    search:{
        borderColor:"#ccc",
        borderBottomWidth:1,
        fontSize:18,
        width:"100%"
    },
    logoText:{
        fontSize:18,
        fontFamily:"sans-serif",
        fontWeight:"bold",
        fontStyle:"italic"
    },
    inputContainer:{
        width:"100%",
        margin:15,
        alignContent:"center",
        justifyContent:"center",
        textAlign:"center"
    },
    label:{
        fontSize:12,
        fontWeight:"500"
    }
})