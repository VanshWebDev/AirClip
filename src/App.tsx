import { useEffect } from "react";
import { Home } from "./pages/home/Home";
import { disconnectSocket } from "./socket/socketActions";
import { useAppDispatch } from "./hooks/hooks";
import { Route, Routes } from "react-router-dom";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
