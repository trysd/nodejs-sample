import { MJson, ConvertedJson } from './MJson';
import { MTemplate, Tpl } from './MTemplate';
import { MUserInit } from './MUserInit';

export interface ArgvOptions {
  force: boolean,
  preview: boolean,
  init: boolean
}

export default class Core {
  private static tplDir = 'zumen';
  private static mapFile = 'zumen';
  private json = new MJson(Core.mapFile);
  private template = MTemplate.getInstance();
  private baseTpl: Tpl = {};
  private convertedJson: ConvertedJson[] = [];

  /** main */
  public main(): void {

    const options = this.readArgv();

    // user init
    if (options.init) {
      new MUserInit(Core.mapFile, Core.tplDir);
      return;
    }

    // read template
    this.baseTpl = this.template.getAllTemplate(Core.tplDir);

    // Convert to an array representing what should be created where
    this.convertedJson = this.json.convertJson(this.baseTpl, options);

    // write file
    this.template.writeFile(this.convertedJson, this.baseTpl, options);
  }

  /**
   * read ARGV
   * @returns 
   */
  private readArgv(): ArgvOptions {
    const argv = process.argv;
    const options: ArgvOptions = {
      force: false,
      preview: false,
      init: false
    }
    if (argv.length > 2) {
      options.force = argv.includes("-f") ? true : false;
      options.preview = argv.includes("-p") ? true : false;
      options.init = argv.includes("init") ? true : false;
    }
    return options
  }

}


