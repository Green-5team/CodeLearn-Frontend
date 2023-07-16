import React from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_ROUTE, USER_TOKEN_KEY } from '@/constants';

import { postLogin } from '@/apis/authApi';
import { useAuthForm } from '@/hooks/useAuthForm';

const Login = () => {
  const { emailRef, passwordRef, userAccount, handleAccountChange, isValidAccount } = useAuthForm();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postLogin(userAccount);
      const { access_token: accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem(USER_TOKEN_KEY, accessToken);
        navigate(PATH_ROUTE.lobby);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <input
          name='email'
          data-testid='email-input'
          ref={emailRef}
          value={userAccount.email}
          onChange={handleAccountChange}
        />
        <input
          name='password'
          data-testid='password-input'
          ref={passwordRef}
          value={userAccount.password}
          onChange={handleAccountChange}
          type='password'
          autoComplete='off'
        />
        <button type='submit' data-testid='signin-button' disabled={!isValidAccount()}>
          로그인하기
        </button>
      </form>
    </>
  );
};

export default Login;
