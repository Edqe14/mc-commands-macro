import { Dispatch, SetStateAction } from 'react';

export type Dispatcher<T> = Dispatch<SetStateAction<T>>;
export type Nullable<T> = { [P in keyof T]?: T[P] | undefined | null; };