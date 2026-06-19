import path from 'path';

export class FileUtil {
  static getExtension(filename: string): string {
    return path.extname(filename);
  }

  static getBaseName(filename: string): string {
    return path.basename(filename, this.getExtension(filename));
  }
}
