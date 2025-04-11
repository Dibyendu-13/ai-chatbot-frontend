import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import './App.css';

function App() {
  const [conversationId, setConversationId] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    setLoading(true);
    const response = await fetch('https://ai-chatbot-backend-gaa4.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, message }),
    });

    const data = await response.json();
    setConversationId(data.conversation_id);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'User', message },
      { sender: 'AI', message: data.reply },
    ]);
    setMessage('');
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent form submit
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="sm" className="container">
      <Paper elevation={3} className="paper">
        <Typography variant="h4" align="center" className="header">AI Chatbot</Typography>
        
        <Box className="chatBox">
          {chatHistory.map((chat, index) => (
            <Box key={index} className={`chatMessage ${chat.sender === 'AI' ? 'ai' : 'user'}`}>
              <Box className="messageBox">
                <Typography variant="body1">{chat.message}</Typography>
              </Box>
            </Box>
          ))}
          {loading && <CircularProgress className="loading" />}
        </Box>

        <TextField
          label="Type your message..."
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="textField"
        />
        
        <Button
         style={{ marginTop: '10px' }}
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={loading}
          className="sendButton"
        >
          Send
        </Button>
      </Paper>
    </Container>
  );
}

export default App;
