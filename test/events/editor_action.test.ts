import swdcTracker, { EditorAction } from "../../src/index";
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
    await swdcTracker.initialize("localhost:5005", "editor_action", "swdotcom-vscode");
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
  });

  it("Stores the editor actions params to reconcile", async function () {
    const eventData = {
      jwt: "JWT 456",
      entity: "editor",
      type: "mouse",
      name: "click",
      description: "TreeViewExpand",
      tz_offset_minutes: 420,
      plugin_id: 2,
      plugin_name: "code-time",
      plugin_version: "2.1.22",
    };

    const editorActionPayload: any = new EditorAction(eventData).buildPayload();
    const payloadHash = swdcTracker.getEventDataHash(editorActionPayload.data);

    await swdcTracker.trackEditorAction(eventData);

    const outgoingPayload = swdcTracker.getOutgoingParamsData("editor_action_event", payloadHash);

    expect(outgoingPayload.jwt).to.eq(eventData.jwt);
    expect(outgoingPayload.plugin_version).to.eq(eventData.plugin_version);
  });
});
