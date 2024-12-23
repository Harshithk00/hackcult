import React, { useState } from 'react';
import sodium from 'libsodium-wrappers';
function App() {

  return (
    <>
     <FileEncryptor />
     <FileDecryptor />
    </>
  )
}


function FileEncryptor() {
  const [encryptedFile, setEncryptedFile] = useState(null);

  // Encrypt the file
  const encryptFile = async (file) => {
    await sodium.ready;

    // Read the file as binary data (ArrayBuffer)
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const fileData = new Uint8Array(fileReader.result);

      // Generate a random key and nonce
      const key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
      const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

      // Encrypt the file data
      const encryptedData = sodium.crypto_secretbox_easy(fileData, nonce, key);

      // Save the encrypted data as a downloadable file
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      const encryptedFileUrl = URL.createObjectURL(blob);
      setEncryptedFile(encryptedFileUrl);

      // Optionally, store the key and nonce securely for decryption later
      console.log('Encryption key:', sodium.to_hex(key));
      console.log('Nonce:', sodium.to_hex(nonce));
    };
    fileReader.readAsArrayBuffer(file); // Read file as binary data
  };

  // Handle file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      encryptFile(file);
    }
  };

  return (
    <div>
      <h2>File Encryptor</h2>
      <input type="file" onChange={handleFileChange} />
      {encryptedFile && (
        <div>
          <a href={encryptedFile} download="encryptedFile.bin">Download Encrypted File</a>
        </div>
      )}
    </div>
  );
}


function FileDecryptor() {
  const [decryptedFile, setDecryptedFile] = useState(null);
  const [key, setKey] = useState(''); // Encryption key (in hex format)
  const [nonce, setNonce] = useState(''); // Nonce (in hex format)

  // Function to decrypt the file
  const decryptFile = async (file) => {
    await sodium.ready;

    // Convert the key and nonce from hex to Uint8Array
    const keyBytes = sodium.from_hex(key);
    const nonceBytes = sodium.from_hex(nonce);

    // Read the encrypted file as binary data
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const encryptedData = new Uint8Array(fileReader.result);

      // Decrypt the file data
      try {
        const decryptedData = sodium.crypto_secretbox_open_easy(encryptedData, nonceBytes, keyBytes);

        // Create a Blob for the decrypted data
        const decryptedBlob = new Blob([decryptedData], { type: 'application/octet-stream' });
        const decryptedFileUrl = URL.createObjectURL(decryptedBlob);
        setDecryptedFile(decryptedFileUrl);

        // Optionally, display or store the decrypted file
        console.log('File decrypted successfully');
      } catch (error) {
        console.error('Decryption failed:', error);
        alert('Decryption failed. Please check the key and nonce.');
      }
    };
    fileReader.readAsArrayBuffer(file); // Read file as binary data
  };

  // Handle file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      decryptFile(file);
    }
  };

  return (
    <div>
      <h2>File Decryptor</h2>
      
      {/* Input for the encryption key */}
      <div>
        <label>
          Encryption Key (Hex):
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter the key in hex format"
          />
        </label>
      </div>

      {/* Input for the nonce */}
      <div>
        <label>
          Nonce (Hex):
          <input
            type="text"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            placeholder="Enter the nonce in hex format"
          />
        </label>
      </div>

      {/* File input for the encrypted file */}
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>

      {/* If decryption is successful, provide a download link for the decrypted file */}
      {decryptedFile && (
        <div>
          <a href={decryptedFile} download="decryptedFile.bin">Download Decrypted File</a>
        </div>
      )}
    </div>
  );
}



export default App