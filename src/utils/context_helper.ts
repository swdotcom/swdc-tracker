import { CodeTime } from "../events/codetime";
import { EditorAction } from "../events/editor_action";
import { Auth } from "../entities/auth";
import { Project } from "../entities/project";
import { Repo } from "../entities/repo";
import { File } from "../entities/file";
import { Plugin } from "../entities/plugin";
import { UIInteraction } from "../events/ui_interaction";
import { UIElement } from "../entities/ui_element";

export async function buildContexts(params: any) {
  // build the strict types
  const codetime: CodeTime = new CodeTime(params);
  const editorAction: EditorAction = new EditorAction(params);
  const uiInteraction: UIInteraction = new UIInteraction(params);
  const uiElement: UIElement = new UIElement(params);
  const project: Project = new Project(params);
  const repo: Repo = new Repo(params);
  const file: File = new File(params);
  const plugin: Plugin = new Plugin(params);
  const auth: Auth = new Auth(params);

  const contexts = [];

  // create the payloads

  // code time
  if (codetime.hasData()) {
    const _codetimePayload = await codetime.buildPayload();
    contexts.push(_codetimePayload);
  }

  // editor action
  if (editorAction.hasData()) {
    const _editorActionPayload = await editorAction.buildPayload();
    contexts.push(_editorActionPayload);
  }

  // ui interaction
  if (uiInteraction.hasData()) {
    const _uiInteractionPayload = await uiInteraction.buildPayload();
    contexts.push(_uiInteractionPayload);
  }

  // ui element
  if (uiElement.hasData()) {
    const _uiElementPayload = await uiElement.buildPayload();
    contexts.push(_uiElementPayload);
  }

  // project
  if (project.hasData()) {
    const _projecPayload = await project.buildPayload();
    contexts.push(_projecPayload);
  }

  // repo
  if (repo.hasData()) {
    const _repoPayload = await repo.buildPayload();
    contexts.push(_repoPayload);
  }

  // file
  if (file.hasData()) {
    const _filePayload = await file.buildPayload();
    contexts.push(_filePayload);
  }

  // plugin
  if (plugin.hasData()) {
    const _pluginPayload = await plugin.buildPayload();
    contexts.push(_pluginPayload);
  }

  const _authPayload = await auth.buildPayload();
  contexts.push(_authPayload);

  return contexts;
}