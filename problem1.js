const fs = require('fs');

/////// using callback//////////

function callBackFs(path) {
  setTimeout(function creadeDir() {
    fs.mkdir(`${path}`, { recursive: true }, (err) => {
      if (err) throw err;
      console.log(`directory ${path} created`);
    });
    setTimeout(function createfile() {
      fs.writeFile(
        `${path}/callbackrandom 1.json`,
        JSON.stringify({ random: '1' }),
        (err) => {
          if (err) throw err;
          console.log(`the file callbackrandom 1 has been saved`);
        },
      );
      setTimeout(function removefile() {
        fs.unlink(`${path}/callbackrandom 1.json`, (err) => {
          if (err) throw err;
          console.log(`the file callbackrandom 1 has been delete`);
        });
        setTimeout(function createfile() {
          fs.writeFile(
            `${path}/callbackrandom 2.json`,
            JSON.stringify({ random: '2' }),
            (err) => {
              if (err) throw err;
              console.log(`the file callbackrandom 2 has been saved`);
            },
          );
          setTimeout(function removeFile() {
            fs.unlink(`${path}/callbackrandom 2.json`, (err) => {
              if (err) throw err;
              console.log(`the file callbackrandom 2 has been delete`);
            });
            setTimeout(function createfile() {
              fs.writeFile(
                `${path}/callbackrandom 3.json`,
                JSON.stringify({ random: '3' }),
                (err) => {
                  if (err) throw err;
                  console.log(`the file callbackrandom 3 has been saved`);
                },
              );
              setTimeout(function removeFile() {
                fs.unlink(`${path}/callbackrandom 3.json`, (err) => {
                  if (err) throw err;
                  console.log(`the file callbackrandom 3 has been delete`);
                });
              }, 2400);
            }, 2000);
          }, 1600);
        }, 1200);
      }, 800);
    }, 400);
  }, 0);
}

/////////////// using Promises//////////////

function usingPromise(path) {
  //  directory creation section start

  function createDir() {
    const createDirPromise = new Promise((resolve, reject) => {
      fs.mkdir(`${path}`, { recursive: true }, (err) => {
        if (err) {
          reject(`directory ${path} creation has been failed`);
        } else {
          resolve(`directory ${path} has been created`);
        }
      });
    });
    return createDirPromise;
  }
  //  directory creation section end

  //  file creation section start

  function createfile(creatpath) {
    const createFilePromise = new Promise((resolve, reject) => {
      fs.writeFile(
        `${path}/${creatpath}.json`,
        JSON.stringify({ random: '1' }),
        (err) => {
          if (err) {
            reject(`file ${creatpath} creation failed`);
          } else {
            resolve(`file ${creatpath} created`);
          }
        },
      );
    });
    return createFilePromise;
  }
  //  file creation section end

  // file remove section start

  function removefile(removepath) {
    const removeFilePromise = new Promise((resolve, reject) => {
      fs.unlink(`${path}/${removepath}.json`, (err) => {
        if (err) {
          reject(`file ${removepath} does not removed`);
        } else {
          resolve(`file ${removepath} has been deleted`);
        }
      });
    });
    return removeFilePromise;
  }

  // file remove section end

  // consuming promises using chaining

  createDir()
    .then((response) => {
      console.log(response);
      return createfile('promisechainrandom 1');
    })
    .then((response) => {
      console.log(response);
      return removefile('promisechainrandom 1');
    })
    .then((response) => {
      console.log(response);
      return createfile('promisechainrandom2');
    })
    .then((response) => {
      console.log(response);
      return removefile('promisechainrandom2');
    })
    .then((response) => {
      console.log(response);
      return createfile('promisechainrandom3');
    })
    .then((response) => {
      console.log(response);
      return removefile('promisechainrandom3');
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => console.log(err));
}

////////////// using async await//////////////////

async function usingAsyncAwait(path) {
  function createDir() {
    const createDirPromiseAsync = new Promise((resolve, reject) => {
      fs.mkdir(`${path}`, { recursive: true }, (err) => {
        if (err) {
          reject({
            messege: `directory ${path} creation failed`,
            status: false,
          });
        } else {
          resolve({ messege: `directory ${path} created`, status: true });
        }
      });
    });
    return createDirPromiseAsync;
  }
  //  directory creation section end

  //  file creation section start

  function createfile(creatpath) {
    const createFilePromiseAsync = new Promise((resolve, reject) => {
      fs.writeFile(
        `${path}/${creatpath}.json`,
        JSON.stringify({ random: '1' }),
        (err) => {
          if (err) {
            reject({
              messege: `file ${creatpath} failed created`,
              status: false,
            });
          } else {
            resolve({
              messege: ` file ${creatpath} created`,
              status: true,
            });
          }
        },
      );
    });
    return createFilePromiseAsync;
  }
  //  file creation section end

  // file remove section start

  function removefile(removepath) {
    const removeFilePromiseAsync = new Promise((resolve, reject) => {
      fs.unlink(`${path}/${removepath}.json`, (err) => {
        if (err) {
          reject({
            messege: `file ${removepath} failed to remove `,
            status: false,
          });
        } else {
          resolve({
            messege: `file ${removepath} removed`,
            status: true,
          });
        }
      });
    });
    return removeFilePromiseAsync;
  }

  // file remove section end

  // consuming promises with async await and error with try and catch statement

  try {
    const directoryCreation = await createDir();
    console.log(directoryCreation.messege);
    if (directoryCreation.status) {
      const fileCreation1 = await createfile('asyncrandom 1');
      console.log(fileCreation1.messege);
      const fileRemove1 = await removefile('asyncrandom 1');
      console.log(fileRemove1.messege);
      const fileCreation2 = await createfile('asyncrandom 2');
      console.log(fileCreation2.messege);
      const fileRemove2 = await removefile('asyncrandom 2');
      console.log(fileRemove2.messege);
      const fileCreation3 = await createfile('asyncrandom 3');
      console.log(fileCreation3.messege);
      const fileRemove3 = await removefile('asyncrandom 3');
      console.log(fileRemove3.messege);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { callBackFs, usingPromise, usingAsyncAwait };
