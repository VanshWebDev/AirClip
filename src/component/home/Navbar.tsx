import styles from "../../styles/component/home/Navbar.module.css";
import logo from "../../assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const navigateToLogin = (route: string) => {
    navigate(`${route}`);
  };
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <img src={logo} alt="AirClip logo" className={styles.logoImg} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <PersonIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuLabel>Login/signup</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigateToLogin("/login")}>
                Login
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateToLogin("/signup")}>
                Signup
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
