import axios from 'axios';

export const authSkyWay = async (channelName: string, memberName: string) => {
  const data = { channelName, memberName };
  const jwt = await axios.post('http://localhost:7072/auth', data);
  return jwt;
};
