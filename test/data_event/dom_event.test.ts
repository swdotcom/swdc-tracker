import swdcTracker from "../../src/index";

const http = require("../../src/utils/http");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("Test data event functions", function () {

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
    await swdcTracker.initialize("api.software.com", "event_data", "swdotcom-vscode");
  });

  it("Validate creating a data event payload", async function () {

    const now = new Date();
    const ts = Math.round(now.getTime() / 1000);
    const tz_offset_minutes = 420;

    const eventData = {
      type: "mouse",
      name: "click",
      description: "TreeViewExpand",
      timestamp: ts,
      timestamp_local: ts - tz_offset_minutes,
      tz_offset_minutes,
      timezone: "America/Los_Angeles",
      pluginId: 2,
      os: "Darwin",
      version: "2.1.20",
      hostname: "MacOs-User1",
    };
    const payloadData = await swdcTracker.trackDomEvent("JWT 123", eventData);
    const props = payloadData.properties;
    const contexts = payloadData.contexts;
    expect(props.schema).to.include("code_event");
    expect(props.data.type).to.equal("mouse");
    expect(contexts.length).to.equal(2);
  })
});