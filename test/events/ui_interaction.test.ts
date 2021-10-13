import swdcTracker from '../../src/index';
import {TrackerResponse} from '../../src/utils/response';
import {CodeTime} from '../../src/events/codetime';

const http = require('../../src/utils/http');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('UI Interaction Event', function () {
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
  context('when creating a ui_interaction event', async function () {
    const eventData = {
      jwt: 'JWT 123',
      interaction_type: 'click',
      element_name: 'ct_summary_btn',
      element_location: 'ct_menu_tree',
      color: 'purple',
      icon_name: 'guage',
      cta_text: 'View Summary',
      tz_offset_minutes: 420,
      plugin_id: 2,
      plugin_name: 'code-time',
      plugin_version: '2.1.20',
      editor_name: 'vscode',
      editor_version: '1.61.0',
    };

    it('returns a 200 status', async function () {
      const response: TrackerResponse = await swdcTracker.trackUIInteraction(eventData);
      expect(response.status).to.equal(200);
    });

    it('creates an event with the ui_interaction schema', async function () {
      await swdcTracker.trackUIInteraction(eventData);
      const props = swdcTracker.getLastProcessedTestEvent().properties;

      expect(props.schema).to.include('ui_interaction');
    });

    it('creates an event with the supplied interaction_type', async function () {
      await swdcTracker.trackUIInteraction(eventData);
      const props = swdcTracker.getLastProcessedTestEvent().properties;

      expect(props.data.interaction_type).to.equal(eventData.interaction_type);
    });

    it('creates a plugin context with the supplied plugin attributes', async function () {
      await swdcTracker.trackUIInteraction(eventData);
      const contexts = swdcTracker.getLastProcessedTestEvent().contexts;
      const pluginContext: any = contexts.find((n: any) => n.schema.includes('plugin'));

      expect(eventData).to.include(pluginContext.data);
    });

    it('creates a ui_element context with the supplied ui_element attributes', async function () {
      await swdcTracker.trackUIInteraction(eventData);
      const contexts = swdcTracker.getLastProcessedTestEvent().contexts;
      const ui_elementContext: any = contexts.find((n: any) => n.schema.includes('ui_element'));

      expect(eventData).to.include(ui_elementContext.data);
    });
  });

  it('does not create a codetime payload', async function () {
    const eventData: any = {
      jwt: 'JWT 123',
      interaction_type: 'execute_command',
      element_name: 'tree_view_summary_button',
      element_location: 'tree',
      tz_offset_minutes: 420,
      plugin_id: 2,
      plugin_name: 'code-time',
      plugin_version: '2.1.20',
    };

    // needs to have start and end time
    expect(CodeTime.hasData(eventData)).to.be.undefined;
  });
});
