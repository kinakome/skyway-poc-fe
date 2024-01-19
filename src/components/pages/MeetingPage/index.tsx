import React, { useRef, useState } from 'react';
import { DangerButton } from 'components/atoms/Button';
import {
  LocalP2PRoomMember,
  LocalVideoStream,
  P2PRoom,
  RoomPublication,
  SkyWayStreamFactory,
} from '@skyway-sdk/room';
import { MdMeetingRoom, MdVideocam, MdVideocamOff } from 'react-icons/md';
import DynamicParticipantVideoPanel from './ParticipantVideoPanel/dynamic';
import { PiUser } from 'react-icons/pi';

export type MeetingPageProps = {
  member: LocalP2PRoomMember;
  room: P2PRoom;
  exitRoom: () => void;
};

export const MeetingPage = ({ member, room, exitRoom }: MeetingPageProps) => {
  // 自分の映像と音声配信用Ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isStartVideo, setIsStartVideo] = useState(false);
  const [
    myVideoPublication,
    setMyVideoPublication,
  ] = useState<RoomPublication<LocalVideoStream> | null>(null);

  // ビデオONの際にPublicationを配信
  const startVideo = async () => {
    if (!videoRef.current || !member) return;
    const videoArea = videoRef.current;

    //既にPublicationが存在する場合は再開
    if (myVideoPublication && myVideoPublication.stream) {
      await myVideoPublication.enable();
      myVideoPublication.stream.attach(videoArea);
      await videoArea.play();
      setIsStartVideo(true);

      return;
    }

    const {
      audio,
      video,
    } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();

    video.attach(videoArea);
    await videoArea.play();
    const videoPublication = await member.publish(video);
    await member.publish(audio);
    setMyVideoPublication(videoPublication);
    setIsStartVideo(true);
  };

  // ビデオOFFの際にPublicationを停止
  const closeVideo = async () => {
    if (!videoRef.current || !myVideoPublication || !myVideoPublication.stream)
      return;
    const videoArea = videoRef.current;

    myVideoPublication.stream.detach();
    videoArea.pause();
    await myVideoPublication.disable();
    setIsStartVideo(false);
  };

  return (
    <div>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-center items-center py-4 px-8 bg-white rounded-full shadow-inner">
          <MdMeetingRoom size={24} color={'#ccc'} />
          <div className="ml-2">{room.name}</div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-4 mx-auto mt-4 mb-10 bg-white rounded drop-shadow-lg">
        <div className="flex px-8 pt-2">
          <DynamicParticipantVideoPanel member={member} room={room} />

          {/* 自分のビデオ表示エリア */}
          <div className="flex relative flex-col mx-auto w-96 h-72 bg-gray-hover">
            <video ref={videoRef} className="mb-4 w-96" />
            {!isStartVideo && (
              <div className="flex absolute top-0 left-0 flex-col justify-center items-center mb-4 w-96 h-72 text-blackop-60">
                自分
                <PiUser size={80} />
                <div className="py-2 px-3 my-2 text-xs font-normal text-gray-light rounded-full border border-gray-light">
                  カメラがOFFになっています
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ビデオON/OFFボタン */}
        <div className="flex justify-between items-center py-3 px-8 w-full border-t border-blackop-16">
          {isStartVideo ? (
            <button
              className="flex justify-center items-center w-12 h-12 bg-blueop-6 rounded-full border border-blueop-38 hover:opacity-60 transition"
              onClick={closeVideo}>
              <MdVideocam size={30} color={'rgba(60,69, 189, 0.60)'} />
            </button>
          ) : (
            <button
              className="flex justify-center items-center w-12 h-12 hover:bg-blackop-3 rounded-full border border-blackop-6 transition"
              onClick={startVideo}>
              <MdVideocamOff size={30} color={'#ccc'} />
            </button>
          )}
          <audio ref={audioRef} autoPlay />

          <DangerButton onClick={exitRoom} className="w-20">
            退出
          </DangerButton>
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
