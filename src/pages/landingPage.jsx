import React from 'react';
import { Box, Heading, Button, Divider, Flex, Image, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ParticlesComponent from '/Users/harmainmunir/Desktop/test_cunyGPT/cunyGPT/src/components/particles.jsx';
import { TypeAnimation } from 'react-type-animation';


const LandingPage = () => {
  return (
    <Box position="relative" overflow="hidden" width="100%" minHeight="100vh">
      {/* Particles Background */}
      <Box position="absolute" top="0" left="0" width="100%" height="100%" zIndex="0">
        <ParticlesComponent id="particles" />
      </Box>

      {/* Main Content */}
      <Box position="relative" zIndex="1" bg="transparent" py={20} px={{ base: 4, md: 8, lg: 16 }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          textAlign={{ base: 'center', md: 'left' }}
          mb={12}
        >
          <Box flex="1" pr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '6xl' }} 
            color="#FFFFFF" 
            mb={2}
            fontWeight="bold"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
            style={{ whiteSpace: 'nowrap' }} // Prevents text wrapping

            >
    
              Welcome to CUNY GPT
            </Heading>

            <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'Your Virtual AI Assistant',
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        'Your Hub for All CUNY Wellness Resources',
        1000,
        'Your Guide to Life at CUNY',
        1000,
        'Your ',
        1000
      ]}
      wrapper="span"
      speed={50}
      style={{
        fontSize: '1.5em', // Increased font size
        display: 'inline-block',
        color: "#FFFFFF",
        fontWeight: 'bold', // Made text bolder
        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)', // Enhanced text shadow
        letterSpacing: '0.05em' // Added letter spacing
      }}
      repeat={Infinity}
    />

           
            <Flex justify={{ base: 'center', md: 'flex-start' }} mt={8} ml={9}>
              <Button
                colorScheme="blue"
                color="#FFB71B"
                bg="#204CAD"
                _hover={{ bg: '#071B49' }}
                as={RouterLink}
                to="/messaging"
                size="lg"
                px={8}
                py={6}
              >
                Try Now for Free
              </Button>
            </Flex>
          </Box>
          <Box height="60%" width="60%">
            <Image
              src="/images/final_robotimg.png"
              alt="AI Robot"
              width="180%"
              height="180%"
              objectFit="cover"
            />
          </Box>
        </Flex>

        {/* Additional Content Below */}
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
    </Box>
  );
};

export default LandingPage;
