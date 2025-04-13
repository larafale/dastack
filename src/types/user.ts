export type TUser = {
  id: string;
  email: string;
  name: string;
  image: string;
};

export const RolesOptionList = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'User', value: 'USER' },
  { label: 'Doctor', value: 'DOCTOR' },
  { label: 'Guest', value: 'GUEST' },
  { label: 'Anonymous', value: 'ANONYMOUS' },
  { label: 'None', value: 'NONE' },
];
