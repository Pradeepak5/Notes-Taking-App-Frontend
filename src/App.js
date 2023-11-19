import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Login from './login';
import Register from './Register';
import Notes from './Notes';
const url = 'https://notes-taking-app-zkhm.onrender.com';


const AppWrapper = styled.div`
  font-family: 'Arial', sans-serif; /* Example font family, replace with your choice */
`;

function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path="/" element={<Login url={url} />} />
        <Route path='/register' element={<Register url={url}/>}/>
        <Route path='/notes' element={<Notes url={url}/>}/>
      </Routes>
    </AppWrapper>
  );
}

export default App;
