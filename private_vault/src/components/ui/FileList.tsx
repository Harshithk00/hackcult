import React from 'react';
import { Download, Share2, Trash2 } from 'lucide-react';

interface File {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface FileListProps {
  files: File[];
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onDownload, onShare, onDelete }) => {
  return (
    <ul className="space-y-4">
      {files.map(file => (
        <li key={file.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-md">
          <div>
            <p className="font-medium text-purple-400">{file.filename+"."+file.extention}</p>
            <p className="text-sm text-gray-400">{file.size} • Uploaded on {file.uploadDate}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDownload(file.id)}
              className="p-2 text-emerald-400 hover:bg-gray-600 rounded-full transition-colors"
              aria-label="Download file"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => onShare(file.id)}
              className="p-2 text-purple-400 hover:bg-gray-600 rounded-full transition-colors"
              aria-label="Share file"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(file.id)}
              className="p-2 text-red-400 hover:bg-gray-600 rounded-full transition-colors"
              aria-label="Delete file"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FileList;