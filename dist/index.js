"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./utils/http");
var data_structures_1 = require("./utils/data_structures");
var snowplow = require('snowplow-tracker');
var emitter = snowplow.emitter;
var tracker = snowplow.tracker;
var swdcTracker = {};
swdcTracker.initialize = function (swdcApiHost, namespace, appId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, tracker_api_host, e, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, http_1.get(swdcApiHost, "/plugins/config")];
            case 1:
                result = _a.sent();
                tracker_api_host = result.data.tracker_api;
                e = emitter(tracker_api_host);
                swdcTracker.spTracker = tracker([e], namespace, appId, false);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log("swdcTracker failed to initialize", e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
swdcTracker.trackEditorAction = function (_a) {
    var jwt = _a.jwt, entity = _a.entity, type = _a.type, tz_offset_minutes = _a.tz_offset_minutes, file_name = _a.file_name, file_path = _a.file_path, file_syntax = _a.file_syntax, file_line_count = _a.file_line_count, file_character_count = _a.file_character_count, project_name = _a.project_name, project_directory = _a.project_directory, plugin_id = _a.plugin_id, plugin_version = _a.plugin_version;
    var properties = {
        schema: "iglu:com.software/editor_action/jsonschema/1-0-0",
        data: {
            entity: entity,
            type: type,
            tz_offset_minutes: tz_offset_minutes
        }
    };
    var context = [
        data_structures_1.authPayload(jwt),
        data_structures_1.filePayload(file_name, file_path, file_syntax, file_line_count, file_character_count),
        data_structures_1.projectPayload(project_name, project_directory),
        data_structures_1.pluginPayload(plugin_id, plugin_version)
    ];
    swdcTracker.spTracker.trackUnstructEvent(properties, context);
};
swdcTracker.trackCodetime = function (_a) {
    var jwt = _a.jwt, keystrokes = _a.keystrokes, chars_added = _a.chars_added, chars_deleted = _a.chars_deleted, chars_pasted = _a.chars_pasted, pastes = _a.pastes, lines_added = _a.lines_added, lines_deleted = _a.lines_deleted, start_time = _a.start_time, // UTC start timestamp in rfc 3339 format
    end_time = _a.end_time, // UTC end timestamp inrfc 3339 format 
    tz_offset_minutes = _a.tz_offset_minutes, file_name = _a.file_name, file_path = _a.file_path, file_syntax = _a.file_syntax, file_line_count = _a.file_line_count, file_character_count = _a.file_character_count, project_name = _a.project_name, project_directory = _a.project_directory, plugin_id = _a.plugin_id, plugin_version = _a.plugin_version, repo_identifier = _a.repo_identifier, repo_name = _a.repo_name, repo_owner_id = _a.repo_owner_id, repo_git_branch = _a.repo_git_branch, repo_git_tag = _a.repo_git_tag;
    var properties = {
        schema: "iglu:com.software/codetime/jsonschema/1-0-0",
        data: {
            keystrokes: keystrokes,
            chars_added: chars_added,
            chars_deleted: chars_deleted,
            chars_pasted: chars_pasted,
            pastes: pastes,
            lined_added: lines_added,
            lined_deleted: lines_deleted,
            start_time: start_time,
            end_time: end_time,
            tz_offset_minutes: tz_offset_minutes
        }
    };
    var context = [
        data_structures_1.authPayload(jwt),
        data_structures_1.filePayload(file_name, file_path, file_syntax, file_line_count, file_character_count),
        data_structures_1.projectPayload(project_name, project_directory),
        data_structures_1.pluginPayload(plugin_id, plugin_version),
        data_structures_1.repoPayload(repo_identifier, repo_name, repo_owner_id, repo_git_branch, repo_git_tag)
    ];
    swdcTracker.spTracker.trackUnstructEvent(properties, context);
};
exports.default = swdcTracker;
