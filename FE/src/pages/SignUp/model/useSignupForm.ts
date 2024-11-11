import { useState, ChangeEvent } from 'react';
import { FormData } from './formDataType';

interface FormValidation {
  email: { hasError: boolean; message: string };
  password: { hasError: boolean; message: string };
  passwordCheck: { hasError: boolean; message: string };
}

const useSignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
  });
  const [passwordCheck, setPasswordCheck] = useState('');
  const [formValidation, setFormValidation] = useState<FormValidation>({
    email: { hasError: false, message: '' },
    password: { hasError: false, message: '' },
    passwordCheck: { hasError: false, message: '' },
  });
  const [nullError, setNullError] = useState(false);

  const setError = (field: keyof FormValidation, isError: boolean, message = '') => {
    setFormValidation((prevErrors) => ({
      ...prevErrors,
      [field]: { hasError: isError, message: message },
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlePasswordCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isInvalid = !emailRegex.test(formData.email);
    setError(
      'email',
      isInvalid,
      isInvalid ? '유효하지 않은 이메일 형식입니다. 다시 입력해 주세요.' : ''
    );
    return isInvalid;
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/;
    const isInvalid = !passwordRegex.test(formData.password);
    setError('password', isInvalid, isInvalid ? '비밀번호가 조건에 맞지 않습니다.' : '');
    return isInvalid;
  };

  const validatePasswordCheck = () => {
    const isInvalid = formData.password !== passwordCheck;
    setError(
      'passwordCheck',
      isInvalid,
      isInvalid ? '비밀번호가 일치하지 않습니다. 다시 입력해 주세요' : ''
    );
    return isInvalid;
  };

  const validateNull = () => {
    const isNull = Object.values(formData).some((value) => value === '') || passwordCheck === '';
    setNullError(isNull);
    return isNull;
  };

  const validateForm = () => {
    return validateNull() || validateEmail() || validatePassword() || validatePasswordCheck();
  };

  return {
    formData,
    passwordCheck,
    formValidation,
    nullError,
    handleChange,
    handlePasswordCheckChange,
    validateForm,
  };
};

export default useSignupForm;
