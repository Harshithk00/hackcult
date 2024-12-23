import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const validateRegister = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message,
        });
    }
    next();
};

//  const handleDownload = (id: string) => {
//     setDownloadingFileId(id);
//     setDownloadKey('');
//     const result = axios.post("http://localhost:8000/api/download", {
//       id: id
//     })
    
//     decryptFile(result.data,nonce,key)
//   };

//   const response = await axios.post("http://localhost:8000/api/upload", {
//     encryptedData: encryptedData,
//     fileExtension: fileExtension
//   });

//   f()
// };

// async function f(){
//     const response = await axios.get("http://localhost:3000/api/give");
//     console.log(response.data);
//     const encryptedDataArray = new Uint8Array(Object.values(response.data));

//       // Log the received encrypted data
//       console.log("Received encrypted data:", encryptedDataArray);
//       decryptFile(encryptedDataArray,nonce,key)
//   }
