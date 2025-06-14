export interface Login {
  userName: string;
  cardNo: string;
  deviceInfo?: string;
}

export interface RoomQueryRoomList {
  userName: string;
  cardNo: string;
}

export interface FingerPrint {
  fingerUrl: string
}

export interface UpdateFingerUrl extends FingerPrint{
  lawPeopleRecordNumId: string
}

export interface CardOcr{
  cardUrl: string
}

/**
 * 字典类型
 * @type {string}
 */
export interface Dict {
  type: string;
}
