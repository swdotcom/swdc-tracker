import swdcTracker from "../../src/index";
import { TrackerResponse } from "../../src/utils/response";

const http = require("../../src/utils/http");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("Test ui interaction event functions", function () {

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

  it("Validate creating a UI interaction payload", async function () {
    const eventData = {
      jwt: "JWT 123",
      interaction_type: "execute_command",
      element_name: "tree_view_summary_button",
      element_location: "tree",
      tz_offset_minutes: 420,
      plugin_id: 2,
      plugin_name: "code-time",
      plugin_version: "2.1.20",
    };
    const response: TrackerResponse = await swdcTracker.trackUIInteraction(eventData);

    expect(response.status).to.equal(200);

    const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();

    // get the data
    const props = lastProcessedTestEvent.properties;
    const contexts = lastProcessedTestEvent.contexts;

    // SCHEMA validation "ui_interaction"
    expect(props.schema).to.include("ui_interaction");
    expect(props.data.interaction_type).to.equal("execute_command");

    // get the plugin context
    const pluginContext: any = contexts.find((n: any) => n.schema.includes("plugin"));
    expect(pluginContext.data.plugin_id).to.equal(2);
  })
});