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
      chars_added: 111,
      chars_deleted: 10,
      pastes: 1,
      lines_added: 2,
      lines_deleted: 3,
      start_time: "2020-07-29T01:04:03Z",
      end_time: "2020-07-29T01:04:20Z",
      plugin_id: 4,
      plugin_name: "code-time",
      plugin_version: "2.1.999",
      project_name: "foo",
      project_directory: "baz"
    };
    const response: TrackerResponse = await swdcTracker.trackCodeTimeEvent(eventData);

    expect(response.status).to.equal(200);

    const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();

    // get the data
    const props = lastProcessedTestEvent.properties;
    const contexts = lastProcessedTestEvent.contexts;

    // SCHEMA validation "codetime"
    expect(props.schema).to.include("codetime");
    expect(props.data.keystrokes).to.equal(20);
    expect(props.data.chars_added).to.equal(111);
    expect(props.data.chars_deleted).to.equal(10);
    expect(props.data.pastes).to.equal(1);
    expect(props.data.lines_added).to.equal(2);
    expect(props.data.lines_deleted).to.equal(3);
    expect(props.data.start_time).to.equal("2020-07-29T01:04:03Z");
    expect(props.data.end_time).to.equal("2020-07-29T01:04:20Z");
    // get the plugin context
    const pluginContext: any = contexts.find((n: any) => n.schema.includes("plugin"));
    expect(pluginContext.data.plugin_id).to.equal(4);
    expect(pluginContext.data.plugin_name).to.equal("code-time");
    expect(pluginContext.data.plugin_version).to.equal("2.1.999");
    const projectContext: any = contexts.find((n: any) => n.schema.includes("project"));
    expect(projectContext.data.project_name).to.be.a('string').that.matches(/^[a-f0-9]{128}$/);
    expect(projectContext.data.project_directory).to.be.a('string').that.matches(/^[a-f0-9]{128}$/);
  })
});
