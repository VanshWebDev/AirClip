import {
  GoogleOAuthProvider,
  GoogleLogin,
  type GoogleCredentialResponse,
} from "@react-oauth/google";
import { type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrHandling } from "../../utils/Err/ErrHandling";
import {
  // useSigninWithGoogleMutation,
  useSignupWithGoogleMutation,
} from "@/features/apiSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { setUser } from "@/features/auth/authSlice";
import { toast } from "sonner";

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

const GoogleAuth: FC<{ authMethod: string }> = ({ authMethod }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // +++ Setup RTK Query and Redux dispatch
  const dispatch = useAppDispatch();
  // const [signinWithGoogle] = useSigninWithGoogleMutation();
  const [signupWithGoogle] = useSignupWithGoogleMutation();

  const handleSignupSuccess = async (response: GoogleCredentialResponse) => {
    const { credential: token } = response;
    if (!token) return;

    try {
      let res;
      // Decide which mutation to call
      if (authMethod === "signinwithgoogle") {
        // res = await signinWithGoogle({ token }).unwrap();
        res = await signupWithGoogle({ token }).unwrap();
      } else {
        // The wantToCreateNewAcc flag is removed
        res = await signupWithGoogle({ token }).unwrap();
      }
      console.log(res)
      toast.success(res.message)
      if (res.user) {
        dispatch(setUser({
          name: res.user.name || "",
          email: res.user.email,
          picture: res.user.picture || "",
          username: res.user.username || "",
        }));
      }
      navigate(location?.state?.previousPath || "/");
    } catch (err: unknown) {
      // The "user exists" case will now be caught here as an error
      const errorData = err as {
        data?: { message?: string; needSignup?: boolean };
      };
      if (errorData.data?.needSignup) {
        navigate("/signup");
        return;
      }
      ErrHandling(err, "try after some time");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSignupSuccess}
        onError={() => {
          console.log("err during signup");
        }}
        size="large"
        shape="square"
        width="50"
        text="continue_with"
        type="standard"
        theme="outline"
        auto_select
        useOneTap
        logo_alignment="center"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
