import { useEffect } from "react";
import { Home } from "./pages/home/Home";
import { useAppDispatch } from "./hooks/hooks";
import { Outlet, Route, Routes } from "react-router-dom";
import { Navbar } from "./component/home/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toaster } from "sonner";
import ResetPasswordPage from "./component/auth/Login/ResetPwd";
import { useCheckTokenQuery } from "./features/apiSlice";
import { setLoginStatus, setUser } from "./features/auth/authSlice";
import { AirClipLoadingBar } from "./component/reusable/AirClipLoadingBar";
import { connectSocket, disconnectSocket } from "./socket/socketActions";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

function App() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isSuccess } = useCheckTokenQuery();
  const { isUserLoggedIn } = useSelector((state: RootState) => state.auth);
  // 2. Use a useEffect to react to the result of the query.
  useEffect(() => {
    // When the query is successful and we have user data, dispatch it to the auth slice.
    if (data?.authenticated && data?.user) {
      dispatch(setUser(data.user));
      dispatch(setLoginStatus(true));
    }
  }, [isSuccess, data, dispatch]);

  // 4. +++ ADD THIS: This effect manages the socket connection
  useEffect(() => {
    // If the user is logged in, establish the connection
    if (isUserLoggedIn) {
      dispatch(connectSocket());
    }

    // This cleanup function will run when isUserLoggedIn becomes false (on logout)
    return () => {
      dispatch(disconnectSocket());
    };
  }, [isUserLoggedIn, dispatch]); // This effect re-runs when login state changes

  // 3. (Optional) Show a loading spinner for the whole app while checking the token.
  if (isLoading) {
    return <AirClipLoadingBar />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route
          element={
            <>
              <Navbar />
              <Outlet />{" "}
            </>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/resetpwd" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
