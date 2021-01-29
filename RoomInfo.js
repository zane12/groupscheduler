import React from 'react';

import {View, Text} from 'react-native';

import moment from 'moment';

const dateFormat =  "dddd MMMM Do [at] hh:mm a"

const RoomInfo = (props) => {

    const styles = props.styles;
    const roomData = props.roomData;

    if(typeof roomData !== 'object' || !roomData.name || !roomData.users || !roomData.owner) return null; 
  
    const userList = [<Text key="users" style={{...styles.user, width: 400}}>{'\t\t'}Users:</Text>]
    roomData.users.forEach((user) => {
      userList.push(<Text key={user.name} style={styles.user}>{user.name}</Text>);
    })
  
  
    return <View style={styles.userList}>
            <Text style={{...styles.user, width: 400}}>Room: {roomData.name}</Text>
            <Text style={{...styles.user, width: 400}}>{'\t'}Owner: {roomData.owner.name}</Text>
            {userList}
          </View>
  } 

function renderDates (dates, styles, dateFormat) {
  return dates.map((d, i) => {
    return <Text style={styles.header} key={i.toString()}>{moment(d).format(dateFormat)}</Text>
  })
}

export { RoomInfo, renderDates, dateFormat };