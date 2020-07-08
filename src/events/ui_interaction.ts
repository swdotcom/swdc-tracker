import { UIElementInterface } from "../entities/ui_element";
import { PluginInterface } from "../entities/plugin";
import { AuthInterface } from "../entities/auth";

// The UI Interaction event
export interface UIInteractionInterface {
  interaction_type: string,
}

export class UIInteraction implements UIInteractionInterface {
  public interaction_type: string;

  constructor(data: UIInteractionInterface) {
    this.interaction_type = data.interaction_type;
  }

  static hasData(data: UIInteractionInterface) {
    return data.interaction_type;
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

export interface UIInteractionParams extends
  AuthInterface, PluginInterface, UIElementInterface, UIInteractionInterface { }
