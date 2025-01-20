const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);
readStream.pipe(process.stdout);
readStream.on('error', (err) => {
  console.error('Ошибка при чтении файла:', err.message);
});
