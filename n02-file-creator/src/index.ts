import path = require('path');
import fs = require('fs-extra');
import ejs = require('ejs');

export default class Main {

  private static tplDir = 'x.files';

  /*

    ・引数ありの場合
      引数でpath, props決定
    ・引数なしの場合
      json設定ファイルでpath, props決定

  */
  /**
   * main
   */
  public main(): void {
    console.log("main!");
    this.typeArgv();
  }

  private typeArgv(): void {

    const base = path.resolve();

    // const targetPath = base + '/src/aaa/bbb/'
    // console.log(targetPath);

    // fs.mkdirs(targetPath, function (err) {
    //   if (err) return console.error(err)
    //   console.log("success!")
    // });

    // fs.outputFileSync(targetPath + '/test.txt', 'hello!');

    // ファイル読み込んで
    const tplPathStr = this.readDir(base + '/' + Main.tplDir);
    // console.log(tplPathStr);
    const tplBodes = tplPathStr.map(f => {
      console.log(f);
      const tplPath = base + '/' + Main.tplDir + '/' + f;
      const str = fs.readFileSync(tplPath).toString();
      const strCompiled = ejs.render(str, {
        name: "testABC",
        path: '',
        components: '',
        jsx: '',
        states: '',
        props: ''
      }).replace(/\n\n+/g, '\n\n');

      console.log('-----');
      console.log(strCompiled);
      console.log('-----//');
    });
    console.log(tplBodes)
  }

  /**
   * ディレクトリ内ファイル一覧取得
   * @param dirPath 
  */
  public readDir(dirPath: string): string[] {
    const res: string[] = [];
    const dirent = fs.readdirSync(dirPath, { withFileTypes: true });
    dirent.forEach(d => res.push(d.name))
    return res;
  }

}

new Main().main();