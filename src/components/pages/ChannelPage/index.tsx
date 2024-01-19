import { authSkyWay } from 'api/auth/auth';
import { Textbox } from 'components/atoms/Textbox';
import React from 'react';
import { useForm } from 'react-hook-form';
import { PrimaryFullButton } from 'components/atoms/Button';

type AuthFormValues = {
  channelName: string;
  memberName: string;
};

// チャンネル参加ページ
export const ChannelPage = ({
  setStorageToken,
}: {
  setStorageToken: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { register, handleSubmit } = useForm<AuthFormValues>({
    defaultValues: { channelName: 'テスト用チャンネル' },
  });

  const onSubmit = async (data: AuthFormValues) => {
    const result = await authSkyWay(data.channelName, data.memberName);
    localStorage.setItem('token', result.data.authToken);
    localStorage.setItem('userName', data.memberName);

    setStorageToken(result.data.authToken);
  };

  return (
    <div className="flex flex-col justify-center items-center p-20 mx-auto w-[500px] bg-white rounded drop-shadow-lg">
      <div className="mb-6 font-zenkaku text-3xl font-bold text-black-medium">
        Sample Meet
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textbox
          placeholder="チャンネル名"
          className="mb-3"
          disabled
          {...register('channelName')}
        />
        <Textbox
          placeholder="ユーザー名"
          {...register('memberName')}
          className="mb-3"
        />
        <PrimaryFullButton type="submit">チャンネルを作成</PrimaryFullButton>
      </form>
    </div>
  );
};
