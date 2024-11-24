import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from '../pages/Home';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import { useAuthActions } from '../shared/store/auth/authActions';
import { useToast } from '../shared/store/ToastContext';
import Toast from '../shared/UI/Toast';
import errorMessages from '../shared/consts/errorMessages';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuthActions();
  const { addToast } = useToast();

  const [queryClient] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onSuccess: () => {
          login();
        },
        onError: (error) => {
          if (error instanceof Error) {
            if (error.message === '403') {
              logout();
              if (location.pathname !== '/') {
                addToast(errorMessages[403], 'error');
                navigate('signin');
              }
            }
          }
        },
      }),
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
