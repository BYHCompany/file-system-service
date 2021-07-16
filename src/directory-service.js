const fs = require('fs').promises;

class DirectoryService {
  async makeDirectory(directory) {
    await fs.mkdir(directory, { recursive: true });
  }
}

module.exports = new DirectoryService();
