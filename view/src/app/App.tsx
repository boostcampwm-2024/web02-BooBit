import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
