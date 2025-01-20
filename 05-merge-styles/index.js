const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFilePath = path.join(outputDir, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.rm(outputFilePath, { force: true });
    const files = await fs.readdir(stylesDir);
    const styles = [];

    for (const file of files) {
      const filePath = path.join(stylesDir, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile() && path.extname(file) === '.css') {
        const content = await fs.readFile(filePath, 'utf-8');
        styles.push(content);
      }
    }

    await fs.writeFile(outputFilePath, styles.join('\n'), 'utf-8');
    console.log('Стили успешно объединены в bundle.css');
  } catch (err) {
    console.error('Ошибка при объединении стилей:', err.message);
  }
}

mergeStyles();
