import React, {useState, useEffect} from 'react';

import {Text, TextInput, View, Button} from 'react-native'

const createRoom = (room, user, ws) => {
    if(room === '' || user === '') return null;

    const msg = {
        message: 'message',
        user: user.trim(),
        meta: 'create',
        room: room.trim()
    }

    ws.send(JSON.stringify(msg));
    
}

const CreatorView = (props) => {

    const [user, setUser] = useState('');
    const [room, setRoom] = useState('');   
    const [ws, setWs] = useState(props.ws);
    const styles = props.styles;

    

    return (
    <View style={styles.container}>
        <Text style={styles.header}>Create Room{'\n\n'}</Text>
        <Text style={styles.header}>Enter Room Name</Text>
        <TextInput 
            style={styles.input}
            value={room}
            onChangeText={(text) => setRoom(text)}
        />
        <Text style={styles.header}>Enter Username</Text>
        <TextInput
            style={styles.input}
            value={user}
            onChangeText={(text) => setUser(text)}
        />
        <Button 
            style={styles.button} 
            title='Enter' 
            onPress={() => createRoom(room, user, ws)}
        />
        <Text>{'\n\n\n\n\n'}</Text>
    </View>
    )
}

export default CreatorView