import AuthLayout from '../../widgets/AuthLayout';
import logo from '../../shared/images/BuBuWithLogo.png';
import SubmitButton from '../../shared/UI/SubmitButton';
import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent } from 'react';
import InputField from '../../shared/UI/InputFeild';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSumbit = () => {
    alert('이메일: ' + email + '\n비밀번호: ' + password);
  };

  const moveToSignup = () => {
    navigate('/signup');
  };

  return (
    <AuthLayout>
      <img src={logo} alt="logo" className="w-[11rem] mb-[2rem]" />
      <InputField type="text" placeholder="이메일" value={email} onChange={handleEmailChange} />
      <InputField
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={handlePasswordChange}
      />
      <SubmitButton content="로그인" onClick={handleSumbit} />
      <button
        className="ml-[52%] mb-[5rem] text-available-medium-16 text-text-dark"
        onClick={moveToSignup}
      >
        아직 계정이 없다면? 회원가입하기
      </button>
    </AuthLayout>
  );
};

export default SignIn;
