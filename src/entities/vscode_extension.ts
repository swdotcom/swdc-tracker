// The vscode extension entity interface
export interface VSCodeExtensionInterface {
  id: string;
  publisher: string;
  name: string;
  display_name: string;
  author: string;
  version: string;
  description: string;
  categories: string[];
  extension_kind: string[];
}

export class VSCodeExtension implements VSCodeExtensionInterface {
  public id: string; // "The canonical extension identifier in the form of: `publisher.name`" - (max len: 1024)
  public publisher: string; // (max len: 512)
  public name: string; // (max len: 512)
  public display_name: string; // (max len: 2048)
  public author: string; // (max len: 512)
  public version: string; // (max len: 255)
  public description: string; // (max len: 2048)
  public categories: string[]; // (max len per category string: 510)
  public extension_kind: string[]; // In a remote window the extension kind describes if an extension runs where the UI (window) runs or if an extension runs remotely. (max len: 255)

  constructor(data: VSCodeExtensionInterface) {
    this.id = data.id;
    this.publisher = data.publisher;
    this.name = data.name;
    this.display_name = data.display_name;
    this.author = data.author;
    this.version = data.version;
    this.description = data.description;
    this.categories = data.categories;
    this.extension_kind = data.extension_kind;
  }

  // required: [id, name, publisher, author, version]
  static hasData(data: VSCodeExtensionInterface) {
    return data.id && data.name && data.publisher && data.author && data.version;
  }

  async buildPayload() {
    return {
      schema: 'iglu:com.software/vscode_extension/jsonschema/1-0-1',
      data: {
        id: this.id,
        publisher: this.publisher,
        name: this.name,
        display_name: this.display_name,
        author: this.author,
        version: this.version,
        description: this.description,
        categories: this.categories,
        extension_kind: this.extension_kind
      },
    };
  }
}
