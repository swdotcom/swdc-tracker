import { CodeTime } from "../events/codetime";
import { EditorAction } from "../events/editor_action";
import { Auth } from "../entities/auth";
import { Project } from "../entities/project";
import { Repo } from "../entities/repo";
import { File } from "../entities/file";
import { Plugin } from "../entities/plugin";
import { UIInteraction } from "../events/ui_interaction";
import { UIElement } from "../entities/ui_element";

/**
 * Build the snowplow payloads based on params available
 * @param params
 */
export function buildContexts(params: any) {

  const contexts = [];

  // code time
  if (CodeTime.hasData(params)) {
    const _codetimePayload = new CodeTime(params).buildPayload();
    contexts.push(_codetimePayload);
  }

  // editor action
  if (EditorAction.hasData(params)) {
    const _editorActionPayload = new EditorAction(params).buildPayload();
    contexts.push(_editorActionPayload);
  }

  // ui interaction
  if (UIInteraction.hasData(params)) {
    const _uiInteractionPayload = new UIInteraction(params).buildPayload();
    contexts.push(_uiInteractionPayload);
  }

  // ui element
  if (UIElement.hasData(params)) {
    const _uiElementPayload = new UIElement(params).buildPayload();
    contexts.push(_uiElementPayload);
  }

  // project
  if (Project.hasData(params)) {
    const _projecPayload = new Project(params).buildPayload();
    contexts.push(_projecPayload);
  }

  // repo
  if (Repo.hasData(params)) {
    const _repoPayload = new Repo(params).buildPayload();
    contexts.push(_repoPayload);
  }

  // file
  if (File.hasData(params)) {
    const _filePayload = new File(params).buildPayload();
    contexts.push(_filePayload);
  }

  // plugin
  if (Plugin.hasData(params)) {
    const _pluginPayload = new Plugin(params).buildPayload();
    contexts.push(_pluginPayload);
  }

  // Auth is required
  const _authPayload = new Auth(params).buildPayload();
  contexts.push(_authPayload);

  return contexts;
}
