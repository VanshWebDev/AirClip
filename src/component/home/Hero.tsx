import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const Hero = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("Our user: ",user);
  return <div>{user.email}</div>;
};
