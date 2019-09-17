export type Something = 'AVAILABLE' | 'OUT_OF_STOCK' | 'ONLY_FEW_LEFT';
export type Else = 'AVAILABLE' | 'OUT_OF_STOCK' | 'ONLY_FEW_LEFT';

export interface Base {
  fistname: string;
  lastname: string;
  age?: number;
}

export interface Upper {
  gogo: Float;
}

export interface Friend extends Base {
  nickname: Something;
  other: Else;
  hello: SomethingElse;
}

export interface Student extends Base {
  grade: Float;
  friends: Friend[];
  friend: Friend;
}

export interface SomethingElse {
  someName: string;
}
