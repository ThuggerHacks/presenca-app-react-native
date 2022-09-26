import {View, Text, Alert } from "react-native";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useEffect, useState } from "react";
import { getData, removeData } from "../utils/Storage";
import { getPresences, nextPageData, postWorkDuraion, resetFinger, searchData, signPresenceWithApi ,updateFingerPrint} from "../service/sign.service";
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Device from "expo-device";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { styles } from "./styles";



const uzEstradaLatitude =   -19.8317827;
const uzEstradaLongitude =34.8661684;
const uzPortaoLatitude = -19.8331208;
const uzPortaoLongitude = 34.8657246;
const uzPadariaLatitude =  -19.8322216;
const uzPadariaLongitude = 34.8632286;

const uzEstradaLatitude1 = -19.8325606;
const uzEstradaLongitude1 = 34.8649166;
const uzPortaoLatitude1 =  -19.8332921;
const uzPortaoLongitude1 =34.8646549;
const uzPadariaLatitude1 =  -19.8326426;
const uzPadariaLongitude1 = 34.8635548;

const isInsideArea = (myLatitude, myLongitude) => {
    //area uz1
    var ABx = (-uzEstradaLongitude + uzPadariaLongitude);
    var ABy = (-uzEstradaLatitude + uzPadariaLatitude);
    var ACx = (-uzEstradaLongitude + uzPortaoLongitude);
    var ACy = (-uzEstradaLatitude + uzPortaoLatitude );

    let areaUz = Math.abs((ABx*ACy - ABy*ACx))/2;

    //area uz2
    ABx = (-uzEstradaLongitude1 + uzPadariaLongitude1);
    ABy = (-uzEstradaLatitude1 + uzPadariaLatitude1);
    ACx = (-uzEstradaLongitude1 + uzPortaoLongitude1);
    ACy = (-uzEstradaLatitude1 + uzPortaoLatitude1 );

    let areaUz2 = Math.abs((ABx*ACy - ABy*ACx))/2;

    //areas usuario
    //1
   var PBx = (-myLongitude + uzPadariaLongitude);
   var PBy = ( -myLatitude + uzPadariaLatitude);
   var PAy = ( -myLatitude + uzEstradaLatitude);
   var PAx = (-myLongitude + uzEstradaLongitude);

    let area1 = Math.abs((PBx*PAy - PBy*PAx))/2;

    //2
    var PAx = ( -myLongitude + uzEstradaLongitude);
    var PAy = (-myLatitude + uzEstradaLatitude);
    var PCx = (-myLongitude + uzPortaoLongitude);
    var PCy = (-myLatitude + uzPortaoLatitude);

    let area2 = Math.abs((PAx*PCy - PAy*PCx))/2;

    //3
    var PBx = (-myLongitude + uzPadariaLongitude);
    var PBy = (-myLatitude + uzPadariaLatitude);
    var PCx = (-myLongitude + uzPortaoLongitude);
    var PCy = (-myLatitude + uzPortaoLatitude);

    let area3 = Math.abs((PBx*PCy - PBy*PCx))/2;

    let totalArea = area1 + area2 + area3;

        //areas usuario
    //1
   var PBx = (-myLongitude + uzPadariaLongitude1);
   var PBy = ( -myLatitude + uzPadariaLatitude1);
   var PAy = ( -myLatitude + uzEstradaLatitude1);
   var PAx = (-myLongitude + uzEstradaLongitude1);

    let area11 = Math.abs((PBx*PAy - PBy*PAx))/2;

    //2
    var PAx = ( -myLongitude + uzEstradaLongitude1);
    var PAy = (-myLatitude + uzEstradaLatitude1);
    var PCx = (-myLongitude + uzPortaoLongitude1);
    var PCy = (-myLatitude + uzPortaoLatitude1);

    let area21 = Math.abs((PAx*PCy - PAy*PCx))/2;

    //3
    var PBx = (-myLongitude + uzPadariaLongitude1);
    var PBy = (-myLatitude + uzPadariaLatitude1);
    var PCx = (-myLongitude + uzPortaoLongitude1);
    var PCy = (-myLatitude + uzPortaoLatitude1);

    let area31 = Math.abs((PBx*PCy - PBy*PCx))/2;

    let totalArea2 = area11 + area21 + area31;

    return totalArea2 == areaUz2 || totalArea == areaUz;
}

const myTask = (myLatitude,myLongitude) => {
    try {
 
        if(isInsideArea(myLatitude,myLongitude)){
            postWorkDuraion(getData().codigo_docente).then( data => {
                console.log(data.data)
            }).catch( error => {
                console.log(error)
            })
            
        }else{
            console.log("Outta uz")
        }
       
    } catch (err) {
      console.log(err)
    }
  }

  const initBackgroundFetch = async (taskName,taskFn,interval )  => {
    try {
      if (!TaskManager.isTaskDefined(taskName)) {
          const location = await  Location.getCurrentPositionAsync({});
        TaskManager.defineTask(taskName, () => {taskFn(location.coords.latitude,location.coords.longitude)});
      }
      const options = {
        minimumInterval: interval // in seconds
      };
    await BackgroundFetch.registerTaskAsync(taskName, options);
    } catch (err) {
      console.log("registerTaskAsync() failed:", err);
    }
  }
  initBackgroundFetch('myTaskName', myTask, 5);



export const PrincipalPage = ( props ) => {
   

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const[date,setDate] = useState("");
    const[data,setData] = useState([]);
    const[info,setInfo] = useState("");
    const[next,setNext] = useState("");
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const[fingerprint,setFingerPrint] = useState(false);
    const [confirm,setConfirm]=useState(null);
    // wherever the useState is located 
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = async() => {
        setDatePickerVisibility(false);

       
       
    };

    const handleConfirm = async(date1) => {
        const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        const days = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

        setDate(new Date(date1).getFullYear() + "-"+months[new Date(date1).getMonth()]+"-"+days[new Date(date1).getDate() - 1])
        hideDatePicker();
    };


    const signPresence = async() => {
   

        LocalAuthentication.authenticateAsync({
            cancelLabel: "Cancelar",
            disableDeviceFallback: true,
            promptMessage:"Por favor confirme a sua identidade"
          })
        .then( async(res) =>{
           
            let location = await Location.getCurrentPositionAsync({});
          
            let myLongitude = location.coords.longitude;
            let myLatitude = location.coords.latitude;


            if(isInsideArea(myLatitude,myLongitude) == false){
                alert("Impossivel assinar fora do recinto da universidade");
            }else{
                if(res.success===true){
                    
                    //check if fingerprint is valid
                    if(getData().docente_fingerprint == Device.osBuildFingerprint || getData().docente_fingerprint == null || getData().docente_fingerprint == ""){

                        //update  finger print
                        const hasErrors = await updateFingerPrintAsync();
                        if(hasErrors == 1 ){
                            const sign = await signPresenceWithApi(getData().codigo_docente);
    
                            if(sign.data){
                                if(sign.data.error){
                                    alert(sign.data.error);
                                }else{
                                    alert(sign.data.success);
                                }
                            }else{
                                alert("Houve um erro");
                            
                            }
                        }

                        await getDataAsync();
                        //register biometrics in backend
                    }else{
                        alert("Impressão digital invalida");
                    }
                  }
            }
            

        }).catch( error => {
        // setError(error);
        
        })
    }


    const updateFingerPrintAsync = async() => {
        if(getData().docente_fingerprint == null || getData().docente_fingerprint == ""){
            const update =  await updateFingerPrint(getData().codigo_docente,Device.osBuildFingerprint);
            if(update.data.error != null){
                alert(update.data.error);
                return 0;
            }
        }

        getData().docente_fingerprint = Device.osBuildFingerprint;
        return 1;
    }


    const resetFingerPrintHandler = async() => {
        const update =  await updateFingerPrint(getData().codigo_docente,Device.osBuildFingerprint,true);
        if(update.data.error != null){
            alert(update.data.error);
            return 0;
        }

        getData().docente_fingerprint = Device.osBuildFingerprint;
        return 1;
    }

    const logOut = () => {

        removeData();
        props.navigation.push("Login");
    }

    const nextPage = async() => {
        const urlData = await nextPageData(next);
        setData(urlData.data.data)
        if(urlData.data.next_page_url){
            setNext(presences.data.next_page_url)
        }else if(!urlData.data.next_page_url){
            setNext(0);
        }
    }

    const searchResult = async() => {
        const search = await searchData(date,getData().codigo_docente);
        setData(search.data.data)

    }

    const reset_fingerPrint = async() => {
        
        if(getData().reset_fingerprint == 1){
            const conf = Alert.alert(
                "Unizambeze",
                "Deseja redefinir a sua impressao digital ? ",
                [
                    {
                        text:"Nao",
                        onPress:async() =>{
                            const data = await resetFinger(getData().codigo_docente,0);
                        }
                    },
                    {
                        text:"Sim",
                       onPress:async() =>  {
                            //reset Fingerprint

                            LocalAuthentication.authenticateAsync({
                                cancelLabel: "Cancelar",
                                disableDeviceFallback: true,
                                promptMessage:"Por favor confirme a sua identidade"
                            })
                            .then( async(res) =>{

                                if(res.success){
                                    const data =  await resetFingerPrintHandler();

                                    if(data == 1){
                                        await resetFinger(getData().codigo_docente,0);
                                        Alert.alert("Unizambeze","Sucesso");

                                    }
                                }

                            }).catch( error => {
                                alert(error);
                            })
                       }
                    }
                ]
            );

        }
    }


    useEffect(() => {
       (async() => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
        let fingerprints = await LocalAuthentication.isEnrolledAsync();
         setFingerPrint( fingerprints );
                if(fingerprint == false){
                    // alert("Por favor registe o leitor de impressão digital")
                    // setError("Por favor registe o leitor de impressão digital");
                }

        await getDataAsync();
        await reset_fingerPrint();
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      })();


    },[])

    const getDataAsync = async() => {
        const presences = await getPresences(getData().codigo_docente);
          if(!presences.data.data ){
              setInfo("Sem presencas")
          }else{
            setData(presences.data.data);
            setInfo("");

            if(presences.data.next_page_url){
                setNext(presences.data.next_page_url)
            }else if(!presences.data.next_page_url){
                setNext(0);
            }
          }
    }
    return (
        <SafeAreaView style={styles.container}>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
             <View style={styles.div}>
               <View style={styles.divInner}>
                    <Text style={styles.name}>{getData().nome_docente}</Text>
                    <Text style={styles.email}>{getData().email_docente}</Text>
               </View>
               <View style={styles.divInner2}>
                    <TouchableOpacity style={styles.btnAssinar} onPress={signPresence}>
                        <Text style={styles.btnText1}>Assinar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSair} onPress={logOut}>
                        <Text style={styles.btnText}>Sair</Text>
                    </TouchableOpacity>
               </View>
            </View> 
            <View style={styles.searchView}>
                <TextInput placeholder="Pesquisar" style={styles.search} onPressIn={showDatePicker} value={date}/>
                <TouchableOpacity style={styles.btnSearch} onPress={searchResult}>
                    <Text style={styles.btnText1}>Pesquisar</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {
                    info != "" ?
                    <View style={styles.card} key={i}>
                        <View>
                            <Text style={styles.caption}>{info}</Text>
                        </View>
                    </View>
                    :""
                }
            {
                data?data.map( (item,i) => {
                    return(
                        <View style={styles.card} key={i}>
                            <View>
                                <Text style={styles.caption}>Data: </Text><Text>{item.data_presenca.split(" ")[0]}</Text>
                            </View>
                            <View>
                                <Text style={styles.caption}>Entrada: </Text><Text>{item.entrada}</Text>
                            </View>
                            <View>
                                <Text style={styles.caption}>Saida: </Text><Text>{item.saida}</Text>
                            </View>
                        </View>
                        
                        
                    )
                }):""
            }
            
                <View >
                   
                    <View>
                        {
                        next != 0 && next !=""?
                        <TouchableOpacity style={styles.btn} onPress={nextPage}>
                            <Text style={styles.more}>Proximo</Text>
                        </TouchableOpacity>:""
                        }
                    </View>
                    
                </View>
            
            </ScrollView>
            
        </SafeAreaView>
    );
}