import { Auth } from "../entities/auth";
import { Project } from "../entities/project";
import { Repo } from "../entities/repo";
import { File } from "../entities/file";
import { Plugin } from "../entities/plugin";
import { UIElement } from "../entities/ui_element";
import { UncommittedChange } from "../entities/uncommitted_change";

/**
 * Build the snowplow payloads based on params available
 * @param params
 */
export async function buildContexts(params: any) {

  const contexts = [];

  // ui element
  if (UIElement.hasData(params)) {
    const _uiElementPayload = await new UIElement(params).buildPayload();
    contexts.push(_uiElementPayload);
  }

  // project
  if (Project.hasData(params)) {
    const _projectPayload = await new Project(params).buildPayload(params.jwt);
    contexts.push(_projectPayload);
  }

  // repo
  if (Repo.hasData(params)) {
    const _repoPayload = await new Repo(params).buildPayload(params.jwt);
    contexts.push(_repoPayload);
  }

  // file
  if (File.hasData(params)) {
    const _filePayload = await new File(params).buildPayload(params.jwt);
    contexts.push(_filePayload);
  }

  // plugin
  if (Plugin.hasData(params)) {
    const _pluginPayload = await new Plugin(params).buildPayload();
    contexts.push(_pluginPayload);
  }

  // uncommitted_changes
  if (params.uncommitted_changes?.length > 0) {
    for (const change of params.uncommitted_changes) {
      if (UncommittedChange.hasData(change))
        contexts.push(await new UncommittedChange(change).buildPayload(params.jwt));
    }
  }

  // Auth is required
  const _authPayload = await new Auth(params).buildPayload();
  contexts.push(_authPayload);

  return contexts;
}
