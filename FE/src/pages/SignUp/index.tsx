import SubmitButton from '../../shared/UI/SubmitButton';
import AuthLayout from '../../widgets/AuthLayout';
import logo from '../../shared/images/BuBuWithLogo.png';
import { useState, ChangeEvent } from 'react';
import LabeledInput from './UI/LabeledInput';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [passwordCheck, setPasswordCheck] = useState('');

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

  const handleSumbit = () => {
    alert(JSON.stringify(formData));
  };

  return (
    <AuthLayout>
      <img src={logo} alt="logo" className="w-[11rem] mb-[2rem]" />
      <LabeledInput
        label="이메일"
        type="text"
        placeholder="example@email.com"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <LabeledInput
        label="이름"
        type="text"
        placeholder="홍길동"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <LabeledInput
        label="비밀번호"
        type="password"
        placeholder="비밀번호"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <LabeledInput
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 확인"
        name="passwordCheck"
        value={passwordCheck}
        onChange={handlePasswordCheckChange}
      />
      <SubmitButton content="가입하기" onClick={handleSumbit} />
    </AuthLayout>
  );
};

export default SignUp;
