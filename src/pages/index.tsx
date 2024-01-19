import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { ChannelPage } from 'components/pages/ChannelPage';
import DynamicRoomEntrancePage from 'components/pages/RoomEntrancePage/dynamic';

const Home: NextPage = () => {
  const [storageToken, setStorageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setStorageToken(localStorage.getItem('token'));
    setIsLoading(false);
  }, []);
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-blackop-3">
      {storageToken && !isLoading ? (
        <DynamicRoomEntrancePage setStorageToken={setStorageToken} />
      ) : (
        <ChannelPage setStorageToken={setStorageToken} />
      )}
    </div>
  );
};

export default Home;
