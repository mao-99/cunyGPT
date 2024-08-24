import React from 'react';
import { Box, Flex, Button, Image, HStack, Divider } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import LogoCunyGPT from "@/assets/LogoCunyGPT.png"

const Navigation = () => {
  return (
    <Box>
      <Box bg="rgba(237, 242, 247, 1)" py={4} zIndex={10} position="relative">
        <Flex justify="space-between" maxW="1000px" mx="auto">
          <RouterLink to="/">
            <Image
              src='/logo.png'
              alt="logo"
              width="200px"
            />
          </RouterLink>
          <HStack spacing={4}>
            <Button
              as={RouterLink}
              to="/"
              color="#FFB71B"
              bg="#204CAD"
              _hover={{ bg: "#071B49" }}
              borderRadius="30px"
              px={4}
              py={2}
            >
              Home
            </Button>
            <Button
              as={RouterLink}
              to="/messages"
              color="#FFB71B"
              bg="#204CAD"
              _hover={{ bg: "#071B49" }}
              borderRadius="30px"
              px={4}
              py={2}
            >
              Chat
            </Button>
            <Button
              as={RouterLink}
              to="/about"
              color="#FFB71B"
              bg="#204CAD"
              _hover={{ bg: "#071B49" }}
              borderRadius="30px"
              px={4}
              py={2}
            >
              About
            </Button>
          </HStack>
        </Flex>
      </Box>
      
      {/* Idea 1: Yellow Divider w/dropshadow */}
      <Box boxShadow="lg" shadow="0 4px 6px #FFB71B">
        <Divider borderColor="#FFB71B" borderWidth="3px" opacity={1} />
      </Box>

      {/* Idea 2: Gradient Divider */}
      {/* <Box
        bgGradient="linear(to-b, rgba(237, 242, 247, 1) 0%, rgba(237, 242, 247, 0.75) 50%, rgba(237, 242, 247, 0.1) 100%)"
        position="relative"
        min-width="280px"
        min-height="75px"
        max-height="75px"
        height="50px"
        width="calc(100% + 0px)"
        margin={"-0px 0px"}
      /> */}
    </Box>
  );
};

export default Navigation;