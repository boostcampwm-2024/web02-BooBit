import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>홈</h1>} />
      <Route path="/about" element={<h1>소개</h1>} />
    </Routes>
  );
};

export default App;
