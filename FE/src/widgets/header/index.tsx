import { Link } from 'react-router-dom';
import Logo from './UI/Logo';
import { useState } from 'react';

const Header = () => {
  const [isLogin, setIsLogIn] = useState(true);

  const handleLogout = () => {
    alert('로그아웃하기');
  };

  return (
    <header className="flex justify-between items-center w-full h-20 px-[16vw] bg-primary text-text-light ">
      <Logo />
      {isLogin ? (
        <div className="flex gap-[1rem]">
          <Link to="/mypage">마이페이지</Link>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <div className="flex gap-[1rem]">
          <Link to="/signin">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
