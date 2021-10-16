import React, { createContext, useState, useEffect } from 'react';
import { refresh, login as apiLogin } from '../services/auth';
import { getUserProfile } from '../services/profile';
import { storeRefTokenKey } from '../services/storage';
import { UserProfile } from '../shared/types';

interface UserContextProps {
  user: UserProfile | null;
  resync: (user: UserProfile) => any;
  login: (email: string, password: string) => any;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  resync: () => null,
  login: () => null,
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // init connection with background and maintain synced data
  useEffect(() => {
    autoRefresh();
    return () => {
      timer && clearTimeout(timer);
    };
  }, [user]);

  const autoRefresh = () => {
    return refresh()
      .then((data) => {
        if (data.expiresIn) {
          timer && clearTimeout(timer);
          const newTimer = setTimeout(refresh, data.expiresIn * 1000);
          setTimer(newTimer);
        }
        storeRefTokenKey(data?.refreshToken || '');
      })
      .then(async () => {
        const user = await getUserProfile();
        console.log(user);
        setUser(user);
      })
      .catch((err) => {
        console.log('auth failed', err.message);
        setUser(null);
      })
      .finally(() => {
        console.log(user);
        loading && setLoading(false);
      });
  };

  const login = (email: string, password: string) => {
    return apiLogin(email, password)
      .then((data) => {
        if (data.expiresIn) {
          timer && clearTimeout(timer);
          const newTimer = setTimeout(refresh, data.expiresIn * 1000);
          setTimer(newTimer);
        }
        storeRefTokenKey(data?.refreshToken || '');
      })
      .then(async () => {
        const user = await getUserProfile();
        setUser(user);
        return user;
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, resync: refresh, login }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
