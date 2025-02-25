import { Route, Routes } from 'react-router';
import AppLayout from './components/pages/Layout';
import MainPage from './components/pages/MainPage';
import ErrorPage from './components/pages/ErrorPage';
import Sign from './components/pages/Sign';
import User from './components/pages/User';
import SignUp from './components/pages/SignUp';
import { useEffect, useState } from 'react';
import axiosInstance, { setAccessToken } from './utils/axiosInstanse';
import ProtectedRouteUser from './ProtectedRouteUser';
import ProtectedRouteSign from './ProtectedRouteSign';
import MovieCard from './components/pages/MovieCard';
import TvCard from './components/pages/TvCard';
import ConfirmationEmail from './components/pages/СonfirmationEmail';
import RecoverPassoword from './components/pages/RecoverPassoword';
import ResetPassword from './components/pages/ResetPassword';
import Friends from './components/pages/Friends';
import Friend from './components/pages/Friend';

function App() {
  const [user, setUser] = useState('');

  useEffect(() => {
    (async function () {
      const { data } = await axiosInstance.get('/api/v1.0/tokens/refresh');
      if (data) {
        setUser(data.user);
        setAccessToken(data.setAccessToken);
      } else {
        console.log(data);
      }
    })();
  }, []);

  return (
    <Routes>
      <Route element={<AppLayout user={user} />}>
        <Route path="/" element={<MainPage user={user} />} />
        <Route
          path="/sign"
          element={
            <ProtectedRouteSign user={user} redirectTo="/user">
              <Sign setUser={setUser} />
            </ProtectedRouteSign>
          }
        />
        <Route
          path="/signUp"
          element={
            <ProtectedRouteSign user={user} redirectTo="/user">
              <SignUp setUser={setUser} />
            </ProtectedRouteSign>
          }
        />
        <Route
          path="/recover"
          element={
            <ProtectedRouteSign user={user} redirectTo="/user">
              <RecoverPassoword setUser={setUser} />
            </ProtectedRouteSign>
          }
        />
        <Route
          path="/recover/:token"
          element={
            <ProtectedRouteSign user={user} redirectTo="/user">
              <ResetPassword setUser={setUser} />
            </ProtectedRouteSign>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRouteUser user={user} redirectTo="/sign">
              <User user={user} setUser={setUser} />
            </ProtectedRouteUser>
          }
        />
        <Route path="*" element={<ErrorPage />} />
        <Route
          path="/friends"
          element={
            <ProtectedRouteUser user={user} redirectTo="/sign">
              <Friends user={user} />
            </ProtectedRouteUser>
          }
        />
        <Route path="/movie/:id" element={<MovieCard user={user} />} />
        <Route path="/tv/:id" element={<TvCard user={user} />} />
        <Route
          path="/confirm-email/:token"
          element={<ConfirmationEmail setUser={setUser} />}
        />
        <Route
          path="/users/:login"
          element={<Friend user={user} setUser={setUser} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
