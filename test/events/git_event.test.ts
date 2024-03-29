import swdcTracker, { Repo } from "../../src/index";
import { TrackerResponse } from "../../src/utils/response";

const http = require("../../src/utils/http");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

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
    sandbox.stub(http, "post").callsFake(function () {
      return { status: 201 }
    });
    await swdcTracker.initialize("localhost:5005", "codetime", "swdotcom-vscode");
  });

  afterEach(() => {
    sandbox.restore();
  });

  context("with a valid payload", async function() {
    const eventData: any = {
      git_event_type: "uncommitted_change",
      jwt: "JWT 123",
      file_changes: [
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
      expect(props.data.git_event_type).to.equal("uncommitted_change");
    });

    it("has all of the repo properties", async function() {
      await swdcTracker.trackGitEvent(eventData);
      const repoPayload = await new Repo(eventData).buildPayload(eventData.jwt);
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();
      const repoContext = lastProcessedTestEvent.contexts.find((n: any) => n.schema == 'iglu:com.software/repo/jsonschema/1-0-0')

      // use Deep Equality "eql"
      expect(repoContext.data).to.eql(repoPayload.data);
    })

    it("repo_identifier is not undefined", async function() {
      await swdcTracker.trackGitEvent(eventData);
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();
      const repoContext = lastProcessedTestEvent.contexts.find((n: any) => n.schema == 'iglu:com.software/repo/jsonschema/1-0-0')

      expect(repoContext.data.repo_identifier).to.not.equal(undefined);
    })

    it("sets multiple file_change entities", async function () {
      await swdcTracker.trackGitEvent(eventData);
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();
      const contexts = lastProcessedTestEvent.contexts;
      // get the plugin context
      const fileChangeContexts: any = contexts.filter((n: any) => n.schema.includes("file_change"));

      expect(fileChangeContexts.length).to.equal(2);
    });

    it("sets the correct attributes in the file_change entity", async function () {
      await swdcTracker.trackGitEvent(eventData);
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();
      const contexts = lastProcessedTestEvent.contexts;
      // get the plugin context
      const fileChangeContext: any = contexts.find((n: any) => n.schema.includes("file_change"));
      expect(Object.keys(fileChangeContext.data)).to.eql(['file_name', 'insertions', 'deletions']);
    });

    it("does not encrypt the file_change file_names", async function() {
      // Purposely leaving out fields so that we can make sure that
      // POST /user_encrypted_data is not called for file changes.
      const eventData = {
        git_event_type: "uncommitted_change",
        jwt: "JWT 123",
        file_changes: [
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
        ]
      }
      await swdcTracker.trackGitEvent(eventData);

      expect(http.post).to.not.have
        .been.calledWith("/user_encrypted_data", sinon.match.any, sinon.match.any)
    });
  });
});
