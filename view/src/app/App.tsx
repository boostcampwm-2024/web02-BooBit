import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useAuthActions } from '../shared/store/auth/authActions';
import { useToast } from '../shared/store/ToastContext';
import Toast from '../shared/UI/Toast';
import errorMessages from '../shared/consts/errorMessages';
import { useState } from 'react';

const App = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const { addToast } = useToast();

  const [queryClient] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          if (error instanceof Error) {
            if (error.message === '403') {
              addToast(errorMessages[403], 'error');
              logout();
              navigate('signin');
            }
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          if (error instanceof Error) {
            if (error.message === '403') {
              addToast(errorMessages[403], 'error');
              logout();
              navigate('signin');
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
