import React, { useState } from 'react';

import { View, Text, TextInput, Button } from 'react-native';

function joinRoom(user, room, ws) {
    if(user === '' || room === '') return null;

    const msg = {
        message: 'Request to join room.',
        user: user.trim(),
        room: room.trim(),
        meta: 'join'
    };

    ws.send(JSON.stringify(msg));
}

function UserView (props) {

    const styles = props.styles;

    const [ws, setWs] = useState(props.ws);
    const [roomInput, setRoomInput] = useState('');
    const [room, setRoom] = useState({});
    const [user, setUser] = useState('');

    useState(() => {
        setRoom(props.room);
    }, [props.room]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Join Room{'\n\n'}</Text>
            <Text style={styles.header}>Enter Room Name</Text>
            <TextInput 
                style={styles.input}
                value={roomInput}
                onChangeText={(text) => setRoomInput(text)}
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
                onPress={() => joinRoom(user, roomInput, ws)}
            />
            <Text>{'\n\n\n\n\n'}</Text>
        </View>
        )
}

export default UserView;