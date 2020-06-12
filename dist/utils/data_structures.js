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
exports.authPayload = exports.repoPayload = exports.pluginPayload = exports.projectPayload = exports.filePayload = void 0;
var hash_1 = require("./hash");
function filePayload(name, path, syntax, line_count, character_count) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedName, hashedPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hash_1.hashValue(name)];
                case 1:
                    hashedName = _a.sent();
                    return [4 /*yield*/, hash_1.hashValue(path)];
                case 2:
                    hashedPath = _a.sent();
                    return [2 /*return*/, {
                            schema: "iglu:com.software/file/jsonschema/1-0-0",
                            data: {
                                name: hashedName,
                                path: hashedPath,
                                syntax: syntax,
                                line_count: line_count,
                                character_count: character_count
                            }
                        }];
            }
        });
    });
}
exports.filePayload = filePayload;
function projectPayload(name, directory) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedName, hashedDirectory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hash_1.hashValue(name)];
                case 1:
                    hashedName = _a.sent();
                    return [4 /*yield*/, hash_1.hashValue(directory)];
                case 2:
                    hashedDirectory = _a.sent();
                    return [2 /*return*/, {
                            schema: "iglu:com.software/project/jsonschema/1-0-0",
                            data: {
                                name: hashedName,
                                directory: hashedDirectory
                            }
                        }];
            }
        });
    });
}
exports.projectPayload = projectPayload;
function pluginPayload(id, version) {
    return {
        schema: "iglu:com.software/plugin/jsonschema/1-0-0",
        data: {
            id: id,
            version: version
        }
    };
}
exports.pluginPayload = pluginPayload;
function repoPayload(identifier, name, owner_id, git_branch, git_tag) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedName, hashedIdentifier, hashedOwnerId, hashedGitBranch, hashedGitTag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hash_1.hashValue(name)];
                case 1:
                    hashedName = _a.sent();
                    return [4 /*yield*/, hash_1.hashValue(identifier)];
                case 2:
                    hashedIdentifier = _a.sent();
                    return [4 /*yield*/, hash_1.hashValue(owner_id)];
                case 3:
                    hashedOwnerId = _a.sent();
                    return [4 /*yield*/, hash_1.hashValue(git_branch)];
                case 4:
                    hashedGitBranch = _a.sent();
                    return [4 /*yield*/, hash_1.hashValue(git_tag)];
                case 5:
                    hashedGitTag = _a.sent();
                    return [2 /*return*/, {
                            schema: "iglu:com.software/repo/jsonschema/1-0-0",
                            data: {
                                identifier: hashedIdentifier,
                                name: hashedName,
                                owner_id: hashedOwnerId,
                                git_branch: hashedGitBranch,
                                git_tag: hashedGitTag
                            }
                        }];
            }
        });
    });
}
exports.repoPayload = repoPayload;
function authPayload(jwt) {
    return {
        schema: "iglu:com.software/auth/jsonschema/1-0-0",
        data: {
            jwt: jwt
        }
    };
}
exports.authPayload = authPayload;
