'use client'
import React from 'react';
import { Box, Flex, Image, Text, Link, Tooltip, useToast } from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';

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
          boxSize="180px" // Increased size proportionally
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
    <Box maxW="1050px" mx="auto" p={8}>
      <Text fontSize="4xl" fontWeight="bold" textAlign="center">Our Team</Text>
      <Text fontSize="2xl" textAlign="center" mb={8}>Who we are?</Text>
      <Text fontSize="lg" textAlign="center" mb={12}>
        As CUNY students, we created CunyGPT to empower CUNY students by providing personalized, accurate, and timely advice on all educational matters. 
        Our goal is to make navigating college life easier, one question at a time.
      </Text>
      <Flex justify="space-between" wrap="nowrap" gap="20px">
        <TeamCard
          image={"HeadshotJackH.jpeg"}
          name="Jack Hachicho"
          school="New York City College of Technology"
          bio="Senior at City Tech majoring in Computer Systems Technology specializing in fullstack web development. Fun fact about me I can type at 150 words per minute(WPM)!"
          linkedin="https://www.linkedin.com/in/jackhachicho"
          github="https://github.com/jackhachicho"
          discordUsername="jackh_123"
        />
        <TeamCard
          image="/path-to-image2.png"
          name="Mubarak"
          school="School 2"
          bio="Bio 2 lorem ipsum..."
          linkedin="https://www.linkedin.com/in/name2"
          github="https://github.com/name2"
          discordUsername="mao.nda"
        />
        <TeamCard
          image="/path-to-image3.png"
          name="Harmain"
          school="School 3"
          bio="Bio 3 lorem ipsum..."
          linkedin="https://www.linkedin.com/in/name3"
          github="https://github.com/name3"
          discordUsername="hsa7867"
        />
        <TeamCard
          image="/path-to-image4.png"
          name="Idris"
          school="School 4"
          bio="Bio 4 lorem ipsum..."
          linkedin="https://www.linkedin.com/in/name4"
          github="https://github.com/name4"
          discordUsername="speedy_panda"
        />
      </Flex>
    </Box>
  );
};

export default AboutUs;