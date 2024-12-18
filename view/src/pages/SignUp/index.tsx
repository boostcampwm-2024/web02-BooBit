import SubmitButton from '../../shared/UI/SubmitButton';
import AuthLayout from '../../widgets/AuthLayout';
import logo from '../../shared/images/BuBuWithLogo.png';
import LabeledInput from './UI/LabeledInput';
import Guideline from './UI/Guideline';
import useSignupForm from './model/useSignupForm';
import useSignup from './model/useSignup';

const SignUp = () => {
  const {
    formData,
    passwordCheck,
    formValidation,
    handleChange,
    handlePasswordCheckChange,
    validateForm,
    setError,
  } = useSignupForm();
  const { mutate } = useSignup(setError);

  const handleSumbit = () => {
    if (validateForm()) {
      return;
    }

    mutate(formData);
  };

  return (
    <AuthLayout>
      <img src={logo} alt="logo" className="w-[8vw] mb-[2rem]" />
      <LabeledInput
        label="이메일"
        type="text"
        placeholder="example@email.com"
        name="email"
        value={formData.email}
        onChange={handleChange}
        isError={formValidation.email.hasError}
        errorMessage={formValidation.email.message}
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
        isError={formValidation.password.hasError}
        errorMessage={formValidation.password.message}
      />
      <div className="w-[100%] mb-[1rem]">
        <Guideline content="영문/숫자 필수 포함" />
        <Guideline content="8자 이상 32자 이하 입력" />
      </div>
      <LabeledInput
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 확인"
        name="passwordCheck"
        value={passwordCheck}
        onChange={handlePasswordCheckChange}
        isError={formValidation.passwordCheck.hasError}
        errorMessage={formValidation.passwordCheck.message}
      />
      {formValidation.total.hasError && (
        <div className="text-negative  text-available-medium-14">
          {formValidation.total.message}
        </div>
      )}
      <SubmitButton height="h-[8vh]" content="가입하기" onClick={handleSumbit} />
    </AuthLayout>
  );
};

export default SignUp;
