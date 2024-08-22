import React, { useState, useEffect, useRef } from 'react';
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
import FormModal from '../components/FormModal';

const Messages = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userInfo, setUserInfo] = useState(null);
  const [savedMessages, setSavedMessages] = useState([
    "Here's information about CUNY's academic calendar.",
    "These are the required courses for your major."
  ]);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      { role: 'assistant', content: "Hello! How can I assist you today with CUNY-related questions?" },
      { role: 'user', content: "What are the admission requirements for CUNY schools?" },
      { role: 'assistant', content: "The admission requirements for CUNY schools typically include a high school diploma or equivalent, SAT/ACT scores, and a completed application. Specific requirements may vary by school and program." },
      { role: 'user', content: "Thanks! Can you tell me about financial aid options?" },
    ],
  });
  const chatBoxRef = useRef(null);
  const [chatBoxHeight, setChatBoxHeight] = useState('670px');

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

  const customSubmit = (e) => {
    e.preventDefault();
    const userMessage = { role: 'user', content: input };
    messages.push(userMessage);
    handleSubmit(e);
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
