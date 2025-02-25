/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

export default function ProtectedRouteUser({ children, user, redirectTo }) {
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  } else {
    return children;
  }
}
