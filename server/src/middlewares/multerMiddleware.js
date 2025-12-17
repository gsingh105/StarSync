import multer from "multer";

// Use memoryStorage instead of diskStorage
// The file is stored in memory as a Buffer (req.file.buffer)
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });