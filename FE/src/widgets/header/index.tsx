import { Link } from 'react-router-dom';
import Logo from './UI/Logo';

const Header = () => {
  return (
    <header className="flex justify-between items-center w-full h-20 px-[16vw] bg-primary text-text-light ">
      <Logo />
      <div className="flex gap-[1rem]">
        <Link to="/signin">로그인</Link>
        <Link to="/signup">회원가입</Link>
        <Link to="/mypage">마이페이지</Link>
        <button>로그아웃</button>
      </div>
    </header>
  );
};

export default Header;
