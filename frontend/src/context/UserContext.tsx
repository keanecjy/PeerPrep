import React, { createContext, useState, useEffect } from 'react';
import { refresh } from '../services/auth';
import { getUserProfile } from '../services/profile';
import RefreshTokenService from '../services/refreshToken';
import { UserProfile } from '../shared/types';

interface UserContextProps {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => null,
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // init connection with background and maintain synced data
  useEffect(() => {
    RefreshTokenService.addListener(getUser);

    // auto login
    refresh().catch(() => {
      setLoading(false);
    });
  }, []);

  const getUser = async (auth?: string | null) => {
    if (auth === null) {
      setUser(null);
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
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
