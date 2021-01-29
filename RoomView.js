import 'node-libs-react-native/globals'

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';

import * as chrono from 'chrono-node';
import moment from 'moment';
import {RoomInfo, renderDates, dateFormat} from './RoomInfo';
import { useParams } from 'react-router';



const submitDate = (textInput, date, setDate, setDateWasInput) => {
  

  if(textInput !== undefined && textInput !== '') {
    const dateSubmitted = chrono.parseDate(textInput, new Date(), {forwardDate: true});
    setDate(dateSubmitted);
    setDateWasInput(true);
  }
  
}

const addDate = (date, dates, setDates) => {
  if(date !== '' && date !== null) { 
    
    //prevent duplicates
    if(dates.find((d) => d === date)) return null;

    const newDates = [...dates, date];
    setDates(newDates);

  } 
}

const submitDates = (dates, room, user, ws) => {

  msgDates = dates.map((date) => {
    return moment(date).toISOString();
  })
  const msg = JSON.stringify({ meta: 'submitDates', message: msgDates, room, user });
  ws.send(msg);

  console.log('submitted')
}



const RoomView = (props) => {
  const [textInput, setTextInput] = useState('');
  const [date, setDate] = useState();
  const [dateWasInput, setDateWasInput] = useState(false);
  const [dates, setDates] = useState([]);
  const [roomData, setRoomData] = useState({});
  

  const { user } = useParams();

  useEffect(() => {
    console.log('new roomData received', props.room)
    const newRoomData = props.room;
    setRoomData(newRoomData);
  }, [props.room]);
  
  

  const styles = props.styles;

  // const renderDates = dates.map((d, i) => {
  //   return <Text style={styles.header} key={i.toString()}>{moment(d).format(dateFormat)}</Text>
  // })


  return (
    <View style={styles.container}>
      <RoomInfo styles={styles} roomData={roomData} />      
      <Text style={styles.header}>What times are you available?</Text>
      <TextInput 
        style={styles.input} 
        placeholder={'Tell me in plain English.'}
        value={textInput}
        onChangeText={(text) => { setTextInput(text) }}
        onEndEditing={() => {
            submitDate(textInput, date, setDate, setDateWasInput);
        }}
      />
      <Text style={styles.header}>
        {date !== undefined ? moment(date).format(dateFormat) : null}
      </Text>
      <Button
        style={styles.button}
        title="Add"
        onPress={() => {
          if(dateWasInput) addDate(date, dates, setDates);
        }}        
      />    
      <ScrollView>{renderDates(dates, styles, dateFormat)}</ScrollView>      
      <Text />
      <Button         
        title='Submit'
        onPress={() => submitDates(dates, roomData.name, user, props.ws)}
      />    
    </View>
  );
};




export default RoomView;
