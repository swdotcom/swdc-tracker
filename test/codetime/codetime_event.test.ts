import swdcTracker from "../../src/index";
import { TrackerResponse } from "../../src/utils/response";

const http = require("../../src/utils/http");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("Test codetime event functions", function () {

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
    await swdcTracker.initialize("api.software.com", "codetime", "swdotcom-vscode");
  });

  after(() => {
    sandbox.restore();
  });

  it("Validate creating a codetime payload", async function () {
    const eventData = {
      jwt: "JWT 123",
      keystrokes: 20,
      chars_added: 10,
      chars_deleted: 10,
      pastes: 0,
      lines_added: 0,
      lines_deleted: 0,
      start_time: 1,
      end_time: 2,
      tz_offset_minutes: 420,
      plugin_id: 4,
      plugin_name: "code-time",
      plugin_version: "2.1.20",
      project_name: "foo",
      project_directory: "baz"
    };
    const response: TrackerResponse = await swdcTracker.trackCodeTimeEvent(eventData);

    expect(response.status).to.equal(200);

    // get the data
    const payloadData = response.data;
    const props = payloadData.properties;
    const contexts = payloadData.contexts;
    expect(props.schema).to.include("codetime");
    expect(props.data.keystrokes).to.equal(20);

    // get the plugin context
    const pluginContext: any = contexts.find((n: any) => n.schema.includes("plugin"));
    expect(pluginContext.data.plugin_id).to.equal(4);
  })
});