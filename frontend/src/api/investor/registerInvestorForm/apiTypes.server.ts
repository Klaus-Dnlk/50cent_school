export interface RegFormRequestApi {
  name: string;
  surname: string;
  middle_name: string;
  photo: File | undefined;
  id_file: File | undefined;
}

export interface RegFormResponseApi {
  status: string;
}
