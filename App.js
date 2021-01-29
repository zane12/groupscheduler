import 'node-libs-react-native/globals';

import {
  Link, 
  NativeRouter, 
  Redirect, 
  Route, 
  BackButton
} from 'react-router-native';

import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import UserView from './UserView';
import CreatorView from './CreatorView';
import RoomView from './RoomView';
import SubmittedView from './SubmittedView';



const App = () => {

  const [ws, setWs] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [room, setRoom] = useState({});
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    console.log('useEffect called')
    const ws = new WebSocket('ws://10.0.0.38:8999');

    ws.onopen = () => {
      console.log('connected')
    }

    ws.onclose = () => {
      console.log('disconnected')
    }

    ws.onmessage = (msg) => {
      // console.log("Message from server: " + msg.data);
      msg.data = JSON.parse(msg.data);

      if(msg.data.meta === 'enter') {
        console.log(msg.data)
        setRoom(msg.data.room);
        setRedirect(<Redirect to={'/room/' + msg.data.user} />);
      }

      if(msg.data.meta === 'update') {
        console.log('update room ', msg.data.room);
        setRoom(msg.data.room);
      }

      if(msg.data.meta === 'matches') {
        setMatches(msg.data.message);
      }

      if(msg.data.meta == 'submitted') {
        setRedirect(<Redirect to={'/submitted/' + msg.data.message}/>)
      }
    }



    
    setWs(ws);

    return () => {
        if(ws) {
            ws.close();
        }
    }
  }, []);

  
  

  return <NativeRouter>  
          <BackButton/>
          {redirect}
          <View style={styles.container}> 
            <Route 
              exact
              path='/'>
              <Text>
                <Link to='/create'>          
                  <Text style={styles.link}>Create</Text>          
                </Link>
                <Link to='/join'>
                  <Text style={styles.link}>Join</Text>
                </Link>
              </Text>
            </Route>
            
            <Route 
              exact
              path='/join'
            >
              <UserView ws={ws} room={room} styles={styles}/>
            </Route>
            <Route
              exact
              path='/create'
            >
              <CreatorView ws={ws} room={room} styles={styles} />
            </Route>    
            <Route
              exact
              path='/room/:user'
            >
              <RoomView ws={ws} styles={styles} room={room}/>  
            </Route>
            <Route
              exact
              path='/submitted/:dates'>
              <SubmittedView matches={matches} ws={ws} styles={styles} room={room}/>  
            </Route>    
          </View>
        </NativeRouter> 
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    margin: 12,
    color: 'white',
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    margin: 12,
    color: 'white',
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  smallText: {
    margin: 12,
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    margin: 12,
    backgroundColor: 'white',
    height: 40,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userList: {
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 4,
    margin: 20,
    flexWrap: 'wrap',
    padding: 8,
    maxWidth: 400,
  },
  user: {
    color: 'white',
    margin: 6
  }
});

export default App;
