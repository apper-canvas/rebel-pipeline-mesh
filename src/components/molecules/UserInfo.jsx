import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import { AuthContext } from '../../App';

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

export default UserInfo;