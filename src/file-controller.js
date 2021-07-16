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

      if (links == null) {
        res.status(400).json({
          status: 1,
          message:
            'Need to choose that need to save (if avatar => remove advertID and put ONE photo)',
          data: null,
        });
        return;
      }

      res.status(201).json({
        status: 0,
        message: 'Files are successfully saved on disk',
        data: links,
      });

      return;
    } catch (error) {
      next(error);
    }
  }

  async deleteFiles(req, res, next) {
    try {
      const { paths } = req.body;

      if (!paths) {
        throw ApiError.BadRequest('No paths to delete');
      }

      const links = await fileService.deleteFiles(paths);

      res.status(200).json({
        status: 0,
        message: 'Files are successfully deleted from disk, if null element => no such directory',
        data: links,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FileController();
