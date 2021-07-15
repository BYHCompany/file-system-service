const ApiError = require('./exceptions/api-error');
const fileService = require('./file-service');

class FileController {
  async saveFiles(req, res, next) {
    try {
      const { userID, advertID } = req.body;
      const files = req.files;

      if (!files) {
        throw ApiError.BadRequest('No files uploaded');
      }

      if (!userID) {
        throw ApiError.BadRequest('You need to set user ID');
      }

      const links = await fileService.saveFilesOnDisk(files, userID, advertID);

      res.status(201).json({
        status: 0,
        message: 'Files are successfully saved on disk',
        data: links,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FileController();
