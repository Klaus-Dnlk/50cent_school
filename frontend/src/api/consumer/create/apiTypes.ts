import { UploadFile } from 'antd/lib/upload/interface';

export interface CreateRequest {
  name: string;
  surname: string;
  middleName: string;
  photo?: UploadFile | null;
  work_file?: UploadFile | null;
  id_file?: UploadFile | null;
  property_file?: UploadFile | null;
}

export interface CreateResponse {
  status: string;
}
