// 服務相關類型
declare module '@/lib/services/uploadClient' {
  export const UPLOAD_CONSTANTS: {
    MAX_FILE_SIZE: number;
    ALLOWED_IMAGE_TYPES: string[];
  };

  export class UploadClient {
    uploadFile(file: File, path: string): Promise<string>;
    uploadAvatar(file: File, userId: string): Promise<string>;
    uploadChatImage(file: File, chatId: string): Promise<string>;
  }

  export const uploadClient: UploadClient;
} 