const fs = require('fs').promises;
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');
async function displayFilesInfo() {
  try {
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);
        const stats = await fs.stat(filePath);

        const fileName = path.parse(file.name).name;
        const fileExt = path.extname(file.name).slice(1);
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExt} - ${fileSize}b`);
      }
    }
  } catch (err) {
    console.error('Ошибка при чтении папки:', err.message);
  }
}

displayFilesInfo();
