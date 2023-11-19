import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginForm = styled.form`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;

  @media (max-width: 768px) {
    width: 80%; /* Adjust the width for smaller screens */
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const EmailValidationError = styled.p`
  color: red;
`;

function Register({url}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailValidationError, setEmailValidationError] = useState('');

  const navigate = useNavigate()

  const handleRegisteration = async(e) => {
    e.preventDefault();

    if(!password || !email || !name){
      setErrorMessage('Please provide all fields.');
        return;
    }

    setErrorMessage('');
    setEmailValidationError('');  

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidationError('Please enter a valid email address.');
      return;
    }

    try{
      const response = await axios.post(`${url}/user/add-user`,{
        userName: name,
        email,
        password
      })
      console.log(response.data)
      if(response?.data.message == "User Registered Successfully"){
        toast.success(response.data.message);
      }

    }catch(error){
      console.log(error);
      toast.error(error.response.data.message)
    }

    console.log('Registration clicked');
  };

  return (
    <LoginPageWrapper>
      <LoginForm>
        <h2 style={{textAlign:'center'}}>Notes Reminder</h2>
        <h3>Create Account</h3>
        <FormGroup>
          <Label>Name:</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Email:</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailValidationError && (
            <EmailValidationError>{emailValidationError}</EmailValidationError>
          )}
        </FormGroup>
        <FormGroup>
          <Label>Password:</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <p>Already a user? <b style={{cursor:'pointer'}} onClick={()=>navigate('/')}>Login Here</b></p>
        <Button onClick={handleRegisteration}>Create Account</Button>
      </LoginForm>
    </LoginPageWrapper>
  );
}

export default Register;
