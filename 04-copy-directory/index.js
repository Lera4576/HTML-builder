const fs = require('fs').promises; // Импортируем модуль fs с поддержкой промисов
const path = require('path'); // Импортируем модуль path

const sourceDir = path.join(__dirname, 'files'); // Путь к исходной папке files
const destDir = path.join(__dirname, 'files-copy'); // Путь к папке назначения files-copy

async function copyDir() {
  try {
    await fs.rm(destDir, { recursive: true, force: true });
    await fs.mkdir(destDir, { recursive: true });
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      const sourceFile = path.join(sourceDir, file); // Полный путь к исходному файлу
      const destFile = path.join(destDir, file); // Полный путь к файлу назначения

      await fs.copyFile(sourceFile, destFile); // Копируем файл
    }

    console.log('Копирование завершено.');
  } catch (err) {
    console.error('Ошибка при копировании директории:', err.message);
  }
}

copyDir();
