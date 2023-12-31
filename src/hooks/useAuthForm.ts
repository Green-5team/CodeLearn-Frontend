import { useRef, useState } from 'react';

import { validateUserInfo } from '@/utils';

import { useInput } from '@/hooks/useInput';

export const useAuthForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rePasswordRef = useRef<HTMLInputElement>(null);
  const { value: userAccount, setValue: setUserAccount } = useInput({
    email: '',
    password: '',
    rePassword: '',
  });
  const { value: validateState, setValue: setValidateState } = useInput({
    email: false,
    password: false,
    rePassword: false,
  });
  const { value: errorMessage, setValue: setErrorMessage } = useInput({
    email: '',
    password: '',
    rePassword: '',
  });
  const [isDuplicate, setIsDuplicate] = useState(false);

  const isValidAccount = () => {
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const isValid = validateUserInfo.checkAccount(email, password);
    return isValid;
  };

  const isValidEmail = () => {
    const email = emailRef.current?.value || '';
    const isValid = validateUserInfo.checkEmail(email);
    return isValid;
  };

  const isValidPassword = () => {
    const password = passwordRef.current?.value || '';
    const isValid = validateUserInfo.checkPassword(password);
    return isValid;
  };

  const handleAccountChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    if (name === 'email') {
      if (isValidEmail()) setValidateState({ ...validateState, email: true });
      else setValidateState({ ...validateState, email: false });
      setIsDuplicate(false);
    } else if (name === 'password' || name === 'rePassword') {
      setErrorMessage({ ...errorMessage, rePassword: '' });
      if (isValidPassword()) {
        setValidateState({ ...validateState, password: true });
      } else {
        setValidateState({ ...validateState, password: false });
      }
    }
    if (errorMessage[name]) setErrorMessage({ ...errorMessage, [name]: '' });
    setUserAccount({ ...userAccount, [name]: value });
  };

  return {
    emailRef,
    passwordRef,
    rePasswordRef,
    userAccount,
    validateState,
    setValidateState,
    handleAccountChange,
    isValidAccount,
    isDuplicate,
    setIsDuplicate,
    errorMessage,
    setErrorMessage,
  };
};
