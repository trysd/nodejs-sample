import fs = require('fs-extra');

/** Converted type */
export interface ConvertedJson {
  props: unknown,
  tpl: string, // template
  name: string,
  path: string[],
  pathStr: string
}

/** Class to parse map JSON */
export class AnalyzeJson {

  private static JsonURL = null;
  constructor(jsonUrl: string) {
    AnalyzeJson.JsonURL = jsonUrl;
  }

  /**
   * JSON parsing main
   */
  public analyze(): ConvertedJson[] {

    // read and parse
    const json = this.readJson();

    // Convert to an array representing what should be created where
    const convertedJson: ConvertedJson[] = this.jsonToArray(json, [], []);

    // Resolve annotation
    this.readAnnotation(convertedJson);

    return convertedJson;
  }

  /**
   * Resolve annotations.
   * the annotation value is converted to an array and replaced.
   * @param arrRef whole array
   * @param objRef Object to convert
   * @param index Index to be converted from the entire array
   * @param annoKey The key name of the annotation
   */
  public putAnnotation(
    arrRef: ConvertedJson[],
    objRef: ConvertedJson,
    index: number,
    annoKey: string
  ): void {
    const val = objRef.props[annoKey];
    const annoFileType = val.replace(/^.*\@/, '');
    const responseList: { name: string, path: string }[] = [];
    const backCount = (val.match(/\.\.\//g) || []).length;
    const targetPath = objRef.path.slice(0, objRef.path.length - backCount);
    arrRef.forEach((cj, i) => {
      if (i != index
        && targetPath.join("") === cj.path.join("")
        && annoFileType === cj.tpl
      ) {
        responseList.push({
          name: cj.name,
          path: '../'.repeat(backCount),
        })
      }
    });
    objRef.props[annoKey] = responseList;
  }

  /**
   * Annotation analysis
   * @param arrRef 
   */
  public readAnnotation(arrRef: ConvertedJson[]): void {
    arrRef.forEach((obj, i) => {
      Object.keys(obj.props).forEach(key => {
        const val = obj.props[key];
        if (val.match(/^(\.\.\/)*\@\w+/)) {
          this.putAnnotation(arrRef, obj, i, key)
        }
      });
    });
  }

  /**
   * Convert Object to array with path
   * @param json 
   * @param arr 
   * @param path 
   * @returns 
   */
  public jsonToArray(json: unknown, arr: ConvertedJson[], path: string[]): ConvertedJson[] {
    Object.keys(json).forEach(key => {
      if (key.match(/\/$/)) {
        // console.log(path, key)
        const _path = [...path, key];
        this.jsonToArray(json[key], arr, _path)
      } else {
        const keySplitted = key.split('=');
        arr.push({
          props: json[key],

          tpl: keySplitted[0],
          name: keySplitted[1],
          path: path,
          pathStr: path.join("")

        })
      }
    });
    return arr;
  }

  /**
   * json read and parse with remove comment
   * @returns 
   */
  public readJson(): unknown {
    const jsonStr = fs.readFileSync(AnalyzeJson.JsonURL).toString();
    const json = JSON.parse(jsonStr);
    this.removeJsonCommentOut(json);
    return json;
  }

  /**
   * Remove the // at the beginning of the item name.
   * The / at the end of the item name is a recursive search.
   * @param json json of map
   */
  public removeJsonCommentOut(json: unknown): void {
    Object.keys(json).forEach(key => {
      if (key.match(/^\/\//)) {
        delete json[key]
      } else if (key.match(/\/$/)) {
        this.removeJsonCommentOut(json[key])
      }
    });
  }

}