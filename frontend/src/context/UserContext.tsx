import React, { createContext, useState, useEffect } from 'react';
import { refresh } from '../services/auth';
import { getUserProfile } from '../services/profile';
import RefreshTokenService from '../services/refreshToken';
import { getGuestAccount } from '../shared/functions';
import { UserProfile } from '../shared/types';

interface UserContextProps {
  user: UserProfile | null;
}

const UserContext = createContext<UserContextProps>({
  user: null,
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // init connection with background and maintain synced data
  useEffect(() => {
    const unsubscribe = RefreshTokenService.addListener(getUser);

    // auto login
    refresh().catch(() => {
      // preload guest account
      const guest = getGuestAccount();
      setUser(guest);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getUser = async (auth?: string | null) => {
    if (auth === null) {
      const guest = getGuestAccount();
      setUser(guest);
    } else {
      const user = await getUserProfile();
      setUser(user);
    }
    setLoading(false);
    return user;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
