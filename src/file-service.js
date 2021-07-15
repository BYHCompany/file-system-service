const fs = require('fs');
const path = require('path');
const ApiError = require('./exceptions/api-error');

class FileService {
  async saveFileOnDisk(file, filePath, fileName = 'file.jpg', staticPath) {
    const directory = path.join(staticPath, filePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(path.join(directory, fileName), file.buffer);

    const full = path.join(filePath, fileName);

    return `${process.env.SERVER_DOMAIN}:${process.env.PORT}/${full}`;
  }

  async saveFilesOnDisk(files, userID, advertID) {
    try {
      const pathToStatic = path.resolve(__dirname, '..', 'static');

      if (!fs.existsSync(pathToStatic)) {
        fs.mkdirSync(pathToStatic, { recursive: true });
      }

      let fileNames = [];

      if (files.length > 1 && advertID) {
        for (let i = 0; i < files.length; i++) {
          const filePath = `${userID}${path.sep}${advertID}`;
          const fileName = `${i}.jpg`;
          fileNames.push(await this.saveFileOnDisk(files[i], filePath, fileName, pathToStatic));
        }
        return fileNames;
      }

      if (files.length === 1 && !advertID) {
        fileNames.push(
          await this.saveFileOnDisk(files[0], `${userID}`, `avatar-${userID}.jpg`, pathToStatic),
        );
        return fileNames;
      }
    } catch (error) {
      throw ApiError.InternalServerError();
    }
  }
}

module.exports = new FileService();
