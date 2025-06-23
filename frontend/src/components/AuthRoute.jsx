import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function AuthRoute(props) {
  const { authUser } = useAuthStore();
  const { children } = props;

  if (authUser) {
    return children;
  }
  return <Navigate to="/login" replace={true} />;
}

export default AuthRoute;
