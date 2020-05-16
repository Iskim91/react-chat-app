import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({ location }) => {
  const [ name, setName ] = useState('');
  const [ room, setRoom ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ messages, setMessages ] = useState([]);
  const [ users, setUsers ] = useState('');

  const ENDPOINT = 'localhost:5000';
  // useEffect is like componentDidMount and may be used many times
  useEffect(() => {
    // location is something that react-router-dom provides
    // queryString.parse makes it more readable by transforming into an Object
    socket = io(ENDPOINT);
    const {name, room} = queryString.parse(location.search);
    setName(name);
    setRoom(room);
    // this will send to the server
    socket.emit('join', { name, room}, () => {

    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message])
    });

  }, [messages])

  useEffect(() => {
    socket.on('roomData', ({users}) => {
      setUsers(users)
    });
  }, [])

  const sendMessage = (e) => {
    e.preventDefault();

    if(message) {
      socket.emit("sendMessage", message, () => setMessage(''))
    }
  }

  console.log(users)

  return (
    <div className='outerContainer'>
      <div className="container">
        <InfoBar roomName={room} />
        <Messages name={name} messages={messages}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  );
}

export default Chat;
