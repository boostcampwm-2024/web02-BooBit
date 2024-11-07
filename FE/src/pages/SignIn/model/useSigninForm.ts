import { ChangeEvent, useState } from 'react';

interface FormData {
  email: string;
  password: string;
}

interface FormError {
  isError: boolean;
  errorMessage: string;
}

const useSigninForm = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [error, setError] = useState<FormError>({ isError: false, errorMessage: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.email === '' || formData.password === '') {
      setError({ isError: true, errorMessage: '이메일 또는 비밀번호를 입력해주세요.' });
      return false;
    }
    return true;
  };

  const resetError = () => setError({ isError: false, errorMessage: '' });

  return { formData, error, handleChange, validateForm, resetError };
};

export default useSigninForm;
