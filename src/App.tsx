import { useEffect } from "react";
import { Home } from "./pages/home/Home";
import { disconnectSocket } from "./socket/socketActions";
import { useAppDispatch } from "./hooks/hooks";
import { Outlet, Route, Routes } from "react-router-dom";
import { Navbar } from "./component/home/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toaster } from "sonner";
import ResetPasswordPage from "./component/auth/Login/ResetPwd";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  return (
    <>
     <Toaster position="top-center" />
    <Routes>
      <Route element={<><Navbar /><Outlet /> </>}>

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
