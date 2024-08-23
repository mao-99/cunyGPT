"use client"
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import LandingPage from './landingPage/page';
import AboutUs from './about/page';
import Chat from './chat/page';
import Messages from './messages/page';

function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          {/* <Route path='/chat' element={<Chat />} /> */}
          <Route path="/about" element={<AboutUs/>} /> 
          <Route path="/messages" element={<Messages/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App