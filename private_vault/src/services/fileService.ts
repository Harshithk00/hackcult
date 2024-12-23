import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export interface FileUploadRequest {
  encryptedData: Uint8Array;
  fileExtension: string;
}

export interface FileShareRequest {
  filename: string;
  tempemail: string;
}

export interface FileDownloadRequest {
  id: number;
}

export const fileService = {
  async uploadFile(data: FileUploadRequest) {
    try {
      const response = await axios.post(`${BASE_URL}/upload`, data);
      return response.data;
    } catch (error) {
      console.error('File upload failed', error);
      throw error;
    }
  },

  async shareFile(data: FileShareRequest) {
    try {
      const response = await axios.post(`${BASE_URL}/upload`, data);
      return response.data;
    } catch (error) {
      console.error('File share failed', error);
      throw error;
    }
  },

  async downloadFile(data: FileDownloadRequest) {
    try {
      const response = await axios.post(`${BASE_URL}/download`, data);
      return response.data;
    } catch (error) {
      console.error('File download failed', error);
      throw error;
    }
  }
};