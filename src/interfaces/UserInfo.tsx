interface UserInfo {
  id: string;
  data: {
    userUid: string;
    accessKey: string;
    accessSecret: string;
  };
}

export default UserInfo;
