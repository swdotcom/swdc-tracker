import swdcTracker from "../../src/index";
import { TrackerResponse } from "../../src/utils/response";

const http = require("../../src/utils/http");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("Test git_event functions", function () {

  const sandbox = sinon.createSandbox();

  beforeEach(async () => {
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

  afterEach(() => {
    sandbox.restore();
  });

  context("with a valid payload", async function() {
    const eventData = {
      git_event: "uncommitted_change",
      jwt: "JWT 123",
      uncommitted_changes: [
        {
          file_name: "/db/migration/new.rb",
          insertions: 23,
          deletions: 0
        },
        {
          file_name: "/app/models/user.rb",
          insertions: 2,
          deletions: 15
        }
      ],
      plugin_id: 4,
      plugin_name: "code-time",
      plugin_version: "2.1.999",
      project_name: "foo",
      project_directory: "baz",
      repo_name: "my_repo",
      repo_identifier: "git@github.com:swdotcom/rails_app",
      git_branch: "main",
      git_tag: "head"
    };

    it("returns a 200", async function () {
      const response: TrackerResponse = await swdcTracker.trackGitEvent(eventData);

      expect(response.status).to.equal(200);
    });
    it("sets the git_event property", async function () {
      await swdcTracker.trackGitEvent(eventData);
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();
      const props = lastProcessedTestEvent.properties;
      expect(props.schema).to.include("git_event");
      expect(props.data.git_event).to.equal("uncommitted_change");
    });

    it("sets multiple uncommitted_change entities", async function () {
      await swdcTracker.trackGitEvent(eventData);
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();
      const contexts = lastProcessedTestEvent.contexts;
      // get the plugin context
      const uncommittedChangesContexts: any = contexts.filter((n: any) => n.schema.includes("uncommitted_change"));
      expect(uncommittedChangesContexts.length).to.equal(2);
    });

    it("sets the correct attributes in the uncommitted_change entity", async function () {
      await swdcTracker.trackGitEvent(eventData);
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();
      const contexts = lastProcessedTestEvent.contexts;
      // get the plugin context
      const uncommittedChangesContext: any = contexts.find((n: any) => n.schema.includes("uncommitted_change"));
      expect(Object.keys(uncommittedChangesContext.data)).to.eql(['file_name', 'insertions','deletions']);
    });
  });
});
