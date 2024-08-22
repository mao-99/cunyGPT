import React from 'react';
import { Box, Heading, Button, Divider, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ParticlesComponent from '../components/particles';
import { TypeAnimation } from 'react-type-animation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CircularProgress, CircularProgressLabel} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';



// Import all CUNY images
import CUNY_Baruch from "../Assets/CUNY_Baruch.png";
import CUNY_BC from "../Assets/CUNY_BC.png";
import CUNY_BCC from "../Assets/CUNY_BCC.png";
import CUNY_BMCC from "../Assets/CUNY_BMCC.jpg";
import CUNY_CCNY from "../Assets/CUNY_CCNY.png";
import CUNY_CSI from "../Assets/CUNY_CSI.png";
import CUNY_Graduate_Center from "../Assets/CUNY_Graduate_Center.png";
import CUNY_Guttman from "../Assets/CUNY_Guttman.gif";
import CUNY_Health_Policy from "../Assets/CUNY_Health_Policy.png";
import CUNY_Hostos from "../Assets/CUNY_Hostos.png";
import CUNY_Hunter from "../Assets/CUNY_Hunter.png";
import CUNY_JohnJay from "../Assets/CUNY_JohnJay.png";
import CUNY_Journalism from "../Assets/CUNY_Journalism.png";
import CUNY_Kingsborough from "../Assets/CUNY_Kingsborough.jpg";
import CUNY_Labor from "../Assets/CUNY_Labor.png";
import CUNY_Law from "../Assets/CUNY_Law.png";
import CUNY_Lehman from "../Assets/CUNY_Lehman.png";
import CUNY_Macaulay from "../Assets/CUNY_Macaulay.png";
import CUNY_Medgar from "../Assets/CUNY_Medgar.png";
import CUNY_NYCCT from "../Assets/CUNY_NYCCT.jpg";
import CUNY_Professional_Studies from "../Assets/CUNY_Professional_Studies.png";
import CUNY_QCC from "../Assets/CUNY_QCC.png";
import CUNY_Queens from "../Assets/CUNY_Queens.webp";
import CUNY_York from "../Assets/CUNY_York.png";


const SliderImage = ({ src, alt }) => (
  <Box
    w="150px"
    h="150px"
    m={2}
    position="relative"
    overflow="hidden"
     bg="#f0f0f0"
    borderRadius="50%" // Makes the container circular
    transition="all 0.3s"
  >
    <Image
     
      src={src}
      alt={alt}
      w="100%"
      h="100%"
      objectFit="contain"
      transition="all 0.3s"
    />
  </Box>
);

const SliderContainer = ({ children }) => (
  <Box
    maxW="1000px"
    mx="auto"
    position="relative"
    _before={{
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '50px',
      zIndex: 1,
    }}
    _after={{
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '50px',
      zIndex: 1,
    }}
  >
    {children}
  </Box>
);

const LandingPage = () => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'ease-in-out',
    pauseOnHover: false,
    // Mobile friendly
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      }
    ],
    useCSS: true,
  };

  const cunyImages = [
    CUNY_Baruch, CUNY_BC, CUNY_BCC, CUNY_BMCC, CUNY_CCNY, CUNY_CSI, CUNY_Graduate_Center,
    CUNY_Guttman, CUNY_Health_Policy, CUNY_Hostos, CUNY_Hunter, CUNY_JohnJay, CUNY_Journalism,
    CUNY_Kingsborough, CUNY_Labor, CUNY_Law, CUNY_Lehman, CUNY_Macaulay, CUNY_Medgar,
    CUNY_NYCCT, CUNY_Professional_Studies, CUNY_QCC, CUNY_Queens, CUNY_York
  ];

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
              style={{ whiteSpace: 'nowrap' }}
            >
              Welcome to CUNY GPT
            </Heading>

            <TypeAnimation
              sequence={[
                'Your Virtual AI Assistant',
                1000,
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
                fontSize: '1.5em',
                display: 'inline-block',
                color: "#FFFFFF",
                fontWeight: 'bold',
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)',
                letterSpacing: '0.05em'
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

        <Heading fontSize={{ base: '3xl', md: '4xl', lg: '4xl' }} 
              color="#FFFFFF" 
              fontWeight="bold"
              textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
              textAlign="center"
            >Our Connections</Heading>
        {/* Left to right slider */}
        <SliderContainer>
          <Slider {...sliderSettings}>
            {cunyImages.map((img, index) => (
              <SliderImage key={index} src={img} alt={`CUNY ${index + 1}`} />
            ))}
          </Slider>
        </SliderContainer>

        {/* Right to left slider */}
        <SliderContainer>
          <Slider {...{ ...sliderSettings, rtl: true }}>
            {cunyImages.map((img, index) => (
              <SliderImage key={index} src={img} alt={`CUNY ${cunyImages.length - index}`} />
            ))}
          </Slider>
        </SliderContainer>

        {/* Problem/Solution Section */}
        <Flex justifyContent="center" alignItems="center" height="100vh" position="relative">
      {/* CircularProgress */}
      <CircularProgress
        value={77}
        size="400px"
        color="blue.400"
        trackColor="gray.100"
        thickness="12px"
      >
        <CircularProgressLabel
          fontSize="3xl"
          fontWeight="bold"
          color="blue.500"
          textShadow="2px 2px 6px rgba(0, 0, 0, 0.3)"
        >
          77%
        </CircularProgressLabel>
      </CircularProgress>

      {/* White Part Tooltip */}
      <Box
       position="absolute"
       left="0"              
       top="50%"              
       transform="translateY(-50%)" g
       bg="gray.200"
       color="gray.800"
       p="8"
       borderRadius="lg"
       width="300px"
       textAlign="center"
       fontSize="sm"
       boxShadow="lg"
       zIndex="1"
       fontStyle="italic"
       textShadow="2px 2px 6px rgba(0, 0, 0, 0.3)"
       fontWeight="bold"


      >
        Only 23 percent of a HealthyCUNY survey respondents are aware that their campus had services to help them address food insecurity.
      </Box>

      {/* Blue Part Tooltip */}
      <Box
        top="50%"
        right="-10px"
        transform="translateY(-50%)"
        position="absolute"
        bg="blue.500"
        color="white"
        p="8"
        borderRadius="lg"
        width="300px"
        textAlign="center"
        fontSize="sm"
        boxShadow="lg"
        zIndex="1"
        fontStyle="italic"
        textShadow="2px 2px 6px rgba(0, 0, 0, 0.3)"
        fontWeight="bold"


      >
        77 percent of CUNY students are unaware or unsure of the availability of campus food insecurity services (HealthyCUNY, 2018).
      </Box>
    </Flex>
    <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" p={5}>
      <Box flex="1" pr={{ base: 0, md: 6 }}>
        <Image 
          src="images/viewOfModel.png" 
          alt="App Screenshot"
          objectFit="contain"
          boxSize="100%"
          borderRadius="lg"
          overflow={'hidden'}
        />
      </Box>
      <Box flex="1">
        <Heading fontSize="3xl" color={'white'} mb={4}>Our Solution</Heading>
        <Text color={'white'} mb={4}>
          CUNYGPT is a revolutionary resource for CUNY students to find all resources at one site.
        </Text>
        <Text color={'white'} mb={4}>
          The power of our idea lies in its ability to integrate various campus resources into a single, accessible platform.
        </Text>
        <Text color={'white'}>
          Discover how CUNYGPT can enhance your student experience by providing all the essential information you need in one place.
        </Text>
      </Box>
    </Flex>
    

        <Heading mb={4} textAlign="center">
          See how it works
        </Heading>
        <Flex justify="center" mb={12}>
          <Image src="placeholder.gif" alt="Placeholder" />
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