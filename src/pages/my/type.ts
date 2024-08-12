import { GetUserAssetList } from '@/@type/response'

export interface MyState {
  current: number;
  hasMore: boolean;
  empty: boolean;
  list: GetUserAssetList[]
}
