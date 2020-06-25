import { UIElementInterface } from "../entities/ui_element";
import { PluginInterface } from "../entities/plugin";

// The UI Interaction event
export interface UIInteractionInterface {
  interaction_type: string,
}

export class UIInteraction implements UIInteractionInterface {
  public interaction_type: string;

  constructor(data: UIInteractionInterface) {
    this.interaction_type = data.interaction_type;
  }

  hasData() {
    return this.interaction_type ? true : false;
  }

  buildPayload() {
    return {
      schema: "iglu:com.software/ui_interaction/jsonschema/1-0-0",
      data: {
        interaction_type: this.interaction_type,
      }
    }
  }
}

export interface UIInteractionParams extends PluginInterface, UIElementInterface, UIInteractionInterface {
  jwt: string
}