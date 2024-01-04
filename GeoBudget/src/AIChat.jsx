/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef} from 'react';
import OpenAI from 'openai';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
library.add(faPowerOff, faFeatherPointed);

const AIChat = ({chatHistory, addMessageToChat, user, expenses, IsSignedin, DemoData, power, DataOption}) => {

const [userInput, setUserInput] = useState('');
const [ailoading, setailoading] = useState(false);
const chatContainerRef = useRef(null);
//const openai = new OpenAI();

const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const clientHeight = chatContainerRef.current.clientHeight;

      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  const generateAIresponse = async (UserMessage, TempChatHistory) => {
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + import.meta.env.VITE_OPENAI_API_KEY, // Replace with your API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: 'system', content: "You are a helpful assistant. Respond concisely within 50 tokens. If the prompt is off-topic, remind the user you are a finance assistant." },...TempChatHistory, UserMessage],
          max_tokens: 50
        }),
      });
      const completion = await response.json();
      //console.log([{ role: 'system', content: "You are a helpful assistant. Respond concisely if the user content is not related to finance" },...TempChatHistory, UserMessage], "in gen AI");
      setailoading(false)
      return completion.choices[0].message.content
    } catch (error) {
      console.error('Error generating AI response:', error);
      if(!power)
      {
        return 'Sorry, I am currently connecting to the server. Please wait a few seconds until the profile icon turns green. In the meantime, please try the other features.'
      }
      else
        return 'Sorry, an error occurred while generating the AI response.';
    }
  };

const handleKeyup = (event) => {
    if (event.key === "Enter") {
        handleSendMessage();
    }
};

const handleUserInput = (event) => {
    //for typing into chatbox
    setUserInput(event.target.value);
  };
  
  const handleSendMessage = async () => {
    
    const userMessage = { role: 'user', content: userInput };
    setUserInput('');
    const TempChatHistory = chatHistory;
    addMessageToChat(userMessage); //since this is async, it does not complete before sending it to ai response. Therefore, user message needas to be sent seperate with an pre-appended version of caht history
    setailoading(true)
    const aiResponse = await generateAIresponse(userMessage, TempChatHistory);
    const aiMessage = { role: 'assistant', content: aiResponse };

    addMessageToChat(aiMessage);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
    
return (        
    <div style={{ maxWidth: '60vw', margin: 'auto', padding: '20px' }}>
        <div >
            <h2 style={{ fontSize: '30px', color: 'black', margin: '0', paddingBottom: '23px', textAlign: 'center' }}>
              <FontAwesomeIcon icon={faFeatherPointed} style={{ color: 'green', fontSize: 27 }}/> FinanceAI
            </h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', height: '70vh' }} ref={chatContainerRef}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              style={{
                borderRadius: '10px',
                padding: '10px',
                backgroundColor: message.role === 'user' ? '#aaffaa' : '#aaaaff',
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                wordWrap: 'break-word',
                maxWidth: '70%',
              }}
            >
              {message.content}
            </div>
          ))}
          {ailoading && (
            <div
            key="loading"
            style={{
                borderRadius: '10px',
                padding: '10px',
                backgroundColor: '#aaaaff', 
                alignSelf: 'flex-start',
                wordWrap: 'break-word',
                maxWidth: '70%',
                fontStyle: 'italic'
            }}
            >
            Generating response...
            </div>
             )}
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', overflow: 'hidden' }}>
          <input type="text" value={userInput} onChange={handleUserInput} onKeyUp={handleKeyup} style={{ flex: 1, borderRadius: '10px', padding: '5px' }} />
          <button style={{ border: 'black 1px solid'}} onClick={handleSendMessage}>Send</button>
        </div>
      </div>
        
    );
};

export default AIChat;
