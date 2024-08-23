'use client'
import React from 'react';
import { Box, Flex, Image, Text, Link, Tooltip, useToast, Heading, Container } from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';
import ParticlesComponent from '../../components/particles';

const TeamCard = ({ image, name, school, bio, linkedin, github, discordUsername }) => {
  const toast = useToast();

  const handleDiscordCopy = () => {
    navigator.clipboard.writeText(discordUsername);
    toast({
      title: "Copied!",
      description: "Discord username copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box position="relative" maxW="240px" flex="1" mb={8} textAlign="center">
      <Box position="relative" zIndex="1" mb={-16} mx="auto">
        <Image
          src={image}
          alt={name}
          borderRadius="full"
          boxSize="180px"
          objectFit="cover"
          border="5px solid white"
          position="relative"
          zIndex="2"
          mx="auto"
        />
      </Box>
      <Box
        border="1px solid #e2e8f0"
        borderRadius="md"
        overflow="hidden"
        textAlign="center"
        bg="gray.100"
        width="100%"
        height="380px"
        position="relative"
        paddingBottom="56px"
      >
        <Box p={6} mt={12}>
          <Text fontWeight="bold" fontSize="lg">{name}</Text>
          <Text fontSize="sm" color="gray.500">{school}</Text>
          <Text mt={4} fontSize="sm" whiteSpace="pre-line" textAlign={"left"}>
            {bio}
          </Text>
        </Box>
        <Box bg="#204CAD" p={4} position="absolute" bottom="0" width="100%">
          <Flex justify="space-around">
            <Link href={linkedin} isExternal color="#FFB71B">
              <FaLinkedin size="24" />
            </Link>
            <Link href={github} isExternal color="#FFB71B">
              <FaGithub size="24" />
            </Link>
            <Tooltip label={`${discordUsername} (Click to Copy)`} borderRadius="10px">
              <Box
                as="button"
                onClick={handleDiscordCopy}
                color="#FFB71B"
              >
                <FaDiscord size="24" />
              </Box>
            </Tooltip>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

const AboutUs = () => {
  return (
    <Box minHeight="100vh" width="100%">
      {/* Hero Section with Particles Background */}
      <Box position="relative" overflow="hidden" height="500px">
        <Box position="absolute" top="0" left="0" width="100%" height="100%" zIndex="-1">
          <ParticlesComponent id="particles" />
        </Box>

        <Container maxW="1000px" height="100%" centerContent>
          <Flex
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            height="100%"
            zIndex="1"
          >
            <Heading
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              color="#FFFFFF"
              fontWeight="bold"
              textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
              mt={-35}
            >
              Our Team
            </Heading>
            <Heading
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              color="#FFFFFF"
              fontWeight="normal"
              mt={4}
              textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
            >
              Who are we?
            </Heading>

            {/* Box with border radius and drop shadow */}
            <Box
              maxW="1000px"
              bg="rgba(255, 255, 255, 0.9)"
              borderRadius="xl"
              boxShadow="xl"
              p={8}
              mt={8}
            >
              <Text fontSize="lg" textAlign="center">
                As CUNY students, we created CunyGPT to empower CUNY students by providing personalized, accurate, and timely advice on all educational matters.
                Our goal is to make navigating college life easier, one question at a time.
              </Text>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Gradient Divider */}
      <Box
        position="relative"
        minWidth="280px"
        height="75px"
        width="100%"
        margin="0px 0"
        sx={{
          background: 'linear-gradient(to top, #FFFFFF, rgba(255, 255, 255, 0))'
        }}
      />

      {/* Team Members Section */}
      <Box bg="#FFFFFF" minHeight="80vh">
        <Box maxW="1050px" mx="auto" p={8} zIndex={2}>
          <Flex justify="space-between" wrap="nowrap" gap="20px" >
            <TeamCard
              image={"HeadshotJackH.jpeg"}
              name="Jack Hachicho"
              school="New York City College of Technology"
              bio="CST Major in the Software Development track! Specializing in full stack web development! Fun fact about me I can type at 150 words per minute(WPM)!"
              linkedin="https://www.linkedin.com/in/jackhachicho"
              github="https://github.com/jackhachicho"
              discordUsername="jackh_123"
            />
            <TeamCard
              image={"Headshot_Mao.png"}
              name="Mubarak Odufade"
              school="College of Staten Island"
              bio="Bio 2 lorem ipsum..."
              linkedin="https://www.linkedin.com/in/modufade/"
              github="https://github.com/mao-99"
              discordUsername="mao.nda"
            />
            <TeamCard
              image={"Headshot_Harmain.jpeg"}
              name="Harmain Munir"
              school="Brooklyn College"
              bio="CS Major! I'm passionate about full stack development and technology. Please check out my linkedin for recent updates about my journey in the tech field"
              linkedin="https://www.linkedin.com/in/harmain-munir-335511243/"
              github="https://github.com/Harmain1233"
              discordUsername="hsa7867"
            />
            <TeamCard
              image={"Headshot_Idris.png"}
              name="Idris Hassan"
              school="College of Staten Island"
              bio="CS Major! Passionate about problem-solving and continuous learning. My interests lie in software development, automation, and creating innovative solutions."
              linkedin="https://www.linkedin.com/in/idris-h-8aa78b249/"
              github="https://github.com/Randit-07"
              discordUsername="speedy_panda"
            />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;