const fs = require('fs');

function changeToUpperCasePromise(str) {
  return new Promise((resolve, reject) => {
    if (str) {
      resolve(str.toUpperCase());
    } else {
      reject(new Error('not valid text or inputtext'));
    }
  });
}

function changeToLowerCasePromise(str) {
  return new Promise((resolve, reject) => {
    if (str) {
      resolve(str.toLowerCase());
    } else {
      reject(new Error('not valid text or inputtext'));
    }
  });
}

function fileWritePromise(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${file}`, data, 'utf-8', (err) => {
      if (err) {
        reject(err, 12354);
      } else {
        resolve({
          message: `data saved in ${file}`,
          fileName: `${file}`,
          data: `${data}`,
        });
      }
    });
  });
}

function fileAppendPromise(file, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(`${file}`, data, 'utf-8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          message: `data saved in ${file}`,
          fileName: `${file}`,
          data: `${data}`,
        });
      }
    });
  });
}

function fileReadPromise(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${file}`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
function fileUnlinkPromise(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(`${file}`, (err) => {
      if (err) {
        reject('file can be deleted');
      } else {
        resolve(`file name: ${file} : deleted`);
      }
    });
  });
}

function splitSentence(str) {
  return new Promise((resolve, reject) => {
    if (str) {
      const splitArr = str.split('\n').join(' ').split('.');
      resolve(splitArr.slice(0, splitArr.length - 1));
    } else {
      reject(new Error('not valid text or inputtext'));
    }
  });
}

function sortcontent(str) {
  return new Promise((resolve, reject) => {
    if (str) {
      resolve(str.split(' ').sort().join(' '));
    } else {
      reject(new Error(`give valid string:1 ${str}`));
    }
  });
}
//  step 1
function stepOne(file, readFileCb) {
  return readFileCb(file);
}

// step 2
async function stepTwo(text, uppercaseCb, writeFileCb) {
  const uppercaseTxt = await uppercaseCb(text);
  const fileupperinfo = await writeFileCb('uppercase.txt', uppercaseTxt);
  const filenameInfo = await writeFileCb(
    'filenames.txt',
    fileupperinfo.fileName,
  );
  return filenameInfo;
}

// step 3

async function stepThree(
  file,
  readFileCb,
  lowerCaseCb,
  splitSentencecb,
  appendFileCb,
  writeFileCb,
) {
  const lipsumUpperText = await readFileCb(file);
  const lowerCaseText = await lowerCaseCb(lipsumUpperText);
  const splitTextArr = await splitSentencecb(lowerCaseText);
  const newFilePathArr = await Promise.all(
    splitTextArr.map(async (splitText, index) => {
      try {
        await writeFileCb(
          `./data/sentence-${index + 1}.txt`,
          splitText.trimStart(),
        );
      } catch (error) {
        console.log(error);
      }
      return `./data/sentence-${index + 1}.txt`;
    }),
  );
  await Promise.all(
    newFilePathArr.map((objEl) => {
      return appendFileCb('filenames.txt', '\n' + objEl);
    }),
  );
  return newFilePathArr;
}

// step 4
async function stepFour(pathArr, readFileCb, sortContentCb, appendFileCb) {
  const textArr = await Promise.all(pathArr.map((path) => readFileCb(path)));
  const sortcontent = await Promise.all(
    textArr.map((text) => sortContentCb(text)),
  );
  let fileInfo = {};
  for (let content of sortcontent) {
    fileInfo = await appendFileCb('sorted.txt', content + '. ' + '\n');
  }
  const fileNameInfo = await appendFileCb(
    'filenames.txt',
    '\n' + fileInfo.fileName,
  );
  return fileNameInfo;
}

// step 5

async function stepFive(fileName, readFileCb, fileUnlinkCb) {
  const readFileData = await readFileCb(fileName);
  for (let path of readFileData.split('\n')) {
    const message = await fileUnlinkCb(path);
    console.log(message);
  }
  return 'all the file has been deleted';
}

// main function
async function main(file) {
  try {
    const lipsumText = await stepOne(file, fileReadPromise);
    const filenameInfo = await stepTwo(
      lipsumText,
      changeToUpperCasePromise,
      fileWritePromise,
    );

    const newFIlepathArr = await stepThree(
      filenameInfo.data,
      fileReadPromise,
      changeToLowerCasePromise,
      splitSentence,
      fileAppendPromise,
      fileWritePromise,
    );

    console.log(newFIlepathArr);
    const mainFileInfoName = await stepFour(
      newFIlepathArr,
      fileReadPromise,
      sortcontent,
      fileAppendPromise,
    );
    setTimeout(async () => {
      try {
        const lastMessage = await stepFive(
          mainFileInfoName.fileName,
          fileReadPromise,
          fileUnlinkPromise,
        );
        console.log(lastMessage);
      } catch (error) {
        console.log(error);
      }
      // console.log(readFileData.split('\n'));
    }, 5000);

    // console.log(mainFileInfoName, 'line 202');
  } catch (error) {
    console.log(error);
  }
}
// main();
module.exports = main;
