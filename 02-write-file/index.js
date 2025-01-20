const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Введите текст для записи в файл. Для выхода введите "exit" или нажмите Ctrl + C.',
);

const promptUser = () => {
  rl.question('Введите текст: ', (input) => {
    if (input.trim() === 'exit') {
      console.log('Спасибо за использование программы! До свидания!');
      rl.close();
      writeStream.end();
      process.exit();
    } else {
      writeStream.write(input + '\n', (err) => {
        if (err) {
          console.error('Ошибка при записи в файл:', err.message);
        }
        promptUser();
      });
    }
  });
};

process.on('SIGINT', () => {
  console.log('\nСпасибо за использование программы! До свидания!');
  rl.close();
  writeStream.end();
  process.exit();
});

promptUser();
