import { Auth } from "../entities/auth";
import { Project } from "../entities/project";
import { Repo } from "../entities/repo";
import { File } from "../entities/file";
import { Plugin } from "../entities/plugin";
import { UIElement } from "../entities/ui_element";
import { FileChange } from "../entities/file_change";
import { VSCodeExtension } from '../entities/vscode_extension';

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
  if (Array.isArray(params.file_changes)) {
    for (const change of params.file_changes) {
      if (FileChange.hasData(change))
        contexts.push(await new FileChange(change).buildPayload(params.jwt));
    }
  }

  // vscode extension event
  if (params.vscode_extension && VSCodeExtension.hasData(params.vscode_extension)) {
    const _vscodeExtension = await new VSCodeExtension(params.vscode_extension).buildPayload();
    contexts.push(_vscodeExtension);
  }

  // Auth is required
  const _authPayload = await new Auth(params).buildPayload();
  contexts.push(_authPayload);

  return contexts;
}
