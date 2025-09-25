import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, className }) => {
  return (
    <header className={cn("bg-white shadow-card border-b border-gray-200", className)}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <ApperIcon name="Menu" size={24} />
            </button>
            <div className="ml-2 md:ml-0">
              <h1 className="text-xl font-semibold text-gray-900">Pipeline Pro</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" icon="Bell" />
            <Button variant="ghost" size="sm" icon="Settings" />
            <UserInfo />
          </div>
        </div>
      </div>
    </header>
  );
};

// Add UserInfo component
const UserInfo = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-semibold">?</span>
      </div>
    );
  }

  const userInitial = user.firstName?.charAt(0) || user.emailAddress?.charAt(0) || 'U';

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{userInitial}</span>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">{user.emailAddress}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        icon="LogOut"
      />
    </div>
  );
};

export default Header;