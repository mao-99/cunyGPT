import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Navigation from './components/navigation';
import Footer from './components/footer';
import LandingPage from './pages/landingPage';
import AboutPage from './pages/aboutPage';
import Messages from './pages/messages';

function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/chat" element={<Messages/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App
