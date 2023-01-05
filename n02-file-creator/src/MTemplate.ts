import path = require('path');
import fs = require('fs-extra');
import { MFile } from './MFile';
import { ConvertedJson } from './AnalyzeJson';
import ejs = require('ejs');

export interface Tpl {
  [keys: string]: {
    fileName: string,
    body: string
  }
}

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
   * writeFile
   * @param jsonArr 
   * @param tpl 
   */
  public writeFile(jsonArr: ConvertedJson[], tpl: Tpl): void {

    jsonArr.forEach(m => {
      const fileName = tpl[m.tpl].fileName.replace(/{name}/, m.name);
      const props = m.props;
      const compiledBody = ejs.render(tpl[m.tpl].body, m.props).replace(/\n\n+/g, '\n\n');
      fs.mkdirs(m.pathStr, function (err) {
        if (err) {
          throw new Error("Failed to create directory")
        }
      });
      fs.outputFileSync(m.pathStr + fileName.replace(/\.ejs$/, ''), compiledBody);

      // console.log("===== " + m.pathStr + fileName.replace(/\.ejs$/, ''))
      // console.log(compiledBody, "\n");
    });

  }

  /**
   * getAllTemplate
   * @param dir 
   * @returns 
   */
  public getAllTemplate(dir: string): Tpl {
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
    const result: Tpl = {};
    dirArr.forEach(m => {
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