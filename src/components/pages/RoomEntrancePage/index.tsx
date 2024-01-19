import { Textbox } from 'components/atoms/Textbox';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PrimaryButton,
  PrimaryFullButton,
  PrimaryTextButton,
} from 'components/atoms/Button';
import {
  LocalP2PRoomMember,
  P2PRoom,
  SkyWayContext,
  SkyWayRoom,
} from '@skyway-sdk/room';
import DynamicMeetingPage from '../MeetingPage/dynamic';
import { Modal } from 'components/molecules/Modal';

type RoomEnterFormValues = {
  roomName: string;
};

export type RoomEntranceProps = {
  setStorageToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const RoomEntrancePage = ({
  setStorageToken,
}: {
  setStorageToken: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { register, handleSubmit, watch } = useForm<RoomEnterFormValues>({});
  const [member, setMember] = useState<LocalP2PRoomMember | null>(null);
  const [joinedRoom, setJoinedRoom] = useState<P2PRoom | null>(null);

  // 同名ルーム存在時のダイアログ表示管理state
  const [isOpenAlertPanel, setIsOpenAlertPanel] = useState(false);
  // 定員オーバーのダイアログ表示管理state
  const [isOpenFullPanel, setIsOpenFullPanel] = useState(false);

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const onSubmit = async (data: RoomEnterFormValues) => {
    if (!token) return;
    const context = await SkyWayContext.Create(token);

    try {
      const existedRoom = await SkyWayRoom.Find(
        context,
        { name: data.roomName },
        'p2p'
      );

      // 既に同名のルームが存在する場合、参加確認ダイアルを表示
      if (existedRoom) {
        if (existedRoom.members.length == 2) {
          setIsOpenFullPanel(true);
        } else {
          setIsOpenAlertPanel(true);
        }
        return;
      }
    } catch {
      // 同名のルームが存在しない場合、ルームを作成してjoin
      const room = await SkyWayRoom.FindOrCreate(context, {
        type: 'p2p',
        name: data.roomName,
      });
      setJoinedRoom(room);
      localStorage.setItem('joinedRoom', data.roomName);

      const newMember = await room.join({ name: userName || 'no name' });
      setMember(newMember);
    }
  };

  const joinExistsRoom = async (roomName: string) => {
    if (!token) return;
    const context = await SkyWayContext.Create(token);
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: roomName,
    });
    setJoinedRoom(room);
    localStorage.setItem('joinedRoom', roomName);

    try {
      const newMember = await room.join({ name: userName || 'no name' });
      setMember(newMember);
      setIsOpenAlertPanel(false);
    } catch (e) {
      // useEffectが2回呼ばれるのを直す
      console.log(e);
    }
  };

  // ルーム選択画面に戻る
  const exitRoom = () => {
    if (!joinedRoom || !member) return;
    joinedRoom.leave(member);
    setJoinedRoom(null);
    setMember(null);
    localStorage.removeItem('joinedRoom');
  };

  // JWTを削除してチャンネル選択画面に戻る
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('joinedRoom');
    setStorageToken(null);
  };

  useEffect(() => {
    // localstorageに参加中のルーム情報があれば再度参加する
    const joinedRoomName = localStorage.getItem('joinedRoom');
    if (!joinedRoomName || joinedRoomName === '') return;
    joinExistsRoom(joinedRoomName);
  }, []);

  return (
    <>
      {!member && (
        <div className="flex flex-col justify-center items-center p-20 mx-auto w-[500px] bg-white rounded drop-shadow-lg">
          <div className="mb-6 font-zenkaku text-3xl font-bold text-black-medium">
            Sample Meet
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Textbox
              placeholder="ルーム名"
              className="mb-4"
              {...register('roomName', { required: true })}
            />
            <PrimaryFullButton type="submit" className="mb-4">
              ルームに参加
            </PrimaryFullButton>
          </form>

          <button
            className="text-sm text-blackop-60 hover:opacity-50 transition"
            onClick={logout}>
            ログアウト
          </button>
        </div>
      )}
      {isOpenAlertPanel && (
        <Modal setIsOpen={setIsOpenAlertPanel} usePadding={true}>
          <div>
            <div className="mb-1 text-lg font-medium">
              同名のルームが存在します
            </div>
            <div className="mb-6 text-blackop-60">ルームに参加しますか？</div>

            <div className="flex justify-end">
              <PrimaryTextButton
                type="button"
                className="mr-2 w-24"
                onClick={() => setIsOpenAlertPanel(false)}>
                キャンセル
              </PrimaryTextButton>
              <PrimaryButton
                type="button"
                className="w-24"
                onClick={() => joinExistsRoom(watch('roomName'))}>
                参加
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {isOpenFullPanel && (
        <Modal setIsOpen={setIsOpenAlertPanel} usePadding={true}>
          <div>
            <div className="mb-1 text-lg font-medium">ルームが満員です</div>
            <div className="mb-6 text-blackop-60">
              別のルームに参加してください
            </div>

            <div className="flex justify-end">
              <PrimaryTextButton
                type="button"
                className="mr-2 w-24"
                onClick={() => setIsOpenFullPanel(false)}>
                キャンセル
              </PrimaryTextButton>
            </div>
          </div>
        </Modal>
      )}

      {member && joinedRoom && (
        <DynamicMeetingPage
          member={member}
          room={joinedRoom}
          exitRoom={() => exitRoom()}
        />
      )}
    </>
  );
};

export default RoomEntrancePage;
