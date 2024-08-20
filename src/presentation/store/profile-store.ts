import {create} from 'zustand';

export interface ProfileState {
  uid: string | undefined;
  name: string | null | undefined;
  userName: string | null | undefined;
  email: string | null | undefined;
  photoURL: string | undefined;
  bibliografia: string | undefined;
  direccion: string | undefined;

  changeProfile: (
    uid: string | undefined,
    name: string | null | undefined,
    userName: string | null | undefined,
    email: string | null | undefined,
    photoURL: string | undefined,
    bibliografia: string | undefined,
    direccion: string | undefined,
  ) => void;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  uid: '',
  name: '',
  email: '',
  photoURL: '',
  bibliografia: '',
  userName: '',
  direccion: '',
  changeProfile: (
    uid: string | undefined,
    name: string | null | undefined,
    userName: string | null | undefined,
    email: string | null | undefined,
    photoURL: string | undefined,
    bibliografia: string | undefined,
    direccion: string | undefined,
  ) => {
    set({
      uid: uid,
      name: name,
      userName: userName,
      email: email,
      photoURL: photoURL,
      bibliografia: bibliografia,
      direccion: direccion,
    });
  },
}));
