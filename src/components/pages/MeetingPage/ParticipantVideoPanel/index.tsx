import React, { useEffect, useRef, useState } from 'react';
import {
  LocalP2PRoomMember,
  P2PRoom,
  RemoteAudioStream,
  RemoteRoomMember,
  RemoteVideoStream,
  RoomPublication,
} from '@skyway-sdk/room';
import { PiUser } from 'react-icons/pi';

export type ParticipantVideoPanelProps = {
  member: LocalP2PRoomMember;
  room: P2PRoom;
};

export const ParticipantVideoPanel = ({
  member,
  room,
}: ParticipantVideoPanelProps) => {
  const [isJoinedParticipant, setIsJoinedParticipant] = useState(false);
  const [joinedParticipant, setJoinedParticipant] = useState<
    RemoteRoomMember | undefined
  >(undefined);

  const [isParticipantVideoOn, setIsParticipantVideoOn] = useState(false);

  // 参加者の映像と音声配信用Ref
  const participantVideoRef = useRef<HTMLVideoElement>(null);
  const participantAudioRef = useRef<HTMLAudioElement>(null);

  //roomに参加者が存在している時、参加者の情報を取得
  if (room.members.length === 2) {
    if (!isJoinedParticipant) setIsJoinedParticipant(true);
    const otherMember = room.members.find((m) => m.id !== member.id);
    console.log(otherMember);
    if (!joinedParticipant) setJoinedParticipant(otherMember);
  }

  const subscribeAndAttach = async (publication: RoomPublication) => {
    if (publication.publisher.id === member.id) {
      // console.log('自分のmediaはSubscribeしません');
      return;
    }

    try {
      const { stream } = await member.subscribe<
        RemoteAudioStream | RemoteVideoStream
      >(publication.id);
      const participantVideoArea = participantVideoRef.current;
      const participantAudioArea = participantAudioRef.current;
      if (!participantVideoArea || !participantAudioArea) return;

      switch (stream.contentType) {
        case 'video':
          (stream as RemoteVideoStream).attach(participantVideoArea);
          await participantVideoArea.play();
          setIsParticipantVideoOn(true);
          false;
          break;
        case 'audio':
          (stream as RemoteAudioStream).attach(participantAudioArea);
          await participantVideoArea.play();
          break;
        default:
          return;
      }
    } catch {
      // console.log('既にSubscribe済みです');
    }
  };

  // 参加者がVideoを再度ONにした時に発火
  const enabledParticipantVideo = async () => {
    const participantVideoArea = participantVideoRef.current;
    if (!participantVideoArea) return;
    await participantVideoArea.play();
    setIsParticipantVideoOn(true);
  };

  // 参加者がVideoを再度OFFにした時に発火
  const disabledParticipantVideo = () => {
    const participantVideoArea = participantVideoRef.current;
    if (!participantVideoArea) return;
    participantVideoArea.pause();
    setIsParticipantVideoOn(false);
  };

  useEffect(() => {
    // こんなにイベント設定連打するのが正しいのだろうか...？
    room.publications.forEach(subscribeAndAttach);
    room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
    room.onPublicationDisabled.add(() => disabledParticipantVideo());
    room.onPublicationEnabled.add(() => enabledParticipantVideo());
    room.onMemberJoined.add(() => setIsJoinedParticipant(true));
    room.onMemberLeft.add(() => {
      setIsJoinedParticipant(false);
      setJoinedParticipant(undefined);
    });
  }, []);

  return (
    <div className="relative mb-4 text-xl text-black-medium bg-white">
      <video
        ref={participantVideoRef}
        className="mr-4 mb-4 w-[700px] h-[524px] bg-gray-hover"
        muted
      />
      {!isJoinedParticipant && (
        <div className="flex absolute top-0 left-0 justify-center items-center w-[700px] h-[524px] font-bold text-blackop-38 bg-gray-hover">
          ユーザーの参加を待っています
        </div>
      )}

      {joinedParticipant && !isParticipantVideoOn && (
        <div className="flex absolute top-0 left-0 flex-col justify-center items-center w-[700px] h-[524px] font-bold text-blackop-60 bg-gray-hover">
          {joinedParticipant && <div>{joinedParticipant?.name}</div>}

          <PiUser size={160} />
          <div className="py-2 px-4 my-2 text-sm font-normal text-gray-light rounded-full border border-gray-light">
            カメラがOFFになっています
          </div>
        </div>
      )}

      <audio ref={participantAudioRef} autoPlay />
    </div>
  );
};

export default ParticipantVideoPanel;
