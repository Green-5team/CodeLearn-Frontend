export type userInfos = { [key: number]: userInfo };

export type userInfo = {
  level: number;
  nickname: string;
  owner: boolean;
  solved: boolean;
  status: boolean;
  review: boolean;
};

export type EMPTY = 'EMPTY';
export type LOCK = 'LOCK';

export interface RoomInformation {
  title: string;
  member_count: number;
  max_members: number;
  status: 'PUBLIC' | 'PRIVATE';
  password?: string;
  level: number;
  mode: 'STUDY' | 'COOPERATIVE';
  ready: boolean;
  create_time: string;
  socket_id: string;
  master: string;
}

export interface RoomStatus {
  title: string;
  member_count: number;
  max_members: number;
  user_info: userInfo[];
}
