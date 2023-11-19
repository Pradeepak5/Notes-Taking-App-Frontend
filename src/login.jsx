import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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

function Login({url}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailValidationError, setEmailValidationError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();

    if (!email && !password) {
      setErrorMessage('Please fill in both email and password fields.');
      return;
    }else if(!email){
      setErrorMessage('Please fill email fields.');
      return;
    }else if(!password){
      setErrorMessage('Please fill password fields.');
      return;
    }

    setErrorMessage('');
    setEmailValidationError('');  

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidationError('Please enter a valid email address.');
      return;
    }

    // Implement your login logic here
    try{
      const respone = await axios.post(`${url}/user/login`, {
        email,
        password
      })
      console.log(respone.data);
      if(respone.data.message == "Login Success"){
        localStorage.setItem('accessToken', respone.data.access_token);
        localStorage.setItem('userId', respone.data._id)
        navigate('/notes')
        toast.success(respone.data.message)
      }
    }catch(error){
      toast.error(error.response.data.message)
    }
    console.log('Login clicked');
  };

  return (
    <LoginPageWrapper>
      <LoginForm>
        <h2 style={{ textAlign: 'center' }}>Notes Reminder</h2>
        <h3>Login</h3>
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
        <p>
          New On Our Platform?{' '}
          <b style={{ cursor: 'pointer' }} onClick={() => navigate('/register')}>
            Create account
          </b>
        </p>
        <Button onClick={handleLogin}>Login</Button>
      </LoginForm>
    </LoginPageWrapper>
  );
}

export default Login;
