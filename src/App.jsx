import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Navigation from './components/navigation';
import Footer from './components/footer';
import LandingPage from './pages/landingPage';

function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App
