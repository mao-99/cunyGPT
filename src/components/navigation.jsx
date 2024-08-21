// components/Navigation.js
import React from 'react';
import { Box, Flex, Button, Image, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import LogoCunyGPT from '../assets/LogoCunyGPT.png';

const Navigation = () => {
  return (
    <Box bg="gray.200" py={4}>
      <Flex justify="space-between" maxW="1000px" mx="auto">
        <Link to="/">
          <Image
            src={LogoCunyGPT}
            alt="logo"
            width="200px"
          />
        </Link>
        <HStack spacing={4}>
          <Button
            color="#FFB71B"
            bg="#204CAD"
            _hover={{ bg: "#071B49" }}
            borderRadius="30px"
            px={4}
            py={2}
          >
            <Link to={"/"}>
              Home
            </Link>
          </Button>
          <Button
            color="#FFB71B"
            bg="#204CAD"
            _hover={{ bg: "#071B49" }}
            borderRadius="30px"
            px={4}
            py={2}
          >
            <Link to={"/chat"}>
              Chat
            </Link>
          </Button>
          <Button
            color="#FFB71B"
            bg="#204CAD"
            _hover={{ bg: "#071B49" }}
            borderRadius="30px"
            px={4}
            py={2}
          >
            <Link to={"/about"}>
              About
            </Link>
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigation;
