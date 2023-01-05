import path = require('path');
import fs = require('fs-extra');
import { MFile } from './MFile';
import { ConvertedJson } from './MJson';
import ejs = require('ejs');
import { ArgvOptions } from './Core';

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
  public writeFile(jsonArr: ConvertedJson[], tpl: Tpl, options: ArgvOptions): void {

    if (!options.force) {
      jsonArr.forEach(m => {
        const fileName = tpl[m.tpl].fileName.replace(/{name}/, m.name).replace(/\.ejs$/, '');
        if (fs.pathExistsSync(m.pathStr + fileName)) {
          throw new Error(
            'File to write already exists.'
            + `\ntarget: ${tpl[m.tpl].fileName}`
            + `\nexists: ${m.pathStr + fileName}`
            + `\nhint: -f option will force overwriting`);
        }

      });
    }

    jsonArr.forEach(m => {
      const fileName = tpl[m.tpl].fileName.replace(/{name}/, m.name).replace(/\.ejs$/, '');
      const compiledBody = ejs.render(tpl[m.tpl].body, m.props).replace(/\n\n+/g, '\n\n');
      fs.mkdirsSync(m.pathStr);
      fs.outputFileSync(m.pathStr + fileName, compiledBody);
      console.log(`created: ${m.pathStr + fileName}`);
    });

  }

  /**
   * getAllTemplate
   * @param dir 
   * @returns 
   */
  public getAllTemplate(dir: string): Tpl {

    let dirArr;
    try {
      dirArr = MFile.readDir(dir);
    } catch {
      throw new Error(
        `no such file or directory, scan dir 'zumen/'`
        + `\n"npx zumen@latest init" to create a sample first.`
      );
    }

    const exists: { [keys: string]: boolean } = {};
    dirArr.forEach(f => {
      if (!f.match(/^[^=]+=/)) {
        throw new Error(
          `Template name error: "${f}". The template file name must include "=".`
          + `\nexample: "${f}={name}.ts.ejs"`  
        );
      }
      const fn = f.split("=");
      if (exists[fn[1] + "\t"]) {
        throw new Error(`Duplicate file name of template in ${fn[0]}`);
      }
      exists[fn[1] + "\t"] = true;
    });

    // read files
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