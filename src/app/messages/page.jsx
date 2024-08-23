'use client'
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  IconButton,
  List,
  ListItem,
  useDisclosure,
  Container,
  Heading,
  Tooltip,
  useClipboard,
  useToast,
  UnorderedList,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ArrowForwardIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { useChat } from 'ai/react';
import FormModal from '@/components/FormModal';

const Messages = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userInfo, setUserInfo] = useState(null);
  const [savedMessages, setSavedMessages] = useState([
    "Here's information about CUNY's academic calendar.",
    "These are the required courses for your major."
  ]);
  const { messages, input, handleInputChange, setInput, setMessages } = useChat({
    initialMessages: [
      { role: 'assistant', content: "Hello! How can I assist you today with CUNY-related questions?" },
      { role: 'user', content: "What are the admission requirements for CUNY schools?" },
      { role: 'assistant', content: "The admission requirements for CUNY schools typically include a high school diploma or equivalent, SAT/ACT scores, and a completed application. Specific requirements may vary by school and program." },
    ],
  });
  const chatBoxRef = useRef(null);
  const [chatBoxHeight, setChatBoxHeight] = useState('670px');
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");


  `As a work around to contextual messages. I will locally manage chatHistory by using a chat history state variable which is an array of objects.
  The objects have the structure: {question: "this is the question the user asks", response: "this is the response gotten"}. 
  Each submit triggers a call to an async function that responds with the backend response. When the response is generated, a new element is added to the messages state variable. 
  The messages state variable is what we are using to manage the text stream. 
  
  In the call to the async function, we include the context. And based off this context the function knows which database to look for context before passing it to the llm.
  `

  useEffect(() => {
    onOpen();
    updateChatBoxHeight();
    window.addEventListener('resize', updateChatBoxHeight);
    return () => window.removeEventListener('resize', updateChatBoxHeight);
  }, []);

  // Move the chatbox to the bottom of the users screen regardless of resolution.
  const updateChatBoxHeight = () => {
    if (chatBoxRef.current) {
      const windowHeight = window.innerHeight;
      const chatBoxTop = chatBoxRef.current.getBoundingClientRect().top;
      const newHeight = windowHeight - chatBoxTop - 100; 
      setChatBoxHeight(`${newHeight}px`);
    }
  };

  const handleSaveForm = (formData) => {
    setUserInfo(formData);
  };

  const handleEditInfo = () => {
    onOpen();
  };

  const handleSaveMessage = (message) => {
    setSavedMessages((prev) => [...prev, message]);
  };

  const toast = useToast();
  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const customSubmit = async (e) => {
    e.preventDefault();
    
    console.log(input);

    // Add the user's question to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: input }
    ]);

    // Set input to blank
    setInput('');

    try {
        console.log(messages)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages, // You can use messages instead of chatHistory
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log(data);

      // Add the assistant's response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data.answer } // Assuming data.answer contains the response
      ]);

    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show an error message to the user)
    }

    console.log(userInfo);
  };

  return (
    <Container maxW="1060px">
      <Flex>
        {/* Left Tab */}
        <Box w="25%" p={4}>
          <Heading size="md" mb={6} mt={2}>Tips for Using CunyGPT:</Heading>
          <UnorderedList spacing={2}>
            <ListItem>You can save each message to "Saved Information".</ListItem>
            <ListItem>You can switch the context you are talking to using the edit button.</ListItem>
            <ListItem>Refresh the page to start a new chat. Current information will be deleted.</ListItem>
          </UnorderedList>
        </Box>

        {/* Middle Tab */}
        <Box w="75%" p={4}>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading size="md">
              {userInfo ? `${userInfo.schoolName} - ${userInfo.major}, ${userInfo.year}` : 'Chat'}
            </Heading>
            <IconButton
              icon={<EditIcon />}
              onClick={handleEditInfo}
              aria-label="Edit info"
              backgroundColor="#204CAD"
              color="white"
              _hover={{ backgroundColor: "#071B49" }}
            />
          </Flex>

          <Box 
            ref={chatBoxRef}
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            p={4} 
            mb={4} 
            height={chatBoxHeight} 
            overflowY="auto"
          >
            <VStack spacing={4} align="stretch">
              {messages.map((m, index) => (
                <HStack key={index} justify={m.role === 'user' ? 'flex-end' : 'flex-start'}>
                  <Box
                    bg={m.role === 'user' ? 'gray.100' : '#204CAD'} 
                    p={2}
                    borderRadius="md"
                    maxW="80%"
                  >
                    <Text color={m.role === 'user' ? 'black' : 'white'}>{m.content}</Text> 
                  </Box>
                  {m.role === 'assistant' && (
                    <Tooltip label="Save message">
                      <IconButton
                        icon={<AddIcon />}
                        size="sm"
                        backgroundColor="#FFB71B"
                        color="white"
                        _hover={{ backgroundColor: "#de9904" }}
                        onClick={() => handleSaveMessage(m.content)}
                        aria-label="Save message"
                      />
                    </Tooltip>
                  )}
                </HStack>
              ))}
            </VStack>
          </Box>

          <form onSubmit={customSubmit}>
            <InputGroup>
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question..."
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  icon={<ArrowForwardIcon />}
                  backgroundColor="#204CAD"
                  color="white"
                  _hover={{ backgroundColor: "#071B49" }}
                  type="submit"
                  aria-label="Send message"
                  onClick={customSubmit}
                />
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>

        {/* Right Tab */}
        <Box w="35%" p={4}>
          <Heading size="md" mb={6} mt={2}>Saved Information</Heading>
          <Box 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            p={4} 
            height={chatBoxHeight} 
            overflowY="auto"
          >
            <UnorderedList spacing={2}>
              {savedMessages.map((message, index) => (
                <Tooltip borderRadius={"10px"} label="Click to copy" key={index}>
                  <ListItem
                    onClick={() => handleCopy(message)}
                    _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {message}
                  </ListItem>
                </Tooltip>
              ))}
            </UnorderedList>
          </Box>
        </Box>
      </Flex>
        <FormModal isOpen={isOpen} onClose={onClose} onSave={handleSaveForm} />
    </Container>
  );
};

export default Messages;
