// pages/LandingPage.js
import React from 'react';
import { Box, Heading, Button, Divider, Flex, Image, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box>
      <Flex justify="center" mt={20}>
        <Image src="placeholder.jpg" alt="Placeholder" />
      </Flex>
      <Flex justify="center" mt={6}>
        <Button
          colorScheme="blue"
          color="#FFB71B"
          bg="#204CAD"
          _hover={{ bg: '#071B49' }}
          as={RouterLink}
          to="/messaging"
        >
          Try now for free
        </Button>
      </Flex>
      <Divider my={12} />
      <Flex justify="center" align="center" mb={8}>
        <Image src="placeholder.jpg" alt="Placeholder" mr={8} />
        <Box>
          <Heading mb={2} fontSize="2xl">The Problem</Heading>
          <Text>
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum lorem ipsum
          </Text>
        </Box>
      </Flex>
      <Flex justify="center" align="center" mb={8}>
        <Box>
          <Heading mb={2} fontSize="2xl">Our Solution</Heading>
          <Text>
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum lorem ipsum
          </Text>
        </Box>
        <Image src="placeholder.jpg" alt="Placeholder" ml={8} />
      </Flex>
      <Heading mb={4} textAlign="center">
        See how it works
      </Heading>
      <Flex justify="center" mb={12}>
        <Image src="placeholder.gif" alt="Placeholder" />
      </Flex>
      <Flex justify="center" mb={12}>
        <Text>CunyGPT is connected to:</Text>
        {/* Going to add code for the all the CUNY schools in a later commit */}
      </Flex>
      <Flex justify="center">
        <Button
          colorScheme="blue"
          color="#FFB71B"
          bg="#204CAD"
          _hover={{ bg: '#071B49' }}
          as={RouterLink}
          to="/messaging"
          mb={3}
        >
          Try now for free
        </Button>
      </Flex>
    </Box>
  );
};

export default LandingPage;