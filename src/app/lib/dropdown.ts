import { Dispatch } from 'react';

export type DropdownProps = {
  dropdownState: boolean;
  setDropdownState: Dispatch<boolean>;
  options: number[];
  setValue: Dispatch<null | number>;
  value: number | null;
};
