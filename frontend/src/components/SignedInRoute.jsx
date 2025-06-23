import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function SignedInRoute(props) {
  const { authUser } = useAuthStore();
  const { children } = props;

  if (authUser) {
    return <Navigate to="/" replace={true} />;
  }
  return children;
}

export default SignedInRoute;
