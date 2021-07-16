const fs = require('fs');
const asyncFS = fs.promises;
const path = require('path');
const ApiError = require('./exceptions/api-error');
const directoryService = require('./directory-service');

class FileService {
  /**
   * Save file on disk by userID, advertID
   *
   * @param file: File
   * @param filePath: string (userID/advertID)
   * @param fileName: string
   * @param staticPath: string (path to static folder)
   */
  async saveFileOnDisk(file, filePath, fileName = 'file.jpg', staticPath) {
    const directory = path.join(staticPath, filePath);

    if (!fs.existsSync(directory)) {
      await directoryService.makeDirectory(directory);
    }

    await asyncFS.writeFile(path.join(directory, fileName), file.buffer);

    const full = path.join(filePath, fileName);

    return `${process.env.SERVER_DOMAIN}:${process.env.PORT}/${full}`;
  }

  /**
   * Save files on disk by userID, advertID
   * @param files: File[]
   * @param userID: number
   * @param advertID: number
   */
  async saveFilesOnDisk(files, userID, advertID) {
    try {
      const pathToStatic = path.resolve(__dirname, '..', 'static');

      if (!fs.existsSync(pathToStatic)) {
        directoryService.makeDirectory(pathToStatic);
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

      return null;
    } catch (error) {
      throw ApiError.InternalServerError();
    }
  }

  /**
   * Delete folder
   * @param path: string
   */
  async deleteFile(pathToDelete) {
    if (!pathToDelete) {
      throw ApiError.BadRequest('No path');
    }

    const fullPath = path.join(__dirname, '..', 'static', pathToDelete);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    if ((await asyncFS.stat(fullPath)).isDirectory()) {
      await asyncFS.rmdir(fullPath, { recursive: true });
    } else {
      await asyncFS.rm(fullPath);
    }

    return pathToDelete;
  }

  /**
   * Delete all folder paths
   * @param paths: string[]
   */
  async deleteFiles(paths) {
    const deletedLinks = [];

    for (let i = 0; i < paths.length; i++) {
      deletedLinks.push(await this.deleteFile(paths[i]));
    }

    return deletedLinks;
  }
}

module.exports = new FileService();
