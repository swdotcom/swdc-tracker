import swdcTracker, { VSCodeExtensionEvent } from '../../src/index';
import { TrackerResponse } from '../../src/utils/response';

const http = require('../../src/utils/http');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('VSCode Extension Event', function () {
  const sandbox = sinon.createSandbox();

  before(async () => {
    // return any api since we're not really trying to call out
    sandbox.stub(http, 'get').callsFake(function () {
      return {
        data: {
          tracker_api: 'localhost',
        },
      };
    });
    await swdcTracker.initialize('localhost:5005', 'codetime', 'swdotcom-vscode');
  });

  after(() => {
    sandbox.restore();
  });

  let baseData = {
    jwt: 'JWT 123',
    tz_offset_minutes: 420,
    plugin_id: 2,
    plugin_name: 'code-time',
    plugin_version: '2.1.20',
    editor_name: 'vscode',
    editor_version: '1.61.0'
  }
  context('when creating a vscode_extension_event', async function () {
    const eventData = {
      ...baseData,
      action: 'installed',
      event_at: '2023-02-13T04:00:00Z',
      os: 'Darwin_22.1.0_darwin',
      vscode_extension: {
        id: 'softwaredotcom.swdc-vscode',
        publisher: 'softwaredotcom',
        name: 'swdc-vscode',
        display_name: 'Code Time',
        author: 'Software.com',
        version: '2.6.44',
        description: 'Code Time is an open source plugin that provides programming metrics right in Visual Studio Code.',
        categories: ["Other"],
        extension_kind: ["ui", "workspace"]
      }
    };

    it('returns a 200 status', async function () {
      const response: TrackerResponse = await swdcTracker.trackVSCodeExtension(eventData);
      expect(response.status).to.equal(200);
    });

    it("has all of the vscode extension event properties", async function() {
      await swdcTracker.trackVSCodeExtension(eventData);
      const extensionPayload = await new VSCodeExtensionEvent(eventData).buildPayload();
      const lastProcessedTestEvent = swdcTracker.getLastProcessedTestEvent();

      // use Deep Equality "eql"
      expect(lastProcessedTestEvent.properties).to.eql(extensionPayload);
    })

    it("has all of the vscode extension entity properties", async function() {
      await swdcTracker.trackVSCodeExtension(eventData);
      const contexts = swdcTracker.getLastProcessedTestEvent().contexts;
      const vscodeExtensionContext: any = contexts.find((n: any) => n.schema.includes('vscode_extension'));

      expect(vscodeExtensionContext.data).to.eql(
        {
          id: 'softwaredotcom.swdc-vscode',
          publisher: 'softwaredotcom',
          name: 'swdc-vscode',
          display_name: 'Code Time',
          author: 'Software.com',
          version: '2.6.44',
          description: 'Code Time is an open source plugin that provides programming metrics right in Visual Studio Code.',
          categories: [ 'Other' ],
          extension_kind: [ 'ui', 'workspace' ]
        }
      );
    })

    it("has the auth context", async function() {
      await swdcTracker.trackVSCodeExtension(eventData);
      const contexts = swdcTracker.getLastProcessedTestEvent().contexts;
      const auth: any = contexts.find((n: any) => n.schema.includes('auth'));

      expect(auth.data).to.eql({ "jwt": "JWT 123" });
    })
  });
});
