import React, { useEffect, useState } from "react";
import { Upload, Trash2, Share2, Download, ChevronRight } from "lucide-react";
import sodium from "libsodium-wrappers";
import axios from "axios";
import FileList from "./components/ui/FileList";

interface File {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<File[]>([
    {
      id: "1",
      name: "project_proposal.pdf",
      size: "2.3 MB",
      uploadDate: "2023-05-21",
    },
  ]);

  const [filename1, setfilename1] = useState("");
  const [sharingFileId, setSharingFileId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveStep, setReceiveStep] = useState(1);
  const [receiveEmail, setReceiveEmail] = useState("");
  const [receiveFileName, setReceiveFileName] = useState();
  const [securityKey1, setSecurityKey1] = useState("");
  const [securityKey2, setSecurityKey2] = useState("");
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null
  );
  const [receiveFile , setReceiveFile] = useState({});
  const [downloadKey, setDownloadKey] = useState("");
  const [downloadKey2, setDownloadKey2] = useState("");
  const [fileExtention, setfileExtention] = useState("");
  const [encryptedFileUrl, setEncryptedFileUrl] = useState<string | null>(null);
  const [keyHex, setKeyHex] = useState<string>("");
  const [nonceHex, setNonceHex] = useState<string>("");
  let key;
  let nonce;
  const [textBox1, setTextBox1] = useState("");
  const [textBox2, setTextBox2] = useState("");
  const [showTextBoxes, setShowTextBoxes] = useState(false);
  const [uploadStart, setUploadStart] = useState(false);


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/files',{}, {
          withCredentials: true,
          headers: {
                    'Content-Type': 'application/json'
                }
        });
        setFiles(response.data);
        console.log(response.data[1]);
      } catch (error) {
        console.error(error);
      }
    };

    setTimeout(fetchFiles, 200);
  }, [uploadStart]);

  const encryptFile = async (file: any, fileExtension: string, filename: string) => {
    await sodium.ready;
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const fileData = new Uint8Array(fileReader.result as ArrayBuffer);

      // Generate a random key and nonce
      key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
      nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      setTextBox1(sodium.to_hex(key));
      setTextBox2(sodium.to_hex(nonce));
      // Encrypt the file content
      setUploadStart(true);
      const encryptedData = sodium.crypto_secretbox_easy(fileData, nonce, key); 

      // Store the key and nonce securely (client-side or in a secure vault)
      // In this example, we are just logging them but you should store them securely.
      // console.log("Key and nonce are stored securely, do not send them!");

      // Send only the encrypted data and file metadata (e.g., fileExtension)
      console.log("c",filename);
      const response = await axios.post("http://localhost:8000/api/upload", {
        encryptedData: encryptedData,
        fileExtension: fileExtension,
        filename: filename,
      },{
        withCredentials: true,
      });
    };

    fileReader.readAsArrayBuffer(file);
    setUploadStart(false);
  };

  
 
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name;
      console.log("a",fileName);
      
      const fileExtension = fileName.split(".").pop()?.toLowerCase(); // Extracting the extension of the file
      const filename = fileName.split(".")[0];
      setfilename1(filename);
      console.log("b",filename);
      const forbiddenExtensions = [
        "exe",
        "bat",
        "cmd",
        "sh",
        "msi",
        "com",
        "vbs",
      ];
      if (event.target.files?.length > 1) {
        alert("You can only upload up to 1 files at a time.");
        return;
      }
      if (fileExtension && forbiddenExtensions.includes(fileExtension)) {
        alert("This file type is not allowed.");
        return;
      } else {
        console.log("Valid file uploaded:", file.name);
      }
      if (fileExtension) {
        console.log("File extension:", fileExtension);
        setfileExtention(fileExtension);
        console.log(2);
        encryptFile(file, fileExtension,filename);
        setShowTextBoxes(true);
      } else {
        console.log("Could not determine file extension");
      }
    }
  };
  const decryptFile = async (encryptedData: any, nonce: any, key: any) => {
    await sodium.ready;
    console.log("Decryption started");

    const decryptedData = sodium.crypto_secretbox_open_easy(
      encryptedData,
      nonce,
      key
    );
    if (!decryptedData) {
      console.error("Decryption failed!");
      return null;
    }

    console.log("Decryption done", decryptedData);
    const decryptedBlob = new Blob([decryptedData]);

    const downloadUrl = URL.createObjectURL(decryptedBlob);
    const a = document.createElement("a");
    a.href = downloadUrl;

    const fileName = `decrypted_file.txt`;
    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(downloadUrl);

    document.body.removeChild(a);
  };

  

  

  const handleShareSubmit = async () => {
    console.log(`Sharing file ${sharingFileId} with ${shareEmail}`);
    // const g = files[Number(sharingFileId) - 1].name;
    // console.log(g);
    const response = await axios.post("http://localhost:8000/api/files/share", {
      id:sharingFileId,
      tempEmail: shareEmail,
    },{
      withCredentials: true,
    });
    setSharingFileId(null);
    setShareEmail("");
  };

  const handleDownload = (id: string) => {
    setDownloadingFileId(id);
    setDownloadKey("");
    setDownloadKey2("");
  };

  const handleDownloadSubmit = async () => {
    console.log(
      `Downloading file ${downloadingFileId} with keys ${downloadKey} and ${downloadKey2}`
    );

    const result = await axios.post("http://localhost:8000/api/download", {
      id: downloadingFileId,
    },{
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    );
    // console.log(result.data);
    
    const encryptedDataArray = new Uint8Array(Object.values(result.data));
    // console.log(encryptedDataArray);

    const nonceArray =
      typeof downloadKey2 === "string"
        ? sodium.from_hex(downloadKey2)
        : new Uint8Array(downloadKey2);

    const keyArray =
      typeof downloadKey === "string"
        ? sodium.from_hex(downloadKey)
        : new Uint8Array(downloadKey);

    if (downloadKey !== "" && downloadKey2 !== "") {
      await decryptFile(encryptedDataArray, nonceArray, keyArray);
    }

    setDownloadStart(false);
    setDownloadingFileId(null);
    setDownloadKey("");
    setDownloadKey2("");

    
  };

 

 
  const handleDownloadTextBoxes = () => {
    const content = `secret key:\n${textBox1}\n\nnonce:\n${textBox2}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text_boxes_content.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const handleDelete = async (id: string) => {

    const result = await axios.post("http://localhost:8000/api/files/delete", {
      id: id,
    },{
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setFiles(files.filter((file) => file.id !== id));
  };

  const handleShare = (id: string) => { 
    setSharingFileId(id);
    setShareEmail("");
  };


  const handleReceiveNext = async () => {
    setReceiveStep(2);
    
  };

const handleReceiveFile = async() => {
    // console.log("Receiving file:", {
    //   receiveEmail,
    //   receiveFileName,
    //   securityKey1,
    //   securityKey2,
    // });
    console.log("downloading");
    const result = await axios.post("http://localhost:8000/api/files/recieve", {
      receiveEmail: receiveEmail,
      receiveFileName: receiveFileName,
    },
      {
        withCredentials: true,
      });
      console.log(result.data);
      // setReceiveFile(result.data);
      if(result.data){
        console.log("file received");
      }
    const encryptedDataArray = new Uint8Array(Object.values(result.data));
      console.log("Received encrypted data:", encryptedDataArray);
    const nonce =
      typeof securityKey2 === "string"
        ? sodium.from_hex(securityKey2)
        : new Uint8Array(securityKey2);

    const key =
      typeof securityKey1 === "string"
        ? sodium.from_hex(securityKey1)
        : new Uint8Array(securityKey1);

    if (securityKey1 !== "" && securityKey2 !== "") {
      console.log("a"+securityKey1)
      console.log("a"+securityKey2)
      await decryptFile(encryptedDataArray, nonce, key);
    }
    console.log("done");
    setIsReceiving(false);
    setReceiveStep(1);
    setReceiveEmail("");
    setReceiveFileName("");
    setSecurityKey1("");
    setSecurityKey2("");
    setReceiveFile("");
  };
 
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Welcome</h1>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">
              Upload Files
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-400 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-purple-400" />
                    <p className="mb-2 text-sm text-purple-300">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      Any file type (MAX. 100MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                  />
                </label>
              </div>
              {showTextBoxes && (
                <div className="space-y-4">
                  <textarea
                    value={textBox1}
                    onChange={(e) => setTextBox1(e.target.value)}
                    placeholder="Enter text for Box 1"
                    className="w-full p-2 border rounded-md bg-gray-700 text-white"
                    rows={4}
                  />
                  <textarea
                    value={textBox2}
                    onChange={(e) => setTextBox2(e.target.value)}
                    placeholder="Enter text for Box 2"
                    className="w-full p-2 border rounded-md bg-gray-700 text-white"
                    rows={4}
                  />
                  <button
                    onClick={handleDownloadTextBoxes}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download Text Boxes Content
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
            <FileList
              files={files}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
            />
            {sharingFileId && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                <h3 className="font-semibold mb-2">Share File</h3>
                <input
                  type="email"
                  placeholder="Enter recipient's email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <button
                  onClick={handleShareSubmit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Share
                </button>
              </div>
            )}
            {downloadingFileId && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <h3 className="font-semibold mb-2">Download File</h3>
                <input
                  type="text"
                  placeholder="Enter decryption key 1"
                  value={downloadKey}
                  onChange={(e) => setDownloadKey(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />

                <input
                  type="text"
                  placeholder="Enter decryption key 2"
                  value={downloadKey2}
                  onChange={(e) => setDownloadKey2(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />

                <button
                  onClick={handleDownloadSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  OK
                </button>
              </div>
            )}
          </section>
        </div>

        <section className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Receive Files</h2>
          {!isReceiving ? (
            <button
              onClick={() => setIsReceiving(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Access Shared Files
            </button>
          ) : (
            <div className="space-y-4">
              {receiveStep === 1 ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={receiveEmail}
                    onChange={(e) => setReceiveEmail(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter file name"
                    value={receiveFileName}
                    onChange={(e) => setReceiveFileName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={handleReceiveNext}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter first security key"
                    value={securityKey1}
                    onChange={(e) => setSecurityKey1(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter second security key"
                    value={securityKey2}
                    onChange={(e) => setSecurityKey2(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={handleReceiveFile}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    Access File
                    <Download className="w-5 h-5 ml-2" />
                  </button>
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
