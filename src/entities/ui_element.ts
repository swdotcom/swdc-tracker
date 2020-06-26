// The ui_element interface
export interface UIElementInterface {
  element_name: string,
  element_location: string,
  color: string,
  icon_name: string,
  cta_text: string
}

export class UIElement implements UIElementInterface {
  public element_name: string;
  public element_location: string;
  public color: string;
  public icon_name: string;
  public cta_text: string;

  constructor(data: UIElementInterface) {
    this.element_name = data.element_name;
    this.element_location = data.element_location;
    this.color = data.color;
    this.icon_name = data.icon_name;
    this.cta_text = data.cta_text;
  }

  static hasData(data: UIElementInterface) {
    return data.element_name && data.element_location;
  }

  async buildPayload() {
    return {
      schema: "iglu:com.software/ui_element/jsonschema/1-0-0",
      data: {
        element_name: this.element_name,
        element_location: this.element_location,
        color: this.color,
        icon_name: this.icon_name,
        cta_text: this.cta_text
      }
    }
  }
}