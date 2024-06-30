import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RiMenuFold2Fill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { link } from 'fs';
interface Props {
  profileLink: string;
  blogLink: string;
  loginLink: string;
  registerLink: string;
  homeLink: string;
  userName?: string;
  onLogout?: () => void; // onLogout prop'u opsiyonel hale getirdik
}

const DropMenu: React.FC<Props> = ({
  profileLink,
  blogLink,
  loginLink,
  registerLink,
  homeLink,
  userName,
  onLogout,
}) => {
  const handleProfileClick = () => {
    window.location.href = profileLink; // Profil linkine yönlendirme yap
  };

  const handleDashboardClick = () => {
    window.location.href = blogLink; // Dashboard linkine yönlendirme yap
  };

  const handleLoginClick = () => {
    window.location.href = loginLink; // Login linkine yönlendirme yap
  };

  const handleRegisterClick = () => {
    window.location.href = registerLink; // Register linkine yönlendirme yap
  };

  const handleHomeClick = () => {
    window.location.href = homeLink; // Anasayfa linkine yönlendirme yap
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // onLogout prop'u varsa çağırarak logout işlemini gerçekleştir
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2">
            <RiMenuFold2Fill />
            <span>Account</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userName ? (
            <>
              <DropdownMenuLabel className="text-center">
                {userName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleProfileClick}
              >
                <div className="flex items-center gap-2">
                  <FaUser />

                  <span>Profile</span>
                </div>
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleHomeClick}
              >
                Homepage
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDashboardClick}
              >
                Dashboard
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogoutClick}
              >
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleHomeClick}
              >
                Homepage
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLoginClick}
              >
                Login
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleRegisterClick}
              >
                Register
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DropMenu;
