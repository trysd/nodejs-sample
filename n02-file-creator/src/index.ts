import path = require('path');
import fs = require('fs-extra');

import { AnalyzeJson, ConvertedJson } from './AnalyzeJson';
import { MTemplate, Tpl } from './MTemplate';

// とりあえず自分で使い勝手がいいものを作る

/** .. */
export default class Main {
  private static tplDir = 'x.files';
  private static mapFile = 'x.map.json';
  private json = new AnalyzeJson(Main.mapFile);
  private base = path.resolve();

  private template = MTemplate.getInstance();
  private baseTpl: Tpl = null;
  private convertedJson: ConvertedJson[] = [];

  /** main */
  public main(): void {

    // Convert to an array representing what should be created where
    this.convertedJson = this.json.convertJson();
    console.dir(this.convertedJson, { depth: null })

    // read template
    this.baseTpl = this.template.getAllTemplate(Main.tplDir);

    // write file
    this.template.writeFile(this.convertedJson, this.baseTpl);

  }

}

new Main().main();


// -> 出力済みのファイルの対応
//    -> 基本的にはエラー。-f オプション付与を促す
//    -> 強制上書きオプション？（消去してから出力）

// jsonエラーチェック
// ・エラーチェックのみ処理オプション -t
// ・末尾/のない階層の配下に末尾/付きの出現 => エラー
// ・末尾/配下に、「末尾/」or「=付き」項目名ではない => エラー
// ・JSの予約語をjson項目名にしている => エラー

// -> マップの逆書き出し(後足し表記?) ※例: { newCompo: "__afterDetect__" }
// -> (\w+).stories.tsx なら、stories=$1 をmapに書き出す
//    未知のファイルの場合、unknown={ファイル名そのまま} をmapに書き出す
//    但し、これらのファイルは -f をつけた実行でも絶対に強制的出力しない。


// コマンド
// 実行 npm run 
