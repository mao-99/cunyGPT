// components/Footer.js
import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box bg="#204CAD" py={8}>
      <Flex justify="center" maxW="1200px" mx="auto">
        <Link
          to="/"
          color="#FFB71B"
          _hover={{ color: '#071B49' }}
          borderRadius="30px"
          px={4}
          py={2}
          mr={4}
        >
          Home
        </Link>
        <Link
          to="/messages"
          color="#FFB71B"
          _hover={{ color: '#071B49' }}
          borderRadius="30px"
          px={4}
          py={2}
          mr={4}
        >
          Messaging
        </Link>
        <Link
          to="/about"
          color="#FFB71B"
          _hover={{ color: '#071B49' }}
          borderRadius="30px"
          px={4}
          py={2}
        >
          About
        </Link>
      </Flex>
    </Box>
  );
};

export default Footer;