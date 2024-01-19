import React from 'react';
import dynamic from 'next/dynamic';
import { RoomEntranceProps } from './index';

// RTCPeerConnection is not definedを回避するためにNextのSSRを無効化
const DynamicRoomEntrancePage = (props: RoomEntranceProps) => {
  const RoomEntranceComponent = dynamic(() => import('./index'), {
    ssr: false,
  });

  return <RoomEntranceComponent {...props} />;
};
export default DynamicRoomEntrancePage;
