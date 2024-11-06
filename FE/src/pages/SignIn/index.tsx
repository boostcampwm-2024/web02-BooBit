import AuthLayout from '../../widgets/AuthLayout';
import logo from '../../shared/images/BuBuWithLogo.png';
import SubmitButton from '../../shared/UI/SubmitButton';
import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent } from 'react';
import InputField from '../../shared/UI/InputFeild';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSumbit = () => {
    alert(JSON.stringify(formData));
  };

  const moveToSignup = () => {
    navigate('/signup');
  };

  return (
    <AuthLayout>
      <img src={logo} alt="logo" className="w-[11rem] mb-[2rem]" />
      <InputField
        type="text"
        placeholder="이메일"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <InputField
        type="password"
        placeholder="비밀번호"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <SubmitButton content="로그인" onClick={handleSumbit} />
      <button
        className="ml-[52%] mb-[5rem] text-available-medium-16 text-text-dark hover:underline"
        onClick={moveToSignup}
      >
        아직 계정이 없다면? 회원가입하기
      </button>
    </AuthLayout>
  );
};

export default SignIn;
