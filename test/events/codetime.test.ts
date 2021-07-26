import swdcTracker, { CodeTime } from "../../src/index";
import { TrackerResponse } from "../../src/utils/response";

const hash = require("object-hash");
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
    sandbox.stub(http, "post").callsFake(function () {
      return { status: 201 }
    });
    await swdcTracker.initialize("localhost:5005", "codetime", "swdotcom-vscode");
  });

  after(() => {
    sandbox.restore();
  });

  it("Validate creating a codetime payload", async function () {
    const eventData = {
      jwt: "JWT 123",
      keystrokes: 20,
      lines_added: 2,
      lines_deleted: 3,
      characters_added: 111,
      characters_deleted: 10,
      single_deletes: 9,
      multi_deletes: 1,
      single_adds: 100,
      multi_adds: 12,
      auto_indents: 14,
      replacements: 99,
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
    expect(props.data.lines_added).to.equal(2);
    expect(props.data.lines_deleted).to.equal(3);
    expect(props.data.characters_added).to.equal(111);
    expect(props.data.characters_deleted).to.equal(10);
    expect(props.data.single_deletes).to.equal(9);
    expect(props.data.multi_deletes).to.equal(1);
    expect(props.data.single_adds).to.equal(100);
    expect(props.data.multi_adds).to.equal(12);
    expect(props.data.auto_indents).to.equal(14);
    expect(props.data.replacements).to.equal(99);
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
  });

  it("Stores the code time params to reconcile", async function () {
    const eventData: any = {
      jwt: "JWT 456",
      keystrokes: 20,
      lines_added: 2,
      lines_deleted: 3,
      characters_added: 111,
      characters_deleted: 10,
      single_deletes: 9,
      multi_deletes: 1,
      single_adds: 100,
      multi_adds: 12,
      auto_indents: 14,
      replacements: 99,
      start_time: "2021-07-29T01:04:03Z",
      end_time: "2021-07-29T01:04:20Z",
      plugin_id: 4,
      plugin_name: "code-time",
      plugin_version: "2.2.0",
      project_name: "foo",
      project_directory: "baz"
    };

    const codetimePayload: any = new CodeTime(eventData).buildPayload();
    const payloadHash = hash(codetimePayload);

    await swdcTracker.trackCodeTimeEvent(eventData);
    const outgoingPayload = swdcTracker.getOutgoingParamsData("codetime_event", payloadHash);

    expect(outgoingPayload.jwt).to.eq(eventData.jwt);
    expect(outgoingPayload.end_time).to.eq(eventData.end_time);
  });
});
