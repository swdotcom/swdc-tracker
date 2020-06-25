import swdcTracker from "../../src/index";
import { TrackerResponse } from "../../src/utils/response";

const http = require("../../src/utils/http");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("Test editor action event functions", function () {

  const sandbox = sinon.createSandbox();

  before(async () => {
    // return any api since we're not really trying to call out
    sandbox.stub(http, "get").callsFake(function () {
      return {
        data: {
          tracker_api: "localhost"
        }
      }
    });
    await swdcTracker.initialize("api.software.com", "editor_action", "swdotcom-vscode");
  });

  after(() => {
    sandbox.restore();
  });

  it("Validate creating a editor action payload", async function () {
    const eventData = {
      jwt: "JWT 123",
      entity: "editor",
      type: "mouse",
      name: "click",
      description: "TreeViewExpand",
      tz_offset_minutes: 420,
      plugin_id: 2,
      plugin_name: "code-time",
      plugin_version: "2.1.20",
    };
    const response: TrackerResponse = await swdcTracker.trackEditorAction(eventData);

    expect(response.status).to.equal(200);

    const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();

    // get the data
    const props = lastProcessedTestEvent.properties;
    const contexts = lastProcessedTestEvent.contexts;

    // SCHEMA validation "editor_action"
    expect(props.schema).to.include("editor_action");
    expect(props.data.type).to.equal("mouse");

    // get the plugin context
    const pluginContext: any = contexts.find((n: any) => n.schema.includes("plugin"));
    expect(pluginContext.data.plugin_id).to.equal(2);
  })
});