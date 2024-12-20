import React, { useState, useRef } from 'react';
import { TextInput } from 'flowbite-react';
import {useSelector} from 'react-redux'
import botAvatar from '../resources/img/bot-mini.png';

export default function CallToAction({ post }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const { currentUser } = useSelector((state) => state.user)
  const messagesContainerRef = useRef(null);
  const API_CHAT_URL = import.meta.env.VITE_API_CHAT_URL;
  const API_SUMMARY_URL = import.meta.env.VITE_API_SUMMARY_URL;

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const generateRandomId = () => {
    return Math.floor(Math.random() * 10000000); // Generate a random number from 0 to 9999999
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const userMessage = input;
      setInput('');
      addMessage('user', userMessage);

      if (userMessage.toLowerCase().startsWith('summary')) {
        if (post && post.content) {
          const plainText = post.content.replace(/<\/?[^>]+(>|$)/g, '');
          await sendSummaryMessage(plainText);
        } else {
          addMessage('bot', 'No content available to summarize.');
        }
      } else {
        let newConversationId;
        if (!conversationId) {
          newConversationId = generateRandomId();
          setConversationId(newConversationId);
        }
        await sendMessage(userMessage, conversationId || newConversationId);
      }
    }
  };
  
  const sendSummaryMessage = async (plainText) => {
    addMessage('bot', 'loader');
  
    try {  
      const response = await fetch(API_SUMMARY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ dialogue: plainText }),
      });
  
      const data = await response.json();  
      if (!response.ok) {
        console.error("Error from summary API:", data.message || "Unknown error");
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            sender: 'bot',
            content: "An error occurred while generating the summary.",
          };
          return updatedMessages;
        });
        return;
      }
  
      const botResponse = data.summary || "Sorry, I couldn't generate a summary.";
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          sender: 'bot',
          content: formatBotResponse(botResponse),
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error in sendSummaryMessage:", error.message);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          sender: 'bot',
          content: "An error occurred while fetching the summary.",
        };
        return updatedMessages;
      });
    } finally {
      scrollToBottom();
    }
  };  

  const addMessage = (sender, content) => {
    const messageContent = sender === 'bot' && content === 'loader'
      ? (<div className="loader"></div>)
      : content;
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender, content: messageContent },
    ]);
  
    scrollToBottom();
  };
  

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const formatBotResponse = (response) => {
    // Loại bỏ dấu nháy kép
    let formattedResponse = response.replace(/"/g, '');
  
    // Loại bỏ các ký tự nhấn mạnh (ví dụ: * và _)
    formattedResponse = formattedResponse.replace(/[*_]/g, '');
  
    return formattedResponse;
  };
  
  const sendMessage = async (userMessage, conversationId) => {
    addMessage('bot', 'loader');

    const response = await fetch(API_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage, conversation_id: String(conversationId) }),
    });
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let botResponse = '';
    
    const processResult = async () => {
      const { done, value } = await reader.read();
      if (done) return;
  
      const token = decoder.decode(value);
      botResponse += token;
  
      const formattedResponse = formatBotResponse(botResponse);
  
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          sender: 'bot',
          content: formattedResponse,
        };
        return updatedMessages;
      });
  
      scrollToBottom();
      processResult();
    };
  
    processResult();
  };
  

  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center h-4/5">
      <div className="bg-white rounded-lg p-5 w-full dark:text-gray-700 dark:bg-slate-800 h-full">
        <h1 className="text-2xl font-bold mb-4 text-center dark:text-gray-200">Blog Plants CHATBOT</h1>
        <div
          ref={messagesContainerRef}
          className=" h-4/5 overflow-y-auto rounded-lg relative pb-30"
        >
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* Bot avatar on the left */}
              {message.sender === 'bot' && (
                <img
                  src={botAvatar}
                  className="w-8 h-8 rounded-full mr-2"
                  alt={`${message.sender} avatar`}
                />
              )}
              {/* Message content */}
              <span className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-gradient-to-r from-teal-500 to-lime-500 text-white' : 'bg-gray-200 text-black text-left'}`}>
                {message.content}
              </span>
              {/* User avatar on the right */}
              {message.sender === 'user' && (
                <img
                  src={currentUser.profilePicture}
                  className="w-8 h-8 rounded-full ml-2"
                  alt={`${message.sender} avatar`}
                />
              )}
            </div>
          ))}
        </div>
          <TextInput
            id="input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            rows={1}
            className="rounded-r-lg p-2 w-full h-1/5 resize-none absolute right-0 bottom-16 z-30 mt-10"
          />
      </div>
    </div>
  );
}