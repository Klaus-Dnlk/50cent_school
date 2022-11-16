export interface RegFormRequest {
  name: string;
  surname: string;
  middleName: string;
  photo: File | undefined;
  idFile: File | undefined;
}

export interface RegFormResponse {
  status: string;
}
