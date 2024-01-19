import React from 'react';
import dynamic from 'next/dynamic';
import { ParticipantVideoPanelProps } from './index';

// RTCPeerConnection is not definedを回避するためにNextのSSRを無効化
const DynamicParticipantVideoPanel = (props: ParticipantVideoPanelProps) => {
  const ParticipantVideoPanel = dynamic(() => import('./index'), {
    ssr: false,
  });

  return <ParticipantVideoPanel {...props} />;
};
export default DynamicParticipantVideoPanel;
