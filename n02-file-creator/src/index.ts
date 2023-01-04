import path = require('path');
import fs = require('fs-extra');
import ejs = require('ejs');

import { AnalyzeJson } from './AnalyzeJson';

// とりあえず自分で使い勝手がいいものを作る

// 後は配列に従ってファイルを作成するだけ
// 順序
// ・テンプレート事前準備
// ・ループ
// ・ejs置換
// ・フォルダ作成しつつファイル出力
// 

// -> 出力済みのファイルの対応
//    -> 基本的にはエラー。-f オプション付与を促す
//    -> 強制上書きオプション？（消去してから出力）

// -> マップの逆書き出し(後足し表記?) ※例: { newCompo: "__afterDetect__" }
// -> (\w+).stories.tsx なら、stories=$1 をmapに書き出す
//    未知のファイルの場合、unknow={ファイル名そのまま} をmapに書き出す
//    但し、これらのファイルは -f をつけた実行でも絶対に強制的出力しない。

// jsonエラーチェック
// ・末尾/のない階層の配下に末尾/付きの出現 => エラー
// ・末尾/配下に、「末尾/」or「=付き」項目名ではない => エラー

// コマンド
// 実行 npm run 

/** .. */
export default class Main {
  private static tplDir = 'x.files';

  json = new AnalyzeJson("./x.files.map.json");

  base = path.resolve();

  /** main */
  public main(): void {

    // Convert to an array representing what should be created where
    const convertedJson = this.json.analyze();

    // ..
    console.dir(convertedJson, { depth: null })
    console.log("path: " + this.base);


  }

  // ===========
  // =========== OLD
  // ===========

  // // 引数があれば - 引数でpath, props決定
  // this.typeArgv({
  //   name: "AAA",
  //   comment: "sss"
  // });

  /**  */
  private typeArgv(props): void {

    const base = path.resolve();

    // // tplフォルダ解析
    // const tplPathStr = this.readDir(base + '/' + Main.tplDir);
    // console.log(tplPathStr);

    // tplPathStr.forEach(f => {
    //   const tplPath = base + '/' + Main.tplDir + '/' + f;
    //   const str = fs.readFileSync(tplPath).toString();
    //   const strCompiled = ejs.render(str, props).replace(/\n\n+/g, '\n\n');
    //   console.log('---------- ' + f)
    // });

    // console.log(process.argv);
    // tplBodyList.forEach(..
    // fs.mkdirs(targetPath, function (err) {
    //   if (err) return console.error(err)
    //   console.log("success!")
    // });
    // const targetPath = base + '/src/aaa/bbb/'
    // console.log(targetPath);
    // fs.outputFileSync(targetPath + '/test.txt', 'hello!');
  }




  /**
   * Get recursive directory structure
   * @param dirPath
   * @param res response value
   * @param route stack structure
  */
  public readDir(dirPath: string, res: string[] = [], route: string[] = []): string[] {
    const routesStr = (route.length ? route.join('/') + '/' : '');
    const dirent = fs.readdirSync(dirPath + '/' + routesStr, { withFileTypes: true });
    dirent.forEach(d => {
      if (d.isDirectory()) {
        res = [...res, ...(this.readDir(dirPath, res, [...route, d.name]))];
      } else {
        res.push(routesStr + d.name)
      }
    })
    return res;
  }

}

new Main().main();