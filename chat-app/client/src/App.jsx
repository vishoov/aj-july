import { useEffect, React, useState, useMemo } from 'react'
import { io } from 'socket.io-client'

import './App.css' 


function App() {


  const [messages, setMessages] = useState([])

  const socket = useMemo(()=>{
    return io("http://localhost:3000")
  }, [])
  const [socketId, setSocketId] = useState(null)


  const handleSubmit = (e)=>{
    e.preventDefault()
    const message = e.target.message.value;
    const reciever = e.target.reciever.value;
    // Emit the message to the server
    socket.emit("message", {message, reciever})
    console.log("Message sent:", message)
  }

const joinRoom = (e)=>{
e.preventDefault()
 const room = e.target.room.value;
 console.log(`Joining room: ${room}`)
// Emit the join room event to the server
socket.emit("join-room", room)
}

  useEffect(()=>{
    // Listen for the connection event
    socket.on('connect', ()=>{
      console.log(`Connected to server with id: ${socket.id}`)
     
      setSocketId(socket.id)
    })

    // Listen for the forward-message event from the server
    socket.on("forward-message", (data)=>{
      const { message, socketId }= data;
      setMessages((prevMessages)=>[...prevMessages, {message, socketId}])

    })

  }, [socket])

  return (
    <>
     <h1>Welcome to the best chat app in the world</h1>
     <p>Socket ID: {socketId}</p>


    <form onSubmit={handleSubmit}>
      <label htmlFor="message">Message:</label>
      <input type="text" id="message" name="message" required />
      <input type="text" id="reciever" name="reciever" placeholder="Reciever ID" />
      <button type="submit">Send</button>
    </form>

    <form onSubmit = {joinRoom}>
      <label htmlFor="room">Join Room:</label>
      <input type = "text" id = "room " name = "room" required />
      <button type="submit">Join</button>
    </form>

    <div className="messages">
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index)=>{
          return (
            <li key={index}>
              <strong>Socket ID: {msg.socketId}</strong> - {msg.message}
            </li>
          )
        })}
      </ul>
    </div>


    </>
  )
}

export default App
