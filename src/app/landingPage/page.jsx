import React from 'react';
import { Box, Heading, Button, Flex, Image, Text, Container } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ParticlesComponent from '@/components/particles';
import { TypeAnimation } from 'react-type-animation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const SliderImage = ({ src, alt }) => (
  <Box
    w="150px"
    h="150px"
    m={2}
    position="relative"
    overflow="hidden"
  >
    <Image
      src={src}
      alt={alt}
      w="100%"
      h="100%"
      objectFit="contain"
      transition="all 0.3s"
      filter="grayscale(100%)"
      _hover={{ filter: "grayscale(0%)" }}
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
      width: '100px',
      zIndex: 1,
      background: 'linear-gradient(to right, white, transparent)',
    }}
    _after={{
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '100px',
      zIndex: 1,
      background: 'linear-gradient(to left, white, transparent)',
    }}
  >
    {children}
  </Box>
);

const LandingPage = () => {
  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'ease-in-out',
    pauseOnHover: false,
    // Mobile Friendly
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
    "CUNY_Baruch.png", "CUNY_BC.png", "CUNY_BCC.png", "CUNY_BMCC.jpg", "CUNY_CCNY.png", "CUNY_CSI.png", "CUNY_Graduate_Center.png",
    "CUNY_Guttman.gif", "CUNY_Health_Policy.png", "CUNY_Hostos.png", "CUNY_Hunter.png", "CUNY_JohnJay.png", "CUNY_Journalism.png",
    "CUNY_Kingsborough.jpg", "CUNY_Labor.png", "CUNY_Law.png", "CUNY_Lehman.png", "CUNY_Macaulay.png", "CUNY_Medgar.png", "CUNY_NYCCT.jpg",
    "CUNY_Professional_Studies.png", "CUNY_QCC.png", "CUNY_Queens.webp", "CUNY_York.png"
  ];

  return (
    <Box width="100%" minHeight={"100vh"}>
      {/* Hero Section with Particles Background */}
      <Box position="relative" overflow="hidden" height="400px">
        <Box position="absolute" top="0" left="0" width="100%" height="100%" zIndex="-1">
          <ParticlesComponent id="particles" />
        </Box>

        <Container maxW="1150px" height="100%">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="center"
            textAlign={{ base: 'center', md: 'left' }}
            px={{ base: 4, md: 8, lg: 16 }}
            position="relative"
            zIndex="1"
            height="100%"
          >
            <Box flex="1" pr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
              <Heading
                fontSize={{ base: '3xl', md: '4xl', lg: '6xl' }}
                color="#FFFFFF"
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

              <Flex justify={{ base: 'center', md: 'flex-start' }} mt={8}>
                <Button
                  color="#FFB71B"
                  bg="#204CAD"
                  _hover={{ bg: '#071B49' }}
                  as={RouterLink}
                  to="/messaging"
                  size="lg"
                  px={8}
                  py={6}
                  mb={8}
                  boxShadow="0px 4px 10px rgba(0, 0, 0, 0.3)"
                >
                  Try Now for Free
                </Button>
              </Flex>
            </Box>
            <Box>
              <Image
                src="/images/final_robotimg.png"
                alt="AI Robot"
                mb={8}
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Rest of the content with white background */}
      {/* Gradient Divider */}
      <Box
        bgGradient="linear(to-t, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0.1) 100%)"
        position="relative"
        min-width="280px"
        min-height="75px"
        max-height="75px"
        height="50px"
        width="calc(100% + 0px)"
        margin={"-0px 0px"}
      />
      <Box bg="#FFFFFF" py={20} px={{ base: 4, md: 8, lg: 16 }} minHeight={"100vh"}>
        <Heading
          fontSize={{ base: '3xl', md: '4xl', lg: '4xl' }}
          color="#000000"
          fontWeight="bold"
          textAlign="center"
          mt={-16}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)"
        >
          Our Connections
        </Heading>

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

        {/* Problem Section */}
        <Container maxW="1000px" mt={10}>
          <Heading textAlign="center" mb={8} textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)">The Problem</Heading>
          <Box position="relative">
            <Box
              position="absolute"
              top="20px"
              left="20px"
              right="-20px"
              bottom="-15px"
              bg="#FFB71B"
              transform="rotate(2deg)"
              zIndex={0}
              boxShadow="0px 4px 20px rgba(0, 0, 0, 0.3)"
              borderRadius="20px"
            />
            <Box bg="#204CAD" p={8} borderRadius="20px" position="relative" zIndex={1}>
              <Flex justifyContent="center" alignItems="center" position="relative">
                <CircularProgress
                  value={77}
                  size="300px"
                  color="#FFB71B"
                  trackColor="gray.100"
                  thickness="12px"
                >
                  <CircularProgressLabel
                    fontSize="3xl"
                    fontWeight="bold"
                    color="#FFB71B"
                    textShadow="2px 2px 6px rgba(0, 0, 0, 0.3)"
                  >
                    77%
                  </CircularProgressLabel>
                </CircularProgress>

                <Box
                  position="absolute"
                  left="0"
                  top="50%"
                  transform="translateY(-50%)"
                  bg="gray.200"
                  color="gray.800"
                  p="6"
                  borderRadius="lg"
                  width="250px"
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

                <Box
                  top="50%"
                  right="0"
                  transform="translateY(-50%)"
                  position="absolute"
                  bg="#FFB71B"
                  color="white"
                  p="6"
                  borderRadius="lg"
                  width="250px"
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
            </Box>
          </Box>
        </Container>

        {/* Solution Section */}
        <Container maxW="1000px" my={20}>
          <Heading textAlign="center" mb={8} textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)">Our Solution</Heading>
          <Box position="relative">
            <Box
              position="absolute"
              top="20px"
              left="20px"
              right="-20px"
              bottom="-15px"
              bg="#204CAD"
              transform="rotate(2deg)"
              zIndex={0}
              boxShadow="0px 4px 20px rgba(0, 0, 0, 0.3)"
              borderRadius="20px"
            />
            <Box bg="#FFB71B" borderRadius="20px" position="relative" zIndex={1}>
              <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" p={10}>
                <Box flex="1" pr={{ base: 0, md: 6 }} mb={{ base: 6, md: 0 }}>
                  <Image
                    src="/screenshot.png"
                    alt="App Screenshot"
                    objectFit="contain"
                    boxSize="100%"
                    borderRadius="lg"
                    overflow={'hidden'}
                  />
                </Box>
                <Box flex="1">
                  <Text color={'black'} mb={4}>
                    <b>CUNYGPT</b> is a revolutionary resource for CUNY students to find all resources at one site.
                  </Text>
                  <Text color={'black'} mb={4}>
                    The power of our idea lies in its ability to integrate various campus resources into a single, accessible platform.
                  </Text>
                  <Text color={'black'}>
                    Discover how <b>CUNYGPT</b> can enhance your student experience by providing all the essential information you need in one place.
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Container>

        {/* GIF DEMO(Stretch) */}
        {/* <Heading mb={4} textAlign="center" textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)">
          See how it works
        </Heading>
        <Flex justify="center" mb={12}>
          <Image src="placeholder.gif" alt="Placeholder" />
        </Flex> */}

        <Flex justify="center">
          <Button
            color="#FFB71B"
            bg="#204CAD"
            _hover={{ bg: '#071B49' }}
            as={RouterLink}
            to="/messaging"
            size="lg"
            px={8}
            py={6}
            mb={8}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.3)"
          >
            Try Now for Free
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default LandingPage;