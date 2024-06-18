import React, {useState, useEffect} from 'react';
// import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Animated,
  Image,
  useColorScheme,
  View,
  Button,
  Alert,
  TextInput,
} from 'react-native';

import {
  Colors,
  // DebugInstructions,
  // Header,
  // LearnMoreLinks,
  // ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import Moment from 'moment';

// // import DateTimePicker from './js/components/utils/datePicker';
import {
  TouchableOpacity,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

type SectionProps = PropsWithChildren<{
  title: string;
}>;
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from './js/constants/colors.js';
import CalendarStrip from 'react-native-calendar-strip';

// //Dias a Retroceder o Avanzar
// // const maxDaysFuture = 90;
// // const maxDaysPast = 10;

// // const title = 'detallazo';
import axios from 'axios';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import parsePhoneNumber from 'libphonenumber-js';
import CountryPicker from 'react-native-country-picker-modal';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as Keychain from 'react-native-keychain';
import Realm from 'realm';
// import {enableLatestRenderer} from 'react-native-maps';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const Tab = createBottomTabNavigator();

// enableLatestRenderer();

function HomeScreen() {
  const [data, setData] = useState(null);
  const [Info, setInfo] = useState('');
  const [clave, setClave] = useState('');
  const scaleValue = useSharedValue(1);

  const handleSaveCredentials = async () => {
    try {
      await Keychain.setGenericPassword('chiapas', 'superclave');
      console.log('Credentials saved successfully!');
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  const handleRetrieveCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log('Username:', credentials.username);
        console.log('Password:', credentials.password);
        setInfo(credentials.username);
        setClave(credentials.password);
      } else {
        console.log('No credentials stored.');
      }
    } catch (error) {
      console.log('Error retrieving credentials:', error);
    }
  };

  const handlePress = () => {
    scaleValue.value = withTiming(scaleValue.value === 1 ? 1.5 : 1, {
      duration: 500,
      easing: Easing.ease,
    });

    console.log("aha! super clickeada!");
  };

  const animatedStyle = {
    transform: [{scale: scaleValue.value}],
  };

  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = 'https://www.boredapi.com/api/activity';

    // Make the Axios GET request
    axios
      .get(apiUrl)
      .then(response => {
        // Handle the successful response
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  async () => {
    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        console.log('Credentials successfully loaded for user '+ credentials.username);
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
    // await Keychain.resetGenericPassword();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1}}> 
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
        <Text>medio AXIOS!</Text>
        {data ? (
          <Text>Actividad: {JSON.stringify(data.activity)}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
        <Text> </Text>
        <Text> ---- credenciales ---- </Text>
        <Text> ---- {Info} - {clave} ---- </Text>
        <Button title="Save Credentials" onPress={handleSaveCredentials} />
        <Button title="Retrieve Credentials" onPress={handleRetrieveCredentials} />
        <Text> </Text>
        <Text>aqui se esta probando la libreria reanimated</Text>
        <TouchableOpacity onPress={handlePress}>
          <Animated.View style={[styles.box, animatedStyle]}>
            <Text style={styles.text}>Click Me!</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

function CitasScreen() {
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');

  const handleCountrySelect = country => {
    setCountryCode(country.cca2);
    setCountryName(country.name);
  };
  
  const country = 'US'; // Replace with your desired country code

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Citas!</Text>
      <Icon name="rocket" size={30} color="#900" />
      <CountryPicker
        withFilter
        withFlag
        withCountryNameButton
        withCallingCode
        withEmoji
        onSelect={handleCountrySelect}
      />
      <Text>Selected Country: {countryName}</Text>
      <Text>Country Code: {countryCode}</Text>
      {countryCode ? (
        <Text style={{ marginRight: 10 }}>{getUnicodeFlagIcon(countryCode)}</Text>
      ) : (
        <Text>eligiendo...</Text>
      )}
    </View>
  );
}

function FavoritosScreen() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [countryCode, setcountryCode] = React.useState('');
  const [callingCode, setcallingCode] = React.useState('');
  const [phoneNumbernormal, setphoneNumbernormal] = React.useState('');

  const handleParsePhoneNumber = () => {
    try {
      console.log(phoneNumber);
      console.log(parsePhoneNumber);
      const phoneNumberObj = parsePhoneNumber(phoneNumber);
      const formattedPhoneNumber = phoneNumberObj? phoneNumberObj.formatInternational() : 'Numero Invalido';
      if (phoneNumberObj) {
        setcountryCode(phoneNumberObj.country);
        setcallingCode(phoneNumberObj.countryCallingCode);
        setphoneNumbernormal(phoneNumberObj.nationalNumber);
      }

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Favoritos! y Telefono</Text>
      <Text>{phoneNumber}</Text>
      <Text>{phoneNumbernormal}</Text>
      <Text>{countryCode}</Text>
      <Text>{callingCode}</Text>
      <TextInput
        style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
        placeholder="Enter phone number"
      />
      <Button title="Parse" onPress={handleParsePhoneNumber} />
    </View>
  );
}
function NotificacionesScreen() {
  const handleDateSelected = date => {
    console.log('Selected Date:', date);
  };

  const datesBlacklistFunc = date => {
    return date.isoWeekday() === 6; // disable Saturdays
  };

  console.log(CalendarStrip);

  return (
    <View style={{ flex: 1 }}>
      <CalendarStrip
        scrollable
        style={{height: 90, paddingTop: 20, paddingBottom: 10}}
        daySelectionAnimation={{type: 'border', borderWidth: 1, borderHighlightColor: 'black'}}
        calendarColor={'#862279'}
        selectedDate={new Date()}
        calendarHeaderStyle={{color: 'white'}}
        dateNumberStyle={{color: 'white'}}
        dateNameStyle={{color: 'white'}}
        iconContainer={{flex: 0.1}}
      />
    </View>
  );
}

function SettingsScreen() {
  const [data, setData] = useState([
    {id: '1', text: 'Item 1'},
    {id: '2', text: 'Item 2'},
    {id: '3', text: 'Item 3'},
    {id: '4', text: 'Item 4'},
    {id: '5', text: 'Item 5'},
  ]);

  const handleDeleteItem = itemId => {
    const updatedData = data.filter(item => item.id !== itemId);
    setData(updatedData);
  };

  const renderHiddenItem = ({ item }) => (
    <View style={styles.hiddenItem}>
      <Text style={styles.deleteText}>Delete</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text>Settings!</Text>
      <SafeAreaView style={styles.container}>
        <SwipeListView
          data={data}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          onRowDidOpen={() => console.log('Row opened')}
          onSwipeValueChange={() => console.log('Swipe value changed')}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
}

function OtrosScreen() {
  useEffect(() => {
    // Define the schema for the object to be stored in the realm database
    const PersonSchema = {
      name: 'Person',
      properties: {
        name: 'string',
        age: 'int',
      },
    };

    // Open the realm database
    const realm = new Realm({ schema: [PersonSchema] });

    // Write data to the realm database
    realm.write(() => {
      realm.create('Person', { name: 'John', age: 25 });
      realm.create('Person', { name: 'Alice', age: 30 });
    });

    // Query the data from the realm database
    const persons = realm.objects('Person');

    // Log the data to the console
    console.log(persons);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Otros!</Text>
      <Text>Check the console for output</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView>

    </View>
  );
}
function App(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  async () => {
    const username = 'zuck';
    const password = 'poniesRgr8';
  
    // Store the credentials
    await Keychain.setGenericPassword(username, password);
  
    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
    // await Keychain.resetGenericPassword();w
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Tab 1" component={HomeScreen} />
        <Tab.Screen name="Tab 2" component={CitasScreen} />
        <Tab.Screen name="Tab 3" component={FavoritosScreen} />
        <Tab.Screen name="Tab 4" component={NotificacionesScreen} />
        <Tab.Screen name="Tab 5" component={SettingsScreen} />
        <Tab.Screen name="Tab 6" component={OtrosScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  calendarHeader: {
    color: '#000000',
  },
  dateNumber: {
    color: '#000000',
  },
  dateName: {
    color: '#000000',
  },
  iconContainer: {
    opacity: 0.4,
  },
  containerGesture: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 150,
    height: 80,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  hiddenItem: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  deleteText: {
    color: '#fff',
  },
  container_map: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
