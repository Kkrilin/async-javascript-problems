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
  const newFilePathArr = [];
  for (let index = 0; index < splitTextArr.length; index++) {
    newFilePathArr.push(`sentence-${index + 1}.txt`);
    const fileInfo = await writeFileCb(
      `sentence-${index + 1}.txt`,
      splitTextArr[index].trimStart(),
    );
    const fileNameInfo = await appendFileCb(
      'filenames.txt',
      '\n' + fileInfo.fileName,
    );
  }
  return newFilePathArr;
}

// step 4
async function stepFour(pathArr, readFileCb, sortContentCb, appendFileCb) {
  let fileInfo = {};
  for (let path of pathArr) {
    const text = await readFileCb(path);
    const sortText = await sortContentCb(text);
    console.log(path);
    fileInfo = await appendFileCb('sorted.txt', sortText + '. ' + '\n');
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
    const mainFileInfoName = await stepFour(
      newFIlepathArr,
      fileReadPromise,
      sortcontent,
      fileAppendPromise,
    );
    setTimeout(async () => {
      const readFileData = await stepFive(
        mainFileInfoName.fileName,
        fileReadPromise,
        fileUnlinkPromise,
      );
      // console.log(readFileData.split('\n'));
    }, 5000);

    // console.log(mainFileInfoName, 'line 202');
  } catch (error) {
    console.log(error);
  }
}
// main();
module.exports = main;
