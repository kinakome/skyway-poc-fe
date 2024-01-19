import React from 'react';
import dynamic from 'next/dynamic';
import { MeetingPageProps } from './index';

// RTCPeerConnection is not definedを回避するためにNextのSSRを無効化
const DynamicMeetingPage = (props: MeetingPageProps) => {
  const MeetingPage = dynamic(() => import('./index'), {
    ssr: false,
  });

  return <MeetingPage {...props} />;
};
export default DynamicMeetingPage;
