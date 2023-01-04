import path = require('path');
import fs = require('fs-extra');
import { MFile } from './MFile';

export class MTemplate {

  /** singleton */
  private static instance = null;
  private constructor() { /* */ }
  public static getInstance(): MTemplate {
    if (!this.instance) this.instance = new MTemplate();
    return this.instance;
  }

  private base = path.resolve();

  /**
   * 
   * @param dir 
   * @returns 
   */
  public getAllTemplate(dir: string): { [keys: string]: {
    fileName: string,
    body: string
  } } {
    const dirArr = MFile.readDir(dir);

    // 同名のfile名があればエラー
    const exists: { [keys: string]: boolean } = {};
    dirArr.forEach(f => {
      const fn = f.split("=");
      if (exists[fn[1] + "\t"]) {
        throw new Error(`Duplicate file name of template in ${fn[0]}`);
      }
      exists[fn[1] + "\t"] = true;
    });

    // ファイル読み込み
    // console.log(dir, dirArr);
    const result = {};
    dirArr.forEach(m => {
      // const file = dir + '/' + m;
      const str = fs.readFileSync(dir + '/' + m).toString();
      const fn = m.split("=");
      result[fn[0]] = {
        fileName: fn[1],
        body: str
      };
    });

    return result;
  } 
}