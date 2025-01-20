const fs = require('fs').promises;
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtmlPath = path.join(projectDistPath, 'index.html');
const outputCssPath = path.join(projectDistPath, 'style.css');

async function buildPage() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true });

    let template = await fs.readFile(templatePath, 'utf-8');

    const regex = /{{(\w+)}}/g;
    const matches = [...template.matchAll(regex)];

    for (const match of matches) {
      const componentName = match[1];
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        template = template.replace(match[0], componentContent);
      } catch (err) {
        console.error(
          `Ошибка при чтении компонента ${componentName}: ${err.message}`,
        );
      }
    }

    await fs.writeFile(outputHtmlPath, template);
    await mergeStyles();
    await copyAssets();

    console.log('Сборка страницы завершена.');
  } catch (err) {
    console.error('Ошибка при сборке страницы:', err.message);
  }
}

async function mergeStyles() {
  try {
    await fs.rm(outputCssPath, { force: true });

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

    await fs.writeFile(outputCssPath, styles.join('\n'), 'utf-8');
  } catch (err) {
    console.error('Ошибка при объединении стилей:', err.message);
  }
}

async function copyAssets() {
  const destDir = path.join(projectDistPath, 'assets');
  await fs.mkdir(destDir, { recursive: true });

  const files = await fs.readdir(assetsDir, { withFileTypes: true });

  for (const file of files) {
    const srcFile = path.join(assetsDir, file.name);
    const destFile = path.join(destDir, file.name);

    if (file.isDirectory()) {
      await copyDirectory(srcFile, destFile);
    } else {
      await fs.copyFile(srcFile, destFile);
    }
  }
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src, { withFileTypes: true });

  for (const file of files) {
    const srcFile = path.join(src, file.name);
    const destFile = path.join(dest, file.name);

    if (file.isDirectory()) {
      await copyDirectory(srcFile, destFile);
    } else {
      await fs.copyFile(srcFile, destFile);
    }
  }
}

buildPage();
