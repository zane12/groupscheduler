const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();

const moment = require('moment')

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

const rooms = {};

const gran = 'hour'

//Create new object to send without websockets to avoid json issues and unnecessary data transfer
function createSendableRoom(room) {
    const roomToSend = {users: []};
    room.users.forEach((user, i) => roomToSend.users[i] = {name: user.name} );
    roomToSend.owner = {name: room.owner.name};
    roomToSend.name = room.name; 
    return roomToSend;
}

wss.on('connection', (ws) => {
    
   
    ws.send(JSON.stringify({meta: 'connected', message: 'server says connected'}));

    ws.on('close', () => {
        for (const room in rooms){
            if(ws === rooms[room].owner.ws) {
                //delete rooms[room];
                //need to add confirmation on client and close out user connections cleanly.
            }
            else {
                rooms[room].users.find((user, i) => {
                    if(ws === user.ws){
                        rooms[room].users.splice(i, 1);
                        const roomToSend = createSendableRoom(rooms[room]);
                        function leaveUpdate(userSocket) {
                            userSocket.send(JSON.stringify({meta: 'update', message: 'User left the room.', room: roomToSend }));
                        }
                        leaveUpdate(rooms[room].owner.ws);
                        rooms[room].users.forEach((user) => {
                            leaveUpdate(user.ws);
                        })

                    }
                })
            }
            

        }
    })

    ws.on('message', (data) => {

        const msg = JSON.parse(data)

        //Creates the room.
        if(msg.meta === 'create') {
            if(!rooms[msg.room]) {

                const owner = {
                    name: msg.user,
                    ws
                }

                rooms[msg.room] = { 
                    name: msg.room,
                    owner,
                    users: []
                }

                ws.send(JSON.stringify({meta: 'enter', message: 'Room created.', room: rooms[msg.room], user: msg.user}));
            } 
                       
        } 

        //Joins room if available and if username is unique within the room. 
        if(msg.meta === 'join') {
            if(rooms[msg.room] && !rooms[msg.room].users.find(user => user.name === msg.user) && msg.user !== rooms[msg.room].owner.name) {
                
                const newUser = {name: msg.user, ws};
                rooms[msg.room].users.push(newUser);

                const roomToSend = createSendableRoom(rooms[msg.room]);

                ws.send(JSON.stringify({meta: 'enter', message: 'Room joined.', room: roomToSend, user: msg.user}));
                
                
                //send update to everyone in the room.
                function joinUpdate(userSocket) {
                    userSocket.send(JSON.stringify({meta: 'update', message: 'New user joined.', room: roomToSend}));
                }                
                joinUpdate(rooms[msg.room].owner.ws);
                rooms[msg.room].users.forEach((user) => {
                    if(user.ws) joinUpdate(user.ws);
                });

            }

            else {                
                console.log('No room found/Username taken.')
            }

        }

        if(msg.meta === 'submitDates'){
            
            let user = rooms[msg.room].users.find( (user) => user.name === msg.user );

            if(user === undefined){
                if(msg.user === rooms[msg.room].owner.name){
                    user = rooms[msg.room].owner;
                }
            }

            if(user){
                user.dates = msg.message;
                const submitted = JSON.stringify({meta: 'submitted', message: user.dates}) 
                ws.send(submitted);
            } 

            

            if(rooms[msg.room].owner.dates){ 
                if(rooms[msg.room].users.every((user) => {
                    return user.dates !== undefined && user.dates !== []; 
                })) {
                    //everyone has submitted, calculate and send common times here.
                    const dates = [];

                    dates.push(rooms[msg.room].owner.dates);

                    rooms[msg.room].users.forEach((user) => {
                        dates.push(user.dates);
                    })

                    dates.forEach((d) => d.sort());

                    //counts matches and creates an array of matches that are shared by everyone.
                    function finalMatch(dateMatch) {
                        dateMatch.sort();
                    
                        let count = 0;
                        let current = null;
                        let goodDates = [];
                    
                        dateMatch.forEach((date) => {
                            if(current != date){
                                current = date,
                                count = 1;
                    
                            }   else {
                                count++
                            }
                            if(count === dates.length-1) {
                                goodDates.push(current);
                            }
                        })
                    
                        return goodDates;
                    }
                    
                    
                    dates.forEach((d) => d.sort());
                    
                    let dateMatch = [];
                    
                    
                    
                    dates[0].forEach((date) => {   
                        //creates an array of matches according to the granularity (defaults to an hour).
                        for(i = 1; i < dates.length; i++){
                            dates[i].forEach((date2) => {
                                if(moment(date).isSame(moment(date2), gran)) dateMatch.push(date);
                            })
                        }      
                    })
                    
                    
                    
                    let goodDates = finalMatch(dateMatch);
                    
                    if(goodDates.length === 0) {
                    
                        dates[0].forEach((date) => {   
                            //creates an array of matches using a wider window of equivalence.
                            for(i = 1; i < dates.length; i++){
                                dates[i].forEach((date2) => {
                                    if(moment(date).isBetween(moment(date2).subtract(2, 'hour'), moment(date2).add(2, 'hour'), '[]')) dateMatch.push(date);
                                })
                            }      
                        })
                    
                        goodDates = finalMatch(dateMatch);
                    }
                    
                    const goodDatesMsg = JSON.stringify({meta: 'matches', message: goodDates})

                    console.log(goodDatesMsg); 

                    rooms[msg.room].owner.ws.send(goodDatesMsg);
                    rooms[msg.room].users.forEach((user) => {
                        console.log(user);
                        if(user.ws) user.ws.send(goodDatesMsg);
                    })


                }
            }
            
        }
        
    })
})




server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port}`);
});