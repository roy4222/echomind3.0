var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb2, mod) => function __require() {
  return mod || (0, cb2[__getOwnPropNames(cb2)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .wrangler/tmp/bundle-tOsIuT/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-tOsIuT/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = /* @__PURE__ */ __name(function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    }, "getAllMatches");
    var isName = /* @__PURE__ */ __name(function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    }, "isName");
    exports.isExist = function(v2) {
      return typeof v2 !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a2, arrayMode) {
      if (a2) {
        const keys = Object.keys(a2);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          if (arrayMode === "strict") {
            target[keys[i2]] = [a2[keys[i2]]];
          } else {
            target[keys[i2]] = a2[keys[i2]];
          }
        }
      }
    };
    exports.getValue = function(v2) {
      if (exports.isExist(v2)) {
        return v2;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
          i2 += 2;
          i2 = readPI(xmlData, i2);
          if (i2.err) return i2;
        } else if (xmlData[i2] === "<") {
          let tagStartPos = i2;
          i2++;
          if (xmlData[i2] === "!") {
            i2 = readCommentAndCDATA(xmlData, i2);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i2] === "/") {
              closingTag = true;
              i2++;
            }
            let tagName = "";
            for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
              tagName += xmlData[i2];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i2--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
            }
            const result = readAttributeStr(xmlData, i2);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
            }
            let attrStr = result.value;
            i2 = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i2 - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else if (tags.length === 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i2++; i2 < xmlData.length; i2++) {
              if (xmlData[i2] === "<") {
                if (xmlData[i2 + 1] === "!") {
                  i2++;
                  i2 = readCommentAndCDATA(xmlData, i2);
                  continue;
                } else if (xmlData[i2 + 1] === "?") {
                  i2 = readPI(xmlData, ++i2);
                  if (i2.err) return i2;
                } else {
                  break;
                }
              } else if (xmlData[i2] === "&") {
                const afterAmp = validateAmpersand(xmlData, i2);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
                i2 = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i2])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i2));
                }
              }
            }
            if (xmlData[i2] === "<") {
              i2--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i2])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t2) => t2.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    __name(isWhiteSpace, "isWhiteSpace");
    function readPI(xmlData, i2) {
      const start = i2;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] == "?" || xmlData[i2] == " ") {
          const tagname = xmlData.substr(start, i2 - start);
          if (i2 > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
          } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
            i2++;
            break;
          } else {
            continue;
          }
        }
      }
      return i2;
    }
    __name(readPI, "readPI");
    function readCommentAndCDATA(xmlData, i2) {
      if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
        for (i2 += 3; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
        let angleBracketsCount = 1;
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i2] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      }
      return i2;
    }
    __name(readCommentAndCDATA, "readCommentAndCDATA");
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i2) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i2];
          } else if (startChar !== xmlData[i2]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i2] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i2];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i2,
        tagClosed
      };
    }
    __name(readAttributeStr, "readAttributeStr");
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i2 = 0; i2 < matches.length; i2++) {
        if (matches[i2][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(matches[i2]));
        } else if (matches[i2][3] !== void 0 && matches[i2][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' is without value.", getPositionFromMatch(matches[i2]));
        } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(matches[i2]));
        }
        const attrName = matches[i2][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i2]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i2]));
        }
      }
      return true;
    }
    __name(validateAttributeString, "validateAttributeString");
    function validateNumberAmpersand(xmlData, i2) {
      let re = /\d/;
      if (xmlData[i2] === "x") {
        i2++;
        re = /[\da-fA-F]/;
      }
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === ";")
          return i2;
        if (!xmlData[i2].match(re))
          break;
      }
      return -1;
    }
    __name(validateNumberAmpersand, "validateNumberAmpersand");
    function validateAmpersand(xmlData, i2) {
      i2++;
      if (xmlData[i2] === ";")
        return -1;
      if (xmlData[i2] === "#") {
        i2++;
        return validateNumberAmpersand(xmlData, i2);
      }
      let count = 0;
      for (; i2 < xmlData.length; i2++, count++) {
        if (xmlData[i2].match(/\w/) && count < 20)
          continue;
        if (xmlData[i2] === ";")
          break;
        return -1;
      }
      return i2;
    }
    __name(validateAmpersand, "validateAmpersand");
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    __name(getErrorObject, "getErrorObject");
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    __name(validateAttrName, "validateAttrName");
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    __name(validateTagName, "validateTagName");
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    __name(getLineNumberForPosition, "getLineNumberForPosition");
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
    __name(getPositionFromMatch, "getPositionFromMatch");
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: /* @__PURE__ */ __name(function(tagName, val2) {
        return val2;
      }, "tagValueProcessor"),
      attributeValueProcessor: /* @__PURE__ */ __name(function(attrName, val2) {
        return val2;
      }, "attributeValueProcessor"),
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: /* @__PURE__ */ __name(() => false, "isArray"),
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: /* @__PURE__ */ __name(function(tagName, jPath, attrs) {
        return tagName;
      }, "updateTag")
      // skipEmptyListItem: false
    };
    var buildOptions = /* @__PURE__ */ __name(function(options) {
      return Object.assign({}, defaultOptions, options);
    }, "buildOptions");
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var XmlNode2 = class {
      static {
        __name(this, "XmlNode");
      }
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val2) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({ [key]: val2 });
      }
      addChild(node) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module.exports = XmlNode2;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var util = require_util();
    function readDocType(xmlData, i2) {
      const entities = {};
      if (xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "C" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "Y" && xmlData[i2 + 7] === "P" && xmlData[i2 + 8] === "E") {
        i2 = i2 + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<" && !comment) {
            if (hasBody && isEntity(xmlData, i2)) {
              i2 += 7;
              [entityName, val, i2] = readEntityExp(xmlData, i2 + 1);
              if (val.indexOf("&") === -1)
                entities[validateEntityName(entityName)] = {
                  regx: RegExp(`&${entityName};`, "g"),
                  val
                };
            } else if (hasBody && isElement(xmlData, i2)) i2 += 8;
            else if (hasBody && isAttlist(xmlData, i2)) i2 += 8;
            else if (hasBody && isNotation(xmlData, i2)) i2 += 9;
            else if (isComment) comment = true;
            else throw new Error("Invalid DOCTYPE");
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i2] === ">") {
            if (comment) {
              if (xmlData[i2 - 1] === "-" && xmlData[i2 - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i2] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i2];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i: i2 };
    }
    __name(readDocType, "readDocType");
    function readEntityExp(xmlData, i2) {
      let entityName2 = "";
      for (; i2 < xmlData.length && (xmlData[i2] !== "'" && xmlData[i2] !== '"'); i2++) {
        entityName2 += xmlData[i2];
      }
      entityName2 = entityName2.trim();
      if (entityName2.indexOf(" ") !== -1) throw new Error("External entites are not supported");
      const startChar = xmlData[i2++];
      let val2 = "";
      for (; i2 < xmlData.length && xmlData[i2] !== startChar; i2++) {
        val2 += xmlData[i2];
      }
      return [entityName2, val2, i2];
    }
    __name(readEntityExp, "readEntityExp");
    function isComment(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "-" && xmlData[i2 + 3] === "-") return true;
      return false;
    }
    __name(isComment, "isComment");
    function isEntity(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "N" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "I" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "Y") return true;
      return false;
    }
    __name(isEntity, "isEntity");
    function isElement(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "L" && xmlData[i2 + 4] === "E" && xmlData[i2 + 5] === "M" && xmlData[i2 + 6] === "E" && xmlData[i2 + 7] === "N" && xmlData[i2 + 8] === "T") return true;
      return false;
    }
    __name(isElement, "isElement");
    function isAttlist(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "A" && xmlData[i2 + 3] === "T" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "L" && xmlData[i2 + 6] === "I" && xmlData[i2 + 7] === "S" && xmlData[i2 + 8] === "T") return true;
      return false;
    }
    __name(isAttlist, "isAttlist");
    function isNotation(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "N" && xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "A" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "I" && xmlData[i2 + 8] === "O" && xmlData[i2 + 9] === "N") return true;
      return false;
    }
    __name(isNotation, "isNotation");
    function validateEntityName(name) {
      if (util.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    __name(validateEntityName, "validateEntityName");
    module.exports = readDocType;
  }
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/strnum/strnum.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
    var consider = {
      hex: true,
      // oct: false,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string") return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
      else if (str === "0") return 0;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return parse_int(trimmedStr, 16);
      } else if (trimmedStr.search(/[eE]/) !== -1) {
        const notation = trimmedStr.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
        if (notation) {
          if (options.leadingZeros) {
            trimmedStr = (notation[1] || "") + notation[3];
          } else {
            if (notation[2] === "0" && notation[3][0] === ".") {
            } else {
              return str;
            }
          }
          return options.eNotation ? Number(trimmedStr) : str;
        } else {
          return str;
        }
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
          else if (options.leadingZeros && leadingZeros === str) return 0;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation) return num;
              else return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "") return num;
              else if (numStr === numTrimmedByZeros) return num;
              else if (sign && numStr === "-" + numTrimmedByZeros) return num;
              else return str;
            }
            if (leadingZeros) {
              return numTrimmedByZeros === numStr || sign + numTrimmedByZeros === numStr ? num : str;
            } else {
              return trimmedStr === numStr || trimmedStr === sign + numStr ? num : str;
            }
          }
        } else {
          return str;
        }
      }
    }
    __name(toNumber, "toNumber");
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".") numStr = "0";
        else if (numStr[0] === ".") numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    __name(trimZeros, "trimZeros");
    function parse_int(numStr, base) {
      if (parseInt) return parseInt(numStr, base);
      else if (Number.parseInt) return Number.parseInt(numStr, base);
      else if (window && window.parseInt) return window.parseInt(numStr, base);
      else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
    }
    __name(parse_int, "parse_int");
    module.exports = toNumber;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var OrderedObjParser = class {
      static {
        __name(this, "OrderedObjParser");
      }
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
          "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
          "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
          "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
          "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
          "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
          "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
          "num_dec": { regex: /&#([0-9]{1,7});/g, val: /* @__PURE__ */ __name((_, str) => String.fromCharCode(Number.parseInt(str, 10)), "val") },
          "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: /* @__PURE__ */ __name((_, str) => String.fromCharCode(Number.parseInt(str, 16)), "val") }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i2 = 0; i2 < entKeys.length; i2++) {
        const ent = entKeys[i2];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    __name(addExternalEntities, "addExternalEntities");
    function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val2 !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val2 = val2.trim();
        }
        if (val2.length > 0) {
          if (!escapeEntities) val2 = this.replaceEntitiesValue(val2);
          const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val2;
          } else if (typeof newval !== typeof val2 || newval !== val2) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val2.trim();
            if (trimmedVal === val2) {
              return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val2;
            }
          }
        }
      }
    }
    __name(parseTextData, "parseTextData");
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    __name(resolveNameSpace, "resolveNameSpace");
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (!this.options.ignoreAttributes && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i2 = 0; i2 < len; i2++) {
          const attrName = this.resolveNameSpace(matches[i2][1]);
          let oldVal = matches[i2][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__") aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    __name(buildAttributesMap, "buildAttributesMap");
    var parseXml = /* @__PURE__ */ __name(function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        const ch2 = xmlData[i2];
        if (ch2 === "<") {
          if (xmlData[i2 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i2 = closeIndex;
          } else if (xmlData[i2 + 1] === "?") {
            let tagData = readTagExp(xmlData, i2, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath);
            }
            i2 = tagData.closeIndex + 1;
          } else if (xmlData.substr(i2 + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i2 + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i2 + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i2 = endIndex;
          } else if (xmlData.substr(i2 + 1, 2) === "!D") {
            const result = readDocType(xmlData, i2);
            this.docTypeEntities = result.entities;
            i2 = result.i;
          } else if (xmlData.substr(i2 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i2 + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
            if (val2 == void 0) val2 = "";
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              currentNode.add(this.options.textNodeName, val2);
            }
            i2 = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i2, this.options.removeNSPrefix);
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                i2 = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i2 = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                i2 = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i2 = closeIndex;
            }
          }
        } else {
          textData += xmlData[i2];
        }
      }
      return xmlObj.child;
    }, "parseXml");
    function addChild(currentNode, childNode, jPath) {
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode);
      } else {
        currentNode.addChild(childNode);
      }
    }
    __name(addChild, "addChild");
    var replaceEntitiesValue = /* @__PURE__ */ __name(function(val2) {
      if (this.options.processEntities) {
        for (let entityName2 in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName2];
          val2 = val2.replace(entity.regx, entity.val);
        }
        for (let entityName2 in this.lastEntities) {
          const entity = this.lastEntities[entityName2];
          val2 = val2.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName2 in this.htmlEntities) {
            const entity = this.htmlEntities[entityName2];
            val2 = val2.replace(entity.regex, entity.val);
          }
        }
        val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val2;
    }, "replaceEntitiesValue");
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0) isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    __name(saveTextToParentTag, "saveTextToParentTag");
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
      }
      return false;
    }
    __name(isItStopNode, "isItStopNode");
    function tagExpWithClosingIndex(xmlData, i2, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i2; index < xmlData.length; index++) {
        let ch2 = xmlData[index];
        if (attrBoundary) {
          if (ch2 === attrBoundary) attrBoundary = "";
        } else if (ch2 === '"' || ch2 === "'") {
          attrBoundary = ch2;
        } else if (ch2 === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch2 === "	") {
          ch2 = " ";
        }
        tagExp += ch2;
      }
    }
    __name(tagExpWithClosingIndex, "tagExpWithClosingIndex");
    function findClosingIndex(xmlData, str, i2, errMsg) {
      const closingIndex = xmlData.indexOf(str, i2);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    __name(findClosingIndex, "findClosingIndex");
    function readTagExp(xmlData, i2, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i2 + 1, closingChar);
      if (!result) return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substring(0, separatorIndex);
        tagExp = tagExp.substring(separatorIndex + 1).trimStart();
      }
      const rawTagName = tagName;
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent,
        rawTagName
      };
    }
    __name(readTagExp, "readTagExp");
    function readStopNodeData(xmlData, tagName, i2) {
      const startIndex = i2;
      let openTagCount = 1;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<") {
          if (xmlData[i2 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i2 + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i2),
                  i: closeIndex
                };
              }
            }
            i2 = closeIndex;
          } else if (xmlData[i2 + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i2 + 1, "StopNode is not closed.");
            i2 = closeIndex;
          } else if (xmlData.substr(i2 + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i2 + 3, "StopNode is not closed.");
            i2 = closeIndex;
          } else if (xmlData.substr(i2 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i2, "StopNode is not closed.") - 2;
            i2 = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i2, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i2 = tagData.closeIndex;
            }
          }
        }
      }
    }
    __name(readStopNodeData, "readStopNodeData");
    function parseValue(val2, shouldParse, options) {
      if (shouldParse && typeof val2 === "string") {
        const newval = val2.trim();
        if (newval === "true") return true;
        else if (newval === "false") return false;
        else return toNumber(val2, options);
      } else {
        if (util.isExist(val2)) {
          return val2;
        } else {
          return "";
        }
      }
    }
    __name(parseValue, "parseValue");
    module.exports = OrderedObjParser;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    function prettify(node, options) {
      return compress(node, options);
    }
    __name(prettify, "prettify");
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i2 = 0; i2 < arr.length; i2++) {
        const tagObj = arr[i2];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0) newJpath = property;
        else newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0) text = tagObj[property];
          else text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val2 = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val2, options);
          if (tagObj[":@"]) {
            assignAttributes(val2, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val2 = val2[options.textNodeName];
          } else if (Object.keys(val2).length === 0) {
            if (options.alwaysCreateTextNode) val2[options.textNodeName] = "";
            else val2 = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val2);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val2];
            } else {
              compressedObj[property] = val2;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0) compressedObj[options.textNodeName] = text;
      } else if (text !== void 0) compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    __name(compress, "compress");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i2 = 0; i2 < keys.length; i2++) {
        const key = keys[i2];
        if (key !== ":@") return key;
      }
    }
    __name(propName, "propName");
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          const atrrName = keys[i2];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    __name(assignAttributes, "assignAttributes");
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    __name(isLeafTag, "isLeafTag");
    exports.prettify = prettify;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      static {
        __name(this, "XMLParser");
      }
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module.exports = XMLParser2;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    __name(toXml, "toXml");
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i2 = 0; i2 < arr.length; i2++) {
        const tagObj = arr[i2];
        const tagName = propName(tagObj);
        if (tagName === void 0) continue;
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName;
        else newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
          else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    __name(arrToStr, "arrToStr");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i2 = 0; i2 < keys.length; i2++) {
        const key = keys[i2];
        if (!obj.hasOwnProperty(key)) continue;
        if (key !== ":@") return key;
      }
    }
    __name(propName, "propName");
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          if (!attrMap.hasOwnProperty(attr)) continue;
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    __name(attr_to_str, "attr_to_str");
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
      }
      return false;
    }
    __name(isStopNode, "isStopNode");
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i2 = 0; i2 < options.entities.length; i2++) {
          const entity = options.entities[i2];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    __name(replaceEntitiesValue, "replaceEntitiesValue");
    module.exports = toXml;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var buildFromOrderedJs = require_orderedJs2Xml();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: /* @__PURE__ */ __name(function(key, a2) {
        return a2;
      }, "tagValueProcessor"),
      attributeValueProcessor: /* @__PURE__ */ __name(function(attrName, a2) {
        return a2;
      }, "attributeValueProcessor"),
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    __name(Builder, "Builder");
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val2 = "";
      for (let key in jObj) {
        if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
        if (typeof jObj[key] === "undefined") {
          if (this.isAttribute(key)) {
            val2 += "";
          }
        } else if (jObj[key] === null) {
          if (this.isAttribute(key)) {
            val2 += "";
          } else if (key[0] === "?") {
            val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          } else {
            val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else if (jObj[key] instanceof Date) {
          val2 += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val2 += this.replaceEntitiesValue(newval);
            } else {
              val2 += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          let listTagAttr = "";
          for (let j2 = 0; j2 < arrLen; j2++) {
            const item = jObj[key][j2];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?") val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                const result = this.j2x(item, level + 1);
                listTagVal += result.val;
                if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                  listTagAttr += result.attrStr;
                }
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level);
              }
            } else {
              if (this.options.oneListGroup) {
                let textValue = this.options.tagValueProcessor(key, item);
                textValue = this.replaceEntitiesValue(textValue);
                listTagVal += textValue;
              } else {
                listTagVal += this.buildTextValNode(item, key, "", level);
              }
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
          }
          val2 += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L2 = Ks.length;
            for (let j2 = 0; j2 < L2; j2++) {
              attrStr += this.buildAttrPairStr(Ks[j2], "" + jObj[key][Ks[j2]]);
            }
          } else {
            val2 += this.processTextOrObjNode(jObj[key], key, level);
          }
        }
      }
      return { attrStr, val: val2 };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val2) {
      val2 = this.options.attributeValueProcessor(attrName, "" + val2);
      val2 = this.replaceEntitiesValue(val2);
      if (this.options.suppressBooleanAttributes && val2 === "true") {
        return " " + attrName;
      } else return " " + attrName + '="' + val2 + '"';
    };
    function processTextOrObjNode(object, key, level) {
      const result = this.j2x(object, level + 1);
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    __name(processTextOrObjNode, "processTextOrObjNode");
    Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
      if (val2 === "") {
        if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if ((attrStr || attrStr === "") && val2.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val2}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode) closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val2}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val2}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val2);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i2 = 0; i2 < this.options.entities.length; i2++) {
          const entity = this.options.entities[i2];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    __name(indentate, "indentate");
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    __name(isAttribute, "isAttribute");
    module.exports = Builder;
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/fast-xml-parser/src/fxp.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// node_modules/bowser/es5.js
var require_es5 = __commonJS({
  "node_modules/bowser/es5.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    !function(e2, t2) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t2() : "function" == typeof define && define.amd ? define([], t2) : "object" == typeof exports ? exports.bowser = t2() : e2.bowser = t2();
    }(exports, function() {
      return function(e2) {
        var t2 = {};
        function r2(n2) {
          if (t2[n2]) return t2[n2].exports;
          var i2 = t2[n2] = { i: n2, l: false, exports: {} };
          return e2[n2].call(i2.exports, i2, i2.exports, r2), i2.l = true, i2.exports;
        }
        __name(r2, "r");
        return r2.m = e2, r2.c = t2, r2.d = function(e3, t3, n2) {
          r2.o(e3, t3) || Object.defineProperty(e3, t3, { enumerable: true, get: n2 });
        }, r2.r = function(e3) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e3, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e3, "__esModule", { value: true });
        }, r2.t = function(e3, t3) {
          if (1 & t3 && (e3 = r2(e3)), 8 & t3) return e3;
          if (4 & t3 && "object" == typeof e3 && e3 && e3.__esModule) return e3;
          var n2 = /* @__PURE__ */ Object.create(null);
          if (r2.r(n2), Object.defineProperty(n2, "default", { enumerable: true, value: e3 }), 2 & t3 && "string" != typeof e3) for (var i2 in e3) r2.d(n2, i2, function(t4) {
            return e3[t4];
          }.bind(null, i2));
          return n2;
        }, r2.n = function(e3) {
          var t3 = e3 && e3.__esModule ? function() {
            return e3.default;
          } : function() {
            return e3;
          };
          return r2.d(t3, "a", t3), t3;
        }, r2.o = function(e3, t3) {
          return Object.prototype.hasOwnProperty.call(e3, t3);
        }, r2.p = "", r2(r2.s = 90);
      }({ 17: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.default = void 0;
        var n2 = r2(18), i2 = function() {
          function e3() {
          }
          __name(e3, "e");
          return e3.getFirstMatch = function(e4, t3) {
            var r3 = t3.match(e4);
            return r3 && r3.length > 0 && r3[1] || "";
          }, e3.getSecondMatch = function(e4, t3) {
            var r3 = t3.match(e4);
            return r3 && r3.length > 1 && r3[2] || "";
          }, e3.matchAndReturnConst = function(e4, t3, r3) {
            if (e4.test(t3)) return r3;
          }, e3.getWindowsVersionName = function(e4) {
            switch (e4) {
              case "NT":
                return "NT";
              case "XP":
                return "XP";
              case "NT 5.0":
                return "2000";
              case "NT 5.1":
                return "XP";
              case "NT 5.2":
                return "2003";
              case "NT 6.0":
                return "Vista";
              case "NT 6.1":
                return "7";
              case "NT 6.2":
                return "8";
              case "NT 6.3":
                return "8.1";
              case "NT 10.0":
                return "10";
              default:
                return;
            }
          }, e3.getMacOSVersionName = function(e4) {
            var t3 = e4.split(".").splice(0, 2).map(function(e5) {
              return parseInt(e5, 10) || 0;
            });
            if (t3.push(0), 10 === t3[0]) switch (t3[1]) {
              case 5:
                return "Leopard";
              case 6:
                return "Snow Leopard";
              case 7:
                return "Lion";
              case 8:
                return "Mountain Lion";
              case 9:
                return "Mavericks";
              case 10:
                return "Yosemite";
              case 11:
                return "El Capitan";
              case 12:
                return "Sierra";
              case 13:
                return "High Sierra";
              case 14:
                return "Mojave";
              case 15:
                return "Catalina";
              default:
                return;
            }
          }, e3.getAndroidVersionName = function(e4) {
            var t3 = e4.split(".").splice(0, 2).map(function(e5) {
              return parseInt(e5, 10) || 0;
            });
            if (t3.push(0), !(1 === t3[0] && t3[1] < 5)) return 1 === t3[0] && t3[1] < 6 ? "Cupcake" : 1 === t3[0] && t3[1] >= 6 ? "Donut" : 2 === t3[0] && t3[1] < 2 ? "Eclair" : 2 === t3[0] && 2 === t3[1] ? "Froyo" : 2 === t3[0] && t3[1] > 2 ? "Gingerbread" : 3 === t3[0] ? "Honeycomb" : 4 === t3[0] && t3[1] < 1 ? "Ice Cream Sandwich" : 4 === t3[0] && t3[1] < 4 ? "Jelly Bean" : 4 === t3[0] && t3[1] >= 4 ? "KitKat" : 5 === t3[0] ? "Lollipop" : 6 === t3[0] ? "Marshmallow" : 7 === t3[0] ? "Nougat" : 8 === t3[0] ? "Oreo" : 9 === t3[0] ? "Pie" : void 0;
          }, e3.getVersionPrecision = function(e4) {
            return e4.split(".").length;
          }, e3.compareVersions = function(t3, r3, n3) {
            void 0 === n3 && (n3 = false);
            var i3 = e3.getVersionPrecision(t3), s2 = e3.getVersionPrecision(r3), a2 = Math.max(i3, s2), o2 = 0, u2 = e3.map([t3, r3], function(t4) {
              var r4 = a2 - e3.getVersionPrecision(t4), n4 = t4 + new Array(r4 + 1).join(".0");
              return e3.map(n4.split("."), function(e4) {
                return new Array(20 - e4.length).join("0") + e4;
              }).reverse();
            });
            for (n3 && (o2 = a2 - Math.min(i3, s2)), a2 -= 1; a2 >= o2; ) {
              if (u2[0][a2] > u2[1][a2]) return 1;
              if (u2[0][a2] === u2[1][a2]) {
                if (a2 === o2) return 0;
                a2 -= 1;
              } else if (u2[0][a2] < u2[1][a2]) return -1;
            }
          }, e3.map = function(e4, t3) {
            var r3, n3 = [];
            if (Array.prototype.map) return Array.prototype.map.call(e4, t3);
            for (r3 = 0; r3 < e4.length; r3 += 1) n3.push(t3(e4[r3]));
            return n3;
          }, e3.find = function(e4, t3) {
            var r3, n3;
            if (Array.prototype.find) return Array.prototype.find.call(e4, t3);
            for (r3 = 0, n3 = e4.length; r3 < n3; r3 += 1) {
              var i3 = e4[r3];
              if (t3(i3, r3)) return i3;
            }
          }, e3.assign = function(e4) {
            for (var t3, r3, n3 = e4, i3 = arguments.length, s2 = new Array(i3 > 1 ? i3 - 1 : 0), a2 = 1; a2 < i3; a2++) s2[a2 - 1] = arguments[a2];
            if (Object.assign) return Object.assign.apply(Object, [e4].concat(s2));
            var o2 = /* @__PURE__ */ __name(function() {
              var e5 = s2[t3];
              "object" == typeof e5 && null !== e5 && Object.keys(e5).forEach(function(t4) {
                n3[t4] = e5[t4];
              });
            }, "o");
            for (t3 = 0, r3 = s2.length; t3 < r3; t3 += 1) o2();
            return e4;
          }, e3.getBrowserAlias = function(e4) {
            return n2.BROWSER_ALIASES_MAP[e4];
          }, e3.getBrowserTypeByAlias = function(e4) {
            return n2.BROWSER_MAP[e4] || "";
          }, e3;
        }();
        t2.default = i2, e2.exports = t2.default;
      }, 18: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.ENGINE_MAP = t2.OS_MAP = t2.PLATFORMS_MAP = t2.BROWSER_MAP = t2.BROWSER_ALIASES_MAP = void 0;
        t2.BROWSER_ALIASES_MAP = { "Amazon Silk": "amazon_silk", "Android Browser": "android", Bada: "bada", BlackBerry: "blackberry", Chrome: "chrome", Chromium: "chromium", Electron: "electron", Epiphany: "epiphany", Firefox: "firefox", Focus: "focus", Generic: "generic", "Google Search": "google_search", Googlebot: "googlebot", "Internet Explorer": "ie", "K-Meleon": "k_meleon", Maxthon: "maxthon", "Microsoft Edge": "edge", "MZ Browser": "mz", "NAVER Whale Browser": "naver", Opera: "opera", "Opera Coast": "opera_coast", PhantomJS: "phantomjs", Puffin: "puffin", QupZilla: "qupzilla", QQ: "qq", QQLite: "qqlite", Safari: "safari", Sailfish: "sailfish", "Samsung Internet for Android": "samsung_internet", SeaMonkey: "seamonkey", Sleipnir: "sleipnir", Swing: "swing", Tizen: "tizen", "UC Browser": "uc", Vivaldi: "vivaldi", "WebOS Browser": "webos", WeChat: "wechat", "Yandex Browser": "yandex", Roku: "roku" };
        t2.BROWSER_MAP = { amazon_silk: "Amazon Silk", android: "Android Browser", bada: "Bada", blackberry: "BlackBerry", chrome: "Chrome", chromium: "Chromium", electron: "Electron", epiphany: "Epiphany", firefox: "Firefox", focus: "Focus", generic: "Generic", googlebot: "Googlebot", google_search: "Google Search", ie: "Internet Explorer", k_meleon: "K-Meleon", maxthon: "Maxthon", edge: "Microsoft Edge", mz: "MZ Browser", naver: "NAVER Whale Browser", opera: "Opera", opera_coast: "Opera Coast", phantomjs: "PhantomJS", puffin: "Puffin", qupzilla: "QupZilla", qq: "QQ Browser", qqlite: "QQ Browser Lite", safari: "Safari", sailfish: "Sailfish", samsung_internet: "Samsung Internet for Android", seamonkey: "SeaMonkey", sleipnir: "Sleipnir", swing: "Swing", tizen: "Tizen", uc: "UC Browser", vivaldi: "Vivaldi", webos: "WebOS Browser", wechat: "WeChat", yandex: "Yandex Browser" };
        t2.PLATFORMS_MAP = { tablet: "tablet", mobile: "mobile", desktop: "desktop", tv: "tv" };
        t2.OS_MAP = { WindowsPhone: "Windows Phone", Windows: "Windows", MacOS: "macOS", iOS: "iOS", Android: "Android", WebOS: "WebOS", BlackBerry: "BlackBerry", Bada: "Bada", Tizen: "Tizen", Linux: "Linux", ChromeOS: "Chrome OS", PlayStation4: "PlayStation 4", Roku: "Roku" };
        t2.ENGINE_MAP = { EdgeHTML: "EdgeHTML", Blink: "Blink", Trident: "Trident", Presto: "Presto", Gecko: "Gecko", WebKit: "WebKit" };
      }, 90: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.default = void 0;
        var n2, i2 = (n2 = r2(91)) && n2.__esModule ? n2 : { default: n2 }, s2 = r2(18);
        function a2(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n3 = t3[r3];
            n3.enumerable = n3.enumerable || false, n3.configurable = true, "value" in n3 && (n3.writable = true), Object.defineProperty(e3, n3.key, n3);
          }
        }
        __name(a2, "a");
        var o2 = function() {
          function e3() {
          }
          __name(e3, "e");
          var t3, r3, n3;
          return e3.getParser = function(e4, t4) {
            if (void 0 === t4 && (t4 = false), "string" != typeof e4) throw new Error("UserAgent should be a string");
            return new i2.default(e4, t4);
          }, e3.parse = function(e4) {
            return new i2.default(e4).getResult();
          }, t3 = e3, n3 = [{ key: "BROWSER_MAP", get: /* @__PURE__ */ __name(function() {
            return s2.BROWSER_MAP;
          }, "get") }, { key: "ENGINE_MAP", get: /* @__PURE__ */ __name(function() {
            return s2.ENGINE_MAP;
          }, "get") }, { key: "OS_MAP", get: /* @__PURE__ */ __name(function() {
            return s2.OS_MAP;
          }, "get") }, { key: "PLATFORMS_MAP", get: /* @__PURE__ */ __name(function() {
            return s2.PLATFORMS_MAP;
          }, "get") }], (r3 = null) && a2(t3.prototype, r3), n3 && a2(t3, n3), e3;
        }();
        t2.default = o2, e2.exports = t2.default;
      }, 91: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.default = void 0;
        var n2 = u2(r2(92)), i2 = u2(r2(93)), s2 = u2(r2(94)), a2 = u2(r2(95)), o2 = u2(r2(17));
        function u2(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        __name(u2, "u");
        var d2 = function() {
          function e3(e4, t4) {
            if (void 0 === t4 && (t4 = false), null == e4 || "" === e4) throw new Error("UserAgent parameter can't be empty");
            this._ua = e4, this.parsedResult = {}, true !== t4 && this.parse();
          }
          __name(e3, "e");
          var t3 = e3.prototype;
          return t3.getUA = function() {
            return this._ua;
          }, t3.test = function(e4) {
            return e4.test(this._ua);
          }, t3.parseBrowser = function() {
            var e4 = this;
            this.parsedResult.browser = {};
            var t4 = o2.default.find(n2.default, function(t5) {
              if ("function" == typeof t5.test) return t5.test(e4);
              if (t5.test instanceof Array) return t5.test.some(function(t6) {
                return e4.test(t6);
              });
              throw new Error("Browser's test function is not valid");
            });
            return t4 && (this.parsedResult.browser = t4.describe(this.getUA())), this.parsedResult.browser;
          }, t3.getBrowser = function() {
            return this.parsedResult.browser ? this.parsedResult.browser : this.parseBrowser();
          }, t3.getBrowserName = function(e4) {
            return e4 ? String(this.getBrowser().name).toLowerCase() || "" : this.getBrowser().name || "";
          }, t3.getBrowserVersion = function() {
            return this.getBrowser().version;
          }, t3.getOS = function() {
            return this.parsedResult.os ? this.parsedResult.os : this.parseOS();
          }, t3.parseOS = function() {
            var e4 = this;
            this.parsedResult.os = {};
            var t4 = o2.default.find(i2.default, function(t5) {
              if ("function" == typeof t5.test) return t5.test(e4);
              if (t5.test instanceof Array) return t5.test.some(function(t6) {
                return e4.test(t6);
              });
              throw new Error("Browser's test function is not valid");
            });
            return t4 && (this.parsedResult.os = t4.describe(this.getUA())), this.parsedResult.os;
          }, t3.getOSName = function(e4) {
            var t4 = this.getOS().name;
            return e4 ? String(t4).toLowerCase() || "" : t4 || "";
          }, t3.getOSVersion = function() {
            return this.getOS().version;
          }, t3.getPlatform = function() {
            return this.parsedResult.platform ? this.parsedResult.platform : this.parsePlatform();
          }, t3.getPlatformType = function(e4) {
            void 0 === e4 && (e4 = false);
            var t4 = this.getPlatform().type;
            return e4 ? String(t4).toLowerCase() || "" : t4 || "";
          }, t3.parsePlatform = function() {
            var e4 = this;
            this.parsedResult.platform = {};
            var t4 = o2.default.find(s2.default, function(t5) {
              if ("function" == typeof t5.test) return t5.test(e4);
              if (t5.test instanceof Array) return t5.test.some(function(t6) {
                return e4.test(t6);
              });
              throw new Error("Browser's test function is not valid");
            });
            return t4 && (this.parsedResult.platform = t4.describe(this.getUA())), this.parsedResult.platform;
          }, t3.getEngine = function() {
            return this.parsedResult.engine ? this.parsedResult.engine : this.parseEngine();
          }, t3.getEngineName = function(e4) {
            return e4 ? String(this.getEngine().name).toLowerCase() || "" : this.getEngine().name || "";
          }, t3.parseEngine = function() {
            var e4 = this;
            this.parsedResult.engine = {};
            var t4 = o2.default.find(a2.default, function(t5) {
              if ("function" == typeof t5.test) return t5.test(e4);
              if (t5.test instanceof Array) return t5.test.some(function(t6) {
                return e4.test(t6);
              });
              throw new Error("Browser's test function is not valid");
            });
            return t4 && (this.parsedResult.engine = t4.describe(this.getUA())), this.parsedResult.engine;
          }, t3.parse = function() {
            return this.parseBrowser(), this.parseOS(), this.parsePlatform(), this.parseEngine(), this;
          }, t3.getResult = function() {
            return o2.default.assign({}, this.parsedResult);
          }, t3.satisfies = function(e4) {
            var t4 = this, r3 = {}, n3 = 0, i3 = {}, s3 = 0;
            if (Object.keys(e4).forEach(function(t5) {
              var a4 = e4[t5];
              "string" == typeof a4 ? (i3[t5] = a4, s3 += 1) : "object" == typeof a4 && (r3[t5] = a4, n3 += 1);
            }), n3 > 0) {
              var a3 = Object.keys(r3), u3 = o2.default.find(a3, function(e5) {
                return t4.isOS(e5);
              });
              if (u3) {
                var d3 = this.satisfies(r3[u3]);
                if (void 0 !== d3) return d3;
              }
              var c2 = o2.default.find(a3, function(e5) {
                return t4.isPlatform(e5);
              });
              if (c2) {
                var f2 = this.satisfies(r3[c2]);
                if (void 0 !== f2) return f2;
              }
            }
            if (s3 > 0) {
              var l2 = Object.keys(i3), h2 = o2.default.find(l2, function(e5) {
                return t4.isBrowser(e5, true);
              });
              if (void 0 !== h2) return this.compareVersion(i3[h2]);
            }
          }, t3.isBrowser = function(e4, t4) {
            void 0 === t4 && (t4 = false);
            var r3 = this.getBrowserName().toLowerCase(), n3 = e4.toLowerCase(), i3 = o2.default.getBrowserTypeByAlias(n3);
            return t4 && i3 && (n3 = i3.toLowerCase()), n3 === r3;
          }, t3.compareVersion = function(e4) {
            var t4 = [0], r3 = e4, n3 = false, i3 = this.getBrowserVersion();
            if ("string" == typeof i3) return ">" === e4[0] || "<" === e4[0] ? (r3 = e4.substr(1), "=" === e4[1] ? (n3 = true, r3 = e4.substr(2)) : t4 = [], ">" === e4[0] ? t4.push(1) : t4.push(-1)) : "=" === e4[0] ? r3 = e4.substr(1) : "~" === e4[0] && (n3 = true, r3 = e4.substr(1)), t4.indexOf(o2.default.compareVersions(i3, r3, n3)) > -1;
          }, t3.isOS = function(e4) {
            return this.getOSName(true) === String(e4).toLowerCase();
          }, t3.isPlatform = function(e4) {
            return this.getPlatformType(true) === String(e4).toLowerCase();
          }, t3.isEngine = function(e4) {
            return this.getEngineName(true) === String(e4).toLowerCase();
          }, t3.is = function(e4, t4) {
            return void 0 === t4 && (t4 = false), this.isBrowser(e4, t4) || this.isOS(e4) || this.isPlatform(e4);
          }, t3.some = function(e4) {
            var t4 = this;
            return void 0 === e4 && (e4 = []), e4.some(function(e5) {
              return t4.is(e5);
            });
          }, e3;
        }();
        t2.default = d2, e2.exports = t2.default;
      }, 92: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.default = void 0;
        var n2, i2 = (n2 = r2(17)) && n2.__esModule ? n2 : { default: n2 };
        var s2 = /version\/(\d+(\.?_?\d+)+)/i, a2 = [{ test: [/googlebot/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Googlebot" }, r3 = i2.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/opera/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Opera" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/opr\/|opios/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Opera" }, r3 = i2.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/SamsungBrowser/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Samsung Internet for Android" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/Whale/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "NAVER Whale Browser" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/MZBrowser/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "MZ Browser" }, r3 = i2.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/focus/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Focus" }, r3 = i2.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/swing/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Swing" }, r3 = i2.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/coast/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Opera Coast" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/opt\/\d+(?:.?_?\d+)+/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Opera Touch" }, r3 = i2.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/yabrowser/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Yandex Browser" }, r3 = i2.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/ucbrowser/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "UC Browser" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/Maxthon|mxios/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Maxthon" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/epiphany/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Epiphany" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/puffin/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Puffin" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/sleipnir/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Sleipnir" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/k-meleon/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "K-Meleon" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/micromessenger/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "WeChat" }, r3 = i2.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/qqbrowser/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: /qqbrowserlite/i.test(e3) ? "QQ Browser Lite" : "QQ Browser" }, r3 = i2.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/msie|trident/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Internet Explorer" }, r3 = i2.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/\sedg\//i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Microsoft Edge" }, r3 = i2.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/edg([ea]|ios)/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Microsoft Edge" }, r3 = i2.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/vivaldi/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Vivaldi" }, r3 = i2.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/seamonkey/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "SeaMonkey" }, r3 = i2.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/sailfish/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Sailfish" }, r3 = i2.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/silk/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Amazon Silk" }, r3 = i2.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/phantom/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "PhantomJS" }, r3 = i2.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/slimerjs/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "SlimerJS" }, r3 = i2.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/blackberry|\bbb\d+/i, /rim\stablet/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "BlackBerry" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/(web|hpw)[o0]s/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "WebOS Browser" }, r3 = i2.default.getFirstMatch(s2, e3) || i2.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/bada/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Bada" }, r3 = i2.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/tizen/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Tizen" }, r3 = i2.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/qupzilla/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "QupZilla" }, r3 = i2.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/firefox|iceweasel|fxios/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Firefox" }, r3 = i2.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/electron/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Electron" }, r3 = i2.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/MiuiBrowser/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Miui" }, r3 = i2.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/chromium/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Chromium" }, r3 = i2.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, e3) || i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/chrome|crios|crmo/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Chrome" }, r3 = i2.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/GSA/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Google Search" }, r3 = i2.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          var t3 = !e3.test(/like android/i), r3 = e3.test(/android/i);
          return t3 && r3;
        }, "test"), describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Android Browser" }, r3 = i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/playstation 4/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "PlayStation 4" }, r3 = i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/safari|applewebkit/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: "Safari" }, r3 = i2.default.getFirstMatch(s2, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/.*/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = -1 !== e3.search("\\(") ? /^(.*)\/(.*)[ \t]\((.*)/ : /^(.*)\/(.*) /;
          return { name: i2.default.getFirstMatch(t3, e3), version: i2.default.getSecondMatch(t3, e3) };
        }, "describe") }];
        t2.default = a2, e2.exports = t2.default;
      }, 93: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.default = void 0;
        var n2, i2 = (n2 = r2(17)) && n2.__esModule ? n2 : { default: n2 }, s2 = r2(18);
        var a2 = [{ test: [/Roku\/DVP/], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, e3);
          return { name: s2.OS_MAP.Roku, version: t3 };
        }, "describe") }, { test: [/windows phone/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, e3);
          return { name: s2.OS_MAP.WindowsPhone, version: t3 };
        }, "describe") }, { test: [/windows /i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, e3), r3 = i2.default.getWindowsVersionName(t3);
          return { name: s2.OS_MAP.Windows, version: t3, versionName: r3 };
        }, "describe") }, { test: [/Macintosh(.*?) FxiOS(.*?)\//], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: s2.OS_MAP.iOS }, r3 = i2.default.getSecondMatch(/(Version\/)(\d[\d.]+)/, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/macintosh/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, e3).replace(/[_\s]/g, "."), r3 = i2.default.getMacOSVersionName(t3), n3 = { name: s2.OS_MAP.MacOS, version: t3 };
          return r3 && (n3.versionName = r3), n3;
        }, "describe") }, { test: [/(ipod|iphone|ipad)/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, e3).replace(/[_\s]/g, ".");
          return { name: s2.OS_MAP.iOS, version: t3 };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          var t3 = !e3.test(/like android/i), r3 = e3.test(/android/i);
          return t3 && r3;
        }, "test"), describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, e3), r3 = i2.default.getAndroidVersionName(t3), n3 = { name: s2.OS_MAP.Android, version: t3 };
          return r3 && (n3.versionName = r3), n3;
        }, "describe") }, { test: [/(web|hpw)[o0]s/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, e3), r3 = { name: s2.OS_MAP.WebOS };
          return t3 && t3.length && (r3.version = t3), r3;
        }, "describe") }, { test: [/blackberry|\bbb\d+/i, /rim\stablet/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, e3) || i2.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, e3) || i2.default.getFirstMatch(/\bbb(\d+)/i, e3);
          return { name: s2.OS_MAP.BlackBerry, version: t3 };
        }, "describe") }, { test: [/bada/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, e3);
          return { name: s2.OS_MAP.Bada, version: t3 };
        }, "describe") }, { test: [/tizen/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, e3);
          return { name: s2.OS_MAP.Tizen, version: t3 };
        }, "describe") }, { test: [/linux/i], describe: /* @__PURE__ */ __name(function() {
          return { name: s2.OS_MAP.Linux };
        }, "describe") }, { test: [/CrOS/], describe: /* @__PURE__ */ __name(function() {
          return { name: s2.OS_MAP.ChromeOS };
        }, "describe") }, { test: [/PlayStation 4/], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, e3);
          return { name: s2.OS_MAP.PlayStation4, version: t3 };
        }, "describe") }];
        t2.default = a2, e2.exports = t2.default;
      }, 94: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.default = void 0;
        var n2, i2 = (n2 = r2(17)) && n2.__esModule ? n2 : { default: n2 }, s2 = r2(18);
        var a2 = [{ test: [/googlebot/i], describe: /* @__PURE__ */ __name(function() {
          return { type: "bot", vendor: "Google" };
        }, "describe") }, { test: [/huawei/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/(can-l01)/i, e3) && "Nova", r3 = { type: s2.PLATFORMS_MAP.mobile, vendor: "Huawei" };
          return t3 && (r3.model = t3), r3;
        }, "describe") }, { test: [/nexus\s*(?:7|8|9|10).*/i], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tablet, vendor: "Nexus" };
        }, "describe") }, { test: [/ipad/i], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tablet, vendor: "Apple", model: "iPad" };
        }, "describe") }, { test: [/Macintosh(.*?) FxiOS(.*?)\//], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tablet, vendor: "Apple", model: "iPad" };
        }, "describe") }, { test: [/kftt build/i], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tablet, vendor: "Amazon", model: "Kindle Fire HD 7" };
        }, "describe") }, { test: [/silk/i], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tablet, vendor: "Amazon" };
        }, "describe") }, { test: [/tablet(?! pc)/i], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tablet };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          var t3 = e3.test(/ipod|iphone/i), r3 = e3.test(/like (ipod|iphone)/i);
          return t3 && !r3;
        }, "test"), describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = i2.default.getFirstMatch(/(ipod|iphone)/i, e3);
          return { type: s2.PLATFORMS_MAP.mobile, vendor: "Apple", model: t3 };
        }, "describe") }, { test: [/nexus\s*[0-6].*/i, /galaxy nexus/i], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.mobile, vendor: "Nexus" };
        }, "describe") }, { test: [/[^-]mobi/i], describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.mobile };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "blackberry" === e3.getBrowserName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.mobile, vendor: "BlackBerry" };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "bada" === e3.getBrowserName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.mobile };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "windows phone" === e3.getBrowserName();
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.mobile, vendor: "Microsoft" };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          var t3 = Number(String(e3.getOSVersion()).split(".")[0]);
          return "android" === e3.getOSName(true) && t3 >= 3;
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tablet };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "android" === e3.getOSName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.mobile };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "macos" === e3.getOSName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.desktop, vendor: "Apple" };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "windows" === e3.getOSName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.desktop };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "linux" === e3.getOSName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.desktop };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "playstation 4" === e3.getOSName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tv };
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return "roku" === e3.getOSName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function() {
          return { type: s2.PLATFORMS_MAP.tv };
        }, "describe") }];
        t2.default = a2, e2.exports = t2.default;
      }, 95: function(e2, t2, r2) {
        "use strict";
        t2.__esModule = true, t2.default = void 0;
        var n2, i2 = (n2 = r2(17)) && n2.__esModule ? n2 : { default: n2 }, s2 = r2(18);
        var a2 = [{ test: /* @__PURE__ */ __name(function(e3) {
          return "microsoft edge" === e3.getBrowserName(true);
        }, "test"), describe: /* @__PURE__ */ __name(function(e3) {
          if (/\sedg\//i.test(e3)) return { name: s2.ENGINE_MAP.Blink };
          var t3 = i2.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, e3);
          return { name: s2.ENGINE_MAP.EdgeHTML, version: t3 };
        }, "describe") }, { test: [/trident/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: s2.ENGINE_MAP.Trident }, r3 = i2.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          return e3.test(/presto/i);
        }, "test"), describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: s2.ENGINE_MAP.Presto }, r3 = i2.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: /* @__PURE__ */ __name(function(e3) {
          var t3 = e3.test(/gecko/i), r3 = e3.test(/like gecko/i);
          return t3 && !r3;
        }, "test"), describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: s2.ENGINE_MAP.Gecko }, r3 = i2.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }, { test: [/(apple)?webkit\/537\.36/i], describe: /* @__PURE__ */ __name(function() {
          return { name: s2.ENGINE_MAP.Blink };
        }, "describe") }, { test: [/(apple)?webkit/i], describe: /* @__PURE__ */ __name(function(e3) {
          var t3 = { name: s2.ENGINE_MAP.WebKit }, r3 = i2.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, e3);
          return r3 && (t3.version = r3), t3;
        }, "describe") }];
        t2.default = a2, e2.exports = t2.default;
      } });
    });
  }
});

// .wrangler/tmp/bundle-tOsIuT/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-tOsIuT/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.ts
init_checked_fetch();
init_modules_watch_stub();

// src/handlers/upload.ts
init_checked_fetch();
init_modules_watch_stub();

// src/utils/cors.ts
init_checked_fetch();
init_modules_watch_stub();
var ALLOWED_ORIGINS = [
  "https://echomind3-0.pages.dev",
  // 原有 Cloudflare Pages 網址
  "https://a6447ec7.echomind4.pages.dev",
  // 新部署的 Cloudflare Pages 網址
  "http://localhost:3000",
  // 本地開發環境
  "https://localhost:3000"
];
function isOriginAllowed(origin) {
  return !origin || ALLOWED_ORIGINS.includes(origin);
}
__name(isOriginAllowed, "isOriginAllowed");
function getCorsHeadersForRequest(request) {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": isOriginAllowed(origin) ? origin || "*" : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400"
  };
}
__name(getCorsHeadersForRequest, "getCorsHeadersForRequest");
function handleCors(request) {
  return new Response(null, {
    status: 204,
    // No content
    headers: getCorsHeadersForRequest(request)
  });
}
__name(handleCors, "handleCors");

// node_modules/@aws-sdk/client-s3/dist-es/S3Client.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-expect-continue/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/protocol-http/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/protocol-http/dist-es/extensions/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/protocol-http/dist-es/extensions/httpExtensionConfiguration.js
init_checked_fetch();
init_modules_watch_stub();
var getHttpHandlerExtensionConfiguration = /* @__PURE__ */ __name((runtimeConfig) => {
  let httpHandler = runtimeConfig.httpHandler;
  return {
    setHttpHandler(handler) {
      httpHandler = handler;
    },
    httpHandler() {
      return httpHandler;
    },
    updateHttpClientConfig(key, value) {
      httpHandler.updateHttpClientConfig(key, value);
    },
    httpHandlerConfigs() {
      return httpHandler.httpHandlerConfigs();
    }
  };
}, "getHttpHandlerExtensionConfiguration");
var resolveHttpHandlerRuntimeConfig = /* @__PURE__ */ __name((httpHandlerExtensionConfiguration) => {
  return {
    httpHandler: httpHandlerExtensionConfiguration.httpHandler()
  };
}, "resolveHttpHandlerRuntimeConfig");

// node_modules/@smithy/protocol-http/dist-es/Field.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/abort.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/auth/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/auth/auth.js
init_checked_fetch();
init_modules_watch_stub();
var HttpAuthLocation;
(function(HttpAuthLocation2) {
  HttpAuthLocation2["HEADER"] = "header";
  HttpAuthLocation2["QUERY"] = "query";
})(HttpAuthLocation || (HttpAuthLocation = {}));

// node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
init_checked_fetch();
init_modules_watch_stub();
var HttpApiKeyAuthLocation;
(function(HttpApiKeyAuthLocation2) {
  HttpApiKeyAuthLocation2["HEADER"] = "header";
  HttpApiKeyAuthLocation2["QUERY"] = "query";
})(HttpApiKeyAuthLocation || (HttpApiKeyAuthLocation = {}));

// node_modules/@smithy/types/dist-es/auth/HttpAuthScheme.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/auth/HttpAuthSchemeProvider.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/auth/HttpSigner.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/auth/IdentityProviderConfig.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/blob/blob-payload-input-types.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/checksum.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/client.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/command.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/connection/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/connection/config.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/connection/manager.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/connection/pool.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/crypto.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/encode.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/endpoint.js
init_checked_fetch();
init_modules_watch_stub();
var EndpointURLScheme;
(function(EndpointURLScheme2) {
  EndpointURLScheme2["HTTP"] = "http";
  EndpointURLScheme2["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));

// node_modules/@smithy/types/dist-es/endpoints/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/endpoints/EndpointRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/endpoints/ErrorRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/endpoints/RuleSetObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/endpoints/shared.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/endpoints/TreeRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/eventStream.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/extensions/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/extensions/defaultClientConfiguration.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/extensions/checksum.js
init_checked_fetch();
init_modules_watch_stub();
var AlgorithmId;
(function(AlgorithmId2) {
  AlgorithmId2["MD5"] = "md5";
  AlgorithmId2["CRC32"] = "crc32";
  AlgorithmId2["CRC32C"] = "crc32c";
  AlgorithmId2["SHA1"] = "sha1";
  AlgorithmId2["SHA256"] = "sha256";
})(AlgorithmId || (AlgorithmId = {}));

// node_modules/@smithy/types/dist-es/extensions/defaultExtensionConfiguration.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/feature-ids.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/http.js
init_checked_fetch();
init_modules_watch_stub();
var FieldPosition;
(function(FieldPosition2) {
  FieldPosition2[FieldPosition2["HEADER"] = 0] = "HEADER";
  FieldPosition2[FieldPosition2["TRAILER"] = 1] = "TRAILER";
})(FieldPosition || (FieldPosition = {}));

// node_modules/@smithy/types/dist-es/http/httpHandlerInitialization.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/identity/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/identity/apiKeyIdentity.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/identity/awsCredentialIdentity.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/identity/identity.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/identity/tokenIdentity.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/logger.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/middleware.js
init_checked_fetch();
init_modules_watch_stub();
var SMITHY_CONTEXT_KEY = "__smithy_context";

// node_modules/@smithy/types/dist-es/pagination.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/profile.js
init_checked_fetch();
init_modules_watch_stub();
var IniSectionType;
(function(IniSectionType2) {
  IniSectionType2["PROFILE"] = "profile";
  IniSectionType2["SSO_SESSION"] = "sso-session";
  IniSectionType2["SERVICES"] = "services";
})(IniSectionType || (IniSectionType = {}));

// node_modules/@smithy/types/dist-es/response.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/retry.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/serde.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/shapes.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/signature.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/stream.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-common-types.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-input-types.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-output-types.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/transfer.js
init_checked_fetch();
init_modules_watch_stub();
var RequestHandlerProtocol;
(function(RequestHandlerProtocol2) {
  RequestHandlerProtocol2["HTTP_0_9"] = "http/0.9";
  RequestHandlerProtocol2["HTTP_1_0"] = "http/1.0";
  RequestHandlerProtocol2["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol || (RequestHandlerProtocol = {}));

// node_modules/@smithy/types/dist-es/transform/client-payload-blob-type-narrow.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/transform/no-undefined.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/transform/type-transform.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/uri.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/util.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/types/dist-es/waiter.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/protocol-http/dist-es/Fields.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/protocol-http/dist-es/httpHandler.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/protocol-http/dist-es/httpRequest.js
init_checked_fetch();
init_modules_watch_stub();
var HttpRequest = class _HttpRequest {
  static {
    __name(this, "HttpRequest");
  }
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static clone(request) {
    const cloned = new _HttpRequest({
      ...request,
      headers: { ...request.headers }
    });
    if (cloned.query) {
      cloned.query = cloneQuery(cloned.query);
    }
    return cloned;
  }
  static isInstance(request) {
    if (!request) {
      return false;
    }
    const req = request;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    return _HttpRequest.clone(this);
  }
};
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
__name(cloneQuery, "cloneQuery");

// node_modules/@smithy/protocol-http/dist-es/httpResponse.js
init_checked_fetch();
init_modules_watch_stub();
var HttpResponse = class {
  static {
    __name(this, "HttpResponse");
  }
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response)
      return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
};

// node_modules/@smithy/protocol-http/dist-es/isValidHostname.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/protocol-http/dist-es/types.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-expect-continue/dist-es/index.js
function addExpectContinueMiddleware(options) {
  return (next) => async (args) => {
    const { request } = args;
    if (HttpRequest.isInstance(request) && request.body && options.runtime === "node") {
      if (options.requestHandler?.constructor?.name !== "FetchHttpHandler") {
        request.headers = {
          ...request.headers,
          Expect: "100-continue"
        };
      }
    }
    return next({
      ...args,
      request
    });
  };
}
__name(addExpectContinueMiddleware, "addExpectContinueMiddleware");
var addExpectContinueMiddlewareOptions = {
  step: "build",
  tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
  name: "addExpectContinueMiddleware",
  override: true
};
var getAddExpectContinuePlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(addExpectContinueMiddleware(options), addExpectContinueMiddlewareOptions);
  }, "applyToStack")
}), "getAddExpectContinuePlugin");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/NODE_REQUEST_CHECKSUM_CALCULATION_CONFIG_OPTIONS.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var RequestChecksumCalculation = {
  WHEN_SUPPORTED: "WHEN_SUPPORTED",
  WHEN_REQUIRED: "WHEN_REQUIRED"
};
var DEFAULT_REQUEST_CHECKSUM_CALCULATION = RequestChecksumCalculation.WHEN_SUPPORTED;
var ResponseChecksumValidation = {
  WHEN_SUPPORTED: "WHEN_SUPPORTED",
  WHEN_REQUIRED: "WHEN_REQUIRED"
};
var DEFAULT_RESPONSE_CHECKSUM_VALIDATION = RequestChecksumCalculation.WHEN_SUPPORTED;
var ChecksumAlgorithm;
(function(ChecksumAlgorithm2) {
  ChecksumAlgorithm2["MD5"] = "MD5";
  ChecksumAlgorithm2["CRC32"] = "CRC32";
  ChecksumAlgorithm2["CRC32C"] = "CRC32C";
  ChecksumAlgorithm2["CRC64NVME"] = "CRC64NVME";
  ChecksumAlgorithm2["SHA1"] = "SHA1";
  ChecksumAlgorithm2["SHA256"] = "SHA256";
})(ChecksumAlgorithm || (ChecksumAlgorithm = {}));
var ChecksumLocation;
(function(ChecksumLocation2) {
  ChecksumLocation2["HEADER"] = "header";
  ChecksumLocation2["TRAILER"] = "trailer";
})(ChecksumLocation || (ChecksumLocation = {}));
var DEFAULT_CHECKSUM_ALGORITHM = ChecksumAlgorithm.CRC32;

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/stringUnionSelector.js
init_checked_fetch();
init_modules_watch_stub();
var SelectorType;
(function(SelectorType3) {
  SelectorType3["ENV"] = "env";
  SelectorType3["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/NODE_RESPONSE_CHECKSUM_VALIDATION_CONFIG_OPTIONS.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/crc64-nvme-crt-container.js
init_checked_fetch();
init_modules_watch_stub();
var crc64NvmeCrtContainer = {
  CrtCrc64Nvme: null
};

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/flexibleChecksumsMiddleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
init_checked_fetch();
init_modules_watch_stub();
function setCredentialFeature(credentials, feature, value) {
  if (!credentials.$source) {
    credentials.$source = {};
  }
  credentials.$source[feature] = value;
  return credentials;
}
__name(setCredentialFeature, "setCredentialFeature");

// node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
init_checked_fetch();
init_modules_watch_stub();
function setFeature(context, feature, value) {
  if (!context.__aws_sdk_context) {
    context.__aws_sdk_context = {
      features: {}
    };
  } else if (!context.__aws_sdk_context.features) {
    context.__aws_sdk_context.features = {};
  }
  context.__aws_sdk_context.features[feature] = value;
}
__name(setFeature, "setFeature");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4Signer.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
init_checked_fetch();
init_modules_watch_stub();
var getDateHeader = /* @__PURE__ */ __name((response) => HttpResponse.isInstance(response) ? response.headers?.date ?? response.headers?.Date : void 0, "getDateHeader");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getSkewCorrectedDate.js
init_checked_fetch();
init_modules_watch_stub();
var getSkewCorrectedDate = /* @__PURE__ */ __name((systemClockOffset) => new Date(Date.now() + systemClockOffset), "getSkewCorrectedDate");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getUpdatedSystemClockOffset.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/isClockSkewed.js
init_checked_fetch();
init_modules_watch_stub();
var isClockSkewed = /* @__PURE__ */ __name((clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5, "isClockSkewed");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getUpdatedSystemClockOffset.js
var getUpdatedSystemClockOffset = /* @__PURE__ */ __name((clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
}, "getUpdatedSystemClockOffset");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4Signer.js
var throwSigningPropertyError = /* @__PURE__ */ __name((name, property) => {
  if (!property) {
    throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
  }
  return property;
}, "throwSigningPropertyError");
var validateSigningProperties = /* @__PURE__ */ __name(async (signingProperties) => {
  const context = throwSigningPropertyError("context", signingProperties.context);
  const config = throwSigningPropertyError("config", signingProperties.config);
  const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
  const signerFunction = throwSigningPropertyError("signer", config.signer);
  const signer = await signerFunction(authScheme);
  const signingRegion = signingProperties?.signingRegion;
  const signingRegionSet = signingProperties?.signingRegionSet;
  const signingName = signingProperties?.signingName;
  return {
    config,
    signer,
    signingRegion,
    signingRegionSet,
    signingName
  };
}, "validateSigningProperties");
var AwsSdkSigV4Signer = class {
  static {
    __name(this, "AwsSdkSigV4Signer");
  }
  async sign(httpRequest, identity, signingProperties) {
    if (!HttpRequest.isInstance(httpRequest)) {
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    }
    const validatedProps = await validateSigningProperties(signingProperties);
    const { config, signer } = validatedProps;
    let { signingRegion, signingName } = validatedProps;
    const handlerExecutionContext = signingProperties.context;
    if (handlerExecutionContext?.authSchemes?.length ?? 0 > 1) {
      const [first, second] = handlerExecutionContext.authSchemes;
      if (first?.name === "sigv4a" && second?.name === "sigv4") {
        signingRegion = second?.signingRegion ?? signingRegion;
        signingName = second?.signingName ?? signingName;
      }
    }
    const signedRequest = await signer.sign(httpRequest, {
      signingDate: getSkewCorrectedDate(config.systemClockOffset),
      signingRegion,
      signingService: signingName
    });
    return signedRequest;
  }
  errorHandler(signingProperties) {
    return (error) => {
      const serverTime = error.ServerTime ?? getDateHeader(error.$response);
      if (serverTime) {
        const config = throwSigningPropertyError("config", signingProperties.config);
        const initialSystemClockOffset = config.systemClockOffset;
        config.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
        const clockSkewCorrected = config.systemClockOffset !== initialSystemClockOffset;
        if (clockSkewCorrected && error.$metadata) {
          error.$metadata.clockSkewCorrected = true;
        }
      }
      throw error;
    };
  }
  successHandler(httpResponse, signingProperties) {
    const dateHeader = getDateHeader(httpResponse);
    if (dateHeader) {
      const config = throwSigningPropertyError("config", signingProperties.config);
      config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
    }
  }
};

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4ASigner.js
init_checked_fetch();
init_modules_watch_stub();
var AwsSdkSigV4ASigner = class extends AwsSdkSigV4Signer {
  static {
    __name(this, "AwsSdkSigV4ASigner");
  }
  async sign(httpRequest, identity, signingProperties) {
    if (!HttpRequest.isInstance(httpRequest)) {
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    }
    const { config, signer, signingRegion, signingRegionSet, signingName } = await validateSigningProperties(signingProperties);
    const configResolvedSigningRegionSet = await config.sigv4aSigningRegionSet?.();
    const multiRegionOverride = (configResolvedSigningRegionSet ?? signingRegionSet ?? [signingRegion]).join(",");
    const signedRequest = await signer.sign(httpRequest, {
      signingDate: getSkewCorrectedDate(config.systemClockOffset),
      signingRegion: multiRegionOverride,
      signingService: signingName
    });
    return signedRequest;
  }
};

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4AConfig.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/getSmithyContext.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-middleware/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-middleware/dist-es/getSmithyContext.js
init_checked_fetch();
init_modules_watch_stub();
var getSmithyContext = /* @__PURE__ */ __name((context) => context[SMITHY_CONTEXT_KEY] || (context[SMITHY_CONTEXT_KEY] = {}), "getSmithyContext");

// node_modules/@smithy/util-middleware/dist-es/normalizeProvider.js
init_checked_fetch();
init_modules_watch_stub();
var normalizeProvider = /* @__PURE__ */ __name((input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
}, "normalizeProvider");

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
function convertHttpAuthSchemesToMap(httpAuthSchemes) {
  const map2 = /* @__PURE__ */ new Map();
  for (const scheme of httpAuthSchemes) {
    map2.set(scheme.schemeId, scheme);
  }
  return map2;
}
__name(convertHttpAuthSchemesToMap, "convertHttpAuthSchemesToMap");
var httpAuthSchemeMiddleware = /* @__PURE__ */ __name((config, mwOptions) => (next, context) => async (args) => {
  const options = config.httpAuthSchemeProvider(await mwOptions.httpAuthSchemeParametersProvider(config, context, args.input));
  const authSchemes = convertHttpAuthSchemesToMap(config.httpAuthSchemes);
  const smithyContext = getSmithyContext(context);
  const failureReasons = [];
  for (const option of options) {
    const scheme = authSchemes.get(option.schemeId);
    if (!scheme) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
      continue;
    }
    const identityProvider = scheme.identityProvider(await mwOptions.identityProviderConfigProvider(config));
    if (!identityProvider) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
      continue;
    }
    const { identityProperties = {}, signingProperties = {} } = option.propertiesExtractor?.(config, context) || {};
    option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties);
    option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties);
    smithyContext.selectedHttpAuthScheme = {
      httpAuthOption: option,
      identity: await identityProvider(option.identityProperties),
      signer: scheme.signer
    };
    break;
  }
  if (!smithyContext.selectedHttpAuthScheme) {
    throw new Error(failureReasons.join("\n"));
  }
  return next(args);
}, "httpAuthSchemeMiddleware");

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemeEndpointRuleSetPlugin.js
init_checked_fetch();
init_modules_watch_stub();
var httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: true,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
};
var getHttpAuthSchemeEndpointRuleSetPlugin = /* @__PURE__ */ __name((config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
      httpAuthSchemeParametersProvider,
      identityProviderConfigProvider
    }), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
  }, "applyToStack")
}), "getHttpAuthSchemeEndpointRuleSetPlugin");

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemePlugin.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-serde/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-serde/dist-es/deserializerMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var deserializerMiddleware = /* @__PURE__ */ __name((options, deserializer) => (next, context) => async (args) => {
  const { response } = await next(args);
  try {
    const parsed = await deserializer(response, options);
    return {
      response,
      output: parsed
    };
  } catch (error) {
    Object.defineProperty(error, "$response", {
      value: response
    });
    if (!("$metadata" in error)) {
      const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
      try {
        error.message += "\n  " + hint;
      } catch (e2) {
        if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") {
          console.warn(hint);
        } else {
          context.logger?.warn?.(hint);
        }
      }
      if (typeof error.$responseBodyText !== "undefined") {
        if (error.$response) {
          error.$response.body = error.$responseBodyText;
        }
      }
    }
    throw error;
  }
}, "deserializerMiddleware");

// node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-serde/dist-es/serializerMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var serializerMiddleware = /* @__PURE__ */ __name((options, serializer) => (next, context) => async (args) => {
  const endpoint = context.endpointV2?.url && options.urlParser ? async () => options.urlParser(context.endpointV2.url) : options.endpoint;
  if (!endpoint) {
    throw new Error("No valid endpoint provider available.");
  }
  const request = await serializer(args.input, { ...options, endpoint });
  return next({
    ...args,
    request
  });
}, "serializerMiddleware");

// node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js
var deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
var serializerMiddlewareOption = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSerdePlugin(config, serializer, deserializer) {
  return {
    applyToStack: /* @__PURE__ */ __name((commandStack) => {
      commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
      commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
    }, "applyToStack")
  };
}
__name(getSerdePlugin, "getSerdePlugin");

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemePlugin.js
var httpAuthSchemeMiddlewareOptions = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};

// node_modules/@smithy/core/dist-es/middleware-http-signing/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/middleware-http-signing/httpSigningMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var defaultErrorHandler = /* @__PURE__ */ __name((signingProperties) => (error) => {
  throw error;
}, "defaultErrorHandler");
var defaultSuccessHandler = /* @__PURE__ */ __name((httpResponse, signingProperties) => {
}, "defaultSuccessHandler");
var httpSigningMiddleware = /* @__PURE__ */ __name((config) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const smithyContext = getSmithyContext(context);
  const scheme = smithyContext.selectedHttpAuthScheme;
  if (!scheme) {
    throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
  }
  const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
  const output = await next({
    ...args,
    request: await signer.sign(args.request, identity, signingProperties)
  }).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
  (signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
  return output;
}, "httpSigningMiddleware");

// node_modules/@smithy/core/dist-es/middleware-http-signing/getHttpSigningMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var httpSigningMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["HTTP_SIGNING"],
  name: "httpSigningMiddleware",
  aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
  override: true,
  relation: "after",
  toMiddleware: "retryMiddleware"
};
var getHttpSigningPlugin = /* @__PURE__ */ __name((config) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.addRelativeTo(httpSigningMiddleware(config), httpSigningMiddlewareOptions);
  }, "applyToStack")
}), "getHttpSigningPlugin");

// node_modules/@smithy/core/dist-es/normalizeProvider.js
init_checked_fetch();
init_modules_watch_stub();
var normalizeProvider2 = /* @__PURE__ */ __name((input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
}, "normalizeProvider");

// node_modules/@smithy/core/dist-es/pagination/createPaginator.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/protocols/requestBuilder.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/submodules/protocols/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-stream/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-stream/dist-es/blob/Uint8ArrayBlobAdapter.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-stream/dist-es/blob/transforms.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-base64/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-base64/dist-es/fromBase64.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-base64/dist-es/constants.browser.js
init_checked_fetch();
init_modules_watch_stub();
var alphabetByEncoding = {};
var alphabetByValue = new Array(64);
for (let i2 = 0, start = "A".charCodeAt(0), limit = "Z".charCodeAt(0); i2 + start <= limit; i2++) {
  const char = String.fromCharCode(i2 + start);
  alphabetByEncoding[char] = i2;
  alphabetByValue[i2] = char;
}
for (let i2 = 0, start = "a".charCodeAt(0), limit = "z".charCodeAt(0); i2 + start <= limit; i2++) {
  const char = String.fromCharCode(i2 + start);
  const index = i2 + 26;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
for (let i2 = 0; i2 < 10; i2++) {
  alphabetByEncoding[i2.toString(10)] = i2 + 52;
  const char = i2.toString(10);
  const index = i2 + 52;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
alphabetByEncoding["+"] = 62;
alphabetByValue[62] = "+";
alphabetByEncoding["/"] = 63;
alphabetByValue[63] = "/";
var bitsPerLetter = 6;
var bitsPerByte = 8;
var maxLetterValue = 63;

// node_modules/@smithy/util-base64/dist-es/fromBase64.browser.js
var fromBase64 = /* @__PURE__ */ __name((input) => {
  let totalByteLength = input.length / 4 * 3;
  if (input.slice(-2) === "==") {
    totalByteLength -= 2;
  } else if (input.slice(-1) === "=") {
    totalByteLength--;
  }
  const out = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(out);
  for (let i2 = 0; i2 < input.length; i2 += 4) {
    let bits = 0;
    let bitLength = 0;
    for (let j2 = i2, limit = i2 + 3; j2 <= limit; j2++) {
      if (input[j2] !== "=") {
        if (!(input[j2] in alphabetByEncoding)) {
          throw new TypeError(`Invalid character ${input[j2]} in base64 string.`);
        }
        bits |= alphabetByEncoding[input[j2]] << (limit - j2) * bitsPerLetter;
        bitLength += bitsPerLetter;
      } else {
        bits >>= bitsPerLetter;
      }
    }
    const chunkOffset = i2 / 4 * 3;
    bits >>= bitLength % bitsPerByte;
    const byteLength = Math.floor(bitLength / bitsPerByte);
    for (let k2 = 0; k2 < byteLength; k2++) {
      const offset = (byteLength - k2 - 1) * bitsPerByte;
      dataView.setUint8(chunkOffset + k2, (bits & 255 << offset) >> offset);
    }
  }
  return new Uint8Array(out);
}, "fromBase64");

// node_modules/@smithy/util-base64/dist-es/toBase64.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-utf8/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
init_checked_fetch();
init_modules_watch_stub();
var fromUtf8 = /* @__PURE__ */ __name((input) => new TextEncoder().encode(input), "fromUtf8");

// node_modules/@smithy/util-utf8/dist-es/toUint8Array.js
init_checked_fetch();
init_modules_watch_stub();
var toUint8Array = /* @__PURE__ */ __name((data) => {
  if (typeof data === "string") {
    return fromUtf8(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}, "toUint8Array");

// node_modules/@smithy/util-utf8/dist-es/toUtf8.browser.js
init_checked_fetch();
init_modules_watch_stub();
var toUtf8 = /* @__PURE__ */ __name((input) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  }
  return new TextDecoder("utf-8").decode(input);
}, "toUtf8");

// node_modules/@smithy/util-base64/dist-es/toBase64.browser.js
function toBase64(_input) {
  let input;
  if (typeof _input === "string") {
    input = fromUtf8(_input);
  } else {
    input = _input;
  }
  const isArrayLike = typeof input === "object" && typeof input.length === "number";
  const isUint8Array = typeof input === "object" && typeof input.byteOffset === "number" && typeof input.byteLength === "number";
  if (!isArrayLike && !isUint8Array) {
    throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  }
  let str = "";
  for (let i2 = 0; i2 < input.length; i2 += 3) {
    let bits = 0;
    let bitLength = 0;
    for (let j2 = i2, limit = Math.min(i2 + 3, input.length); j2 < limit; j2++) {
      bits |= input[j2] << (limit - j2 - 1) * bitsPerByte;
      bitLength += bitsPerByte;
    }
    const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
    bits <<= bitClusterCount * bitsPerLetter - bitLength;
    for (let k2 = 1; k2 <= bitClusterCount; k2++) {
      const offset = (bitClusterCount - k2) * bitsPerLetter;
      str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
    }
    str += "==".slice(0, 4 - bitClusterCount);
  }
  return str;
}
__name(toBase64, "toBase64");

// node_modules/@smithy/util-stream/dist-es/blob/transforms.js
function transformToString(payload, encoding = "utf-8") {
  if (encoding === "base64") {
    return toBase64(payload);
  }
  return toUtf8(payload);
}
__name(transformToString, "transformToString");
function transformFromString(str, encoding) {
  if (encoding === "base64") {
    return Uint8ArrayBlobAdapter.mutate(fromBase64(str));
  }
  return Uint8ArrayBlobAdapter.mutate(fromUtf8(str));
}
__name(transformFromString, "transformFromString");

// node_modules/@smithy/util-stream/dist-es/blob/Uint8ArrayBlobAdapter.js
var Uint8ArrayBlobAdapter = class _Uint8ArrayBlobAdapter extends Uint8Array {
  static {
    __name(this, "Uint8ArrayBlobAdapter");
  }
  static fromString(source, encoding = "utf-8") {
    switch (typeof source) {
      case "string":
        return transformFromString(source, encoding);
      default:
        throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
    }
  }
  static mutate(source) {
    Object.setPrototypeOf(source, _Uint8ArrayBlobAdapter.prototype);
    return source;
  }
  transformToString(encoding = "utf-8") {
    return transformToString(this, encoding);
  }
};

// node_modules/@smithy/util-stream/dist-es/checksum/ChecksumStream.browser.js
init_checked_fetch();
init_modules_watch_stub();
var ReadableStreamRef = typeof ReadableStream === "function" ? ReadableStream : function() {
};
var ChecksumStream = class extends ReadableStreamRef {
  static {
    __name(this, "ChecksumStream");
  }
};

// node_modules/@smithy/util-stream/dist-es/checksum/createChecksumStream.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-stream/dist-es/stream-type-check.js
init_checked_fetch();
init_modules_watch_stub();
var isReadableStream = /* @__PURE__ */ __name((stream) => typeof ReadableStream === "function" && (stream?.constructor?.name === ReadableStream.name || stream instanceof ReadableStream), "isReadableStream");

// node_modules/@smithy/util-stream/dist-es/checksum/createChecksumStream.browser.js
var createChecksumStream = /* @__PURE__ */ __name(({ expectedChecksum, checksum, source, checksumSourceLocation, base64Encoder }) => {
  if (!isReadableStream(source)) {
    throw new Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
  }
  const encoder = base64Encoder ?? toBase64;
  if (typeof TransformStream !== "function") {
    throw new Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
  }
  const transform = new TransformStream({
    start() {
    },
    async transform(chunk, controller) {
      checksum.update(chunk);
      controller.enqueue(chunk);
    },
    async flush(controller) {
      const digest = await checksum.digest();
      const received = encoder(digest);
      if (expectedChecksum !== received) {
        const error = new Error(`Checksum mismatch: expected "${expectedChecksum}" but received "${received}" in response header "${checksumSourceLocation}".`);
        controller.error(error);
      } else {
        controller.terminate();
      }
    }
  });
  source.pipeThrough(transform);
  const readable = transform.readable;
  Object.setPrototypeOf(readable, ChecksumStream.prototype);
  return readable;
}, "createChecksumStream");

// node_modules/@smithy/util-stream/dist-es/createBufferedReadableStream.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-stream/dist-es/ByteArrayCollector.js
init_checked_fetch();
init_modules_watch_stub();
var ByteArrayCollector = class {
  static {
    __name(this, "ByteArrayCollector");
  }
  constructor(allocByteArray) {
    this.allocByteArray = allocByteArray;
    this.byteLength = 0;
    this.byteArrays = [];
  }
  push(byteArray) {
    this.byteArrays.push(byteArray);
    this.byteLength += byteArray.byteLength;
  }
  flush() {
    if (this.byteArrays.length === 1) {
      const bytes = this.byteArrays[0];
      this.reset();
      return bytes;
    }
    const aggregation = this.allocByteArray(this.byteLength);
    let cursor = 0;
    for (let i2 = 0; i2 < this.byteArrays.length; ++i2) {
      const bytes = this.byteArrays[i2];
      aggregation.set(bytes, cursor);
      cursor += bytes.byteLength;
    }
    this.reset();
    return aggregation;
  }
  reset() {
    this.byteArrays = [];
    this.byteLength = 0;
  }
};

// node_modules/@smithy/util-stream/dist-es/createBufferedReadableStream.js
function createBufferedReadableStream(upstream, size, logger2) {
  const reader = upstream.getReader();
  let streamBufferingLoggedWarning = false;
  let bytesSeen = 0;
  const buffers = ["", new ByteArrayCollector((size2) => new Uint8Array(size2))];
  let mode = -1;
  const pull = /* @__PURE__ */ __name(async (controller) => {
    const { value, done } = await reader.read();
    const chunk = value;
    if (done) {
      if (mode !== -1) {
        const remainder = flush(buffers, mode);
        if (sizeOf(remainder) > 0) {
          controller.enqueue(remainder);
        }
      }
      controller.close();
    } else {
      const chunkMode = modeOf(chunk);
      if (mode !== chunkMode) {
        if (mode >= 0) {
          controller.enqueue(flush(buffers, mode));
        }
        mode = chunkMode;
      }
      if (mode === -1) {
        controller.enqueue(chunk);
        return;
      }
      const chunkSize = sizeOf(chunk);
      bytesSeen += chunkSize;
      const bufferSize = sizeOf(buffers[mode]);
      if (chunkSize >= size && bufferSize === 0) {
        controller.enqueue(chunk);
      } else {
        const newSize = merge(buffers, mode, chunk);
        if (!streamBufferingLoggedWarning && bytesSeen > size * 2) {
          streamBufferingLoggedWarning = true;
          logger2?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
        }
        if (newSize >= size) {
          controller.enqueue(flush(buffers, mode));
        } else {
          await pull(controller);
        }
      }
    }
  }, "pull");
  return new ReadableStream({
    pull
  });
}
__name(createBufferedReadableStream, "createBufferedReadableStream");
var createBufferedReadable = createBufferedReadableStream;
function merge(buffers, mode, chunk) {
  switch (mode) {
    case 0:
      buffers[0] += chunk;
      return sizeOf(buffers[0]);
    case 1:
    case 2:
      buffers[mode].push(chunk);
      return sizeOf(buffers[mode]);
  }
}
__name(merge, "merge");
function flush(buffers, mode) {
  switch (mode) {
    case 0:
      const s2 = buffers[0];
      buffers[0] = "";
      return s2;
    case 1:
    case 2:
      return buffers[mode].flush();
  }
  throw new Error(`@smithy/util-stream - invalid index ${mode} given to flush()`);
}
__name(flush, "flush");
function sizeOf(chunk) {
  return chunk?.byteLength ?? chunk?.length ?? 0;
}
__name(sizeOf, "sizeOf");
function modeOf(chunk) {
  if (typeof Buffer !== "undefined" && chunk instanceof Buffer) {
    return 2;
  }
  if (chunk instanceof Uint8Array) {
    return 1;
  }
  if (typeof chunk === "string") {
    return 0;
  }
  return -1;
}
__name(modeOf, "modeOf");

// node_modules/@smithy/util-stream/dist-es/getAwsChunkedEncodingStream.browser.js
init_checked_fetch();
init_modules_watch_stub();
var getAwsChunkedEncodingStream = /* @__PURE__ */ __name((readableStream, options) => {
  const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
  const checksumRequired = base64Encoder !== void 0 && bodyLengthChecker !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
  const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readableStream) : void 0;
  const reader = readableStream.getReader();
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) {
        controller.enqueue(`0\r
`);
        if (checksumRequired) {
          const checksum = base64Encoder(await digest);
          controller.enqueue(`${checksumLocationName}:${checksum}\r
`);
          controller.enqueue(`\r
`);
        }
        controller.close();
      } else {
        controller.enqueue(`${(bodyLengthChecker(value) || 0).toString(16)}\r
${value}\r
`);
      }
    }
  });
}, "getAwsChunkedEncodingStream");

// node_modules/@smithy/util-stream/dist-es/headStream.browser.js
init_checked_fetch();
init_modules_watch_stub();
async function headStream(stream, bytes) {
  let byteLengthCounter = 0;
  const chunks = [];
  const reader = stream.getReader();
  let isDone = false;
  while (!isDone) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
      byteLengthCounter += value?.byteLength ?? 0;
    }
    if (byteLengthCounter >= bytes) {
      break;
    }
    isDone = done;
  }
  reader.releaseLock();
  const collected = new Uint8Array(Math.min(bytes, byteLengthCounter));
  let offset = 0;
  for (const chunk of chunks) {
    if (chunk.byteLength > collected.byteLength - offset) {
      collected.set(chunk.subarray(0, collected.byteLength - offset), offset);
      break;
    } else {
      collected.set(chunk, offset);
    }
    offset += chunk.length;
  }
  return collected;
}
__name(headStream, "headStream");

// node_modules/@smithy/util-stream/dist-es/sdk-stream-mixin.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/fetch-http-handler/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/querystring-builder/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-uri-escape/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-uri-escape/dist-es/escape-uri.js
init_checked_fetch();
init_modules_watch_stub();
var escapeUri = /* @__PURE__ */ __name((uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode), "escapeUri");
var hexEncode = /* @__PURE__ */ __name((c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode");

// node_modules/@smithy/util-uri-escape/dist-es/escape-uri-path.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/querystring-builder/dist-es/index.js
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i2 = 0, iLen = value.length; i2 < iLen; i2++) {
        parts.push(`${key}=${escapeUri(value[i2])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}
__name(buildQueryString, "buildQueryString");

// node_modules/@smithy/fetch-http-handler/dist-es/create-request.js
init_checked_fetch();
init_modules_watch_stub();
function createRequest(url, requestOptions) {
  return new Request(url, requestOptions);
}
__name(createRequest, "createRequest");

// node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
init_checked_fetch();
init_modules_watch_stub();
function requestTimeout(timeoutInMs = 0) {
  return new Promise((resolve, reject) => {
    if (timeoutInMs) {
      setTimeout(() => {
        const timeoutError = new Error(`Request did not complete within ${timeoutInMs} ms`);
        timeoutError.name = "TimeoutError";
        reject(timeoutError);
      }, timeoutInMs);
    }
  });
}
__name(requestTimeout, "requestTimeout");

// node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
var keepAliveSupport = {
  supported: void 0
};
var FetchHttpHandler = class _FetchHttpHandler {
  static {
    __name(this, "FetchHttpHandler");
  }
  static create(instanceOrOptions) {
    if (typeof instanceOrOptions?.handle === "function") {
      return instanceOrOptions;
    }
    return new _FetchHttpHandler(instanceOrOptions);
  }
  constructor(options) {
    if (typeof options === "function") {
      this.configProvider = options().then((opts) => opts || {});
    } else {
      this.config = options ?? {};
      this.configProvider = Promise.resolve(this.config);
    }
    if (keepAliveSupport.supported === void 0) {
      keepAliveSupport.supported = Boolean(typeof Request !== "undefined" && "keepalive" in createRequest("https://[::1]"));
    }
  }
  destroy() {
  }
  async handle(request, { abortSignal } = {}) {
    if (!this.config) {
      this.config = await this.configProvider;
    }
    const requestTimeoutInMs = this.config.requestTimeout;
    const keepAlive = this.config.keepAlive === true;
    const credentials = this.config.credentials;
    if (abortSignal?.aborted) {
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      return Promise.reject(abortError);
    }
    let path = request.path;
    const queryString = buildQueryString(request.query || {});
    if (queryString) {
      path += `?${queryString}`;
    }
    if (request.fragment) {
      path += `#${request.fragment}`;
    }
    let auth = "";
    if (request.username != null || request.password != null) {
      const username = request.username ?? "";
      const password = request.password ?? "";
      auth = `${username}:${password}@`;
    }
    const { port, method } = request;
    const url = `${request.protocol}//${auth}${request.hostname}${port ? `:${port}` : ""}${path}`;
    const body = method === "GET" || method === "HEAD" ? void 0 : request.body;
    const requestOptions = {
      body,
      headers: new Headers(request.headers),
      method,
      credentials
    };
    if (this.config?.cache) {
      requestOptions.cache = this.config.cache;
    }
    if (body) {
      requestOptions.duplex = "half";
    }
    if (typeof AbortController !== "undefined") {
      requestOptions.signal = abortSignal;
    }
    if (keepAliveSupport.supported) {
      requestOptions.keepalive = keepAlive;
    }
    if (typeof this.config.requestInit === "function") {
      Object.assign(requestOptions, this.config.requestInit(request));
    }
    let removeSignalEventListener = /* @__PURE__ */ __name(() => {
    }, "removeSignalEventListener");
    const fetchRequest = createRequest(url, requestOptions);
    const raceOfPromises = [
      fetch(fetchRequest).then((response) => {
        const fetchHeaders = response.headers;
        const transformedHeaders = {};
        for (const pair of fetchHeaders.entries()) {
          transformedHeaders[pair[0]] = pair[1];
        }
        const hasReadableStream = response.body != void 0;
        if (!hasReadableStream) {
          return response.blob().then((body2) => ({
            response: new HttpResponse({
              headers: transformedHeaders,
              reason: response.statusText,
              statusCode: response.status,
              body: body2
            })
          }));
        }
        return {
          response: new HttpResponse({
            headers: transformedHeaders,
            reason: response.statusText,
            statusCode: response.status,
            body: response.body
          })
        };
      }),
      requestTimeout(requestTimeoutInMs)
    ];
    if (abortSignal) {
      raceOfPromises.push(new Promise((resolve, reject) => {
        const onAbort = /* @__PURE__ */ __name(() => {
          const abortError = new Error("Request aborted");
          abortError.name = "AbortError";
          reject(abortError);
        }, "onAbort");
        if (typeof abortSignal.addEventListener === "function") {
          const signal = abortSignal;
          signal.addEventListener("abort", onAbort, { once: true });
          removeSignalEventListener = /* @__PURE__ */ __name(() => signal.removeEventListener("abort", onAbort), "removeSignalEventListener");
        } else {
          abortSignal.onabort = onAbort;
        }
      }));
    }
    return Promise.race(raceOfPromises).finally(removeSignalEventListener);
  }
  updateHttpClientConfig(key, value) {
    this.config = void 0;
    this.configProvider = this.configProvider.then((config) => {
      config[key] = value;
      return config;
    });
  }
  httpHandlerConfigs() {
    return this.config ?? {};
  }
};

// node_modules/@smithy/fetch-http-handler/dist-es/stream-collector.js
init_checked_fetch();
init_modules_watch_stub();
var streamCollector = /* @__PURE__ */ __name(async (stream) => {
  if (typeof Blob === "function" && stream instanceof Blob || stream.constructor?.name === "Blob") {
    if (Blob.prototype.arrayBuffer !== void 0) {
      return new Uint8Array(await stream.arrayBuffer());
    }
    return collectBlob(stream);
  }
  return collectStream(stream);
}, "streamCollector");
async function collectBlob(blob) {
  const base64 = await readToBase64(blob);
  const arrayBuffer = fromBase64(base64);
  return new Uint8Array(arrayBuffer);
}
__name(collectBlob, "collectBlob");
async function collectStream(stream) {
  const chunks = [];
  const reader = stream.getReader();
  let isDone = false;
  let length = 0;
  while (!isDone) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
      length += value.length;
    }
    isDone = done;
  }
  const collected = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    collected.set(chunk, offset);
    offset += chunk.length;
  }
  return collected;
}
__name(collectStream, "collectStream");
function readToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState !== 2) {
        return reject(new Error("Reader aborted too early"));
      }
      const result = reader.result ?? "";
      const commaIndex = result.indexOf(",");
      const dataOffset = commaIndex > -1 ? commaIndex + 1 : result.length;
      resolve(result.substring(dataOffset));
    };
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
__name(readToBase64, "readToBase64");

// node_modules/@smithy/util-hex-encoding/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i2 = 0; i2 < 256; i2++) {
  let encodedByte = i2.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i2] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i2;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i2 = 0; i2 < encoded.length; i2 += 2) {
    const encodedByte = encoded.slice(i2, i2 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i2 / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
__name(fromHex, "fromHex");
function toHex(bytes) {
  let out = "";
  for (let i2 = 0; i2 < bytes.byteLength; i2++) {
    out += SHORT_TO_HEX[bytes[i2]];
  }
  return out;
}
__name(toHex, "toHex");

// node_modules/@smithy/util-stream/dist-es/sdk-stream-mixin.browser.js
var ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.";
var sdkStreamMixin = /* @__PURE__ */ __name((stream) => {
  if (!isBlobInstance(stream) && !isReadableStream(stream)) {
    const name = stream?.__proto__?.constructor?.name || stream;
    throw new Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${name}`);
  }
  let transformed = false;
  const transformToByteArray = /* @__PURE__ */ __name(async () => {
    if (transformed) {
      throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
    }
    transformed = true;
    return await streamCollector(stream);
  }, "transformToByteArray");
  const blobToWebStream = /* @__PURE__ */ __name((blob) => {
    if (typeof blob.stream !== "function") {
      throw new Error("Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.\nIf you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body");
    }
    return blob.stream();
  }, "blobToWebStream");
  return Object.assign(stream, {
    transformToByteArray,
    transformToString: /* @__PURE__ */ __name(async (encoding) => {
      const buf = await transformToByteArray();
      if (encoding === "base64") {
        return toBase64(buf);
      } else if (encoding === "hex") {
        return toHex(buf);
      } else if (encoding === void 0 || encoding === "utf8" || encoding === "utf-8") {
        return toUtf8(buf);
      } else if (typeof TextDecoder === "function") {
        return new TextDecoder(encoding).decode(buf);
      } else {
        throw new Error("TextDecoder is not available, please make sure polyfill is provided.");
      }
    }, "transformToString"),
    transformToWebStream: /* @__PURE__ */ __name(() => {
      if (transformed) {
        throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
      }
      transformed = true;
      if (isBlobInstance(stream)) {
        return blobToWebStream(stream);
      } else if (isReadableStream(stream)) {
        return stream;
      } else {
        throw new Error(`Cannot transform payload to web stream, got ${stream}`);
      }
    }, "transformToWebStream")
  });
}, "sdkStreamMixin");
var isBlobInstance = /* @__PURE__ */ __name((stream) => typeof Blob === "function" && stream instanceof Blob, "isBlobInstance");

// node_modules/@smithy/util-stream/dist-es/splitStream.browser.js
init_checked_fetch();
init_modules_watch_stub();
async function splitStream(stream) {
  if (typeof stream.stream === "function") {
    stream = stream.stream();
  }
  const readableStream = stream;
  return readableStream.tee();
}
__name(splitStream, "splitStream");

// node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
var collectBody = /* @__PURE__ */ __name(async (streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Uint8ArrayBlobAdapter.mutate(streamBody);
  }
  if (!streamBody) {
    return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
  }
  const fromContext = context.streamCollector(streamBody);
  return Uint8ArrayBlobAdapter.mutate(await fromContext);
}, "collectBody");

// node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
init_checked_fetch();
init_modules_watch_stub();
function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c2) {
    return "%" + c2.charCodeAt(0).toString(16).toUpperCase();
  });
}
__name(extendedEncodeURIComponent, "extendedEncodeURIComponent");

// node_modules/@smithy/core/dist-es/submodules/protocols/requestBuilder.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/submodules/protocols/resolve-path.js
init_checked_fetch();
init_modules_watch_stub();
var resolvedPath = /* @__PURE__ */ __name((resolvedPath2, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
  if (input != null && input[memberName] !== void 0) {
    const labelValue = labelValueProvider();
    if (labelValue.length <= 0) {
      throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
    }
    resolvedPath2 = resolvedPath2.replace(uriLabel, isGreedyLabel ? labelValue.split("/").map((segment) => extendedEncodeURIComponent(segment)).join("/") : extendedEncodeURIComponent(labelValue));
  } else {
    throw new Error("No value provided for input HTTP label: " + memberName + ".");
  }
  return resolvedPath2;
}, "resolvedPath");

// node_modules/@smithy/core/dist-es/submodules/protocols/requestBuilder.js
function requestBuilder(input, context) {
  return new RequestBuilder(input, context);
}
__name(requestBuilder, "requestBuilder");
var RequestBuilder = class {
  static {
    __name(this, "RequestBuilder");
  }
  constructor(input, context) {
    this.input = input;
    this.context = context;
    this.query = {};
    this.method = "";
    this.headers = {};
    this.path = "";
    this.body = null;
    this.hostname = "";
    this.resolvePathStack = [];
  }
  async build() {
    const { hostname, protocol = "https", port, path: basePath } = await this.context.endpoint();
    this.path = basePath;
    for (const resolvePath of this.resolvePathStack) {
      resolvePath(this.path);
    }
    return new HttpRequest({
      protocol,
      hostname: this.hostname || hostname,
      port,
      method: this.method,
      path: this.path,
      query: this.query,
      body: this.body,
      headers: this.headers
    });
  }
  hn(hostname) {
    this.hostname = hostname;
    return this;
  }
  bp(uriLabel) {
    this.resolvePathStack.push((basePath) => {
      this.path = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + uriLabel;
    });
    return this;
  }
  p(memberName, labelValueProvider, uriLabel, isGreedyLabel) {
    this.resolvePathStack.push((path) => {
      this.path = resolvedPath(path, this.input, memberName, labelValueProvider, uriLabel, isGreedyLabel);
    });
    return this;
  }
  h(headers) {
    this.headers = headers;
    return this;
  }
  q(query) {
    this.query = query;
    return this;
  }
  b(body) {
    this.body = body;
    return this;
  }
  m(method) {
    this.method = method;
    return this;
  }
};

// node_modules/@smithy/core/dist-es/setFeature.js
init_checked_fetch();
init_modules_watch_stub();
function setFeature2(context, feature, value) {
  if (!context.__smithy_context) {
    context.__smithy_context = {
      features: {}
    };
  } else if (!context.__smithy_context.features) {
    context.__smithy_context.features = {};
  }
  context.__smithy_context.features[feature] = value;
}
__name(setFeature2, "setFeature");

// node_modules/@smithy/core/dist-es/util-identity-and-auth/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/util-identity-and-auth/DefaultIdentityProviderConfig.js
init_checked_fetch();
init_modules_watch_stub();
var DefaultIdentityProviderConfig = class {
  static {
    __name(this, "DefaultIdentityProviderConfig");
  }
  constructor(config) {
    this.authSchemes = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(config)) {
      if (value !== void 0) {
        this.authSchemes.set(key, value);
      }
    }
  }
  getIdentityProvider(schemeId) {
    return this.authSchemes.get(schemeId);
  }
};

// node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/httpApiKeyAuth.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/httpBearerAuth.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/noAuth.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/core/dist-es/util-identity-and-auth/memoizeIdentityProvider.js
init_checked_fetch();
init_modules_watch_stub();
var createIsIdentityExpiredFunction = /* @__PURE__ */ __name((expirationMs) => (identity) => doesIdentityRequireRefresh(identity) && identity.expiration.getTime() - Date.now() < expirationMs, "createIsIdentityExpiredFunction");
var EXPIRATION_MS = 3e5;
var isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS);
var doesIdentityRequireRefresh = /* @__PURE__ */ __name((identity) => identity.expiration !== void 0, "doesIdentityRequireRefresh");
var memoizeIdentityProvider = /* @__PURE__ */ __name((provider, isExpired, requiresRefresh) => {
  if (provider === void 0) {
    return void 0;
  }
  const normalizedProvider = typeof provider !== "function" ? async () => Promise.resolve(provider) : provider;
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = /* @__PURE__ */ __name(async (options) => {
    if (!pending) {
      pending = normalizedProvider(options);
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  }, "coalesceProvider");
  if (isExpired === void 0) {
    return async (options) => {
      if (!hasResult || options?.forceRefresh) {
        resolved = await coalesceProvider(options);
      }
      return resolved;
    };
  }
  return async (options) => {
    if (!hasResult || options?.forceRefresh) {
      resolved = await coalesceProvider(options);
    }
    if (isConstant) {
      return resolved;
    }
    if (!requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      await coalesceProvider(options);
      return resolved;
    }
    return resolved;
  };
}, "memoizeIdentityProvider");

// node_modules/@smithy/property-provider/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/property-provider/dist-es/ProviderError.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/property-provider/dist-es/TokenProviderError.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/property-provider/dist-es/chain.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/property-provider/dist-es/fromStatic.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/property-provider/dist-es/memoize.js
init_checked_fetch();
init_modules_watch_stub();
var memoize = /* @__PURE__ */ __name((provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = /* @__PURE__ */ __name(async () => {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  }, "coalesceProvider");
  if (isExpired === void 0) {
    return async (options) => {
      if (!hasResult || options?.forceRefresh) {
        resolved = await coalesceProvider();
      }
      return resolved;
    };
  }
  return async (options) => {
    if (!hasResult || options?.forceRefresh) {
      resolved = await coalesceProvider();
    }
    if (isConstant) {
      return resolved;
    }
    if (requiresRefresh && !requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      await coalesceProvider();
      return resolved;
    }
    return resolved;
  };
}, "memoize");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4AConfig.js
var resolveAwsSdkSigV4AConfig = /* @__PURE__ */ __name((config) => {
  config.sigv4aSigningRegionSet = normalizeProvider2(config.sigv4aSigningRegionSet);
  return config;
}, "resolveAwsSdkSigV4AConfig");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4Config.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/signature-v4/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/signature-v4/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

// node_modules/@smithy/signature-v4/dist-es/credentialDerivation.js
init_checked_fetch();
init_modules_watch_stub();
var signingKeyCache = {};
var cacheQueue = [];
var createScope = /* @__PURE__ */ __name((shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`, "createScope");
var getSigningKey = /* @__PURE__ */ __name(async (sha256Constructor, credentials, shortDate, region, service) => {
  const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = await hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
}, "getSigningKey");
var hmac = /* @__PURE__ */ __name((ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update(toUint8Array(data));
  return hash.digest();
}, "hmac");

// node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
init_checked_fetch();
init_modules_watch_stub();
var getCanonicalHeaders = /* @__PURE__ */ __name(({ headers }, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
}, "getCanonicalHeaders");

// node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
init_checked_fetch();
init_modules_watch_stub();
var getCanonicalQuery = /* @__PURE__ */ __name(({ query = {} }) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query)) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    const encodedKey = escapeUri(key);
    keys.push(encodedKey);
    const value = query[key];
    if (typeof value === "string") {
      serialized[encodedKey] = `${encodedKey}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[encodedKey] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${encodedKey}=${escapeUri(value2)}`]), []).sort().join("&");
    }
  }
  return keys.sort().map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
}, "getCanonicalQuery");

// node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/is-array-buffer/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
var isArrayBuffer = /* @__PURE__ */ __name((arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]", "isArrayBuffer");

// node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
var getPayloadHash = /* @__PURE__ */ __name(async ({ headers, body }, hashConstructor) => {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(await hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
}, "getPayloadHash");

// node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
init_checked_fetch();
init_modules_watch_stub();
var HeaderFormatter = class {
  static {
    __name(this, "HeaderFormatter");
  }
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
};
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE3) {
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["short"] = 3] = "short";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["long"] = 5] = "long";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["string"] = 7] = "string";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
var Int64 = class _Int64 {
  static {
    __name(this, "Int64");
  }
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0)
      break;
  }
}
__name(negate, "negate");

// node_modules/@smithy/signature-v4/dist-es/headerUtil.js
init_checked_fetch();
init_modules_watch_stub();
var hasHeader = /* @__PURE__ */ __name((soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
}, "hasHeader");

// node_modules/@smithy/signature-v4/dist-es/moveHeadersToQuery.js
init_checked_fetch();
init_modules_watch_stub();
var moveHeadersToQuery = /* @__PURE__ */ __name((request, options = {}) => {
  const { headers, query = {} } = HttpRequest.clone(request);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname) || options.hoistableHeaders?.has(lname)) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return {
    ...request,
    headers,
    query
  };
}, "moveHeadersToQuery");

// node_modules/@smithy/signature-v4/dist-es/prepareRequest.js
init_checked_fetch();
init_modules_watch_stub();
var prepareRequest = /* @__PURE__ */ __name((request) => {
  request = HttpRequest.clone(request);
  for (const headerName of Object.keys(request.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request.headers[headerName];
    }
  }
  return request;
}, "prepareRequest");

// node_modules/@smithy/signature-v4/dist-es/utilDate.js
init_checked_fetch();
init_modules_watch_stub();
var iso8601 = /* @__PURE__ */ __name((time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601");
var toDate = /* @__PURE__ */ __name((time) => {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
}, "toDate");

// node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
var SignatureV4 = class {
  static {
    __name(this, "SignatureV4");
  }
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
    this.headerFormatter = new HeaderFormatter();
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  async presign(originalRequest, options = {}) {
    const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, hoistableHeaders, signingRegion, signingService } = options;
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { longDate, shortDate } = formatDate(signingDate);
    if (expiresIn > MAX_PRESIGNED_TTL) {
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    }
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const request = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders, hoistableHeaders });
    if (credentials.sessionToken) {
      request.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
    }
    request.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
    request.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
    request.query[AMZ_DATE_QUERY_PARAM] = longDate;
    request.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
    const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
    request.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
    request.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
    return request;
  }
  async sign(toSign, options) {
    if (typeof toSign === "string") {
      return this.signString(toSign, options);
    } else if (toSign.headers && toSign.payload) {
      return this.signEvent(toSign, options);
    } else if (toSign.message) {
      return this.signMessage(toSign, options);
    } else {
      return this.signRequest(toSign, options);
    }
  }
  async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate, longDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256);
    const hash = new this.sha256();
    hash.update(headers);
    const hashedHeaders = toHex(await hash.digest());
    const stringToSign = [
      EVENT_ALGORITHM_IDENTIFIER,
      longDate,
      scope,
      priorSignature,
      hashedHeaders,
      hashedPayload
    ].join("\n");
    return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
  }
  async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
    const promise = this.signEvent({
      headers: this.headerFormatter.format(signableMessage.message.headers),
      payload: signableMessage.message.body
    }, {
      signingDate,
      signingRegion,
      signingService,
      priorSignature: signableMessage.priorSignature
    });
    return promise.then((signature) => {
      return { message: signableMessage.message, signature };
    });
  }
  async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate } = formatDate(signingDate);
    const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const request = prepareRequest(requestToSign);
    const { longDate, shortDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    request.headers[AMZ_DATE_HEADER] = longDate;
    if (credentials.sessionToken) {
      request.headers[TOKEN_HEADER] = credentials.sessionToken;
    }
    const payloadHash = await getPayloadHash(request, this.sha256);
    if (!hasHeader(SHA256_HEADER, request.headers) && this.applyChecksum) {
      request.headers[SHA256_HEADER] = payloadHash;
    }
    const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
    const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
    request.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
    return request;
  }
  createCanonicalRequest(request, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request.method}
${this.getCanonicalPath(request)}
${getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  async createStringToSign(longDate, credentialScope, canonicalRequest) {
    const hash = new this.sha256();
    hash.update(toUint8Array(canonicalRequest));
    const hashedRequest = await hash.digest();
    return `${ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
  }
  getCanonicalPath({ path }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path.split("/")) {
        if (pathSegment?.length === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
      const doubleEncoded = escapeUri(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  }
  async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
    const hash = new this.sha256(await keyPromise);
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
};
var formatDate = /* @__PURE__ */ __name((now) => {
  const longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
}, "formatDate");
var getCanonicalHeaderList = /* @__PURE__ */ __name((headers) => Object.keys(headers).sort().join(";"), "getCanonicalHeaderList");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4Config.js
var resolveAwsSdkSigV4Config = /* @__PURE__ */ __name((config) => {
  let isUserSupplied = false;
  let credentialsProvider;
  if (config.credentials) {
    isUserSupplied = true;
    credentialsProvider = memoizeIdentityProvider(config.credentials, isIdentityExpired, doesIdentityRequireRefresh);
  }
  if (!credentialsProvider) {
    if (config.credentialDefaultProvider) {
      credentialsProvider = normalizeProvider2(config.credentialDefaultProvider(Object.assign({}, config, {
        parentClientConfig: config
      })));
    } else {
      credentialsProvider = /* @__PURE__ */ __name(async () => {
        throw new Error("`credentials` is missing");
      }, "credentialsProvider");
    }
  }
  const boundCredentialsProvider = /* @__PURE__ */ __name(async () => credentialsProvider({ callerClientConfig: config }), "boundCredentialsProvider");
  const { signingEscapePath = true, systemClockOffset = config.systemClockOffset || 0, sha256 } = config;
  let signer;
  if (config.signer) {
    signer = normalizeProvider2(config.signer);
  } else if (config.regionInfoProvider) {
    signer = /* @__PURE__ */ __name(() => normalizeProvider2(config.region)().then(async (region) => [
      await config.regionInfoProvider(region, {
        useFipsEndpoint: await config.useFipsEndpoint(),
        useDualstackEndpoint: await config.useDualstackEndpoint()
      }) || {},
      region
    ]).then(([regionInfo, region]) => {
      const { signingRegion, signingService } = regionInfo;
      config.signingRegion = config.signingRegion || signingRegion || region;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = {
        ...config,
        credentials: boundCredentialsProvider,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    }), "signer");
  } else {
    signer = /* @__PURE__ */ __name(async (authScheme) => {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: config.signingName || config.defaultSigningName,
        signingRegion: await normalizeProvider2(config.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      config.signingRegion = config.signingRegion || signingRegion;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = {
        ...config,
        credentials: boundCredentialsProvider,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    }, "signer");
  }
  return {
    ...config,
    systemClockOffset,
    signingEscapePath,
    credentials: isUserSupplied ? async () => boundCredentialsProvider().then((creds) => setCredentialFeature(creds, "CREDENTIALS_CODE", "e")) : boundCredentialsProvider,
    signer
  };
}, "resolveAwsSdkSigV4Config");

// node_modules/@smithy/smithy-client/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/client.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-stack/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-stack/dist-es/MiddlewareStack.js
init_checked_fetch();
init_modules_watch_stub();
var getAllAliases = /* @__PURE__ */ __name((name, aliases) => {
  const _aliases = [];
  if (name) {
    _aliases.push(name);
  }
  if (aliases) {
    for (const alias of aliases) {
      _aliases.push(alias);
    }
  }
  return _aliases;
}, "getAllAliases");
var getMiddlewareNameWithAliases = /* @__PURE__ */ __name((name, aliases) => {
  return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
}, "getMiddlewareNameWithAliases");
var constructStack = /* @__PURE__ */ __name(() => {
  let absoluteEntries = [];
  let relativeEntries = [];
  let identifyOnResolve = false;
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = /* @__PURE__ */ __name((entries) => entries.sort((a2, b2) => stepWeights[b2.step] - stepWeights[a2.step] || priorityWeights[b2.priority || "normal"] - priorityWeights[a2.priority || "normal"]), "sort");
  const removeByName = /* @__PURE__ */ __name((toRemove) => {
    let isRemoved = false;
    const filterCb = /* @__PURE__ */ __name((entry) => {
      const aliases = getAllAliases(entry.name, entry.aliases);
      if (aliases.includes(toRemove)) {
        isRemoved = true;
        for (const alias of aliases) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    }, "filterCb");
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  }, "removeByName");
  const removeByReference = /* @__PURE__ */ __name((toRemove) => {
    let isRemoved = false;
    const filterCb = /* @__PURE__ */ __name((entry) => {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        for (const alias of getAllAliases(entry.name, entry.aliases)) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    }, "filterCb");
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  }, "removeByReference");
  const cloneTo = /* @__PURE__ */ __name((toStack) => {
    absoluteEntries.forEach((entry) => {
      toStack.add(entry.middleware, { ...entry });
    });
    relativeEntries.forEach((entry) => {
      toStack.addRelativeTo(entry.middleware, { ...entry });
    });
    toStack.identifyOnResolve?.(stack.identifyOnResolve());
    return toStack;
  }, "cloneTo");
  const expandRelativeMiddlewareList = /* @__PURE__ */ __name((from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    return expandedMiddlewareList;
  }, "expandRelativeMiddlewareList");
  const getMiddlewareList = /* @__PURE__ */ __name((debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry) => {
      if (entry.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
      wholeList.push(...expandedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  }, "getMiddlewareList");
  const stack = {
    add: /* @__PURE__ */ __name((middleware, options = {}) => {
      const { name, override, aliases: _aliases } = options;
      const entry = {
        step: "initialize",
        priority: "normal",
        middleware,
        ...options
      };
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = absoluteEntries[toOverrideIndex];
            if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
            }
            absoluteEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      absoluteEntries.push(entry);
    }, "add"),
    addRelativeTo: /* @__PURE__ */ __name((middleware, options) => {
      const { name, override, aliases: _aliases } = options;
      const entry = {
        middleware,
        ...options
      };
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = relativeEntries[toOverrideIndex];
            if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
            }
            relativeEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      relativeEntries.push(entry);
    }, "addRelativeTo"),
    clone: /* @__PURE__ */ __name(() => cloneTo(constructStack()), "clone"),
    use: /* @__PURE__ */ __name((plugin) => {
      plugin.applyToStack(stack);
    }, "use"),
    remove: /* @__PURE__ */ __name((toRemove) => {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    }, "remove"),
    removeByTag: /* @__PURE__ */ __name((toRemove) => {
      let isRemoved = false;
      const filterCb = /* @__PURE__ */ __name((entry) => {
        const { tags, name, aliases: _aliases } = entry;
        if (tags && tags.includes(toRemove)) {
          const aliases = getAllAliases(name, _aliases);
          for (const alias of aliases) {
            entriesNameSet.delete(alias);
          }
          isRemoved = true;
          return false;
        }
        return true;
      }, "filterCb");
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    }, "removeByTag"),
    concat: /* @__PURE__ */ __name((from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
      return cloned;
    }, "concat"),
    applyToStack: cloneTo,
    identify: /* @__PURE__ */ __name(() => {
      return getMiddlewareList(true).map((mw) => {
        const step = mw.step ?? mw.relation + " " + mw.toMiddleware;
        return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
      });
    }, "identify"),
    identifyOnResolve(toggle) {
      if (typeof toggle === "boolean")
        identifyOnResolve = toggle;
      return identifyOnResolve;
    },
    resolve: /* @__PURE__ */ __name((handler, context) => {
      for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) {
        handler = middleware(handler, context);
      }
      if (identifyOnResolve) {
        console.log(stack.identify());
      }
      return handler;
    }, "resolve")
  };
  return stack;
}, "constructStack");
var stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
var priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};

// node_modules/@smithy/smithy-client/dist-es/client.js
var Client = class {
  static {
    __name(this, "Client");
  }
  constructor(config) {
    this.config = config;
    this.middlewareStack = constructStack();
  }
  send(command, optionsOrCb, cb2) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb2;
    const useHandlerCache = options === void 0 && this.config.cacheMiddleware === true;
    let handler;
    if (useHandlerCache) {
      if (!this.handlers) {
        this.handlers = /* @__PURE__ */ new WeakMap();
      }
      const handlers = this.handlers;
      if (handlers.has(command.constructor)) {
        handler = handlers.get(command.constructor);
      } else {
        handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
        handlers.set(command.constructor, handler);
      }
    } else {
      delete this.handlers;
      handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
    }
    if (callback) {
      handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler(command).then((result) => result.output);
    }
  }
  destroy() {
    this.config?.requestHandler?.destroy?.();
    delete this.handlers;
  }
};

// node_modules/@smithy/smithy-client/dist-es/collect-stream-body.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/command.js
init_checked_fetch();
init_modules_watch_stub();
var Command = class {
  static {
    __name(this, "Command");
  }
  constructor() {
    this.middlewareStack = constructStack();
  }
  static classBuilder() {
    return new ClassBuilder();
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) {
      this.middlewareStack.use(mw);
    }
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY]: {
        commandInstance: this,
        ...smithyContext
      },
      ...additionalContext
    };
    const { requestHandler } = configuration;
    return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
  }
};
var ClassBuilder = class {
  static {
    __name(this, "ClassBuilder");
  }
  constructor() {
    this._init = () => {
    };
    this._ep = {};
    this._middlewareFn = () => [];
    this._commandName = "";
    this._clientName = "";
    this._additionalContext = {};
    this._smithyContext = {};
    this._inputFilterSensitiveLog = (_) => _;
    this._outputFilterSensitiveLog = (_) => _;
    this._serializer = null;
    this._deserializer = null;
  }
  init(cb2) {
    this._init = cb2;
  }
  ep(endpointParameterInstructions) {
    this._ep = endpointParameterInstructions;
    return this;
  }
  m(middlewareSupplier) {
    this._middlewareFn = middlewareSupplier;
    return this;
  }
  s(service, operation, smithyContext = {}) {
    this._smithyContext = {
      service,
      operation,
      ...smithyContext
    };
    return this;
  }
  c(additionalContext = {}) {
    this._additionalContext = additionalContext;
    return this;
  }
  n(clientName, commandName) {
    this._clientName = clientName;
    this._commandName = commandName;
    return this;
  }
  f(inputFilter = (_) => _, outputFilter = (_) => _) {
    this._inputFilterSensitiveLog = inputFilter;
    this._outputFilterSensitiveLog = outputFilter;
    return this;
  }
  ser(serializer) {
    this._serializer = serializer;
    return this;
  }
  de(deserializer) {
    this._deserializer = deserializer;
    return this;
  }
  build() {
    const closure = this;
    let CommandRef;
    return CommandRef = class extends Command {
      static {
        __name(this, "CommandRef");
      }
      static getEndpointParameterInstructions() {
        return closure._ep;
      }
      constructor(...[input]) {
        super();
        this.serialize = closure._serializer;
        this.deserialize = closure._deserializer;
        this.input = input ?? {};
        closure._init(this);
      }
      resolveMiddleware(stack, configuration, options) {
        return this.resolveMiddlewareWithContext(stack, configuration, options, {
          CommandCtor: CommandRef,
          middlewareFn: closure._middlewareFn,
          clientName: closure._clientName,
          commandName: closure._commandName,
          inputFilterSensitiveLog: closure._inputFilterSensitiveLog,
          outputFilterSensitiveLog: closure._outputFilterSensitiveLog,
          smithyContext: closure._smithyContext,
          additionalContext: closure._additionalContext
        });
      }
    };
  }
};

// node_modules/@smithy/smithy-client/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var SENSITIVE_STRING = "***SensitiveInformation***";

// node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/date-utils.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/parse-utils.js
init_checked_fetch();
init_modules_watch_stub();
var parseBoolean = /* @__PURE__ */ __name((value) => {
  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      throw new Error(`Unable to parse boolean value "${value}"`);
  }
}, "parseBoolean");
var expectNumber = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
}, "expectNumber");
var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
var expectFloat32 = /* @__PURE__ */ __name((value) => {
  const expected = expectNumber(value);
  if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
    if (Math.abs(expected) > MAX_FLOAT) {
      throw new TypeError(`Expected 32-bit float, got ${value}`);
    }
  }
  return expected;
}, "expectFloat32");
var expectLong = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
}, "expectLong");
var expectShort = /* @__PURE__ */ __name((value) => expectSizedInt(value, 16), "expectShort");
var expectByte = /* @__PURE__ */ __name((value) => expectSizedInt(value, 8), "expectByte");
var expectSizedInt = /* @__PURE__ */ __name((value, size) => {
  const expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
  }
  return expected;
}, "expectSizedInt");
var castInt = /* @__PURE__ */ __name((value, size) => {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
}, "castInt");
var expectNonNull = /* @__PURE__ */ __name((value, location) => {
  if (value === null || value === void 0) {
    if (location) {
      throw new TypeError(`Expected a non-null value for ${location}`);
    }
    throw new TypeError("Expected a non-null value");
  }
  return value;
}, "expectNonNull");
var expectObject = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  const receivedType = Array.isArray(value) ? "array" : typeof value;
  throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
}, "expectObject");
var expectString = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  if (["boolean", "number", "bigint"].includes(typeof value)) {
    logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
    return String(value);
  }
  throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
}, "expectString");
var strictParseFloat32 = /* @__PURE__ */ __name((value) => {
  if (typeof value == "string") {
    return expectFloat32(parseNumber(value));
  }
  return expectFloat32(value);
}, "strictParseFloat32");
var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
var parseNumber = /* @__PURE__ */ __name((value) => {
  const matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError(`Expected real number, got implicit NaN`);
  }
  return parseFloat(value);
}, "parseNumber");
var strictParseLong = /* @__PURE__ */ __name((value) => {
  if (typeof value === "string") {
    return expectLong(parseNumber(value));
  }
  return expectLong(value);
}, "strictParseLong");
var strictParseShort = /* @__PURE__ */ __name((value) => {
  if (typeof value === "string") {
    return expectShort(parseNumber(value));
  }
  return expectShort(value);
}, "strictParseShort");
var strictParseByte = /* @__PURE__ */ __name((value) => {
  if (typeof value === "string") {
    return expectByte(parseNumber(value));
  }
  return expectByte(value);
}, "strictParseByte");
var stackTraceWarning = /* @__PURE__ */ __name((message) => {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s2) => !s2.includes("stackTraceWarning")).join("\n");
}, "stackTraceWarning");
var logger = {
  warn: console.warn
};

// node_modules/@smithy/smithy-client/dist-es/date-utils.js
var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateToUtcString(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const dayOfWeek = date.getUTCDay();
  const dayOfMonthInt = date.getUTCDate();
  const hoursInt = date.getUTCHours();
  const minutesInt = date.getUTCMinutes();
  const secondsInt = date.getUTCSeconds();
  const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
  const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
  const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
  const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
  return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year} ${hoursString}:${minutesString}:${secondsString} GMT`;
}
__name(dateToUtcString, "dateToUtcString");
var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
var RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
var parseRfc3339DateTimeWithOffset = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  }
  const match = RFC3339_WITH_OFFSET.exec(value);
  if (!match) {
    throw new TypeError("Invalid RFC-3339 date-time value");
  }
  const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
  const year = strictParseShort(stripLeadingZeroes(yearStr));
  const month = parseDateValue(monthStr, "month", 1, 12);
  const day = parseDateValue(dayStr, "day", 1, 31);
  const date = buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
  if (offsetStr.toUpperCase() != "Z") {
    date.setTime(date.getTime() - parseOffsetToMilliseconds(offsetStr));
  }
  return date;
}, "parseRfc3339DateTimeWithOffset");
var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
var buildDate = /* @__PURE__ */ __name((year, month, day, time) => {
  const adjustedMonth = month - 1;
  validateDayOfMonth(year, adjustedMonth, day);
  return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
}, "buildDate");
var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var validateDayOfMonth = /* @__PURE__ */ __name((year, month, day) => {
  let maxDays = DAYS_IN_MONTH[month];
  if (month === 1 && isLeapYear(year)) {
    maxDays = 29;
  }
  if (day > maxDays) {
    throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
  }
}, "validateDayOfMonth");
var isLeapYear = /* @__PURE__ */ __name((year) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}, "isLeapYear");
var parseDateValue = /* @__PURE__ */ __name((value, type, lower, upper) => {
  const dateVal = strictParseByte(stripLeadingZeroes(value));
  if (dateVal < lower || dateVal > upper) {
    throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
  }
  return dateVal;
}, "parseDateValue");
var parseMilliseconds = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return 0;
  }
  return strictParseFloat32("0." + value) * 1e3;
}, "parseMilliseconds");
var parseOffsetToMilliseconds = /* @__PURE__ */ __name((value) => {
  const directionStr = value[0];
  let direction = 1;
  if (directionStr == "+") {
    direction = 1;
  } else if (directionStr == "-") {
    direction = -1;
  } else {
    throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
  }
  const hour = Number(value.substring(1, 3));
  const minute = Number(value.substring(4, 6));
  return direction * (hour * 60 + minute) * 60 * 1e3;
}, "parseOffsetToMilliseconds");
var stripLeadingZeroes = /* @__PURE__ */ __name((value) => {
  let idx = 0;
  while (idx < value.length - 1 && value.charAt(idx) === "0") {
    idx++;
  }
  if (idx === 0) {
    return value;
  }
  return value.slice(idx);
}, "stripLeadingZeroes");

// node_modules/@smithy/smithy-client/dist-es/default-error-handler.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/exceptions.js
init_checked_fetch();
init_modules_watch_stub();
var ServiceException = class _ServiceException extends Error {
  static {
    __name(this, "ServiceException");
  }
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
  static isInstance(value) {
    if (!value)
      return false;
    const candidate = value;
    return _ServiceException.prototype.isPrototypeOf(candidate) || Boolean(candidate.$fault) && Boolean(candidate.$metadata) && (candidate.$fault === "client" || candidate.$fault === "server");
  }
  static [Symbol.hasInstance](instance) {
    if (!instance)
      return false;
    const candidate = instance;
    if (this === _ServiceException) {
      return _ServiceException.isInstance(instance);
    }
    if (_ServiceException.isInstance(instance)) {
      if (candidate.name && this.name) {
        return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
      }
      return this.prototype.isPrototypeOf(instance);
    }
    return false;
  }
};
var decorateServiceException = /* @__PURE__ */ __name((exception, additions = {}) => {
  Object.entries(additions).filter(([, v2]) => v2 !== void 0).forEach(([k2, v2]) => {
    if (exception[k2] == void 0 || exception[k2] === "") {
      exception[k2] = v2;
    }
  });
  const message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
}, "decorateServiceException");

// node_modules/@smithy/smithy-client/dist-es/default-error-handler.js
var throwDefaultError = /* @__PURE__ */ __name(({ output, parsedBody, exceptionCtor, errorCode }) => {
  const $metadata = deserializeMetadata(output);
  const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
  const response = new exceptionCtor({
    name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException(response, parsedBody);
}, "throwDefaultError");
var withBaseException = /* @__PURE__ */ __name((ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
}, "withBaseException");
var deserializeMetadata = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");

// node_modules/@smithy/smithy-client/dist-es/defaults-mode.js
init_checked_fetch();
init_modules_watch_stub();
var loadConfigsForDefaultMode = /* @__PURE__ */ __name((mode) => {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
}, "loadConfigsForDefaultMode");

// node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/extended-encode-uri-component.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/extensions/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
init_checked_fetch();
init_modules_watch_stub();
var getChecksumConfiguration2 = /* @__PURE__ */ __name((runtimeConfig) => {
  const checksumAlgorithms = [];
  for (const id in AlgorithmId) {
    const algorithmId = AlgorithmId[id];
    if (runtimeConfig[algorithmId] === void 0) {
      continue;
    }
    checksumAlgorithms.push({
      algorithmId: /* @__PURE__ */ __name(() => algorithmId, "algorithmId"),
      checksumConstructor: /* @__PURE__ */ __name(() => runtimeConfig[algorithmId], "checksumConstructor")
    });
  }
  return {
    _checksumAlgorithms: checksumAlgorithms,
    addChecksumAlgorithm(algo) {
      this._checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return this._checksumAlgorithms;
    }
  };
}, "getChecksumConfiguration");
var resolveChecksumRuntimeConfig2 = /* @__PURE__ */ __name((clientConfig) => {
  const runtimeConfig = {};
  clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
  });
  return runtimeConfig;
}, "resolveChecksumRuntimeConfig");

// node_modules/@smithy/smithy-client/dist-es/extensions/retry.js
init_checked_fetch();
init_modules_watch_stub();
var getRetryConfiguration = /* @__PURE__ */ __name((runtimeConfig) => {
  let _retryStrategy = runtimeConfig.retryStrategy;
  return {
    setRetryStrategy(retryStrategy) {
      _retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return _retryStrategy;
    }
  };
}, "getRetryConfiguration");
var resolveRetryRuntimeConfig = /* @__PURE__ */ __name((retryStrategyConfiguration) => {
  const runtimeConfig = {};
  runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
  return runtimeConfig;
}, "resolveRetryRuntimeConfig");

// node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js
var getDefaultExtensionConfiguration = /* @__PURE__ */ __name((runtimeConfig) => {
  return {
    ...getChecksumConfiguration2(runtimeConfig),
    ...getRetryConfiguration(runtimeConfig)
  };
}, "getDefaultExtensionConfiguration");
var resolveDefaultRuntimeConfig = /* @__PURE__ */ __name((config) => {
  return {
    ...resolveChecksumRuntimeConfig2(config),
    ...resolveRetryRuntimeConfig(config)
  };
}, "resolveDefaultRuntimeConfig");

// node_modules/@smithy/smithy-client/dist-es/get-array-if-single-item.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/get-value-from-text-node.js
init_checked_fetch();
init_modules_watch_stub();
var getValueFromTextNode = /* @__PURE__ */ __name((obj) => {
  const textNodeName = "#text";
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) {
      obj[key] = obj[key][textNodeName];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = getValueFromTextNode(obj[key]);
    }
  }
  return obj;
}, "getValueFromTextNode");

// node_modules/@smithy/smithy-client/dist-es/is-serializable-header-value.js
init_checked_fetch();
init_modules_watch_stub();
var isSerializableHeaderValue = /* @__PURE__ */ __name((value) => {
  return value != null;
}, "isSerializableHeaderValue");

// node_modules/@smithy/smithy-client/dist-es/lazy-json.js
init_checked_fetch();
init_modules_watch_stub();
var LazyJsonString = /* @__PURE__ */ __name(function LazyJsonString2(val2) {
  const str = Object.assign(new String(val2), {
    deserializeJSON() {
      return JSON.parse(String(val2));
    },
    toString() {
      return String(val2);
    },
    toJSON() {
      return String(val2);
    }
  });
  return str;
}, "LazyJsonString");
LazyJsonString.from = (object) => {
  if (object && typeof object === "object" && (object instanceof LazyJsonString || "deserializeJSON" in object)) {
    return object;
  } else if (typeof object === "string" || Object.getPrototypeOf(object) === String.prototype) {
    return LazyJsonString(String(object));
  }
  return LazyJsonString(JSON.stringify(object));
};
LazyJsonString.fromObject = LazyJsonString.from;

// node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js
init_checked_fetch();
init_modules_watch_stub();
var NoOpLogger = class {
  static {
    __name(this, "NoOpLogger");
  }
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};

// node_modules/@smithy/smithy-client/dist-es/object-mapping.js
init_checked_fetch();
init_modules_watch_stub();
function map(arg0, arg1, arg2) {
  let target;
  let filter;
  let instructions;
  if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
    target = {};
    instructions = arg0;
  } else {
    target = arg0;
    if (typeof arg1 === "function") {
      filter = arg1;
      instructions = arg2;
      return mapWithFilter(target, filter, instructions);
    } else {
      instructions = arg1;
    }
  }
  for (const key of Object.keys(instructions)) {
    if (!Array.isArray(instructions[key])) {
      target[key] = instructions[key];
      continue;
    }
    applyInstruction(target, null, instructions, key);
  }
  return target;
}
__name(map, "map");
var mapWithFilter = /* @__PURE__ */ __name((target, filter, instructions) => {
  return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
    if (Array.isArray(value)) {
      _instructions[key] = value;
    } else {
      if (typeof value === "function") {
        _instructions[key] = [filter, value()];
      } else {
        _instructions[key] = [filter, value];
      }
    }
    return _instructions;
  }, {}));
}, "mapWithFilter");
var applyInstruction = /* @__PURE__ */ __name((target, source, instructions, targetKey) => {
  if (source !== null) {
    let instruction = instructions[targetKey];
    if (typeof instruction === "function") {
      instruction = [, instruction];
    }
    const [filter2 = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
    if (typeof filter2 === "function" && filter2(source[sourceKey]) || typeof filter2 !== "function" && !!filter2) {
      target[targetKey] = valueFn(source[sourceKey]);
    }
    return;
  }
  let [filter, value] = instructions[targetKey];
  if (typeof value === "function") {
    let _value;
    const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
    const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed) {
      target[targetKey] = _value;
    } else if (customFilterPassed) {
      target[targetKey] = value();
    }
  } else {
    const defaultFilterPassed = filter === void 0 && value != null;
    const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed || customFilterPassed) {
      target[targetKey] = value;
    }
  }
}, "applyInstruction");
var nonNullish = /* @__PURE__ */ __name((_) => _ != null, "nonNullish");
var pass = /* @__PURE__ */ __name((_) => _, "pass");

// node_modules/@smithy/smithy-client/dist-es/quote-header.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/resolve-path.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/ser-utils.js
init_checked_fetch();
init_modules_watch_stub();
var serializeDateTime = /* @__PURE__ */ __name((date) => date.toISOString().replace(".000Z", "Z"), "serializeDateTime");

// node_modules/@smithy/smithy-client/dist-es/serde-json.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/split-every.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/smithy-client/dist-es/split-header.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/core/dist-es/submodules/protocols/common.js
init_checked_fetch();
init_modules_watch_stub();
var collectBodyString = /* @__PURE__ */ __name((streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body)), "collectBodyString");

// node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/parseXmlBody.js
init_checked_fetch();
init_modules_watch_stub();
var import_fast_xml_parser = __toESM(require_fxp());
var parseXmlBody = /* @__PURE__ */ __name((streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
  if (encoded.length) {
    const parser = new import_fast_xml_parser.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: false,
      tagValueProcessor: /* @__PURE__ */ __name((_, val2) => val2.trim() === "" && val2.includes("\n") ? "" : void 0, "tagValueProcessor")
    });
    parser.addEntity("#xD", "\r");
    parser.addEntity("#10", "\n");
    let parsedObj;
    try {
      parsedObj = parser.parse(encoded, true);
    } catch (e2) {
      if (e2 && typeof e2 === "object") {
        Object.defineProperty(e2, "$responseBodyText", {
          value: encoded
        });
      }
      throw e2;
    }
    const textNodeName = "#text";
    const key = Object.keys(parsedObj)[0];
    const parsedObjToReturn = parsedObj[key];
    if (parsedObjToReturn[textNodeName]) {
      parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
      delete parsedObjToReturn[textNodeName];
    }
    return getValueFromTextNode(parsedObjToReturn);
  }
  return {};
}), "parseXmlBody");
var parseXmlErrorBody = /* @__PURE__ */ __name(async (errorBody, context) => {
  const value = await parseXmlBody(errorBody, context);
  if (value.Error) {
    value.Error.message = value.Error.message ?? value.Error.Message;
  }
  return value;
}, "parseXmlErrorBody");
var loadRestXmlErrorCode = /* @__PURE__ */ __name((output, data) => {
  if (data?.Error?.Code !== void 0) {
    return data.Error.Code;
  }
  if (data?.Code !== void 0) {
    return data.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
}, "loadRestXmlErrorCode");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksumAlgorithmForRequest.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/types.js
init_checked_fetch();
init_modules_watch_stub();
var CLIENT_SUPPORTED_ALGORITHMS = [
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.CRC64NVME,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.SHA256
];
var PRIORITY_ORDER_ALGORITHMS = [
  ChecksumAlgorithm.SHA256,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.CRC64NVME
];

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksumAlgorithmForRequest.js
var getChecksumAlgorithmForRequest = /* @__PURE__ */ __name((input, { requestChecksumRequired, requestAlgorithmMember, requestChecksumCalculation }) => {
  if (!requestAlgorithmMember) {
    return requestChecksumCalculation === RequestChecksumCalculation.WHEN_SUPPORTED || requestChecksumRequired ? DEFAULT_CHECKSUM_ALGORITHM : void 0;
  }
  if (!input[requestAlgorithmMember]) {
    return void 0;
  }
  const checksumAlgorithm = input[requestAlgorithmMember];
  if (!CLIENT_SUPPORTED_ALGORITHMS.includes(checksumAlgorithm)) {
    throw new Error(`The checksum algorithm "${checksumAlgorithm}" is not supported by the client. Select one of ${CLIENT_SUPPORTED_ALGORITHMS}.`);
  }
  return checksumAlgorithm;
}, "getChecksumAlgorithmForRequest");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksumLocationName.js
init_checked_fetch();
init_modules_watch_stub();
var getChecksumLocationName = /* @__PURE__ */ __name((algorithm) => algorithm === ChecksumAlgorithm.MD5 ? "content-md5" : `x-amz-checksum-${algorithm.toLowerCase()}`, "getChecksumLocationName");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/hasHeader.js
init_checked_fetch();
init_modules_watch_stub();
var hasHeader2 = /* @__PURE__ */ __name((header, headers) => {
  const soughtHeader = header.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
}, "hasHeader");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/hasHeaderWithPrefix.js
init_checked_fetch();
init_modules_watch_stub();
var hasHeaderWithPrefix = /* @__PURE__ */ __name((headerPrefix, headers) => {
  const soughtHeaderPrefix = headerPrefix.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase().startsWith(soughtHeaderPrefix)) {
      return true;
    }
  }
  return false;
}, "hasHeaderWithPrefix");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/isStreaming.js
init_checked_fetch();
init_modules_watch_stub();
var isStreaming = /* @__PURE__ */ __name((body) => body !== void 0 && typeof body !== "string" && !ArrayBuffer.isView(body) && !isArrayBuffer(body), "isStreaming");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/selectChecksumAlgorithmFunction.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/crc32c/build/module/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/tslib/tslib.es6.mjs
init_checked_fetch();
init_modules_watch_stub();
function __awaiter(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  __name(adopt, "adopt");
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }
    __name(fulfilled, "fulfilled");
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e2) {
        reject(e2);
      }
    }
    __name(rejected, "rejected");
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    __name(step, "step");
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
__name(__awaiter, "__awaiter");
function __generator(thisArg, body) {
  var _ = { label: 0, sent: /* @__PURE__ */ __name(function() {
    if (t2[0] & 1) throw t2[1];
    return t2[1];
  }, "sent"), trys: [], ops: [] }, f2, y2, t2, g2 = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g2.next = verb(0), g2["throw"] = verb(1), g2["return"] = verb(2), typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  __name(verb, "verb");
  function step(op) {
    if (f2) throw new TypeError("Generator is already executing.");
    while (g2 && (g2 = 0, op[0] && (_ = 0)), _) try {
      if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done) return t2;
      if (y2 = 0, t2) op = [op[0] & 2, t2.value];
      switch (op[0]) {
        case 0:
        case 1:
          t2 = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y2 = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t2[1]) {
            _.label = t2[1];
            t2 = op;
            break;
          }
          if (t2 && _.label < t2[2]) {
            _.label = t2[2];
            _.ops.push(op);
            break;
          }
          if (t2[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e2) {
      op = [6, e2];
      y2 = 0;
    } finally {
      f2 = t2 = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
  __name(step, "step");
}
__name(__generator, "__generator");
function __values(o2) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o2[s2], i2 = 0;
  if (m2) return m2.call(o2);
  if (o2 && typeof o2.length === "number") return {
    next: /* @__PURE__ */ __name(function() {
      if (o2 && i2 >= o2.length) o2 = void 0;
      return { value: o2 && o2[i2++], done: !o2 };
    }, "next")
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
__name(__values, "__values");

// node_modules/@aws-crypto/util/build/module/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/util/build/module/convertToBuffer.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
init_checked_fetch();
init_modules_watch_stub();
var fromUtf82 = /* @__PURE__ */ __name((input) => new TextEncoder().encode(input), "fromUtf8");

// node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/toUint8Array.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/toUtf8.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf83 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
  return Buffer.from(input, "utf8");
} : fromUtf82;
function convertToBuffer(data) {
  if (data instanceof Uint8Array)
    return data;
  if (typeof data === "string") {
    return fromUtf83(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}
__name(convertToBuffer, "convertToBuffer");

// node_modules/@aws-crypto/util/build/module/isEmptyData.js
init_checked_fetch();
init_modules_watch_stub();
function isEmptyData(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}
__name(isEmptyData, "isEmptyData");

// node_modules/@aws-crypto/util/build/module/numToUint8.js
init_checked_fetch();
init_modules_watch_stub();
function numToUint8(num) {
  return new Uint8Array([
    (num & 4278190080) >> 24,
    (num & 16711680) >> 16,
    (num & 65280) >> 8,
    num & 255
  ]);
}
__name(numToUint8, "numToUint8");

// node_modules/@aws-crypto/util/build/module/uint32ArrayFrom.js
init_checked_fetch();
init_modules_watch_stub();
function uint32ArrayFrom(a_lookUpTable2) {
  if (!Uint32Array.from) {
    var return_array = new Uint32Array(a_lookUpTable2.length);
    var a_index = 0;
    while (a_index < a_lookUpTable2.length) {
      return_array[a_index] = a_lookUpTable2[a_index];
      a_index += 1;
    }
    return return_array;
  }
  return Uint32Array.from(a_lookUpTable2);
}
__name(uint32ArrayFrom, "uint32ArrayFrom");

// node_modules/@aws-crypto/crc32c/build/module/aws_crc32c.js
init_checked_fetch();
init_modules_watch_stub();
var AwsCrc32c = (
  /** @class */
  function() {
    function AwsCrc32c2() {
      this.crc32c = new Crc32c();
    }
    __name(AwsCrc32c2, "AwsCrc32c");
    AwsCrc32c2.prototype.update = function(toHash) {
      if (isEmptyData(toHash))
        return;
      this.crc32c.update(convertToBuffer(toHash));
    };
    AwsCrc32c2.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, numToUint8(this.crc32c.digest())];
        });
      });
    };
    AwsCrc32c2.prototype.reset = function() {
      this.crc32c = new Crc32c();
    };
    return AwsCrc32c2;
  }()
);

// node_modules/@aws-crypto/crc32c/build/module/index.js
var Crc32c = (
  /** @class */
  function() {
    function Crc32c2() {
      this.checksum = 4294967295;
    }
    __name(Crc32c2, "Crc32c");
    Crc32c2.prototype.update = function(data) {
      var e_1, _a;
      try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
          var byte = data_1_1.value;
          this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return this;
    };
    Crc32c2.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    };
    return Crc32c2;
  }()
);
var a_lookupTable = [
  0,
  4067132163,
  3778769143,
  324072436,
  3348797215,
  904991772,
  648144872,
  3570033899,
  2329499855,
  2024987596,
  1809983544,
  2575936315,
  1296289744,
  3207089363,
  2893594407,
  1578318884,
  274646895,
  3795141740,
  4049975192,
  51262619,
  3619967088,
  632279923,
  922689671,
  3298075524,
  2592579488,
  1760304291,
  2075979607,
  2312596564,
  1562183871,
  2943781820,
  3156637768,
  1313733451,
  549293790,
  3537243613,
  3246849577,
  871202090,
  3878099393,
  357341890,
  102525238,
  4101499445,
  2858735121,
  1477399826,
  1264559846,
  3107202533,
  1845379342,
  2677391885,
  2361733625,
  2125378298,
  820201905,
  3263744690,
  3520608582,
  598981189,
  4151959214,
  85089709,
  373468761,
  3827903834,
  3124367742,
  1213305469,
  1526817161,
  2842354314,
  2107672161,
  2412447074,
  2627466902,
  1861252501,
  1098587580,
  3004210879,
  2688576843,
  1378610760,
  2262928035,
  1955203488,
  1742404180,
  2511436119,
  3416409459,
  969524848,
  714683780,
  3639785095,
  205050476,
  4266873199,
  3976438427,
  526918040,
  1361435347,
  2739821008,
  2954799652,
  1114974503,
  2529119692,
  1691668175,
  2005155131,
  2247081528,
  3690758684,
  697762079,
  986182379,
  3366744552,
  476452099,
  3993867776,
  4250756596,
  255256311,
  1640403810,
  2477592673,
  2164122517,
  1922457750,
  2791048317,
  1412925310,
  1197962378,
  3037525897,
  3944729517,
  427051182,
  170179418,
  4165941337,
  746937522,
  3740196785,
  3451792453,
  1070968646,
  1905808397,
  2213795598,
  2426610938,
  1657317369,
  3053634322,
  1147748369,
  1463399397,
  2773627110,
  4215344322,
  153784257,
  444234805,
  3893493558,
  1021025245,
  3467647198,
  3722505002,
  797665321,
  2197175160,
  1889384571,
  1674398607,
  2443626636,
  1164749927,
  3070701412,
  2757221520,
  1446797203,
  137323447,
  4198817972,
  3910406976,
  461344835,
  3484808360,
  1037989803,
  781091935,
  3705997148,
  2460548119,
  1623424788,
  1939049696,
  2180517859,
  1429367560,
  2807687179,
  3020495871,
  1180866812,
  410100952,
  3927582683,
  4182430767,
  186734380,
  3756733383,
  763408580,
  1053836080,
  3434856499,
  2722870694,
  1344288421,
  1131464017,
  2971354706,
  1708204729,
  2545590714,
  2229949006,
  1988219213,
  680717673,
  3673779818,
  3383336350,
  1002577565,
  4010310262,
  493091189,
  238226049,
  4233660802,
  2987750089,
  1082061258,
  1395524158,
  2705686845,
  1972364758,
  2279892693,
  2494862625,
  1725896226,
  952904198,
  3399985413,
  3656866545,
  731699698,
  4283874585,
  222117402,
  510512622,
  3959836397,
  3280807620,
  837199303,
  582374963,
  3504198960,
  68661723,
  4135334616,
  3844915500,
  390545967,
  1230274059,
  3141532936,
  2825850620,
  1510247935,
  2395924756,
  2091215383,
  1878366691,
  2644384480,
  3553878443,
  565732008,
  854102364,
  3229815391,
  340358836,
  3861050807,
  4117890627,
  119113024,
  1493875044,
  2875275879,
  3090270611,
  1247431312,
  2660249211,
  1828433272,
  2141937292,
  2378227087,
  3811616794,
  291187481,
  34330861,
  4032846830,
  615137029,
  3603020806,
  3314634738,
  939183345,
  1776939221,
  2609017814,
  2295496738,
  2058945313,
  2926798794,
  1545135305,
  1330124605,
  3173225534,
  4084100981,
  17165430,
  307568514,
  3762199681,
  888469610,
  3332340585,
  3587147933,
  665062302,
  2042050490,
  2346497209,
  2559330125,
  1793573966,
  3190661285,
  1279665062,
  1595330642,
  2910671697
];
var lookupTable = uint32ArrayFrom(a_lookupTable);

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getCrc32ChecksumAlgorithmFunction.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/crc32/build/module/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/crc32/build/module/aws_crc32.js
init_checked_fetch();
init_modules_watch_stub();
var AwsCrc32 = (
  /** @class */
  function() {
    function AwsCrc322() {
      this.crc32 = new Crc32();
    }
    __name(AwsCrc322, "AwsCrc32");
    AwsCrc322.prototype.update = function(toHash) {
      if (isEmptyData(toHash))
        return;
      this.crc32.update(convertToBuffer(toHash));
    };
    AwsCrc322.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, numToUint8(this.crc32.digest())];
        });
      });
    };
    AwsCrc322.prototype.reset = function() {
      this.crc32 = new Crc32();
    };
    return AwsCrc322;
  }()
);

// node_modules/@aws-crypto/crc32/build/module/index.js
var Crc32 = (
  /** @class */
  function() {
    function Crc322() {
      this.checksum = 4294967295;
    }
    __name(Crc322, "Crc32");
    Crc322.prototype.update = function(data) {
      var e_1, _a;
      try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
          var byte = data_1_1.value;
          this.checksum = this.checksum >>> 8 ^ lookupTable2[(this.checksum ^ byte) & 255];
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return this;
    };
    Crc322.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    };
    return Crc322;
  }()
);
var a_lookUpTable = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
var lookupTable2 = uint32ArrayFrom(a_lookUpTable);

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getCrc32ChecksumAlgorithmFunction.browser.js
var getCrc32ChecksumAlgorithmFunction = /* @__PURE__ */ __name(() => AwsCrc32, "getCrc32ChecksumAlgorithmFunction");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/selectChecksumAlgorithmFunction.js
var selectChecksumAlgorithmFunction = /* @__PURE__ */ __name((checksumAlgorithm, config) => {
  switch (checksumAlgorithm) {
    case ChecksumAlgorithm.MD5:
      return config.md5;
    case ChecksumAlgorithm.CRC32:
      return getCrc32ChecksumAlgorithmFunction();
    case ChecksumAlgorithm.CRC32C:
      return AwsCrc32c;
    case ChecksumAlgorithm.CRC64NVME:
      if (typeof crc64NvmeCrtContainer.CrtCrc64Nvme !== "function") {
        throw new Error(`Please check whether you have installed the "@aws-sdk/crc64-nvme-crt" package explicitly. 
You must also register the package by calling [require("@aws-sdk/crc64-nvme-crt");] or an ESM equivalent such as [import "@aws-sdk/crc64-nvme-crt";]. 
For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
      }
      return crc64NvmeCrtContainer.CrtCrc64Nvme;
    case ChecksumAlgorithm.SHA1:
      return config.sha1;
    case ChecksumAlgorithm.SHA256:
      return config.sha256;
    default:
      throw new Error(`Unsupported checksum algorithm: ${checksumAlgorithm}`);
  }
}, "selectChecksumAlgorithmFunction");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/stringHasher.js
init_checked_fetch();
init_modules_watch_stub();
var stringHasher = /* @__PURE__ */ __name((checksumAlgorithmFn, body) => {
  const hash = new checksumAlgorithmFn();
  hash.update(toUint8Array(body || ""));
  return hash.digest();
}, "stringHasher");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/flexibleChecksumsMiddleware.js
var flexibleChecksumsMiddlewareOptions = {
  name: "flexibleChecksumsMiddleware",
  step: "build",
  tags: ["BODY_CHECKSUM"],
  override: true
};
var flexibleChecksumsMiddleware = /* @__PURE__ */ __name((config, middlewareConfig) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  if (hasHeaderWithPrefix("x-amz-checksum-", args.request.headers)) {
    return next(args);
  }
  const { request, input } = args;
  const { body: requestBody, headers } = request;
  const { base64Encoder, streamHasher } = config;
  const { requestChecksumRequired, requestAlgorithmMember } = middlewareConfig;
  const requestChecksumCalculation = await config.requestChecksumCalculation();
  const requestAlgorithmMemberName = requestAlgorithmMember?.name;
  const requestAlgorithmMemberHttpHeader = requestAlgorithmMember?.httpHeader;
  if (requestAlgorithmMemberName && !input[requestAlgorithmMemberName]) {
    if (requestChecksumCalculation === RequestChecksumCalculation.WHEN_SUPPORTED || requestChecksumRequired) {
      input[requestAlgorithmMemberName] = DEFAULT_CHECKSUM_ALGORITHM;
      if (requestAlgorithmMemberHttpHeader) {
        headers[requestAlgorithmMemberHttpHeader] = DEFAULT_CHECKSUM_ALGORITHM;
      }
    }
  }
  const checksumAlgorithm = getChecksumAlgorithmForRequest(input, {
    requestChecksumRequired,
    requestAlgorithmMember: requestAlgorithmMember?.name,
    requestChecksumCalculation
  });
  let updatedBody = requestBody;
  let updatedHeaders = headers;
  if (checksumAlgorithm) {
    switch (checksumAlgorithm) {
      case ChecksumAlgorithm.CRC32:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_CRC32", "U");
        break;
      case ChecksumAlgorithm.CRC32C:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_CRC32C", "V");
        break;
      case ChecksumAlgorithm.CRC64NVME:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_CRC64", "W");
        break;
      case ChecksumAlgorithm.SHA1:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_SHA1", "X");
        break;
      case ChecksumAlgorithm.SHA256:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_SHA256", "Y");
        break;
    }
    const checksumLocationName = getChecksumLocationName(checksumAlgorithm);
    const checksumAlgorithmFn = selectChecksumAlgorithmFunction(checksumAlgorithm, config);
    if (isStreaming(requestBody)) {
      const { getAwsChunkedEncodingStream: getAwsChunkedEncodingStream2, bodyLengthChecker } = config;
      updatedBody = getAwsChunkedEncodingStream2(typeof config.requestStreamBufferSize === "number" && config.requestStreamBufferSize >= 8 * 1024 ? createBufferedReadable(requestBody, config.requestStreamBufferSize, context.logger) : requestBody, {
        base64Encoder,
        bodyLengthChecker,
        checksumLocationName,
        checksumAlgorithmFn,
        streamHasher
      });
      updatedHeaders = {
        ...headers,
        "content-encoding": headers["content-encoding"] ? `${headers["content-encoding"]},aws-chunked` : "aws-chunked",
        "transfer-encoding": "chunked",
        "x-amz-decoded-content-length": headers["content-length"],
        "x-amz-content-sha256": "STREAMING-UNSIGNED-PAYLOAD-TRAILER",
        "x-amz-trailer": checksumLocationName
      };
      delete updatedHeaders["content-length"];
    } else if (!hasHeader2(checksumLocationName, headers)) {
      const rawChecksum = await stringHasher(checksumAlgorithmFn, requestBody);
      updatedHeaders = {
        ...headers,
        [checksumLocationName]: base64Encoder(rawChecksum)
      };
    }
  }
  const result = await next({
    ...args,
    request: {
      ...request,
      headers: updatedHeaders,
      body: updatedBody
    }
  });
  return result;
}, "flexibleChecksumsMiddleware");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getFlexibleChecksumsPlugin.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/flexibleChecksumsInputMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var flexibleChecksumsInputMiddlewareOptions = {
  name: "flexibleChecksumsInputMiddleware",
  toMiddleware: "serializerMiddleware",
  relation: "before",
  tags: ["BODY_CHECKSUM"],
  override: true
};
var flexibleChecksumsInputMiddleware = /* @__PURE__ */ __name((config, middlewareConfig) => (next, context) => async (args) => {
  const input = args.input;
  const { requestValidationModeMember } = middlewareConfig;
  const requestChecksumCalculation = await config.requestChecksumCalculation();
  const responseChecksumValidation = await config.responseChecksumValidation();
  switch (requestChecksumCalculation) {
    case RequestChecksumCalculation.WHEN_REQUIRED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_WHEN_REQUIRED", "a");
      break;
    case RequestChecksumCalculation.WHEN_SUPPORTED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_WHEN_SUPPORTED", "Z");
      break;
  }
  switch (responseChecksumValidation) {
    case ResponseChecksumValidation.WHEN_REQUIRED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_RES_WHEN_REQUIRED", "c");
      break;
    case ResponseChecksumValidation.WHEN_SUPPORTED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_RES_WHEN_SUPPORTED", "b");
      break;
  }
  if (requestValidationModeMember && !input[requestValidationModeMember]) {
    if (responseChecksumValidation === ResponseChecksumValidation.WHEN_SUPPORTED) {
      input[requestValidationModeMember] = "ENABLED";
    }
  }
  return next(args);
}, "flexibleChecksumsInputMiddleware");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/flexibleChecksumsResponseMiddleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksumAlgorithmListForResponse.js
init_checked_fetch();
init_modules_watch_stub();
var getChecksumAlgorithmListForResponse = /* @__PURE__ */ __name((responseAlgorithms = []) => {
  const validChecksumAlgorithms = [];
  for (const algorithm of PRIORITY_ORDER_ALGORITHMS) {
    if (!responseAlgorithms.includes(algorithm) || !CLIENT_SUPPORTED_ALGORITHMS.includes(algorithm)) {
      continue;
    }
    validChecksumAlgorithms.push(algorithm);
  }
  return validChecksumAlgorithms;
}, "getChecksumAlgorithmListForResponse");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/isChecksumWithPartNumber.js
init_checked_fetch();
init_modules_watch_stub();
var isChecksumWithPartNumber = /* @__PURE__ */ __name((checksum) => {
  const lastHyphenIndex = checksum.lastIndexOf("-");
  if (lastHyphenIndex !== -1) {
    const numberPart = checksum.slice(lastHyphenIndex + 1);
    if (!numberPart.startsWith("0")) {
      const number = parseInt(numberPart, 10);
      if (!isNaN(number) && number >= 1 && number <= 1e4) {
        return true;
      }
    }
  }
  return false;
}, "isChecksumWithPartNumber");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/validateChecksumFromResponse.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksum.js
init_checked_fetch();
init_modules_watch_stub();
var getChecksum = /* @__PURE__ */ __name(async (body, { checksumAlgorithmFn, base64Encoder }) => base64Encoder(await stringHasher(checksumAlgorithmFn, body)), "getChecksum");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/validateChecksumFromResponse.js
var validateChecksumFromResponse = /* @__PURE__ */ __name(async (response, { config, responseAlgorithms, logger: logger2 }) => {
  const checksumAlgorithms = getChecksumAlgorithmListForResponse(responseAlgorithms);
  const { body: responseBody, headers: responseHeaders } = response;
  for (const algorithm of checksumAlgorithms) {
    const responseHeader = getChecksumLocationName(algorithm);
    const checksumFromResponse = responseHeaders[responseHeader];
    if (checksumFromResponse) {
      let checksumAlgorithmFn;
      try {
        checksumAlgorithmFn = selectChecksumAlgorithmFunction(algorithm, config);
      } catch (error) {
        if (algorithm === ChecksumAlgorithm.CRC64NVME) {
          logger2?.warn(`Skipping ${ChecksumAlgorithm.CRC64NVME} checksum validation: ${error.message}`);
          continue;
        }
        throw error;
      }
      const { base64Encoder } = config;
      if (isStreaming(responseBody)) {
        response.body = createChecksumStream({
          expectedChecksum: checksumFromResponse,
          checksumSourceLocation: responseHeader,
          checksum: new checksumAlgorithmFn(),
          source: responseBody,
          base64Encoder
        });
        return;
      }
      const checksum = await getChecksum(responseBody, { checksumAlgorithmFn, base64Encoder });
      if (checksum === checksumFromResponse) {
        break;
      }
      throw new Error(`Checksum mismatch: expected "${checksum}" but received "${checksumFromResponse}" in response header "${responseHeader}".`);
    }
  }
}, "validateChecksumFromResponse");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/flexibleChecksumsResponseMiddleware.js
var flexibleChecksumsResponseMiddlewareOptions = {
  name: "flexibleChecksumsResponseMiddleware",
  toMiddleware: "deserializerMiddleware",
  relation: "after",
  tags: ["BODY_CHECKSUM"],
  override: true
};
var flexibleChecksumsResponseMiddleware = /* @__PURE__ */ __name((config, middlewareConfig) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const input = args.input;
  const result = await next(args);
  const response = result.response;
  const { requestValidationModeMember, responseAlgorithms } = middlewareConfig;
  if (requestValidationModeMember && input[requestValidationModeMember] === "ENABLED") {
    const { clientName, commandName } = context;
    const isS3WholeObjectMultipartGetResponseChecksum = clientName === "S3Client" && commandName === "GetObjectCommand" && getChecksumAlgorithmListForResponse(responseAlgorithms).every((algorithm) => {
      const responseHeader = getChecksumLocationName(algorithm);
      const checksumFromResponse = response.headers[responseHeader];
      return !checksumFromResponse || isChecksumWithPartNumber(checksumFromResponse);
    });
    if (isS3WholeObjectMultipartGetResponseChecksum) {
      return result;
    }
    await validateChecksumFromResponse(response, {
      config,
      responseAlgorithms,
      logger: context.logger
    });
  }
  return result;
}, "flexibleChecksumsResponseMiddleware");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getFlexibleChecksumsPlugin.js
var getFlexibleChecksumsPlugin = /* @__PURE__ */ __name((config, middlewareConfig) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(flexibleChecksumsMiddleware(config, middlewareConfig), flexibleChecksumsMiddlewareOptions);
    clientStack.addRelativeTo(flexibleChecksumsInputMiddleware(config, middlewareConfig), flexibleChecksumsInputMiddlewareOptions);
    clientStack.addRelativeTo(flexibleChecksumsResponseMiddleware(config, middlewareConfig), flexibleChecksumsResponseMiddlewareOptions);
  }, "applyToStack")
}), "getFlexibleChecksumsPlugin");

// node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/resolveFlexibleChecksumsConfig.js
init_checked_fetch();
init_modules_watch_stub();
var resolveFlexibleChecksumsConfig = /* @__PURE__ */ __name((input) => ({
  ...input,
  requestChecksumCalculation: normalizeProvider(input.requestChecksumCalculation ?? DEFAULT_REQUEST_CHECKSUM_CALCULATION),
  responseChecksumValidation: normalizeProvider(input.responseChecksumValidation ?? DEFAULT_RESPONSE_CHECKSUM_VALIDATION),
  requestStreamBufferSize: Number(input.requestStreamBufferSize ?? 0)
}), "resolveFlexibleChecksumsConfig");

// node_modules/@aws-sdk/middleware-host-header/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
function resolveHostHeaderConfig(input) {
  return input;
}
__name(resolveHostHeaderConfig, "resolveHostHeaderConfig");
var hostHeaderMiddleware = /* @__PURE__ */ __name((options) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
    delete request.headers["host"];
    request.headers[":authority"] = request.hostname + (request.port ? ":" + request.port : "");
  } else if (!request.headers["host"]) {
    let host = request.hostname;
    if (request.port != null)
      host += `:${request.port}`;
    request.headers["host"] = host;
  }
  return next(args);
}, "hostHeaderMiddleware");
var hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
var getHostHeaderPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }, "applyToStack")
}), "getHostHeaderPlugin");

// node_modules/@aws-sdk/middleware-logger/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-logger/dist-es/loggerMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var loggerMiddleware = /* @__PURE__ */ __name(() => (next, context) => async (args) => {
  try {
    const response = await next(args);
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const { $metadata, ...outputWithoutMetadata } = response.output;
    logger2?.info?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error) {
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    logger2?.error?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
}, "loggerMiddleware");
var loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
var getLoggerPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }, "applyToStack")
}), "getLoggerPlugin");

// node_modules/@aws-sdk/middleware-recursion-detection/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
var recursionDetectionMiddleware = /* @__PURE__ */ __name((options) => (next) => async (args) => {
  const { request } = args;
  if (!HttpRequest.isInstance(request) || options.runtime !== "node") {
    return next(args);
  }
  const traceIdHeader = Object.keys(request.headers ?? {}).find((h2) => h2.toLowerCase() === TRACE_ID_HEADER_NAME.toLowerCase()) ?? TRACE_ID_HEADER_NAME;
  if (request.headers.hasOwnProperty(traceIdHeader)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceId = process.env[ENV_TRACE_ID];
  const nonEmptyString = /* @__PURE__ */ __name((str) => typeof str === "string" && str.length > 0, "nonEmptyString");
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next({
    ...args,
    request
  });
}, "recursionDetectionMiddleware");
var addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
var getRecursionDetectionPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
  }, "applyToStack")
}), "getRecursionDetectionPlugin");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/check-content-length-header.js
init_checked_fetch();
init_modules_watch_stub();
var CONTENT_LENGTH_HEADER = "content-length";
var DECODED_CONTENT_LENGTH_HEADER = "x-amz-decoded-content-length";
function checkContentLengthHeader() {
  return (next, context) => async (args) => {
    const { request } = args;
    if (HttpRequest.isInstance(request)) {
      if (!(CONTENT_LENGTH_HEADER in request.headers) && !(DECODED_CONTENT_LENGTH_HEADER in request.headers)) {
        const message = `Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage.`;
        if (typeof context?.logger?.warn === "function" && !(context.logger instanceof NoOpLogger)) {
          context.logger.warn(message);
        } else {
          console.warn(message);
        }
      }
    }
    return next({ ...args });
  };
}
__name(checkContentLengthHeader, "checkContentLengthHeader");
var checkContentLengthHeaderMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["CHECK_CONTENT_LENGTH_HEADER"],
  name: "getCheckContentLengthHeaderPlugin",
  override: true
};
var getCheckContentLengthHeaderPlugin = /* @__PURE__ */ __name((unused) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(checkContentLengthHeader(), checkContentLengthHeaderMiddlewareOptions);
  }, "applyToStack")
}), "getCheckContentLengthHeaderPlugin");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/region-redirect-endpoint-middleware.js
init_checked_fetch();
init_modules_watch_stub();
var regionRedirectEndpointMiddleware = /* @__PURE__ */ __name((config) => {
  return (next, context) => async (args) => {
    const originalRegion = await config.region();
    const regionProviderRef = config.region;
    let unlock = /* @__PURE__ */ __name(() => {
    }, "unlock");
    if (context.__s3RegionRedirect) {
      Object.defineProperty(config, "region", {
        writable: false,
        value: /* @__PURE__ */ __name(async () => {
          return context.__s3RegionRedirect;
        }, "value")
      });
      unlock = /* @__PURE__ */ __name(() => Object.defineProperty(config, "region", {
        writable: true,
        value: regionProviderRef
      }), "unlock");
    }
    try {
      const result = await next(args);
      if (context.__s3RegionRedirect) {
        unlock();
        const region = await config.region();
        if (originalRegion !== region) {
          throw new Error("Region was not restored following S3 region redirect.");
        }
      }
      return result;
    } catch (e2) {
      unlock();
      throw e2;
    }
  };
}, "regionRedirectEndpointMiddleware");
var regionRedirectEndpointMiddlewareOptions = {
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectEndpointMiddleware",
  override: true,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
};

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/region-redirect-middleware.js
init_checked_fetch();
init_modules_watch_stub();
function regionRedirectMiddleware(clientConfig) {
  return (next, context) => async (args) => {
    try {
      return await next(args);
    } catch (err) {
      if (clientConfig.followRegionRedirects) {
        if (err?.$metadata?.httpStatusCode === 301 || err?.$metadata?.httpStatusCode === 400 && err?.name === "IllegalLocationConstraintException") {
          try {
            const actualRegion = err.$response.headers["x-amz-bucket-region"];
            context.logger?.debug(`Redirecting from ${await clientConfig.region()} to ${actualRegion}`);
            context.__s3RegionRedirect = actualRegion;
          } catch (e2) {
            throw new Error("Region redirect failed: " + e2);
          }
          return next(args);
        }
      }
      throw err;
    }
  };
}
__name(regionRedirectMiddleware, "regionRedirectMiddleware");
var regionRedirectMiddlewareOptions = {
  step: "initialize",
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectMiddleware",
  override: true
};
var getRegionRedirectMiddlewarePlugin = /* @__PURE__ */ __name((clientConfig) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(regionRedirectMiddleware(clientConfig), regionRedirectMiddlewareOptions);
    clientStack.addRelativeTo(regionRedirectEndpointMiddleware(clientConfig), regionRedirectEndpointMiddlewareOptions);
  }, "applyToStack")
}), "getRegionRedirectMiddlewarePlugin");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-expires-middleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/classes/S3ExpressIdentityCache.js
init_checked_fetch();
init_modules_watch_stub();
var S3ExpressIdentityCache = class _S3ExpressIdentityCache {
  static {
    __name(this, "S3ExpressIdentityCache");
  }
  data;
  lastPurgeTime = Date.now();
  static EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS = 3e4;
  constructor(data = {}) {
    this.data = data;
  }
  get(key) {
    const entry = this.data[key];
    if (!entry) {
      return;
    }
    return entry;
  }
  set(key, entry) {
    this.data[key] = entry;
    return entry;
  }
  delete(key) {
    delete this.data[key];
  }
  async purgeExpired() {
    const now = Date.now();
    if (this.lastPurgeTime + _S3ExpressIdentityCache.EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS > now) {
      return;
    }
    for (const key in this.data) {
      const entry = this.data[key];
      if (!entry.isRefreshing) {
        const credential = await entry.identity;
        if (credential.expiration) {
          if (credential.expiration.getTime() < now) {
            delete this.data[key];
          }
        }
      }
    }
  }
};

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/classes/S3ExpressIdentityCacheEntry.js
init_checked_fetch();
init_modules_watch_stub();
var S3ExpressIdentityCacheEntry = class {
  static {
    __name(this, "S3ExpressIdentityCacheEntry");
  }
  _identity;
  isRefreshing;
  accessed;
  constructor(_identity, isRefreshing = false, accessed = Date.now()) {
    this._identity = _identity;
    this.isRefreshing = isRefreshing;
    this.accessed = accessed;
  }
  get identity() {
    this.accessed = Date.now();
    return this._identity;
  }
};

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/classes/S3ExpressIdentityProviderImpl.js
init_checked_fetch();
init_modules_watch_stub();
var S3ExpressIdentityProviderImpl = class _S3ExpressIdentityProviderImpl {
  static {
    __name(this, "S3ExpressIdentityProviderImpl");
  }
  createSessionFn;
  cache;
  static REFRESH_WINDOW_MS = 6e4;
  constructor(createSessionFn, cache2 = new S3ExpressIdentityCache()) {
    this.createSessionFn = createSessionFn;
    this.cache = cache2;
  }
  async getS3ExpressIdentity(awsIdentity, identityProperties) {
    const key = identityProperties.Bucket;
    const { cache: cache2 } = this;
    const entry = cache2.get(key);
    if (entry) {
      return entry.identity.then((identity) => {
        const isExpired = (identity.expiration?.getTime() ?? 0) < Date.now();
        if (isExpired) {
          return cache2.set(key, new S3ExpressIdentityCacheEntry(this.getIdentity(key))).identity;
        }
        const isExpiringSoon = (identity.expiration?.getTime() ?? 0) < Date.now() + _S3ExpressIdentityProviderImpl.REFRESH_WINDOW_MS;
        if (isExpiringSoon && !entry.isRefreshing) {
          entry.isRefreshing = true;
          this.getIdentity(key).then((id) => {
            cache2.set(key, new S3ExpressIdentityCacheEntry(Promise.resolve(id)));
          });
        }
        return identity;
      });
    }
    return cache2.set(key, new S3ExpressIdentityCacheEntry(this.getIdentity(key))).identity;
  }
  async getIdentity(key) {
    await this.cache.purgeExpired().catch((error) => {
      console.warn("Error while clearing expired entries in S3ExpressIdentityCache: \n" + error);
    });
    const session = await this.createSessionFn(key);
    if (!session.Credentials?.AccessKeyId || !session.Credentials?.SecretAccessKey) {
      throw new Error("s3#createSession response credential missing AccessKeyId or SecretAccessKey.");
    }
    const identity = {
      accessKeyId: session.Credentials.AccessKeyId,
      secretAccessKey: session.Credentials.SecretAccessKey,
      sessionToken: session.Credentials.SessionToken,
      expiration: session.Credentials.Expiration ? new Date(session.Credentials.Expiration) : void 0
    };
    return identity;
  }
};

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/classes/SignatureV4S3Express.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/constants.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-config-provider/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-config-provider/dist-es/booleanSelector.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-config-provider/dist-es/numberSelector.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-config-provider/dist-es/types.js
init_checked_fetch();
init_modules_watch_stub();
var SelectorType2;
(function(SelectorType3) {
  SelectorType3["ENV"] = "env";
  SelectorType3["CONFIG"] = "shared config entry";
})(SelectorType2 || (SelectorType2 = {}));

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/constants.js
var S3_EXPRESS_BUCKET_TYPE = "Directory";
var S3_EXPRESS_BACKEND = "S3Express";
var S3_EXPRESS_AUTH_SCHEME = "sigv4-s3express";
var SESSION_TOKEN_QUERY_PARAM = "X-Amz-S3session-Token";
var SESSION_TOKEN_HEADER = SESSION_TOKEN_QUERY_PARAM.toLowerCase();

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/classes/SignatureV4S3Express.js
var SignatureV4S3Express = class extends SignatureV4 {
  static {
    __name(this, "SignatureV4S3Express");
  }
  async signWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    requestToSign.headers[SESSION_TOKEN_HEADER] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return privateAccess.signRequest(requestToSign, options ?? {});
  }
  async presignWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    delete requestToSign.headers[SESSION_TOKEN_HEADER];
    requestToSign.headers[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    requestToSign.query = requestToSign.query ?? {};
    requestToSign.query[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return this.presign(requestToSign, options);
  }
};
function getCredentialsWithoutSessionToken(credentials) {
  const credentialsWithoutSessionToken = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    expiration: credentials.expiration
  };
  return credentialsWithoutSessionToken;
}
__name(getCredentialsWithoutSessionToken, "getCredentialsWithoutSessionToken");
function setSingleOverride(privateAccess, credentialsWithoutSessionToken) {
  const id = setTimeout(() => {
    throw new Error("SignatureV4S3Express credential override was created but not called.");
  }, 10);
  const currentCredentialProvider = privateAccess.credentialProvider;
  const overrideCredentialsProviderOnce = /* @__PURE__ */ __name(() => {
    clearTimeout(id);
    privateAccess.credentialProvider = currentCredentialProvider;
    return Promise.resolve(credentialsWithoutSessionToken);
  }, "overrideCredentialsProviderOnce");
  privateAccess.credentialProvider = overrideCredentialsProviderOnce;
}
__name(setSingleOverride, "setSingleOverride");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/functions/s3ExpressMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var s3ExpressMiddleware = /* @__PURE__ */ __name((options) => {
  return (next, context) => async (args) => {
    if (context.endpointV2) {
      const endpoint = context.endpointV2;
      const isS3ExpressAuth = endpoint.properties?.authSchemes?.[0]?.name === S3_EXPRESS_AUTH_SCHEME;
      const isS3ExpressBucket = endpoint.properties?.backend === S3_EXPRESS_BACKEND || endpoint.properties?.bucketType === S3_EXPRESS_BUCKET_TYPE;
      if (isS3ExpressBucket) {
        setFeature(context, "S3_EXPRESS_BUCKET", "J");
        context.isS3ExpressBucket = true;
      }
      if (isS3ExpressAuth) {
        const requestBucket = args.input.Bucket;
        if (requestBucket) {
          const s3ExpressIdentity = await options.s3ExpressIdentityProvider.getS3ExpressIdentity(await options.credentials(), {
            Bucket: requestBucket
          });
          context.s3ExpressIdentity = s3ExpressIdentity;
          if (HttpRequest.isInstance(args.request) && s3ExpressIdentity.sessionToken) {
            args.request.headers[SESSION_TOKEN_HEADER] = s3ExpressIdentity.sessionToken;
          }
        }
      }
    }
    return next(args);
  };
}, "s3ExpressMiddleware");
var s3ExpressMiddlewareOptions = {
  name: "s3ExpressMiddleware",
  step: "build",
  tags: ["S3", "S3_EXPRESS"],
  override: true
};
var getS3ExpressPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(s3ExpressMiddleware(options), s3ExpressMiddlewareOptions);
  }, "applyToStack")
}), "getS3ExpressPlugin");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/functions/s3ExpressHttpSigningMiddleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/functions/signS3Express.js
init_checked_fetch();
init_modules_watch_stub();
var signS3Express = /* @__PURE__ */ __name(async (s3ExpressIdentity, signingOptions, request, sigV4MultiRegionSigner) => {
  const signedRequest = await sigV4MultiRegionSigner.signWithCredentials(request, s3ExpressIdentity, {});
  if (signedRequest.headers["X-Amz-Security-Token"] || signedRequest.headers["x-amz-security-token"]) {
    throw new Error("X-Amz-Security-Token must not be set for s3-express requests.");
  }
  return signedRequest;
}, "signS3Express");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3-express/functions/s3ExpressHttpSigningMiddleware.js
var defaultErrorHandler2 = /* @__PURE__ */ __name((signingProperties) => (error) => {
  throw error;
}, "defaultErrorHandler");
var defaultSuccessHandler2 = /* @__PURE__ */ __name((httpResponse, signingProperties) => {
}, "defaultSuccessHandler");
var s3ExpressHttpSigningMiddleware = /* @__PURE__ */ __name((config) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const smithyContext = getSmithyContext(context);
  const scheme = smithyContext.selectedHttpAuthScheme;
  if (!scheme) {
    throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
  }
  const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
  let request;
  if (context.s3ExpressIdentity) {
    request = await signS3Express(context.s3ExpressIdentity, signingProperties, args.request, await config.signer());
  } else {
    request = await signer.sign(args.request, identity, signingProperties);
  }
  const output = await next({
    ...args,
    request
  }).catch((signer.errorHandler || defaultErrorHandler2)(signingProperties));
  (signer.successHandler || defaultSuccessHandler2)(output.response, signingProperties);
  return output;
}, "s3ExpressHttpSigningMiddleware");
var getS3ExpressHttpSigningPlugin = /* @__PURE__ */ __name((config) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.addRelativeTo(s3ExpressHttpSigningMiddleware(config), httpSigningMiddlewareOptions);
  }, "applyToStack")
}), "getS3ExpressHttpSigningPlugin");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3Configuration.js
init_checked_fetch();
init_modules_watch_stub();
var resolveS3Config = /* @__PURE__ */ __name((input, { session }) => {
  const [s3ClientProvider, CreateSessionCommandCtor] = session;
  return {
    ...input,
    forcePathStyle: input.forcePathStyle ?? false,
    useAccelerateEndpoint: input.useAccelerateEndpoint ?? false,
    disableMultiregionAccessPoints: input.disableMultiregionAccessPoints ?? false,
    followRegionRedirects: input.followRegionRedirects ?? false,
    s3ExpressIdentityProvider: input.s3ExpressIdentityProvider ?? new S3ExpressIdentityProviderImpl(async (key) => s3ClientProvider().send(new CreateSessionCommandCtor({
      Bucket: key
    }))),
    bucketEndpoint: input.bucketEndpoint ?? false
  };
}, "resolveS3Config");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/throw-200-exceptions.js
init_checked_fetch();
init_modules_watch_stub();
var THROW_IF_EMPTY_BODY = {
  CopyObjectCommand: true,
  UploadPartCopyCommand: true,
  CompleteMultipartUploadCommand: true
};
var MAX_BYTES_TO_INSPECT = 3e3;
var throw200ExceptionsMiddleware = /* @__PURE__ */ __name((config) => (next, context) => async (args) => {
  const result = await next(args);
  const { response } = result;
  if (!HttpResponse.isInstance(response)) {
    return result;
  }
  const { statusCode, body: sourceBody } = response;
  if (statusCode < 200 || statusCode >= 300) {
    return result;
  }
  const isSplittableStream = typeof sourceBody?.stream === "function" || typeof sourceBody?.pipe === "function" || typeof sourceBody?.tee === "function";
  if (!isSplittableStream) {
    return result;
  }
  let bodyCopy = sourceBody;
  let body = sourceBody;
  if (sourceBody && typeof sourceBody === "object" && !(sourceBody instanceof Uint8Array)) {
    [bodyCopy, body] = await splitStream(sourceBody);
  }
  response.body = body;
  const bodyBytes = await collectBody2(bodyCopy, {
    streamCollector: /* @__PURE__ */ __name(async (stream) => {
      return headStream(stream, MAX_BYTES_TO_INSPECT);
    }, "streamCollector")
  });
  if (typeof bodyCopy?.destroy === "function") {
    bodyCopy.destroy();
  }
  const bodyStringTail = config.utf8Encoder(bodyBytes.subarray(bodyBytes.length - 16));
  if (bodyBytes.length === 0 && THROW_IF_EMPTY_BODY[context.commandName]) {
    const err = new Error("S3 aborted request");
    err.name = "InternalError";
    throw err;
  }
  if (bodyStringTail && bodyStringTail.endsWith("</Error>")) {
    response.statusCode = 400;
  }
  return result;
}, "throw200ExceptionsMiddleware");
var collectBody2 = /* @__PURE__ */ __name((streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
}, "collectBody");
var throw200ExceptionsMiddlewareOptions = {
  relation: "after",
  toMiddleware: "deserializerMiddleware",
  tags: ["THROW_200_EXCEPTIONS", "S3"],
  name: "throw200ExceptionsMiddleware",
  override: true
};
var getThrow200ExceptionsPlugin = /* @__PURE__ */ __name((config) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.addRelativeTo(throw200ExceptionsMiddleware(config), throw200ExceptionsMiddlewareOptions);
  }, "applyToStack")
}), "getThrow200ExceptionsPlugin");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/validate-bucket-name.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-arn-parser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
var validate = /* @__PURE__ */ __name((str) => typeof str === "string" && str.indexOf("arn:") === 0 && str.split(":").length >= 6, "validate");

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/bucket-endpoint-middleware.js
init_checked_fetch();
init_modules_watch_stub();
function bucketEndpointMiddleware(options) {
  return (next, context) => async (args) => {
    if (options.bucketEndpoint) {
      const endpoint = context.endpointV2;
      if (endpoint) {
        const bucket = args.input.Bucket;
        if (typeof bucket === "string") {
          try {
            const bucketEndpointUrl = new URL(bucket);
            context.endpointV2 = {
              ...endpoint,
              url: bucketEndpointUrl
            };
          } catch (e2) {
            const warning = `@aws-sdk/middleware-sdk-s3: bucketEndpoint=true was set but Bucket=${bucket} could not be parsed as URL.`;
            if (context.logger?.constructor?.name === "NoOpLogger") {
              console.warn(warning);
            } else {
              context.logger?.warn?.(warning);
            }
            throw e2;
          }
        }
      }
    }
    return next(args);
  };
}
__name(bucketEndpointMiddleware, "bucketEndpointMiddleware");
var bucketEndpointMiddlewareOptions = {
  name: "bucketEndpointMiddleware",
  override: true,
  relation: "after",
  toMiddleware: "endpointV2Middleware"
};

// node_modules/@aws-sdk/middleware-sdk-s3/dist-es/validate-bucket-name.js
function validateBucketNameMiddleware({ bucketEndpoint }) {
  return (next) => async (args) => {
    const { input: { Bucket } } = args;
    if (!bucketEndpoint && typeof Bucket === "string" && !validate(Bucket) && Bucket.indexOf("/") >= 0) {
      const err = new Error(`Bucket name shouldn't contain '/', received '${Bucket}'`);
      err.name = "InvalidBucketName";
      throw err;
    }
    return next({ ...args });
  };
}
__name(validateBucketNameMiddleware, "validateBucketNameMiddleware");
var validateBucketNameMiddlewareOptions = {
  step: "initialize",
  tags: ["VALIDATE_BUCKET_NAME"],
  name: "validateBucketNameMiddleware",
  override: true
};
var getValidateBucketNamePlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(validateBucketNameMiddleware(options), validateBucketNameMiddlewareOptions);
    clientStack.addRelativeTo(bucketEndpointMiddleware(options), bucketEndpointMiddlewareOptions);
  }, "applyToStack")
}), "getValidateBucketNamePlugin");

// node_modules/@aws-sdk/middleware-user-agent/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-user-agent/dist-es/configurations.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_UA_APP_ID = void 0;
function isValidUserAgentAppId(appId) {
  if (appId === void 0) {
    return true;
  }
  return typeof appId === "string" && appId.length <= 50;
}
__name(isValidUserAgentAppId, "isValidUserAgentAppId");
function resolveUserAgentConfig(input) {
  const normalizedAppIdProvider = normalizeProvider2(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
  return {
    ...input,
    customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent,
    userAgentAppId: /* @__PURE__ */ __name(async () => {
      const appId = await normalizedAppIdProvider();
      if (!isValidUserAgentAppId(appId)) {
        const logger2 = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
        if (typeof appId !== "string") {
          logger2?.warn("userAgentAppId must be a string or undefined.");
        } else if (appId.length > 50) {
          logger2?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
        }
      }
      return appId;
    }, "userAgentAppId")
  };
}
__name(resolveUserAgentConfig, "resolveUserAgentConfig");

// node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/aws.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/cache/EndpointCache.js
init_checked_fetch();
init_modules_watch_stub();
var EndpointCache = class {
  static {
    __name(this, "EndpointCache");
  }
  constructor({ size, params }) {
    this.data = /* @__PURE__ */ new Map();
    this.parameters = [];
    this.capacity = size ?? 50;
    if (params) {
      this.parameters = params;
    }
  }
  get(endpointParams, resolver) {
    const key = this.hash(endpointParams);
    if (key === false) {
      return resolver();
    }
    if (!this.data.has(key)) {
      if (this.data.size > this.capacity + 10) {
        const keys = this.data.keys();
        let i2 = 0;
        while (true) {
          const { value, done } = keys.next();
          this.data.delete(value);
          if (done || ++i2 > 10) {
            break;
          }
        }
      }
      this.data.set(key, resolver());
    }
    return this.data.get(key);
  }
  size() {
    return this.data.size;
  }
  hash(endpointParams) {
    let buffer = "";
    const { parameters } = this;
    if (parameters.length === 0) {
      return false;
    }
    for (const param of parameters) {
      const val2 = String(endpointParams[param] ?? "");
      if (val2.includes("|;")) {
        return false;
      }
      buffer += val2 + "|;";
    }
    return buffer;
  }
};

// node_modules/@smithy/util-endpoints/dist-es/lib/isIpAddress.js
init_checked_fetch();
init_modules_watch_stub();
var IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
var isIpAddress = /* @__PURE__ */ __name((value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]"), "isIpAddress");

// node_modules/@smithy/util-endpoints/dist-es/lib/isValidHostLabel.js
init_checked_fetch();
init_modules_watch_stub();
var VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
var isValidHostLabel = /* @__PURE__ */ __name((value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
}, "isValidHostLabel");

// node_modules/@smithy/util-endpoints/dist-es/utils/customEndpointFunctions.js
init_checked_fetch();
init_modules_watch_stub();
var customEndpointFunctions = {};

// node_modules/@smithy/util-endpoints/dist-es/resolveEndpoint.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/debug/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/debug/debugId.js
init_checked_fetch();
init_modules_watch_stub();
var debugId = "endpoints";

// node_modules/@smithy/util-endpoints/dist-es/debug/toDebugString.js
init_checked_fetch();
init_modules_watch_stub();
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}
__name(toDebugString, "toDebugString");

// node_modules/@smithy/util-endpoints/dist-es/types/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/types/EndpointError.js
init_checked_fetch();
init_modules_watch_stub();
var EndpointError = class extends Error {
  static {
    __name(this, "EndpointError");
  }
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
};

// node_modules/@smithy/util-endpoints/dist-es/types/EndpointFunctions.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/types/EndpointRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/types/ErrorRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/types/RuleSetObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/types/TreeRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/types/shared.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateRules.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateEndpointRule.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateConditions.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateCondition.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/callFunction.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/endpointFunctions.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/lib/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/lib/booleanEquals.js
init_checked_fetch();
init_modules_watch_stub();
var booleanEquals = /* @__PURE__ */ __name((value1, value2) => value1 === value2, "booleanEquals");

// node_modules/@smithy/util-endpoints/dist-es/lib/getAttr.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/lib/getAttrPathList.js
init_checked_fetch();
init_modules_watch_stub();
var getAttrPathList = /* @__PURE__ */ __name((path) => {
  const parts = path.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
}, "getAttrPathList");

// node_modules/@smithy/util-endpoints/dist-es/lib/getAttr.js
var getAttr = /* @__PURE__ */ __name((value, path) => getAttrPathList(path).reduce((acc, index) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index)];
  }
  return acc[index];
}, value), "getAttr");

// node_modules/@smithy/util-endpoints/dist-es/lib/isSet.js
init_checked_fetch();
init_modules_watch_stub();
var isSet = /* @__PURE__ */ __name((value) => value != null, "isSet");

// node_modules/@smithy/util-endpoints/dist-es/lib/not.js
init_checked_fetch();
init_modules_watch_stub();
var not = /* @__PURE__ */ __name((value) => !value, "not");

// node_modules/@smithy/util-endpoints/dist-es/lib/parseURL.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
var parseURL = /* @__PURE__ */ __name((value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const { hostname: hostname2, port, protocol: protocol2 = "", path = "", query = {} } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path}`);
        url.search = Object.entries(query).map(([k2, v2]) => `${k2}=${v2}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const { host, hostname, pathname, protocol, search } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
}, "parseURL");

// node_modules/@smithy/util-endpoints/dist-es/lib/stringEquals.js
init_checked_fetch();
init_modules_watch_stub();
var stringEquals = /* @__PURE__ */ __name((value1, value2) => value1 === value2, "stringEquals");

// node_modules/@smithy/util-endpoints/dist-es/lib/substring.js
init_checked_fetch();
init_modules_watch_stub();
var substring = /* @__PURE__ */ __name((input, start, stop, reverse) => {
  if (start >= stop || input.length < stop) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
}, "substring");

// node_modules/@smithy/util-endpoints/dist-es/lib/uriEncode.js
init_checked_fetch();
init_modules_watch_stub();
var uriEncode = /* @__PURE__ */ __name((value) => encodeURIComponent(value).replace(/[!*'()]/g, (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`), "uriEncode");

// node_modules/@smithy/util-endpoints/dist-es/utils/endpointFunctions.js
var endpointFunctions = {
  booleanEquals,
  getAttr,
  isSet,
  isValidHostLabel,
  not,
  parseURL,
  stringEquals,
  substring,
  uriEncode
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateExpression.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTemplate.js
init_checked_fetch();
init_modules_watch_stub();
var evaluateTemplate = /* @__PURE__ */ __name((template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
}, "evaluateTemplate");

// node_modules/@smithy/util-endpoints/dist-es/utils/getReferenceValue.js
init_checked_fetch();
init_modules_watch_stub();
var getReferenceValue = /* @__PURE__ */ __name(({ ref }, options) => {
  const referenceRecord = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  return referenceRecord[ref];
}, "getReferenceValue");

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateExpression.js
var evaluateExpression = /* @__PURE__ */ __name((obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
}, "evaluateExpression");

// node_modules/@smithy/util-endpoints/dist-es/utils/callFunction.js
var callFunction = /* @__PURE__ */ __name(({ fn, argv }, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : evaluateExpression(arg, "arg", options));
  const fnSegments = fn.split(".");
  if (fnSegments[0] in customEndpointFunctions && fnSegments[1] != null) {
    return customEndpointFunctions[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
  }
  return endpointFunctions[fn](...evaluatedArgs);
}, "callFunction");

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateCondition.js
var evaluateCondition = /* @__PURE__ */ __name(({ assign, ...fnArgs }, options) => {
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return {
    result: value === "" ? true : !!value,
    ...assign != null && { toAssign: { name: assign, value } }
  };
}, "evaluateCondition");

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateConditions.js
var evaluateConditions = /* @__PURE__ */ __name((conditions = [], options) => {
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const { result, toAssign } = evaluateCondition(condition, {
      ...options,
      referenceRecord: {
        ...options.referenceRecord,
        ...conditionsReferenceRecord
      }
    });
    if (!result) {
      return { result };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return { result: true, referenceRecord: conditionsReferenceRecord };
}, "evaluateConditions");

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointHeaders.js
init_checked_fetch();
init_modules_watch_stub();
var getEndpointHeaders = /* @__PURE__ */ __name((headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
  ...acc,
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {}), "getEndpointHeaders");

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperties.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperty.js
init_checked_fetch();
init_modules_watch_stub();
var getEndpointProperty = /* @__PURE__ */ __name((property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
}, "getEndpointProperty");

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperties.js
var getEndpointProperties = /* @__PURE__ */ __name((properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
  ...acc,
  [propertyKey]: getEndpointProperty(propertyVal, options)
}), {}), "getEndpointProperties");

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointUrl.js
init_checked_fetch();
init_modules_watch_stub();
var getEndpointUrl = /* @__PURE__ */ __name((endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error) {
      console.error(`Failed to construct URL with ${expression}`, error);
      throw error;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
}, "getEndpointUrl");

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateEndpointRule.js
var evaluateEndpointRule = /* @__PURE__ */ __name((endpointRule, options) => {
  const { conditions, endpoint } = endpointRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  };
  const { url, properties, headers } = endpoint;
  options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return {
    ...headers != void 0 && {
      headers: getEndpointHeaders(headers, endpointRuleOptions)
    },
    ...properties != void 0 && {
      properties: getEndpointProperties(properties, endpointRuleOptions)
    },
    url: getEndpointUrl(url, endpointRuleOptions)
  };
}, "evaluateEndpointRule");

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateErrorRule.js
init_checked_fetch();
init_modules_watch_stub();
var evaluateErrorRule = /* @__PURE__ */ __name((errorRule, options) => {
  const { conditions, error } = errorRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error, "Error", {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  }));
}, "evaluateErrorRule");

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTreeRule.js
init_checked_fetch();
init_modules_watch_stub();
var evaluateTreeRule = /* @__PURE__ */ __name((treeRule, options) => {
  const { conditions, rules } = treeRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return evaluateRules(rules, {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  });
}, "evaluateTreeRule");

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateRules.js
var evaluateRules = /* @__PURE__ */ __name((rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
}, "evaluateRules");

// node_modules/@smithy/util-endpoints/dist-es/resolveEndpoint.js
var resolveEndpoint = /* @__PURE__ */ __name((ruleSetObject, options) => {
  const { endpointParams, logger: logger2 } = options;
  const { parameters, rules } = ruleSetObject;
  options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v2]) => v2.default != null).map(([k2, v2]) => [k2, v2.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v2]) => v2.required).map(([k2]) => k2);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
  options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
}, "resolveEndpoint");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/isVirtualHostableS3Bucket.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/isIpAddress.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/isVirtualHostableS3Bucket.js
var isVirtualHostableS3Bucket = /* @__PURE__ */ __name((value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
}, "isVirtualHostableS3Bucket");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/parseArn.js
init_checked_fetch();
init_modules_watch_stub();
var ARN_DELIMITER = ":";
var RESOURCE_DELIMITER = "/";
var parseArn = /* @__PURE__ */ __name((value) => {
  const segments = value.split(ARN_DELIMITER);
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourcePath] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
    return null;
  const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId
  };
}, "parseArn");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partition.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partitions.json
var partitions_default = {
  partitions: [{
    id: "aws",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-east-1",
      name: "aws",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
    regions: {
      "af-south-1": {
        description: "Africa (Cape Town)"
      },
      "ap-east-1": {
        description: "Asia Pacific (Hong Kong)"
      },
      "ap-northeast-1": {
        description: "Asia Pacific (Tokyo)"
      },
      "ap-northeast-2": {
        description: "Asia Pacific (Seoul)"
      },
      "ap-northeast-3": {
        description: "Asia Pacific (Osaka)"
      },
      "ap-south-1": {
        description: "Asia Pacific (Mumbai)"
      },
      "ap-south-2": {
        description: "Asia Pacific (Hyderabad)"
      },
      "ap-southeast-1": {
        description: "Asia Pacific (Singapore)"
      },
      "ap-southeast-2": {
        description: "Asia Pacific (Sydney)"
      },
      "ap-southeast-3": {
        description: "Asia Pacific (Jakarta)"
      },
      "ap-southeast-4": {
        description: "Asia Pacific (Melbourne)"
      },
      "ap-southeast-5": {
        description: "Asia Pacific (Malaysia)"
      },
      "ap-southeast-7": {
        description: "Asia Pacific (Thailand)"
      },
      "aws-global": {
        description: "AWS Standard global region"
      },
      "ca-central-1": {
        description: "Canada (Central)"
      },
      "ca-west-1": {
        description: "Canada West (Calgary)"
      },
      "eu-central-1": {
        description: "Europe (Frankfurt)"
      },
      "eu-central-2": {
        description: "Europe (Zurich)"
      },
      "eu-north-1": {
        description: "Europe (Stockholm)"
      },
      "eu-south-1": {
        description: "Europe (Milan)"
      },
      "eu-south-2": {
        description: "Europe (Spain)"
      },
      "eu-west-1": {
        description: "Europe (Ireland)"
      },
      "eu-west-2": {
        description: "Europe (London)"
      },
      "eu-west-3": {
        description: "Europe (Paris)"
      },
      "il-central-1": {
        description: "Israel (Tel Aviv)"
      },
      "me-central-1": {
        description: "Middle East (UAE)"
      },
      "me-south-1": {
        description: "Middle East (Bahrain)"
      },
      "mx-central-1": {
        description: "Mexico (Central)"
      },
      "sa-east-1": {
        description: "South America (Sao Paulo)"
      },
      "us-east-1": {
        description: "US East (N. Virginia)"
      },
      "us-east-2": {
        description: "US East (Ohio)"
      },
      "us-west-1": {
        description: "US West (N. California)"
      },
      "us-west-2": {
        description: "US West (Oregon)"
      }
    }
  }, {
    id: "aws-cn",
    outputs: {
      dnsSuffix: "amazonaws.com.cn",
      dualStackDnsSuffix: "api.amazonwebservices.com.cn",
      implicitGlobalRegion: "cn-northwest-1",
      name: "aws-cn",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    regions: {
      "aws-cn-global": {
        description: "AWS China global region"
      },
      "cn-north-1": {
        description: "China (Beijing)"
      },
      "cn-northwest-1": {
        description: "China (Ningxia)"
      }
    }
  }, {
    id: "aws-us-gov",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-gov-west-1",
      name: "aws-us-gov",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    regions: {
      "aws-us-gov-global": {
        description: "AWS GovCloud (US) global region"
      },
      "us-gov-east-1": {
        description: "AWS GovCloud (US-East)"
      },
      "us-gov-west-1": {
        description: "AWS GovCloud (US-West)"
      }
    }
  }, {
    id: "aws-iso",
    outputs: {
      dnsSuffix: "c2s.ic.gov",
      dualStackDnsSuffix: "c2s.ic.gov",
      implicitGlobalRegion: "us-iso-east-1",
      name: "aws-iso",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-global": {
        description: "AWS ISO (US) global region"
      },
      "us-iso-east-1": {
        description: "US ISO East"
      },
      "us-iso-west-1": {
        description: "US ISO WEST"
      }
    }
  }, {
    id: "aws-iso-b",
    outputs: {
      dnsSuffix: "sc2s.sgov.gov",
      dualStackDnsSuffix: "sc2s.sgov.gov",
      implicitGlobalRegion: "us-isob-east-1",
      name: "aws-iso-b",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-b-global": {
        description: "AWS ISOB (US) global region"
      },
      "us-isob-east-1": {
        description: "US ISOB East (Ohio)"
      }
    }
  }, {
    id: "aws-iso-e",
    outputs: {
      dnsSuffix: "cloud.adc-e.uk",
      dualStackDnsSuffix: "cloud.adc-e.uk",
      implicitGlobalRegion: "eu-isoe-west-1",
      name: "aws-iso-e",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
    regions: {
      "eu-isoe-west-1": {
        description: "EU ISOE West"
      }
    }
  }, {
    id: "aws-iso-f",
    outputs: {
      dnsSuffix: "csp.hci.ic.gov",
      dualStackDnsSuffix: "csp.hci.ic.gov",
      implicitGlobalRegion: "us-isof-south-1",
      name: "aws-iso-f",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-f-global": {
        description: "AWS ISOF global region"
      },
      "us-isof-east-1": {
        description: "US ISOF EAST"
      },
      "us-isof-south-1": {
        description: "US ISOF SOUTH"
      }
    }
  }],
  version: "1.1"
};

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partition.js
var selectedPartitionsInfo = partitions_default;
var selectedUserAgentPrefix = "";
var partition = /* @__PURE__ */ __name((value) => {
  const { partitions } = selectedPartitionsInfo;
  for (const partition2 of partitions) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return {
          ...outputs,
          ...regionData
        };
      }
    }
  }
  for (const partition2 of partitions) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return {
        ...outputs
      };
    }
  }
  const DEFAULT_PARTITION = partitions.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return {
    ...DEFAULT_PARTITION.outputs
  };
}, "partition");
var getUserAgentPrefix = /* @__PURE__ */ __name(() => selectedUserAgentPrefix, "getUserAgentPrefix");

// node_modules/@aws-sdk/util-endpoints/dist-es/aws.js
var awsEndpointFunctions = {
  isVirtualHostableS3Bucket,
  parseArn,
  partition
};
customEndpointFunctions.aws = awsEndpointFunctions;

// node_modules/@aws-sdk/util-endpoints/dist-es/resolveEndpoint.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/types/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/types/EndpointError.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/types/EndpointRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/types/ErrorRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/types/RuleSetObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/types/TreeRuleObject.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/util-endpoints/dist-es/types/shared.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/middleware-user-agent/dist-es/check-features.js
init_checked_fetch();
init_modules_watch_stub();
var ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
async function checkFeatures(context, config, args) {
  const request = args.request;
  if (request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") {
    setFeature(context, "PROTOCOL_RPC_V2_CBOR", "M");
  }
  if (typeof config.retryStrategy === "function") {
    const retryStrategy = await config.retryStrategy();
    if (typeof retryStrategy.acquireInitialRetryToken === "function") {
      if (retryStrategy.constructor?.name?.includes("Adaptive")) {
        setFeature(context, "RETRY_MODE_ADAPTIVE", "F");
      } else {
        setFeature(context, "RETRY_MODE_STANDARD", "E");
      }
    } else {
      setFeature(context, "RETRY_MODE_LEGACY", "D");
    }
  }
  if (typeof config.accountIdEndpointMode === "function") {
    const endpointV2 = context.endpointV2;
    if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) {
      setFeature(context, "ACCOUNT_ID_ENDPOINT", "O");
    }
    switch (await config.accountIdEndpointMode?.()) {
      case "disabled":
        setFeature(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
        break;
      case "preferred":
        setFeature(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
        break;
      case "required":
        setFeature(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
        break;
    }
  }
  const identity = context.__smithy_context?.selectedHttpAuthScheme?.identity;
  if (identity?.$source) {
    const credentials = identity;
    if (credentials.accountId) {
      setFeature(context, "RESOLVED_ACCOUNT_ID", "T");
    }
    for (const [key, value] of Object.entries(credentials.$source ?? {})) {
      setFeature(context, key, value);
    }
  }
}
__name(checkFeatures, "checkFeatures");

// node_modules/@aws-sdk/middleware-user-agent/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var USER_AGENT = "user-agent";
var X_AMZ_USER_AGENT = "x-amz-user-agent";
var SPACE = " ";
var UA_NAME_SEPARATOR = "/";
var UA_NAME_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
var UA_VALUE_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g;
var UA_ESCAPE_CHAR = "-";

// node_modules/@aws-sdk/middleware-user-agent/dist-es/encode-features.js
init_checked_fetch();
init_modules_watch_stub();
var BYTE_LIMIT = 1024;
function encodeFeatures(features) {
  let buffer = "";
  for (const key in features) {
    const val2 = features[key];
    if (buffer.length + val2.length + 1 <= BYTE_LIMIT) {
      if (buffer.length) {
        buffer += "," + val2;
      } else {
        buffer += val2;
      }
      continue;
    }
    break;
  }
  return buffer;
}
__name(encodeFeatures, "encodeFeatures");

// node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js
var userAgentMiddleware = /* @__PURE__ */ __name((options) => (next, context) => async (args) => {
  const { request } = args;
  if (!HttpRequest.isInstance(request)) {
    return next(args);
  }
  const { headers } = request;
  const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
  const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
  await checkFeatures(context, options, args);
  const awsContext = context;
  defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
  const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
  const appId = await options.userAgentAppId();
  if (appId) {
    defaultUserAgent.push(escapeUserAgent([`app/${appId}`]));
  }
  const prefix = getUserAgentPrefix();
  const sdkUserAgentValue = (prefix ? [prefix] : []).concat([...defaultUserAgent, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next({
    ...args,
    request
  });
}, "userAgentMiddleware");
var escapeUserAgent = /* @__PURE__ */ __name((userAgentPair) => {
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
}, "escapeUserAgent");
var getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
var getUserAgentPlugin = /* @__PURE__ */ __name((config) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }, "applyToStack")
}), "getUserAgentPlugin");

// node_modules/@smithy/config-resolver/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_USE_DUALSTACK_ENDPOINT = false;

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_USE_FIPS_ENDPOINT = false;

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/resolveCustomEndpointsConfig.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/resolveEndpointsConfig.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/utils/getEndpointFromRegion.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionConfig/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionConfig/config.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionConfig/resolveRegionConfig.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionConfig/getRealRegion.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionConfig/isFipsRegion.js
init_checked_fetch();
init_modules_watch_stub();
var isFipsRegion = /* @__PURE__ */ __name((region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips")), "isFipsRegion");

// node_modules/@smithy/config-resolver/dist-es/regionConfig/getRealRegion.js
var getRealRegion = /* @__PURE__ */ __name((region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region, "getRealRegion");

// node_modules/@smithy/config-resolver/dist-es/regionConfig/resolveRegionConfig.js
var resolveRegionConfig = /* @__PURE__ */ __name((input) => {
  const { region, useFipsEndpoint } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return {
    ...input,
    region: /* @__PURE__ */ __name(async () => {
      if (typeof region === "string") {
        return getRealRegion(region);
      }
      const providedRegion = await region();
      return getRealRegion(providedRegion);
    }, "region"),
    useFipsEndpoint: /* @__PURE__ */ __name(async () => {
      const providedRegion = typeof region === "string" ? region : await region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    }, "useFipsEndpoint")
  };
}, "resolveRegionConfig");

// node_modules/@smithy/config-resolver/dist-es/regionInfo/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionInfo/PartitionHash.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionInfo/RegionHash.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionInfo/getRegionInfo.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionInfo/getHostnameFromVariants.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionInfo/getResolvedHostname.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionInfo/getResolvedPartition.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/config-resolver/dist-es/regionInfo/getResolvedSigningRegion.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-serde-config-resolver/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-serde-config-resolver/dist-es/EventStreamSerdeConfig.js
init_checked_fetch();
init_modules_watch_stub();
var resolveEventStreamSerdeConfig = /* @__PURE__ */ __name((input) => ({
  ...input,
  eventStreamMarshaller: input.eventStreamSerdeProvider(input)
}), "resolveEventStreamSerdeConfig");

// node_modules/@smithy/middleware-content-length/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
var CONTENT_LENGTH_HEADER2 = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => async (args) => {
    const request = args.request;
    if (HttpRequest.isInstance(request)) {
      const { body, headers } = request;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER2) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request.headers = {
            ...request.headers,
            [CONTENT_LENGTH_HEADER2]: String(length)
          };
        } catch (error) {
        }
      }
    }
    return next({
      ...args,
      request
    });
  };
}
__name(contentLengthMiddleware, "contentLengthMiddleware");
var contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
var getContentLengthPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }, "applyToStack")
}), "getContentLengthPlugin");

// node_modules/@smithy/middleware-endpoint/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromInstructions.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-endpoint/dist-es/service-customizations/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-endpoint/dist-es/service-customizations/s3.js
init_checked_fetch();
init_modules_watch_stub();
var resolveParamsForS3 = /* @__PURE__ */ __name(async (endpointParams) => {
  const bucket = endpointParams?.Bucket || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
}, "resolveParamsForS3");
var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
var DOTS_PATTERN = /\.\./;
var isDnsCompatibleBucketName = /* @__PURE__ */ __name((bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName), "isDnsCompatibleBucketName");
var isArnBucketName = /* @__PURE__ */ __name((bucketName) => {
  const [arn, partition2, service, , , bucket] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = Boolean(isArn && partition2 && service && bucket);
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return isValidArn;
}, "isArnBucketName");

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/createConfigValueProvider.js
init_checked_fetch();
init_modules_watch_stub();
var createConfigValueProvider = /* @__PURE__ */ __name((configKey, canonicalEndpointParamKey, config) => {
  const configProvider = /* @__PURE__ */ __name(async () => {
    const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  }, "configProvider");
  if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
    return async () => {
      const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
      const configValue = credentials?.credentialScope ?? credentials?.CredentialScope;
      return configValue;
    };
  }
  if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
    return async () => {
      const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
      const configValue = credentials?.accountId ?? credentials?.AccountId;
      return configValue;
    };
  }
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return async () => {
      const endpoint = await configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    };
  }
  return configProvider;
}, "createConfigValueProvider");

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromConfig.browser.js
init_checked_fetch();
init_modules_watch_stub();
var getEndpointFromConfig = /* @__PURE__ */ __name(async (serviceId) => void 0, "getEndpointFromConfig");

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/toEndpointV1.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/url-parser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/querystring-parser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}
__name(parseQueryString, "parseQueryString");

// node_modules/@smithy/url-parser/dist-es/index.js
var parseUrl = /* @__PURE__ */ __name((url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const { hostname, pathname, port, protocol, search } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
}, "parseUrl");

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/toEndpointV1.js
var toEndpointV1 = /* @__PURE__ */ __name((endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      return parseUrl(endpoint.url);
    }
    return endpoint;
  }
  return parseUrl(endpoint);
}, "toEndpointV1");

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromInstructions.js
var getEndpointFromInstructions = /* @__PURE__ */ __name(async (commandInput, instructionsSupplier, clientConfig, context) => {
  if (!clientConfig.endpoint) {
    let endpointFromConfig;
    if (clientConfig.serviceConfiguredEndpoint) {
      endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
    } else {
      endpointFromConfig = await getEndpointFromConfig(clientConfig.serviceId);
    }
    if (endpointFromConfig) {
      clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig));
    }
  }
  const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  return endpoint;
}, "getEndpointFromInstructions");
var resolveParams = /* @__PURE__ */ __name(async (commandInput, instructionsSupplier, clientConfig) => {
  const endpointParams = {};
  const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig)();
        break;
      case "operationContextParams":
        endpointParams[name] = instruction.get(commandInput);
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    await resolveParamsForS3(endpointParams);
  }
  return endpointParams;
}, "resolveParams");

// node_modules/@smithy/middleware-endpoint/dist-es/endpointMiddleware.js
init_checked_fetch();
init_modules_watch_stub();
var endpointMiddleware = /* @__PURE__ */ __name(({ config, instructions }) => {
  return (next, context) => async (args) => {
    if (config.endpoint) {
      setFeature2(context, "ENDPOINT_OVERRIDE", "N");
    }
    const endpoint = await getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, { ...config }, context);
    context.endpointV2 = endpoint;
    context.authSchemes = endpoint.properties?.authSchemes;
    const authScheme = context.authSchemes?.[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
      const smithyContext = getSmithyContext(context);
      const httpAuthOption = smithyContext?.selectedHttpAuthScheme?.httpAuthOption;
      if (httpAuthOption) {
        httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
          signing_region: authScheme.signingRegion,
          signingRegion: authScheme.signingRegion,
          signing_service: authScheme.signingName,
          signingName: authScheme.signingName,
          signingRegionSet: authScheme.signingRegionSet
        }, authScheme.properties);
      }
    }
    return next({
      ...args
    });
  };
}, "endpointMiddleware");

// node_modules/@smithy/middleware-endpoint/dist-es/getEndpointPlugin.js
init_checked_fetch();
init_modules_watch_stub();
var endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
var getEndpointPlugin = /* @__PURE__ */ __name((config, instructions) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config,
      instructions
    }), endpointMiddlewareOptions);
  }, "applyToStack")
}), "getEndpointPlugin");

// node_modules/@smithy/middleware-endpoint/dist-es/resolveEndpointConfig.js
init_checked_fetch();
init_modules_watch_stub();
var resolveEndpointConfig = /* @__PURE__ */ __name((input) => {
  const tls = input.tls ?? true;
  const { endpoint } = input;
  const customEndpointProvider = endpoint != null ? async () => toEndpointV1(await normalizeProvider(endpoint)()) : void 0;
  const isCustomEndpoint = !!endpoint;
  const resolvedConfig = {
    ...input,
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider(input.useDualstackEndpoint ?? false),
    useFipsEndpoint: normalizeProvider(input.useFipsEndpoint ?? false)
  };
  let configuredEndpointPromise = void 0;
  resolvedConfig.serviceConfiguredEndpoint = async () => {
    if (input.serviceId && !configuredEndpointPromise) {
      configuredEndpointPromise = getEndpointFromConfig(input.serviceId);
    }
    return configuredEndpointPromise;
  };
  return resolvedConfig;
}, "resolveEndpointConfig");

// node_modules/@smithy/middleware-endpoint/dist-es/types.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/AdaptiveRetryStrategy.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-retry/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-retry/dist-es/AdaptiveRetryStrategy.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-retry/dist-es/config.js
init_checked_fetch();
init_modules_watch_stub();
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;

// node_modules/@smithy/util-retry/dist-es/DefaultRateLimiter.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/service-error-classification/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/service-error-classification/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
var TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"];
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];

// node_modules/@smithy/service-error-classification/dist-es/index.js
var isClockSkewCorrectedError = /* @__PURE__ */ __name((error) => error.$metadata?.clockSkewCorrected, "isClockSkewCorrectedError");
var isThrottlingError = /* @__PURE__ */ __name((error) => error.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error.name) || error.$retryable?.throttling == true, "isThrottlingError");
var isTransientError = /* @__PURE__ */ __name((error, depth = 0) => isClockSkewCorrectedError(error) || TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0) || error.cause !== void 0 && depth <= 10 && isTransientError(error.cause, depth + 1), "isTransientError");
var isServerError = /* @__PURE__ */ __name((error) => {
  if (error.$metadata?.httpStatusCode !== void 0) {
    const statusCode = error.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
      return true;
    }
    return false;
  }
  return false;
}, "isServerError");

// node_modules/@smithy/util-retry/dist-es/DefaultRateLimiter.js
var DefaultRateLimiter = class _DefaultRateLimiter {
  static {
    __name(this, "DefaultRateLimiter");
  }
  constructor(options) {
    this.currentCapacity = 0;
    this.enabled = false;
    this.lastMaxRate = 0;
    this.measuredTxRate = 0;
    this.requestCount = 0;
    this.lastTimestamp = 0;
    this.timeWindow = 0;
    this.beta = options?.beta ?? 0.7;
    this.minCapacity = options?.minCapacity ?? 1;
    this.minFillRate = options?.minFillRate ?? 0.5;
    this.scaleConstant = options?.scaleConstant ?? 0.4;
    this.smooth = options?.smooth ?? 0.8;
    const currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  async getSendToken() {
    return this.acquireTokenBucket(1);
  }
  async acquireTokenBucket(amount) {
    if (!this.enabled) {
      return;
    }
    this.refillTokenBucket();
    if (amount > this.currentCapacity) {
      const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
      await new Promise((resolve) => _DefaultRateLimiter.setTimeoutFn(resolve, delay));
    }
    this.currentCapacity = this.currentCapacity - amount;
  }
  refillTokenBucket() {
    const timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp;
  }
  updateClientSendingRate(response) {
    let calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response)) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t2 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t2 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
};
DefaultRateLimiter.setTimeoutFn = setTimeout;

// node_modules/@smithy/util-retry/dist-es/StandardRetryStrategy.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-retry/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_RETRY_DELAY_BASE = 100;
var MAXIMUM_RETRY_DELAY = 20 * 1e3;
var THROTTLING_RETRY_DELAY_BASE = 500;
var INITIAL_RETRY_TOKENS = 500;
var RETRY_COST = 5;
var TIMEOUT_RETRY_COST = 10;
var NO_RETRY_INCREMENT = 1;
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var REQUEST_HEADER = "amz-sdk-request";

// node_modules/@smithy/util-retry/dist-es/defaultRetryBackoffStrategy.js
init_checked_fetch();
init_modules_watch_stub();
var getDefaultRetryBackoffStrategy = /* @__PURE__ */ __name(() => {
  let delayBase = DEFAULT_RETRY_DELAY_BASE;
  const computeNextBackoffDelay = /* @__PURE__ */ __name((attempts) => {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
  }, "computeNextBackoffDelay");
  const setDelayBase = /* @__PURE__ */ __name((delay) => {
    delayBase = delay;
  }, "setDelayBase");
  return {
    computeNextBackoffDelay,
    setDelayBase
  };
}, "getDefaultRetryBackoffStrategy");

// node_modules/@smithy/util-retry/dist-es/defaultRetryToken.js
init_checked_fetch();
init_modules_watch_stub();
var createDefaultRetryToken = /* @__PURE__ */ __name(({ retryDelay, retryCount, retryCost }) => {
  const getRetryCount = /* @__PURE__ */ __name(() => retryCount, "getRetryCount");
  const getRetryDelay = /* @__PURE__ */ __name(() => Math.min(MAXIMUM_RETRY_DELAY, retryDelay), "getRetryDelay");
  const getRetryCost = /* @__PURE__ */ __name(() => retryCost, "getRetryCost");
  return {
    getRetryCount,
    getRetryDelay,
    getRetryCost
  };
}, "createDefaultRetryToken");

// node_modules/@smithy/util-retry/dist-es/StandardRetryStrategy.js
var StandardRetryStrategy = class {
  static {
    __name(this, "StandardRetryStrategy");
  }
  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts;
    this.mode = RETRY_MODES.STANDARD;
    this.capacity = INITIAL_RETRY_TOKENS;
    this.retryBackoffStrategy = getDefaultRetryBackoffStrategy();
    this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts;
  }
  async acquireInitialRetryToken(retryTokenScope) {
    return createDefaultRetryToken({
      retryDelay: DEFAULT_RETRY_DELAY_BASE,
      retryCount: 0
    });
  }
  async refreshRetryTokenForRetry(token, errorInfo) {
    const maxAttempts = await this.getMaxAttempts();
    if (this.shouldRetry(token, errorInfo, maxAttempts)) {
      const errorType = errorInfo.errorType;
      this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE);
      const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
      const retryDelay = errorInfo.retryAfterHint ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType) : delayFromErrorType;
      const capacityCost = this.getCapacityCost(errorType);
      this.capacity -= capacityCost;
      return createDefaultRetryToken({
        retryDelay,
        retryCount: token.getRetryCount() + 1,
        retryCost: capacityCost
      });
    }
    throw new Error("No retry token available");
  }
  recordSuccess(token) {
    this.capacity = Math.max(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
  }
  getCapacity() {
    return this.capacity;
  }
  async getMaxAttempts() {
    try {
      return await this.maxAttemptsProvider();
    } catch (error) {
      console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
      return DEFAULT_MAX_ATTEMPTS;
    }
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount() + 1;
    return attempts < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  getCapacityCost(errorType) {
    return errorType === "TRANSIENT" ? TIMEOUT_RETRY_COST : RETRY_COST;
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
};

// node_modules/@smithy/util-retry/dist-es/AdaptiveRetryStrategy.js
var AdaptiveRetryStrategy = class {
  static {
    __name(this, "AdaptiveRetryStrategy");
  }
  constructor(maxAttemptsProvider, options) {
    this.maxAttemptsProvider = maxAttemptsProvider;
    this.mode = RETRY_MODES.ADAPTIVE;
    const { rateLimiter } = options ?? {};
    this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
    this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
  }
  async acquireInitialRetryToken(retryTokenScope) {
    await this.rateLimiter.getSendToken();
    return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
  }
  async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    this.rateLimiter.updateClientSendingRate(errorInfo);
    return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
};

// node_modules/@smithy/util-retry/dist-es/ConfiguredRetryStrategy.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-retry/dist-es/types.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/StandardRetryStrategy.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/uuid/dist/esm-browser/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/uuid/dist/esm-browser/rng.js
init_checked_fetch();
init_modules_watch_stub();
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// node_modules/uuid/dist/esm-browser/stringify.js
init_checked_fetch();
init_modules_watch_stub();
var byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
__name(unsafeStringify, "unsafeStringify");

// node_modules/uuid/dist/esm-browser/v4.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/uuid/dist/esm-browser/native.js
init_checked_fetch();
init_modules_watch_stub();
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// node_modules/@smithy/middleware-retry/dist-es/defaultRetryQuota.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/delayDecider.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/retryDecider.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/util.js
init_checked_fetch();
init_modules_watch_stub();
var asSdkError = /* @__PURE__ */ __name((error) => {
  if (error instanceof Error)
    return error;
  if (error instanceof Object)
    return Object.assign(new Error(), error);
  if (typeof error === "string")
    return new Error(error);
  return new Error(`AWS SDK error wrapper for ${error}`);
}, "asSdkError");

// node_modules/@smithy/middleware-retry/dist-es/configurations.js
init_checked_fetch();
init_modules_watch_stub();
var resolveRetryConfig = /* @__PURE__ */ __name((input) => {
  const { retryStrategy } = input;
  const maxAttempts = normalizeProvider(input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  return {
    ...input,
    maxAttempts,
    retryStrategy: /* @__PURE__ */ __name(async () => {
      if (retryStrategy) {
        return retryStrategy;
      }
      const retryMode = await normalizeProvider(input.retryMode)();
      if (retryMode === RETRY_MODES.ADAPTIVE) {
        return new AdaptiveRetryStrategy(maxAttempts);
      }
      return new StandardRetryStrategy(maxAttempts);
    }, "retryStrategy")
  };
}, "resolveRetryConfig");

// node_modules/@smithy/middleware-retry/dist-es/omitRetryHeadersMiddleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/retryMiddleware.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/middleware-retry/dist-es/isStreamingPayload/isStreamingPayload.browser.js
init_checked_fetch();
init_modules_watch_stub();
var isStreamingPayload = /* @__PURE__ */ __name((request) => request?.body instanceof ReadableStream, "isStreamingPayload");

// node_modules/@smithy/middleware-retry/dist-es/retryMiddleware.js
var retryMiddleware = /* @__PURE__ */ __name((options) => (next, context) => async (args) => {
  let retryStrategy = await options.retryStrategy();
  const maxAttempts = await options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const { request } = args;
    const isRequest = HttpRequest.isInstance(request);
    if (isRequest) {
      request.headers[INVOCATION_ID_HEADER] = v4_default();
    }
    while (true) {
      try {
        if (isRequest) {
          request.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const { response, output } = await next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return { response, output };
      } catch (e2) {
        const retryErrorInfo = getRetryErrorInfo(e2);
        lastError = asSdkError(e2);
        if (isRequest && isStreamingPayload(request)) {
          (context.logger instanceof NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
          throw lastError;
        }
        try {
          retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy?.mode)
      context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
  }
}, "retryMiddleware");
var isRetryStrategyV2 = /* @__PURE__ */ __name((retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined", "isRetryStrategyV2");
var getRetryErrorInfo = /* @__PURE__ */ __name((error) => {
  const errorInfo = {
    error,
    errorType: getRetryErrorType(error)
  };
  const retryAfterHint = getRetryAfterHint(error.$response);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
}, "getRetryErrorInfo");
var getRetryErrorType = /* @__PURE__ */ __name((error) => {
  if (isThrottlingError(error))
    return "THROTTLING";
  if (isTransientError(error))
    return "TRANSIENT";
  if (isServerError(error))
    return "SERVER_ERROR";
  return "CLIENT_ERROR";
}, "getRetryErrorType");
var retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
var getRetryPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }, "applyToStack")
}), "getRetryPlugin");
var getRetryAfterHint = /* @__PURE__ */ __name((response) => {
  if (!HttpResponse.isInstance(response))
    return;
  const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
  if (!retryAfterHeaderName)
    return;
  const retryAfter = response.headers[retryAfterHeaderName];
  const retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds))
    return new Date(retryAfterSeconds * 1e3);
  const retryAfterDate = new Date(retryAfter);
  return retryAfterDate;
}, "getRetryAfterHint");

// node_modules/@aws-sdk/client-s3/dist-es/auth/httpAuthSchemeProvider.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/signature-v4-multi-region/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/signature-v4-multi-region/dist-es/SignatureV4MultiRegion.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/signature-v4-multi-region/dist-es/signature-v4-crt-container.js
init_checked_fetch();
init_modules_watch_stub();
var signatureV4CrtContainer = {
  CrtSignerV4: null
};

// node_modules/@aws-sdk/signature-v4-multi-region/dist-es/SignatureV4MultiRegion.js
var SignatureV4MultiRegion = class {
  static {
    __name(this, "SignatureV4MultiRegion");
  }
  sigv4aSigner;
  sigv4Signer;
  signerOptions;
  constructor(options) {
    this.sigv4Signer = new SignatureV4S3Express(options);
    this.signerOptions = options;
  }
  async sign(requestToSign, options = {}) {
    if (options.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().sign(requestToSign, options);
    }
    return this.sigv4Signer.sign(requestToSign, options);
  }
  async signWithCredentials(requestToSign, credentials, options = {}) {
    if (options.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().signWithCredentials(requestToSign, credentials, options);
    }
    return this.sigv4Signer.signWithCredentials(requestToSign, credentials, options);
  }
  async presign(originalRequest, options = {}) {
    if (options.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().presign(originalRequest, options);
    }
    return this.sigv4Signer.presign(originalRequest, options);
  }
  async presignWithCredentials(originalRequest, credentials, options = {}) {
    if (options.signingRegion === "*") {
      throw new Error("Method presignWithCredentials is not supported for [signingRegion=*].");
    }
    return this.sigv4Signer.presignWithCredentials(originalRequest, credentials, options);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner) {
      let CrtSignerV4 = null;
      try {
        CrtSignerV4 = signatureV4CrtContainer.CrtSignerV4;
        if (typeof CrtSignerV4 !== "function")
          throw new Error();
      } catch (e2) {
        e2.message = `${e2.message}
Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. 
You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. 
For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`;
        throw e2;
      }
      this.sigv4aSigner = new CrtSignerV4({
        ...this.signerOptions,
        signingAlgorithm: 1
      });
    }
    return this.sigv4aSigner;
  }
};

// node_modules/@aws-sdk/client-s3/dist-es/endpoint/endpointResolver.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/client-s3/dist-es/endpoint/ruleset.js
init_checked_fetch();
init_modules_watch_stub();
var ci = "required";
var cj = "type";
var ck = "conditions";
var cl = "fn";
var cm = "argv";
var cn = "ref";
var co = "assign";
var cp = "url";
var cq = "properties";
var cr = "backend";
var cs = "authSchemes";
var ct = "disableDoubleEncoding";
var cu = "signingName";
var cv = "signingRegion";
var cw = "headers";
var cx = "signingRegionSet";
var a = 6;
var b = false;
var c = true;
var d = "isSet";
var e = "booleanEquals";
var f = "error";
var g = "aws.partition";
var h = "stringEquals";
var i = "getAttr";
var j = "name";
var k = "substring";
var l = "bucketSuffix";
var m = "parseURL";
var n = "{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}";
var o = "endpoint";
var p = "tree";
var q = "aws.isVirtualHostableS3Bucket";
var r = "{url#scheme}://{Bucket}.{url#authority}{url#path}";
var s = "not";
var t = "{url#scheme}://{url#authority}{url#path}";
var u = "hardwareType";
var v = "regionPrefix";
var w = "bucketAliasSuffix";
var x = "outpostId";
var y = "isValidHostLabel";
var z = "sigv4a";
var A = "s3-outposts";
var B = "s3";
var C = "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}";
var D = "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}";
var E = "https://{Bucket}.s3.{partitionResult#dnsSuffix}";
var F = "aws.parseArn";
var G = "bucketArn";
var H = "arnType";
var I = "";
var J = "s3-object-lambda";
var K = "accesspoint";
var L = "accessPointName";
var M = "{url#scheme}://{accessPointName}-{bucketArn#accountId}.{url#authority}{url#path}";
var N = "mrapPartition";
var O = "outpostType";
var P = "arnPrefix";
var Q = "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}";
var R = "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}";
var S = "https://s3.{partitionResult#dnsSuffix}";
var T = { [ci]: false, [cj]: "String" };
var U = { [ci]: true, "default": false, [cj]: "Boolean" };
var V = { [ci]: false, [cj]: "Boolean" };
var W = { [cl]: e, [cm]: [{ [cn]: "Accelerate" }, true] };
var X = { [cl]: e, [cm]: [{ [cn]: "UseFIPS" }, true] };
var Y = { [cl]: e, [cm]: [{ [cn]: "UseDualStack" }, true] };
var Z = { [cl]: d, [cm]: [{ [cn]: "Endpoint" }] };
var aa = { [cl]: g, [cm]: [{ [cn]: "Region" }], [co]: "partitionResult" };
var ab = { [cl]: h, [cm]: [{ [cl]: i, [cm]: [{ [cn]: "partitionResult" }, j] }, "aws-cn"] };
var ac = { [cl]: d, [cm]: [{ [cn]: "Bucket" }] };
var ad = { [cn]: "Bucket" };
var ae = { [cl]: m, [cm]: [{ [cn]: "Endpoint" }], [co]: "url" };
var af = { [cl]: e, [cm]: [{ [cl]: i, [cm]: [{ [cn]: "url" }, "isIp"] }, true] };
var ag = { [cn]: "url" };
var ah = { [cl]: "uriEncode", [cm]: [ad], [co]: "uri_encoded_bucket" };
var ai = { [cr]: "S3Express", [cs]: [{ [ct]: true, [j]: "sigv4", [cu]: "s3express", [cv]: "{Region}" }] };
var aj = {};
var ak = { [cl]: q, [cm]: [ad, false] };
var al = { [f]: "S3Express bucket name is not a valid virtual hostable name.", [cj]: f };
var am = { [cr]: "S3Express", [cs]: [{ [ct]: true, [j]: "sigv4-s3express", [cu]: "s3express", [cv]: "{Region}" }] };
var an = { [cl]: d, [cm]: [{ [cn]: "UseS3ExpressControlEndpoint" }] };
var ao = { [cl]: e, [cm]: [{ [cn]: "UseS3ExpressControlEndpoint" }, true] };
var ap = { [cl]: s, [cm]: [Z] };
var aq = { [f]: "Unrecognized S3Express bucket name format.", [cj]: f };
var ar = { [cl]: s, [cm]: [ac] };
var as = { [cn]: u };
var at = { [ck]: [ap], [f]: "Expected a endpoint to be specified but no endpoint was found", [cj]: f };
var au = { [cs]: [{ [ct]: true, [j]: z, [cu]: A, [cx]: ["*"] }, { [ct]: true, [j]: "sigv4", [cu]: A, [cv]: "{Region}" }] };
var av = { [cl]: e, [cm]: [{ [cn]: "ForcePathStyle" }, false] };
var aw = { [cn]: "ForcePathStyle" };
var ax = { [cl]: e, [cm]: [{ [cn]: "Accelerate" }, false] };
var ay = { [cl]: h, [cm]: [{ [cn]: "Region" }, "aws-global"] };
var az = { [cs]: [{ [ct]: true, [j]: "sigv4", [cu]: B, [cv]: "us-east-1" }] };
var aA = { [cl]: s, [cm]: [ay] };
var aB = { [cl]: e, [cm]: [{ [cn]: "UseGlobalEndpoint" }, true] };
var aC = { [cp]: "https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [cq]: { [cs]: [{ [ct]: true, [j]: "sigv4", [cu]: B, [cv]: "{Region}" }] }, [cw]: {} };
var aD = { [cs]: [{ [ct]: true, [j]: "sigv4", [cu]: B, [cv]: "{Region}" }] };
var aE = { [cl]: e, [cm]: [{ [cn]: "UseGlobalEndpoint" }, false] };
var aF = { [cl]: e, [cm]: [{ [cn]: "UseDualStack" }, false] };
var aG = { [cp]: "https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var aH = { [cl]: e, [cm]: [{ [cn]: "UseFIPS" }, false] };
var aI = { [cp]: "https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var aJ = { [cp]: "https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var aK = { [cl]: e, [cm]: [{ [cl]: i, [cm]: [ag, "isIp"] }, false] };
var aL = { [cp]: C, [cq]: aD, [cw]: {} };
var aM = { [cp]: r, [cq]: aD, [cw]: {} };
var aN = { [o]: aM, [cj]: o };
var aO = { [cp]: D, [cq]: aD, [cw]: {} };
var aP = { [cp]: "https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var aQ = { [f]: "Invalid region: region was not a valid DNS name.", [cj]: f };
var aR = { [cn]: G };
var aS = { [cn]: H };
var aT = { [cl]: i, [cm]: [aR, "service"] };
var aU = { [cn]: L };
var aV = { [ck]: [Y], [f]: "S3 Object Lambda does not support Dual-stack", [cj]: f };
var aW = { [ck]: [W], [f]: "S3 Object Lambda does not support S3 Accelerate", [cj]: f };
var aX = { [ck]: [{ [cl]: d, [cm]: [{ [cn]: "DisableAccessPoints" }] }, { [cl]: e, [cm]: [{ [cn]: "DisableAccessPoints" }, true] }], [f]: "Access points are not supported for this operation", [cj]: f };
var aY = { [ck]: [{ [cl]: d, [cm]: [{ [cn]: "UseArnRegion" }] }, { [cl]: e, [cm]: [{ [cn]: "UseArnRegion" }, false] }, { [cl]: s, [cm]: [{ [cl]: h, [cm]: [{ [cl]: i, [cm]: [aR, "region"] }, "{Region}"] }] }], [f]: "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`", [cj]: f };
var aZ = { [cl]: i, [cm]: [{ [cn]: "bucketPartition" }, j] };
var ba = { [cl]: i, [cm]: [aR, "accountId"] };
var bb = { [cs]: [{ [ct]: true, [j]: "sigv4", [cu]: J, [cv]: "{bucketArn#region}" }] };
var bc = { [f]: "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName}`", [cj]: f };
var bd = { [f]: "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`", [cj]: f };
var be = { [f]: "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)", [cj]: f };
var bf = { [f]: "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`", [cj]: f };
var bg = { [f]: "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.", [cj]: f };
var bh = { [f]: "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided", [cj]: f };
var bi = { [cs]: [{ [ct]: true, [j]: "sigv4", [cu]: B, [cv]: "{bucketArn#region}" }] };
var bj = { [cs]: [{ [ct]: true, [j]: z, [cu]: A, [cx]: ["*"] }, { [ct]: true, [j]: "sigv4", [cu]: A, [cv]: "{bucketArn#region}" }] };
var bk = { [cl]: F, [cm]: [ad] };
var bl = { [cp]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cq]: aD, [cw]: {} };
var bm = { [cp]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cq]: aD, [cw]: {} };
var bn = { [cp]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cq]: aD, [cw]: {} };
var bo = { [cp]: Q, [cq]: aD, [cw]: {} };
var bp = { [cp]: "https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cq]: aD, [cw]: {} };
var bq = { [cn]: "UseObjectLambdaEndpoint" };
var br = { [cs]: [{ [ct]: true, [j]: "sigv4", [cu]: J, [cv]: "{Region}" }] };
var bs = { [cp]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var bt = { [cp]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var bu = { [cp]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var bv = { [cp]: t, [cq]: aD, [cw]: {} };
var bw = { [cp]: "https://s3.{Region}.{partitionResult#dnsSuffix}", [cq]: aD, [cw]: {} };
var bx = [{ [cn]: "Region" }];
var by = [{ [cn]: "Endpoint" }];
var bz = [ad];
var bA = [Y];
var bB = [W];
var bC = [Z, ae];
var bD = [{ [cl]: d, [cm]: [{ [cn]: "DisableS3ExpressSessionAuth" }] }, { [cl]: e, [cm]: [{ [cn]: "DisableS3ExpressSessionAuth" }, true] }];
var bE = [af];
var bF = [ah];
var bG = [ak];
var bH = [X];
var bI = [{ [cl]: k, [cm]: [ad, 6, 14, true], [co]: "s3expressAvailabilityZoneId" }, { [cl]: k, [cm]: [ad, 14, 16, true], [co]: "s3expressAvailabilityZoneDelim" }, { [cl]: h, [cm]: [{ [cn]: "s3expressAvailabilityZoneDelim" }, "--"] }];
var bJ = [{ [ck]: [X], [o]: { [cp]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [cq]: ai, [cw]: {} }, [cj]: o }, { [o]: { [cp]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [cq]: ai, [cw]: {} }, [cj]: o }];
var bK = [{ [cl]: k, [cm]: [ad, 6, 15, true], [co]: "s3expressAvailabilityZoneId" }, { [cl]: k, [cm]: [ad, 15, 17, true], [co]: "s3expressAvailabilityZoneDelim" }, { [cl]: h, [cm]: [{ [cn]: "s3expressAvailabilityZoneDelim" }, "--"] }];
var bL = [{ [cl]: k, [cm]: [ad, 6, 19, true], [co]: "s3expressAvailabilityZoneId" }, { [cl]: k, [cm]: [ad, 19, 21, true], [co]: "s3expressAvailabilityZoneDelim" }, { [cl]: h, [cm]: [{ [cn]: "s3expressAvailabilityZoneDelim" }, "--"] }];
var bM = [{ [cl]: k, [cm]: [ad, 6, 20, true], [co]: "s3expressAvailabilityZoneId" }, { [cl]: k, [cm]: [ad, 20, 22, true], [co]: "s3expressAvailabilityZoneDelim" }, { [cl]: h, [cm]: [{ [cn]: "s3expressAvailabilityZoneDelim" }, "--"] }];
var bN = [{ [cl]: k, [cm]: [ad, 6, 26, true], [co]: "s3expressAvailabilityZoneId" }, { [cl]: k, [cm]: [ad, 26, 28, true], [co]: "s3expressAvailabilityZoneDelim" }, { [cl]: h, [cm]: [{ [cn]: "s3expressAvailabilityZoneDelim" }, "--"] }];
var bO = [{ [ck]: [X], [o]: { [cp]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [cq]: am, [cw]: {} }, [cj]: o }, { [o]: { [cp]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [cq]: am, [cw]: {} }, [cj]: o }];
var bP = [ac];
var bQ = [{ [cl]: y, [cm]: [{ [cn]: x }, false] }];
var bR = [{ [cl]: h, [cm]: [{ [cn]: v }, "beta"] }];
var bS = ["*"];
var bT = [aa];
var bU = [{ [cl]: y, [cm]: [{ [cn]: "Region" }, false] }];
var bV = [{ [cl]: h, [cm]: [{ [cn]: "Region" }, "us-east-1"] }];
var bW = [{ [cl]: h, [cm]: [aS, K] }];
var bX = [{ [cl]: i, [cm]: [aR, "resourceId[1]"], [co]: L }, { [cl]: s, [cm]: [{ [cl]: h, [cm]: [aU, I] }] }];
var bY = [aR, "resourceId[1]"];
var bZ = [{ [cl]: s, [cm]: [{ [cl]: h, [cm]: [{ [cl]: i, [cm]: [aR, "region"] }, I] }] }];
var ca = [{ [cl]: s, [cm]: [{ [cl]: d, [cm]: [{ [cl]: i, [cm]: [aR, "resourceId[2]"] }] }] }];
var cb = [aR, "resourceId[2]"];
var cc = [{ [cl]: g, [cm]: [{ [cl]: i, [cm]: [aR, "region"] }], [co]: "bucketPartition" }];
var cd = [{ [cl]: h, [cm]: [aZ, { [cl]: i, [cm]: [{ [cn]: "partitionResult" }, j] }] }];
var ce = [{ [cl]: y, [cm]: [{ [cl]: i, [cm]: [aR, "region"] }, true] }];
var cf = [{ [cl]: y, [cm]: [ba, false] }];
var cg = [{ [cl]: y, [cm]: [aU, false] }];
var ch = [{ [cl]: y, [cm]: [{ [cn]: "Region" }, true] }];
var _data = { version: "1.0", parameters: { Bucket: T, Region: T, UseFIPS: U, UseDualStack: U, Endpoint: T, ForcePathStyle: U, Accelerate: U, UseGlobalEndpoint: U, UseObjectLambdaEndpoint: V, Key: T, Prefix: T, CopySource: T, DisableAccessPoints: V, DisableMultiRegionAccessPoints: U, UseArnRegion: V, UseS3ExpressControlEndpoint: V, DisableS3ExpressSessionAuth: V }, rules: [{ [ck]: [{ [cl]: d, [cm]: bx }], rules: [{ [ck]: [W, X], error: "Accelerate cannot be used with FIPS", [cj]: f }, { [ck]: [Y, Z], error: "Cannot set dual-stack in combination with a custom endpoint.", [cj]: f }, { [ck]: [Z, X], error: "A custom endpoint cannot be combined with FIPS", [cj]: f }, { [ck]: [Z, W], error: "A custom endpoint cannot be combined with S3 Accelerate", [cj]: f }, { [ck]: [X, aa, ab], error: "Partition does not support FIPS", [cj]: f }, { [ck]: [ac, { [cl]: k, [cm]: [ad, 0, a, c], [co]: l }, { [cl]: h, [cm]: [{ [cn]: l }, "--x-s3"] }], rules: [{ [ck]: bA, error: "S3Express does not support Dual-stack.", [cj]: f }, { [ck]: bB, error: "S3Express does not support S3 Accelerate.", [cj]: f }, { [ck]: bC, rules: [{ [ck]: bD, rules: [{ [ck]: bE, rules: [{ [ck]: bF, rules: [{ endpoint: { [cp]: n, [cq]: ai, [cw]: aj }, [cj]: o }], [cj]: p }], [cj]: p }, { [ck]: bG, rules: [{ endpoint: { [cp]: r, [cq]: ai, [cw]: aj }, [cj]: o }], [cj]: p }, al], [cj]: p }, { [ck]: bE, rules: [{ [ck]: bF, rules: [{ endpoint: { [cp]: n, [cq]: am, [cw]: aj }, [cj]: o }], [cj]: p }], [cj]: p }, { [ck]: bG, rules: [{ endpoint: { [cp]: r, [cq]: am, [cw]: aj }, [cj]: o }], [cj]: p }, al], [cj]: p }, { [ck]: [an, ao], rules: [{ [ck]: [ah, ap], rules: [{ [ck]: bH, endpoint: { [cp]: "https://s3express-control-fips.{Region}.amazonaws.com/{uri_encoded_bucket}", [cq]: ai, [cw]: aj }, [cj]: o }, { endpoint: { [cp]: "https://s3express-control.{Region}.amazonaws.com/{uri_encoded_bucket}", [cq]: ai, [cw]: aj }, [cj]: o }], [cj]: p }], [cj]: p }, { [ck]: bG, rules: [{ [ck]: bD, rules: [{ [ck]: bI, rules: bJ, [cj]: p }, { [ck]: bK, rules: bJ, [cj]: p }, { [ck]: bL, rules: bJ, [cj]: p }, { [ck]: bM, rules: bJ, [cj]: p }, { [ck]: bN, rules: bJ, [cj]: p }, aq], [cj]: p }, { [ck]: bI, rules: bO, [cj]: p }, { [ck]: bK, rules: bO, [cj]: p }, { [ck]: bL, rules: bO, [cj]: p }, { [ck]: bM, rules: bO, [cj]: p }, { [ck]: bN, rules: bO, [cj]: p }, aq], [cj]: p }, al], [cj]: p }, { [ck]: [ar, an, ao], rules: [{ [ck]: bC, endpoint: { [cp]: t, [cq]: ai, [cw]: aj }, [cj]: o }, { [ck]: bH, endpoint: { [cp]: "https://s3express-control-fips.{Region}.amazonaws.com", [cq]: ai, [cw]: aj }, [cj]: o }, { endpoint: { [cp]: "https://s3express-control.{Region}.amazonaws.com", [cq]: ai, [cw]: aj }, [cj]: o }], [cj]: p }, { [ck]: [ac, { [cl]: k, [cm]: [ad, 49, 50, c], [co]: u }, { [cl]: k, [cm]: [ad, 8, 12, c], [co]: v }, { [cl]: k, [cm]: [ad, 0, 7, c], [co]: w }, { [cl]: k, [cm]: [ad, 32, 49, c], [co]: x }, { [cl]: g, [cm]: bx, [co]: "regionPartition" }, { [cl]: h, [cm]: [{ [cn]: w }, "--op-s3"] }], rules: [{ [ck]: bQ, rules: [{ [ck]: [{ [cl]: h, [cm]: [as, "e"] }], rules: [{ [ck]: bR, rules: [at, { [ck]: bC, endpoint: { [cp]: "https://{Bucket}.ec2.{url#authority}", [cq]: au, [cw]: aj }, [cj]: o }], [cj]: p }, { endpoint: { [cp]: "https://{Bucket}.ec2.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [cq]: au, [cw]: aj }, [cj]: o }], [cj]: p }, { [ck]: [{ [cl]: h, [cm]: [as, "o"] }], rules: [{ [ck]: bR, rules: [at, { [ck]: bC, endpoint: { [cp]: "https://{Bucket}.op-{outpostId}.{url#authority}", [cq]: au, [cw]: aj }, [cj]: o }], [cj]: p }, { endpoint: { [cp]: "https://{Bucket}.op-{outpostId}.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [cq]: au, [cw]: aj }, [cj]: o }], [cj]: p }, { error: 'Unrecognized hardware type: "Expected hardware type o or e but got {hardwareType}"', [cj]: f }], [cj]: p }, { error: "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`.", [cj]: f }], [cj]: p }, { [ck]: bP, rules: [{ [ck]: [Z, { [cl]: s, [cm]: [{ [cl]: d, [cm]: [{ [cl]: m, [cm]: by }] }] }], error: "Custom endpoint `{Endpoint}` was not a valid URI", [cj]: f }, { [ck]: [av, ak], rules: [{ [ck]: bT, rules: [{ [ck]: bU, rules: [{ [ck]: [W, ab], error: "S3 Accelerate cannot be used in this region", [cj]: f }, { [ck]: [Y, X, ax, ap, ay], endpoint: { [cp]: "https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [Y, X, ax, ap, aA, aB], rules: [{ endpoint: aC, [cj]: o }], [cj]: p }, { [ck]: [Y, X, ax, ap, aA, aE], endpoint: aC, [cj]: o }, { [ck]: [aF, X, ax, ap, ay], endpoint: { [cp]: "https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, X, ax, ap, aA, aB], rules: [{ endpoint: aG, [cj]: o }], [cj]: p }, { [ck]: [aF, X, ax, ap, aA, aE], endpoint: aG, [cj]: o }, { [ck]: [Y, aH, W, ap, ay], endpoint: { [cp]: "https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [Y, aH, W, ap, aA, aB], rules: [{ endpoint: aI, [cj]: o }], [cj]: p }, { [ck]: [Y, aH, W, ap, aA, aE], endpoint: aI, [cj]: o }, { [ck]: [Y, aH, ax, ap, ay], endpoint: { [cp]: "https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [Y, aH, ax, ap, aA, aB], rules: [{ endpoint: aJ, [cj]: o }], [cj]: p }, { [ck]: [Y, aH, ax, ap, aA, aE], endpoint: aJ, [cj]: o }, { [ck]: [aF, aH, ax, Z, ae, af, ay], endpoint: { [cp]: C, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, aH, ax, Z, ae, aK, ay], endpoint: { [cp]: r, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, aH, ax, Z, ae, af, aA, aB], rules: [{ [ck]: bV, endpoint: aL, [cj]: o }, { endpoint: aL, [cj]: o }], [cj]: p }, { [ck]: [aF, aH, ax, Z, ae, aK, aA, aB], rules: [{ [ck]: bV, endpoint: aM, [cj]: o }, aN], [cj]: p }, { [ck]: [aF, aH, ax, Z, ae, af, aA, aE], endpoint: aL, [cj]: o }, { [ck]: [aF, aH, ax, Z, ae, aK, aA, aE], endpoint: aM, [cj]: o }, { [ck]: [aF, aH, W, ap, ay], endpoint: { [cp]: D, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, aH, W, ap, aA, aB], rules: [{ [ck]: bV, endpoint: aO, [cj]: o }, { endpoint: aO, [cj]: o }], [cj]: p }, { [ck]: [aF, aH, W, ap, aA, aE], endpoint: aO, [cj]: o }, { [ck]: [aF, aH, ax, ap, ay], endpoint: { [cp]: E, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, aH, ax, ap, aA, aB], rules: [{ [ck]: bV, endpoint: { [cp]: E, [cq]: aD, [cw]: aj }, [cj]: o }, { endpoint: aP, [cj]: o }], [cj]: p }, { [ck]: [aF, aH, ax, ap, aA, aE], endpoint: aP, [cj]: o }], [cj]: p }, aQ], [cj]: p }], [cj]: p }, { [ck]: [Z, ae, { [cl]: h, [cm]: [{ [cl]: i, [cm]: [ag, "scheme"] }, "http"] }, { [cl]: q, [cm]: [ad, c] }, av, aH, aF, ax], rules: [{ [ck]: bT, rules: [{ [ck]: bU, rules: [aN], [cj]: p }, aQ], [cj]: p }], [cj]: p }, { [ck]: [av, { [cl]: F, [cm]: bz, [co]: G }], rules: [{ [ck]: [{ [cl]: i, [cm]: [aR, "resourceId[0]"], [co]: H }, { [cl]: s, [cm]: [{ [cl]: h, [cm]: [aS, I] }] }], rules: [{ [ck]: [{ [cl]: h, [cm]: [aT, J] }], rules: [{ [ck]: bW, rules: [{ [ck]: bX, rules: [aV, aW, { [ck]: bZ, rules: [aX, { [ck]: ca, rules: [aY, { [ck]: cc, rules: [{ [ck]: bT, rules: [{ [ck]: cd, rules: [{ [ck]: ce, rules: [{ [ck]: [{ [cl]: h, [cm]: [ba, I] }], error: "Invalid ARN: Missing account id", [cj]: f }, { [ck]: cf, rules: [{ [ck]: cg, rules: [{ [ck]: bC, endpoint: { [cp]: M, [cq]: bb, [cw]: aj }, [cj]: o }, { [ck]: bH, endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cq]: bb, [cw]: aj }, [cj]: o }, { endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cq]: bb, [cw]: aj }, [cj]: o }], [cj]: p }, bc], [cj]: p }, bd], [cj]: p }, be], [cj]: p }, bf], [cj]: p }], [cj]: p }], [cj]: p }, bg], [cj]: p }, { error: "Invalid ARN: bucket ARN is missing a region", [cj]: f }], [cj]: p }, bh], [cj]: p }, { error: "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`", [cj]: f }], [cj]: p }, { [ck]: bW, rules: [{ [ck]: bX, rules: [{ [ck]: bZ, rules: [{ [ck]: bW, rules: [{ [ck]: bZ, rules: [aX, { [ck]: ca, rules: [aY, { [ck]: cc, rules: [{ [ck]: bT, rules: [{ [ck]: [{ [cl]: h, [cm]: [aZ, "{partitionResult#name}"] }], rules: [{ [ck]: ce, rules: [{ [ck]: [{ [cl]: h, [cm]: [aT, B] }], rules: [{ [ck]: cf, rules: [{ [ck]: cg, rules: [{ [ck]: bB, error: "Access Points do not support S3 Accelerate", [cj]: f }, { [ck]: [X, Y], endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cq]: bi, [cw]: aj }, [cj]: o }, { [ck]: [X, aF], endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cq]: bi, [cw]: aj }, [cj]: o }, { [ck]: [aH, Y], endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cq]: bi, [cw]: aj }, [cj]: o }, { [ck]: [aH, aF, Z, ae], endpoint: { [cp]: M, [cq]: bi, [cw]: aj }, [cj]: o }, { [ck]: [aH, aF], endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cq]: bi, [cw]: aj }, [cj]: o }], [cj]: p }, bc], [cj]: p }, bd], [cj]: p }, { error: "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}", [cj]: f }], [cj]: p }, be], [cj]: p }, bf], [cj]: p }], [cj]: p }], [cj]: p }, bg], [cj]: p }], [cj]: p }], [cj]: p }, { [ck]: [{ [cl]: y, [cm]: [aU, c] }], rules: [{ [ck]: bA, error: "S3 MRAP does not support dual-stack", [cj]: f }, { [ck]: bH, error: "S3 MRAP does not support FIPS", [cj]: f }, { [ck]: bB, error: "S3 MRAP does not support S3 Accelerate", [cj]: f }, { [ck]: [{ [cl]: e, [cm]: [{ [cn]: "DisableMultiRegionAccessPoints" }, c] }], error: "Invalid configuration: Multi-Region Access Point ARNs are disabled.", [cj]: f }, { [ck]: [{ [cl]: g, [cm]: bx, [co]: N }], rules: [{ [ck]: [{ [cl]: h, [cm]: [{ [cl]: i, [cm]: [{ [cn]: N }, j] }, { [cl]: i, [cm]: [aR, "partition"] }] }], rules: [{ endpoint: { [cp]: "https://{accessPointName}.accesspoint.s3-global.{mrapPartition#dnsSuffix}", [cq]: { [cs]: [{ [ct]: c, name: z, [cu]: B, [cx]: bS }] }, [cw]: aj }, [cj]: o }], [cj]: p }, { error: "Client was configured for partition `{mrapPartition#name}` but bucket referred to partition `{bucketArn#partition}`", [cj]: f }], [cj]: p }], [cj]: p }, { error: "Invalid Access Point Name", [cj]: f }], [cj]: p }, bh], [cj]: p }, { [ck]: [{ [cl]: h, [cm]: [aT, A] }], rules: [{ [ck]: bA, error: "S3 Outposts does not support Dual-stack", [cj]: f }, { [ck]: bH, error: "S3 Outposts does not support FIPS", [cj]: f }, { [ck]: bB, error: "S3 Outposts does not support S3 Accelerate", [cj]: f }, { [ck]: [{ [cl]: d, [cm]: [{ [cl]: i, [cm]: [aR, "resourceId[4]"] }] }], error: "Invalid Arn: Outpost Access Point ARN contains sub resources", [cj]: f }, { [ck]: [{ [cl]: i, [cm]: bY, [co]: x }], rules: [{ [ck]: bQ, rules: [aY, { [ck]: cc, rules: [{ [ck]: bT, rules: [{ [ck]: cd, rules: [{ [ck]: ce, rules: [{ [ck]: cf, rules: [{ [ck]: [{ [cl]: i, [cm]: cb, [co]: O }], rules: [{ [ck]: [{ [cl]: i, [cm]: [aR, "resourceId[3]"], [co]: L }], rules: [{ [ck]: [{ [cl]: h, [cm]: [{ [cn]: O }, K] }], rules: [{ [ck]: bC, endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.{url#authority}", [cq]: bj, [cw]: aj }, [cj]: o }, { endpoint: { [cp]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cq]: bj, [cw]: aj }, [cj]: o }], [cj]: p }, { error: "Expected an outpost type `accesspoint`, found {outpostType}", [cj]: f }], [cj]: p }, { error: "Invalid ARN: expected an access point name", [cj]: f }], [cj]: p }, { error: "Invalid ARN: Expected a 4-component resource", [cj]: f }], [cj]: p }, bd], [cj]: p }, be], [cj]: p }, bf], [cj]: p }], [cj]: p }], [cj]: p }, { error: "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId}`", [cj]: f }], [cj]: p }, { error: "Invalid ARN: The Outpost Id was not set", [cj]: f }], [cj]: p }, { error: "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})", [cj]: f }], [cj]: p }, { error: "Invalid ARN: No ARN type specified", [cj]: f }], [cj]: p }, { [ck]: [{ [cl]: k, [cm]: [ad, 0, 4, b], [co]: P }, { [cl]: h, [cm]: [{ [cn]: P }, "arn:"] }, { [cl]: s, [cm]: [{ [cl]: d, [cm]: [bk] }] }], error: "Invalid ARN: `{Bucket}` was not a valid ARN", [cj]: f }, { [ck]: [{ [cl]: e, [cm]: [aw, c] }, bk], error: "Path-style addressing cannot be used with ARN buckets", [cj]: f }, { [ck]: bF, rules: [{ [ck]: bT, rules: [{ [ck]: [ax], rules: [{ [ck]: [Y, ap, X, ay], endpoint: { [cp]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [Y, ap, X, aA, aB], rules: [{ endpoint: bl, [cj]: o }], [cj]: p }, { [ck]: [Y, ap, X, aA, aE], endpoint: bl, [cj]: o }, { [ck]: [aF, ap, X, ay], endpoint: { [cp]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, ap, X, aA, aB], rules: [{ endpoint: bm, [cj]: o }], [cj]: p }, { [ck]: [aF, ap, X, aA, aE], endpoint: bm, [cj]: o }, { [ck]: [Y, ap, aH, ay], endpoint: { [cp]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [Y, ap, aH, aA, aB], rules: [{ endpoint: bn, [cj]: o }], [cj]: p }, { [ck]: [Y, ap, aH, aA, aE], endpoint: bn, [cj]: o }, { [ck]: [aF, Z, ae, aH, ay], endpoint: { [cp]: Q, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, Z, ae, aH, aA, aB], rules: [{ [ck]: bV, endpoint: bo, [cj]: o }, { endpoint: bo, [cj]: o }], [cj]: p }, { [ck]: [aF, Z, ae, aH, aA, aE], endpoint: bo, [cj]: o }, { [ck]: [aF, ap, aH, ay], endpoint: { [cp]: R, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aF, ap, aH, aA, aB], rules: [{ [ck]: bV, endpoint: { [cp]: R, [cq]: aD, [cw]: aj }, [cj]: o }, { endpoint: bp, [cj]: o }], [cj]: p }, { [ck]: [aF, ap, aH, aA, aE], endpoint: bp, [cj]: o }], [cj]: p }, { error: "Path-style addressing cannot be used with S3 Accelerate", [cj]: f }], [cj]: p }], [cj]: p }], [cj]: p }, { [ck]: [{ [cl]: d, [cm]: [bq] }, { [cl]: e, [cm]: [bq, c] }], rules: [{ [ck]: bT, rules: [{ [ck]: ch, rules: [aV, aW, { [ck]: bC, endpoint: { [cp]: t, [cq]: br, [cw]: aj }, [cj]: o }, { [ck]: bH, endpoint: { [cp]: "https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", [cq]: br, [cw]: aj }, [cj]: o }, { endpoint: { [cp]: "https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", [cq]: br, [cw]: aj }, [cj]: o }], [cj]: p }, aQ], [cj]: p }], [cj]: p }, { [ck]: [ar], rules: [{ [ck]: bT, rules: [{ [ck]: ch, rules: [{ [ck]: [X, Y, ap, ay], endpoint: { [cp]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [X, Y, ap, aA, aB], rules: [{ endpoint: bs, [cj]: o }], [cj]: p }, { [ck]: [X, Y, ap, aA, aE], endpoint: bs, [cj]: o }, { [ck]: [X, aF, ap, ay], endpoint: { [cp]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [X, aF, ap, aA, aB], rules: [{ endpoint: bt, [cj]: o }], [cj]: p }, { [ck]: [X, aF, ap, aA, aE], endpoint: bt, [cj]: o }, { [ck]: [aH, Y, ap, ay], endpoint: { [cp]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aH, Y, ap, aA, aB], rules: [{ endpoint: bu, [cj]: o }], [cj]: p }, { [ck]: [aH, Y, ap, aA, aE], endpoint: bu, [cj]: o }, { [ck]: [aH, aF, Z, ae, ay], endpoint: { [cp]: t, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aH, aF, Z, ae, aA, aB], rules: [{ [ck]: bV, endpoint: bv, [cj]: o }, { endpoint: bv, [cj]: o }], [cj]: p }, { [ck]: [aH, aF, Z, ae, aA, aE], endpoint: bv, [cj]: o }, { [ck]: [aH, aF, ap, ay], endpoint: { [cp]: S, [cq]: az, [cw]: aj }, [cj]: o }, { [ck]: [aH, aF, ap, aA, aB], rules: [{ [ck]: bV, endpoint: { [cp]: S, [cq]: aD, [cw]: aj }, [cj]: o }, { endpoint: bw, [cj]: o }], [cj]: p }, { [ck]: [aH, aF, ap, aA, aE], endpoint: bw, [cj]: o }], [cj]: p }, aQ], [cj]: p }], [cj]: p }], [cj]: p }, { error: "A region must be set when sending requests to S3.", [cj]: f }] };
var ruleSet = _data;

// node_modules/@aws-sdk/client-s3/dist-es/endpoint/endpointResolver.js
var cache = new EndpointCache({
  size: 50,
  params: [
    "Accelerate",
    "Bucket",
    "DisableAccessPoints",
    "DisableMultiRegionAccessPoints",
    "DisableS3ExpressSessionAuth",
    "Endpoint",
    "ForcePathStyle",
    "Region",
    "UseArnRegion",
    "UseDualStack",
    "UseFIPS",
    "UseGlobalEndpoint",
    "UseObjectLambdaEndpoint",
    "UseS3ExpressControlEndpoint"
  ]
});
var defaultEndpointResolver = /* @__PURE__ */ __name((endpointParams, context = {}) => {
  return cache.get(endpointParams, () => resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  }));
}, "defaultEndpointResolver");
customEndpointFunctions.aws = awsEndpointFunctions;

// node_modules/@aws-sdk/client-s3/dist-es/auth/httpAuthSchemeProvider.js
var createEndpointRuleSetHttpAuthSchemeParametersProvider = /* @__PURE__ */ __name((defaultHttpAuthSchemeParametersProvider) => async (config, context, input) => {
  if (!input) {
    throw new Error(`Could not find \`input\` for \`defaultEndpointRuleSetHttpAuthSchemeParametersProvider\``);
  }
  const defaultParameters = await defaultHttpAuthSchemeParametersProvider(config, context, input);
  const instructionsFn = getSmithyContext(context)?.commandInstance?.constructor?.getEndpointParameterInstructions;
  if (!instructionsFn) {
    throw new Error(`getEndpointParameterInstructions() is not defined on \`${context.commandName}\``);
  }
  const endpointParameters = await resolveParams(input, { getEndpointParameterInstructions: instructionsFn }, config);
  return Object.assign(defaultParameters, endpointParameters);
}, "createEndpointRuleSetHttpAuthSchemeParametersProvider");
var _defaultS3HttpAuthSchemeParametersProvider = /* @__PURE__ */ __name(async (config, context, input) => {
  return {
    operation: getSmithyContext(context).operation,
    region: await normalizeProvider(config.region)() || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
}, "_defaultS3HttpAuthSchemeParametersProvider");
var defaultS3HttpAuthSchemeParametersProvider = createEndpointRuleSetHttpAuthSchemeParametersProvider(_defaultS3HttpAuthSchemeParametersProvider);
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "s3",
      region: authParameters.region
    },
    propertiesExtractor: /* @__PURE__ */ __name((config, context) => ({
      signingProperties: {
        config,
        context
      }
    }), "propertiesExtractor")
  };
}
__name(createAwsAuthSigv4HttpAuthOption, "createAwsAuthSigv4HttpAuthOption");
function createAwsAuthSigv4aHttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4a",
    signingProperties: {
      name: "s3",
      region: authParameters.region
    },
    propertiesExtractor: /* @__PURE__ */ __name((config, context) => ({
      signingProperties: {
        config,
        context
      }
    }), "propertiesExtractor")
  };
}
__name(createAwsAuthSigv4aHttpAuthOption, "createAwsAuthSigv4aHttpAuthOption");
var createEndpointRuleSetHttpAuthSchemeProvider = /* @__PURE__ */ __name((defaultEndpointResolver2, defaultHttpAuthSchemeResolver, createHttpAuthOptionFunctions) => {
  const endpointRuleSetHttpAuthSchemeProvider = /* @__PURE__ */ __name((authParameters) => {
    const endpoint = defaultEndpointResolver2(authParameters);
    const authSchemes = endpoint.properties?.authSchemes;
    if (!authSchemes) {
      return defaultHttpAuthSchemeResolver(authParameters);
    }
    const options = [];
    for (const scheme of authSchemes) {
      const { name: resolvedName, properties = {}, ...rest } = scheme;
      const name = resolvedName.toLowerCase();
      if (resolvedName !== name) {
        console.warn(`HttpAuthScheme has been normalized with lowercasing: \`${resolvedName}\` to \`${name}\``);
      }
      let schemeId;
      if (name === "sigv4a") {
        schemeId = "aws.auth#sigv4a";
        const sigv4Present = authSchemes.find((s2) => {
          const name2 = s2.name.toLowerCase();
          return name2 !== "sigv4a" && name2.startsWith("sigv4");
        });
        if (!signatureV4CrtContainer.CrtSignerV4 && sigv4Present) {
          continue;
        }
      } else if (name.startsWith("sigv4")) {
        schemeId = "aws.auth#sigv4";
      } else {
        throw new Error(`Unknown HttpAuthScheme found in \`@smithy.rules#endpointRuleSet\`: \`${name}\``);
      }
      const createOption = createHttpAuthOptionFunctions[schemeId];
      if (!createOption) {
        throw new Error(`Could not find HttpAuthOption create function for \`${schemeId}\``);
      }
      const option = createOption(authParameters);
      option.schemeId = schemeId;
      option.signingProperties = { ...option.signingProperties || {}, ...rest, ...properties };
      options.push(option);
    }
    return options;
  }, "endpointRuleSetHttpAuthSchemeProvider");
  return endpointRuleSetHttpAuthSchemeProvider;
}, "createEndpointRuleSetHttpAuthSchemeProvider");
var _defaultS3HttpAuthSchemeProvider = /* @__PURE__ */ __name((authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
      options.push(createAwsAuthSigv4aHttpAuthOption(authParameters));
    }
  }
  return options;
}, "_defaultS3HttpAuthSchemeProvider");
var defaultS3HttpAuthSchemeProvider = createEndpointRuleSetHttpAuthSchemeProvider(defaultEndpointResolver, _defaultS3HttpAuthSchemeProvider, {
  "aws.auth#sigv4": createAwsAuthSigv4HttpAuthOption,
  "aws.auth#sigv4a": createAwsAuthSigv4aHttpAuthOption
});
var resolveHttpAuthSchemeConfig = /* @__PURE__ */ __name((config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  const config_1 = resolveAwsSdkSigV4AConfig(config_0);
  return {
    ...config_1
  };
}, "resolveHttpAuthSchemeConfig");

// node_modules/@aws-sdk/client-s3/dist-es/commands/CreateSessionCommand.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/client-s3/dist-es/endpoint/EndpointParameters.js
init_checked_fetch();
init_modules_watch_stub();
var resolveClientEndpointParameters = /* @__PURE__ */ __name((options) => {
  return {
    ...options,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    forcePathStyle: options.forcePathStyle ?? false,
    useAccelerateEndpoint: options.useAccelerateEndpoint ?? false,
    useGlobalEndpoint: options.useGlobalEndpoint ?? false,
    disableMultiregionAccessPoints: options.disableMultiregionAccessPoints ?? false,
    defaultSigningName: "s3"
  };
}, "resolveClientEndpointParameters");
var commonParams = {
  ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
  UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
  DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
  Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
  DisableS3ExpressSessionAuth: { type: "clientContextParams", name: "disableS3ExpressSessionAuth" },
  UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// node_modules/@aws-sdk/client-s3/dist-es/models/models_0.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/client-s3/dist-es/models/S3ServiceException.js
init_checked_fetch();
init_modules_watch_stub();
var S3ServiceException = class _S3ServiceException extends ServiceException {
  static {
    __name(this, "S3ServiceException");
  }
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _S3ServiceException.prototype);
  }
};

// node_modules/@aws-sdk/client-s3/dist-es/models/models_0.js
var NoSuchUpload = class _NoSuchUpload extends S3ServiceException {
  static {
    __name(this, "NoSuchUpload");
  }
  name = "NoSuchUpload";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NoSuchUpload",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _NoSuchUpload.prototype);
  }
};
var ObjectNotInActiveTierError = class _ObjectNotInActiveTierError extends S3ServiceException {
  static {
    __name(this, "ObjectNotInActiveTierError");
  }
  name = "ObjectNotInActiveTierError";
  $fault = "client";
  constructor(opts) {
    super({
      name: "ObjectNotInActiveTierError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _ObjectNotInActiveTierError.prototype);
  }
};
var BucketAlreadyExists = class _BucketAlreadyExists extends S3ServiceException {
  static {
    __name(this, "BucketAlreadyExists");
  }
  name = "BucketAlreadyExists";
  $fault = "client";
  constructor(opts) {
    super({
      name: "BucketAlreadyExists",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _BucketAlreadyExists.prototype);
  }
};
var BucketAlreadyOwnedByYou = class _BucketAlreadyOwnedByYou extends S3ServiceException {
  static {
    __name(this, "BucketAlreadyOwnedByYou");
  }
  name = "BucketAlreadyOwnedByYou";
  $fault = "client";
  constructor(opts) {
    super({
      name: "BucketAlreadyOwnedByYou",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _BucketAlreadyOwnedByYou.prototype);
  }
};
var NoSuchBucket = class _NoSuchBucket extends S3ServiceException {
  static {
    __name(this, "NoSuchBucket");
  }
  name = "NoSuchBucket";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NoSuchBucket",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _NoSuchBucket.prototype);
  }
};
var AnalyticsFilter;
(function(AnalyticsFilter2) {
  AnalyticsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(AnalyticsFilter || (AnalyticsFilter = {}));
var MetricsFilter;
(function(MetricsFilter2) {
  MetricsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.AccessPointArn !== void 0)
      return visitor.AccessPointArn(value.AccessPointArn);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(MetricsFilter || (MetricsFilter = {}));
var InvalidObjectState = class _InvalidObjectState extends S3ServiceException {
  static {
    __name(this, "InvalidObjectState");
  }
  name = "InvalidObjectState";
  $fault = "client";
  StorageClass;
  AccessTier;
  constructor(opts) {
    super({
      name: "InvalidObjectState",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _InvalidObjectState.prototype);
    this.StorageClass = opts.StorageClass;
    this.AccessTier = opts.AccessTier;
  }
};
var NoSuchKey = class _NoSuchKey extends S3ServiceException {
  static {
    __name(this, "NoSuchKey");
  }
  name = "NoSuchKey";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NoSuchKey",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _NoSuchKey.prototype);
  }
};
var NotFound = class _NotFound extends S3ServiceException {
  static {
    __name(this, "NotFound");
  }
  name = "NotFound";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NotFound",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _NotFound.prototype);
  }
};
var SessionCredentialsFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.SecretAccessKey && { SecretAccessKey: SENSITIVE_STRING },
  ...obj.SessionToken && { SessionToken: SENSITIVE_STRING }
}), "SessionCredentialsFilterSensitiveLog");
var CreateSessionOutputFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING },
  ...obj.Credentials && { Credentials: SessionCredentialsFilterSensitiveLog(obj.Credentials) }
}), "CreateSessionOutputFilterSensitiveLog");
var CreateSessionRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
}), "CreateSessionRequestFilterSensitiveLog");

// node_modules/@aws-sdk/client-s3/dist-es/protocols/Aws_restXml.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/xml-builder/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/xml-builder/dist-es/XmlNode.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/xml-builder/dist-es/escape-attribute.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/xml-builder/dist-es/XmlText.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/xml-builder/dist-es/escape-element.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/client-s3/dist-es/models/models_1.js
init_checked_fetch();
init_modules_watch_stub();
var EncryptionTypeMismatch = class _EncryptionTypeMismatch extends S3ServiceException {
  static {
    __name(this, "EncryptionTypeMismatch");
  }
  name = "EncryptionTypeMismatch";
  $fault = "client";
  constructor(opts) {
    super({
      name: "EncryptionTypeMismatch",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _EncryptionTypeMismatch.prototype);
  }
};
var InvalidRequest = class _InvalidRequest extends S3ServiceException {
  static {
    __name(this, "InvalidRequest");
  }
  name = "InvalidRequest";
  $fault = "client";
  constructor(opts) {
    super({
      name: "InvalidRequest",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _InvalidRequest.prototype);
  }
};
var InvalidWriteOffset = class _InvalidWriteOffset extends S3ServiceException {
  static {
    __name(this, "InvalidWriteOffset");
  }
  name = "InvalidWriteOffset";
  $fault = "client";
  constructor(opts) {
    super({
      name: "InvalidWriteOffset",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _InvalidWriteOffset.prototype);
  }
};
var TooManyParts = class _TooManyParts extends S3ServiceException {
  static {
    __name(this, "TooManyParts");
  }
  name = "TooManyParts";
  $fault = "client";
  constructor(opts) {
    super({
      name: "TooManyParts",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _TooManyParts.prototype);
  }
};
var ObjectAlreadyInActiveTierError = class _ObjectAlreadyInActiveTierError extends S3ServiceException {
  static {
    __name(this, "ObjectAlreadyInActiveTierError");
  }
  name = "ObjectAlreadyInActiveTierError";
  $fault = "client";
  constructor(opts) {
    super({
      name: "ObjectAlreadyInActiveTierError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, _ObjectAlreadyInActiveTierError.prototype);
  }
};
var SelectObjectContentEventStream;
(function(SelectObjectContentEventStream2) {
  SelectObjectContentEventStream2.visit = (value, visitor) => {
    if (value.Records !== void 0)
      return visitor.Records(value.Records);
    if (value.Stats !== void 0)
      return visitor.Stats(value.Stats);
    if (value.Progress !== void 0)
      return visitor.Progress(value.Progress);
    if (value.Cont !== void 0)
      return visitor.Cont(value.Cont);
    if (value.End !== void 0)
      return visitor.End(value.End);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(SelectObjectContentEventStream || (SelectObjectContentEventStream = {}));
var PutObjectOutputFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
}), "PutObjectOutputFilterSensitiveLog");
var PutObjectRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING },
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
}), "PutObjectRequestFilterSensitiveLog");

// node_modules/@aws-sdk/client-s3/dist-es/protocols/Aws_restXml.js
var se_CreateSessionCommand = /* @__PURE__ */ __name(async (input, context) => {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    [_xacsm]: input[_SM],
    [_xasse]: input[_SSE],
    [_xasseakki]: input[_SSEKMSKI],
    [_xassec]: input[_SSEKMSEC],
    [_xassebke]: [() => isSerializableHeaderValue(input[_BKE]), () => input[_BKE].toString()]
  });
  b2.bp("/");
  b2.p("Bucket", () => input.Bucket, "{Bucket}", false);
  const query = map({
    [_s]: [, ""]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
}, "se_CreateSessionCommand");
var se_PutObjectCommand = /* @__PURE__ */ __name(async (input, context) => {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    [_ct]: input[_CTo] || "application/octet-stream",
    [_xaa]: input[_ACL],
    [_cc]: input[_CC],
    [_cd]: input[_CD],
    [_ce]: input[_CE],
    [_cl]: input[_CL],
    [_cl_]: [() => isSerializableHeaderValue(input[_CLo]), () => input[_CLo].toString()],
    [_cm]: input[_CMD],
    [_xasca]: input[_CA],
    [_xacc]: input[_CCRC],
    [_xacc_]: input[_CCRCC],
    [_xacc__]: input[_CCRCNVME],
    [_xacs]: input[_CSHA],
    [_xacs_]: input[_CSHAh],
    [_e]: [() => isSerializableHeaderValue(input[_E]), () => dateToUtcString(input[_E]).toString()],
    [_im]: input[_IM],
    [_inm]: input[_INM],
    [_xagfc]: input[_GFC],
    [_xagr]: input[_GR],
    [_xagra]: input[_GRACP],
    [_xagwa]: input[_GWACP],
    [_xawob]: [() => isSerializableHeaderValue(input[_WOB]), () => input[_WOB].toString()],
    [_xasse]: input[_SSE],
    [_xasc]: input[_SC],
    [_xawrl]: input[_WRL],
    [_xasseca]: input[_SSECA],
    [_xasseck]: input[_SSECK],
    [_xasseckm]: input[_SSECKMD],
    [_xasseakki]: input[_SSEKMSKI],
    [_xassec]: input[_SSEKMSEC],
    [_xassebke]: [() => isSerializableHeaderValue(input[_BKE]), () => input[_BKE].toString()],
    [_xarp]: input[_RP],
    [_xat]: input[_T],
    [_xaolm]: input[_OLM],
    [_xaolrud]: [() => isSerializableHeaderValue(input[_OLRUD]), () => serializeDateTime(input[_OLRUD]).toString()],
    [_xaollh]: input[_OLLHS],
    [_xaebo]: input[_EBO],
    ...input.Metadata !== void 0 && Object.keys(input.Metadata).reduce((acc, suffix) => {
      acc[`x-amz-meta-${suffix.toLowerCase()}`] = input.Metadata[suffix];
      return acc;
    }, {})
  });
  b2.bp("/{Key+}");
  b2.p("Bucket", () => input.Bucket, "{Bucket}", false);
  b2.p("Key", () => input.Key, "{Key+}", true);
  const query = map({
    [_xi]: [, "PutObject"]
  });
  let body;
  let contents;
  if (input.Body !== void 0) {
    contents = input.Body;
    body = contents;
  }
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
}, "se_PutObjectCommand");
var de_CreateSessionCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output),
    [_SSE]: [, output.headers[_xasse]],
    [_SSEKMSKI]: [, output.headers[_xasseakki]],
    [_SSEKMSEC]: [, output.headers[_xassec]],
    [_BKE]: [() => void 0 !== output.headers[_xassebke], () => parseBoolean(output.headers[_xassebke])]
  });
  const data = expectNonNull(expectObject(await parseXmlBody(output.body, context)), "body");
  if (data[_C] != null) {
    contents[_C] = de_SessionCredentials(data[_C], context);
  }
  return contents;
}, "de_CreateSessionCommand");
var de_PutObjectCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output),
    [_Exp]: [, output.headers[_xae]],
    [_ETa]: [, output.headers[_eta]],
    [_CCRC]: [, output.headers[_xacc]],
    [_CCRCC]: [, output.headers[_xacc_]],
    [_CCRCNVME]: [, output.headers[_xacc__]],
    [_CSHA]: [, output.headers[_xacs]],
    [_CSHAh]: [, output.headers[_xacs_]],
    [_CT]: [, output.headers[_xact]],
    [_SSE]: [, output.headers[_xasse]],
    [_VI]: [, output.headers[_xavi]],
    [_SSECA]: [, output.headers[_xasseca]],
    [_SSECKMD]: [, output.headers[_xasseckm]],
    [_SSEKMSKI]: [, output.headers[_xasseakki]],
    [_SSEKMSEC]: [, output.headers[_xassec]],
    [_BKE]: [() => void 0 !== output.headers[_xassebke], () => parseBoolean(output.headers[_xassebke])],
    [_Si]: [() => void 0 !== output.headers[_xaos], () => strictParseLong(output.headers[_xaos])],
    [_RC]: [, output.headers[_xarc]]
  });
  await collectBody(output.body, context);
  return contents;
}, "de_PutObjectCommand");
var de_CommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseXmlErrorBody(output.body, context)
  };
  const errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "NoSuchUpload":
    case "com.amazonaws.s3#NoSuchUpload":
      throw await de_NoSuchUploadRes(parsedOutput, context);
    case "ObjectNotInActiveTierError":
    case "com.amazonaws.s3#ObjectNotInActiveTierError":
      throw await de_ObjectNotInActiveTierErrorRes(parsedOutput, context);
    case "BucketAlreadyExists":
    case "com.amazonaws.s3#BucketAlreadyExists":
      throw await de_BucketAlreadyExistsRes(parsedOutput, context);
    case "BucketAlreadyOwnedByYou":
    case "com.amazonaws.s3#BucketAlreadyOwnedByYou":
      throw await de_BucketAlreadyOwnedByYouRes(parsedOutput, context);
    case "NoSuchBucket":
    case "com.amazonaws.s3#NoSuchBucket":
      throw await de_NoSuchBucketRes(parsedOutput, context);
    case "InvalidObjectState":
    case "com.amazonaws.s3#InvalidObjectState":
      throw await de_InvalidObjectStateRes(parsedOutput, context);
    case "NoSuchKey":
    case "com.amazonaws.s3#NoSuchKey":
      throw await de_NoSuchKeyRes(parsedOutput, context);
    case "NotFound":
    case "com.amazonaws.s3#NotFound":
      throw await de_NotFoundRes(parsedOutput, context);
    case "EncryptionTypeMismatch":
    case "com.amazonaws.s3#EncryptionTypeMismatch":
      throw await de_EncryptionTypeMismatchRes(parsedOutput, context);
    case "InvalidRequest":
    case "com.amazonaws.s3#InvalidRequest":
      throw await de_InvalidRequestRes(parsedOutput, context);
    case "InvalidWriteOffset":
    case "com.amazonaws.s3#InvalidWriteOffset":
      throw await de_InvalidWriteOffsetRes(parsedOutput, context);
    case "TooManyParts":
    case "com.amazonaws.s3#TooManyParts":
      throw await de_TooManyPartsRes(parsedOutput, context);
    case "ObjectAlreadyInActiveTierError":
    case "com.amazonaws.s3#ObjectAlreadyInActiveTierError":
      throw await de_ObjectAlreadyInActiveTierErrorRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_CommandError");
var throwDefaultError2 = withBaseException(S3ServiceException);
var de_BucketAlreadyExistsRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new BucketAlreadyExists({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_BucketAlreadyExistsRes");
var de_BucketAlreadyOwnedByYouRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new BucketAlreadyOwnedByYou({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_BucketAlreadyOwnedByYouRes");
var de_EncryptionTypeMismatchRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new EncryptionTypeMismatch({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_EncryptionTypeMismatchRes");
var de_InvalidObjectStateRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  if (data[_AT] != null) {
    contents[_AT] = expectString(data[_AT]);
  }
  if (data[_SC] != null) {
    contents[_SC] = expectString(data[_SC]);
  }
  const exception = new InvalidObjectState({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidObjectStateRes");
var de_InvalidRequestRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new InvalidRequest({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidRequestRes");
var de_InvalidWriteOffsetRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new InvalidWriteOffset({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidWriteOffsetRes");
var de_NoSuchBucketRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new NoSuchBucket({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_NoSuchBucketRes");
var de_NoSuchKeyRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new NoSuchKey({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_NoSuchKeyRes");
var de_NoSuchUploadRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new NoSuchUpload({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_NoSuchUploadRes");
var de_NotFoundRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new NotFound({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_NotFoundRes");
var de_ObjectAlreadyInActiveTierErrorRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new ObjectAlreadyInActiveTierError({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_ObjectAlreadyInActiveTierErrorRes");
var de_ObjectNotInActiveTierErrorRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new ObjectNotInActiveTierError({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_ObjectNotInActiveTierErrorRes");
var de_TooManyPartsRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const exception = new TooManyParts({
    $metadata: deserializeMetadata2(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_TooManyPartsRes");
var de_SessionCredentials = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output[_AKI] != null) {
    contents[_AKI] = expectString(output[_AKI]);
  }
  if (output[_SAK] != null) {
    contents[_SAK] = expectString(output[_SAK]);
  }
  if (output[_ST] != null) {
    contents[_ST] = expectString(output[_ST]);
  }
  if (output[_Exp] != null) {
    contents[_Exp] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_Exp]));
  }
  return contents;
}, "de_SessionCredentials");
var deserializeMetadata2 = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var _ACL = "ACL";
var _AKI = "AccessKeyId";
var _AT = "AccessTier";
var _BKE = "BucketKeyEnabled";
var _C = "Credentials";
var _CA = "ChecksumAlgorithm";
var _CC = "CacheControl";
var _CCRC = "ChecksumCRC32";
var _CCRCC = "ChecksumCRC32C";
var _CCRCNVME = "ChecksumCRC64NVME";
var _CD = "ContentDisposition";
var _CE = "ContentEncoding";
var _CL = "ContentLanguage";
var _CLo = "ContentLength";
var _CMD = "ContentMD5";
var _CSHA = "ChecksumSHA1";
var _CSHAh = "ChecksumSHA256";
var _CT = "ChecksumType";
var _CTo = "ContentType";
var _E = "Expires";
var _EBO = "ExpectedBucketOwner";
var _ETa = "ETag";
var _Exp = "Expiration";
var _GFC = "GrantFullControl";
var _GR = "GrantRead";
var _GRACP = "GrantReadACP";
var _GWACP = "GrantWriteACP";
var _IM = "IfMatch";
var _INM = "IfNoneMatch";
var _OLLHS = "ObjectLockLegalHoldStatus";
var _OLM = "ObjectLockMode";
var _OLRUD = "ObjectLockRetainUntilDate";
var _RC = "RequestCharged";
var _RP = "RequestPayer";
var _SAK = "SecretAccessKey";
var _SC = "StorageClass";
var _SM = "SessionMode";
var _SSE = "ServerSideEncryption";
var _SSECA = "SSECustomerAlgorithm";
var _SSECK = "SSECustomerKey";
var _SSECKMD = "SSECustomerKeyMD5";
var _SSEKMSEC = "SSEKMSEncryptionContext";
var _SSEKMSKI = "SSEKMSKeyId";
var _ST = "SessionToken";
var _Si = "Size";
var _T = "Tagging";
var _VI = "VersionId";
var _WOB = "WriteOffsetBytes";
var _WRL = "WebsiteRedirectLocation";
var _cc = "cache-control";
var _cd = "content-disposition";
var _ce = "content-encoding";
var _cl = "content-language";
var _cl_ = "content-length";
var _cm = "content-md5";
var _ct = "content-type";
var _e = "expires";
var _eta = "etag";
var _im = "if-match";
var _inm = "if-none-match";
var _s = "session";
var _xaa = "x-amz-acl";
var _xacc = "x-amz-checksum-crc32";
var _xacc_ = "x-amz-checksum-crc32c";
var _xacc__ = "x-amz-checksum-crc64nvme";
var _xacs = "x-amz-checksum-sha1";
var _xacs_ = "x-amz-checksum-sha256";
var _xacsm = "x-amz-create-session-mode";
var _xact = "x-amz-checksum-type";
var _xae = "x-amz-expiration";
var _xaebo = "x-amz-expected-bucket-owner";
var _xagfc = "x-amz-grant-full-control";
var _xagr = "x-amz-grant-read";
var _xagra = "x-amz-grant-read-acp";
var _xagwa = "x-amz-grant-write-acp";
var _xaollh = "x-amz-object-lock-legal-hold";
var _xaolm = "x-amz-object-lock-mode";
var _xaolrud = "x-amz-object-lock-retain-until-date";
var _xaos = "x-amz-object-size";
var _xarc = "x-amz-request-charged";
var _xarp = "x-amz-request-payer";
var _xasc = "x-amz-storage-class";
var _xasca = "x-amz-sdk-checksum-algorithm";
var _xasse = "x-amz-server-side-encryption";
var _xasseakki = "x-amz-server-side-encryption-aws-kms-key-id";
var _xassebke = "x-amz-server-side-encryption-bucket-key-enabled";
var _xassec = "x-amz-server-side-encryption-context";
var _xasseca = "x-amz-server-side-encryption-customer-algorithm";
var _xasseck = "x-amz-server-side-encryption-customer-key";
var _xasseckm = "x-amz-server-side-encryption-customer-key-md5";
var _xat = "x-amz-tagging";
var _xavi = "x-amz-version-id";
var _xawob = "x-amz-write-offset-bytes";
var _xawrl = "x-amz-website-redirect-location";
var _xi = "x-id";

// node_modules/@aws-sdk/client-s3/dist-es/commands/CreateSessionCommand.js
var CreateSessionCommand = class extends Command.classBuilder().ep({
  ...commonParams,
  DisableS3ExpressSessionAuth: { type: "staticContextParams", value: true },
  Bucket: { type: "contextParams", name: "Bucket" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "CreateSession", {}).n("S3Client", "CreateSessionCommand").f(CreateSessionRequestFilterSensitiveLog, CreateSessionOutputFilterSensitiveLog).ser(se_CreateSessionCommand).de(de_CreateSessionCommand).build() {
  static {
    __name(this, "CreateSessionCommand");
  }
};

// node_modules/@aws-sdk/client-s3/dist-es/runtimeConfig.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/client-s3/package.json
var package_default = {
  name: "@aws-sdk/client-s3",
  description: "AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native",
  version: "3.772.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "node ../../scripts/compilation/inline client-s3",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo s3",
    test: "yarn g:vitest run",
    "test:browser": "node ./test/browser-build/esbuild && yarn g:vitest run -c vitest.config.browser.ts",
    "test:browser:watch": "node ./test/browser-build/esbuild && yarn g:vitest watch -c vitest.config.browser.ts",
    "test:e2e": "yarn g:vitest run -c vitest.config.e2e.ts && yarn test:browser",
    "test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.ts",
    "test:watch": "yarn g:vitest watch"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha1-browser": "5.2.0",
    "@aws-crypto/sha256-browser": "5.2.0",
    "@aws-crypto/sha256-js": "5.2.0",
    "@aws-sdk/core": "3.758.0",
    "@aws-sdk/credential-provider-node": "3.772.0",
    "@aws-sdk/middleware-bucket-endpoint": "3.734.0",
    "@aws-sdk/middleware-expect-continue": "3.734.0",
    "@aws-sdk/middleware-flexible-checksums": "3.758.0",
    "@aws-sdk/middleware-host-header": "3.734.0",
    "@aws-sdk/middleware-location-constraint": "3.734.0",
    "@aws-sdk/middleware-logger": "3.734.0",
    "@aws-sdk/middleware-recursion-detection": "3.772.0",
    "@aws-sdk/middleware-sdk-s3": "3.758.0",
    "@aws-sdk/middleware-ssec": "3.734.0",
    "@aws-sdk/middleware-user-agent": "3.758.0",
    "@aws-sdk/region-config-resolver": "3.734.0",
    "@aws-sdk/signature-v4-multi-region": "3.758.0",
    "@aws-sdk/types": "3.734.0",
    "@aws-sdk/util-endpoints": "3.743.0",
    "@aws-sdk/util-user-agent-browser": "3.734.0",
    "@aws-sdk/util-user-agent-node": "3.758.0",
    "@aws-sdk/xml-builder": "3.734.0",
    "@smithy/config-resolver": "^4.0.1",
    "@smithy/core": "^3.1.5",
    "@smithy/eventstream-serde-browser": "^4.0.1",
    "@smithy/eventstream-serde-config-resolver": "^4.0.1",
    "@smithy/eventstream-serde-node": "^4.0.1",
    "@smithy/fetch-http-handler": "^5.0.1",
    "@smithy/hash-blob-browser": "^4.0.1",
    "@smithy/hash-node": "^4.0.1",
    "@smithy/hash-stream-node": "^4.0.1",
    "@smithy/invalid-dependency": "^4.0.1",
    "@smithy/md5-js": "^4.0.1",
    "@smithy/middleware-content-length": "^4.0.1",
    "@smithy/middleware-endpoint": "^4.0.6",
    "@smithy/middleware-retry": "^4.0.7",
    "@smithy/middleware-serde": "^4.0.2",
    "@smithy/middleware-stack": "^4.0.1",
    "@smithy/node-config-provider": "^4.0.1",
    "@smithy/node-http-handler": "^4.0.3",
    "@smithy/protocol-http": "^5.0.1",
    "@smithy/smithy-client": "^4.1.6",
    "@smithy/types": "^4.1.0",
    "@smithy/url-parser": "^4.0.1",
    "@smithy/util-base64": "^4.0.0",
    "@smithy/util-body-length-browser": "^4.0.0",
    "@smithy/util-body-length-node": "^4.0.0",
    "@smithy/util-defaults-mode-browser": "^4.0.7",
    "@smithy/util-defaults-mode-node": "^4.0.7",
    "@smithy/util-endpoints": "^3.0.1",
    "@smithy/util-middleware": "^4.0.1",
    "@smithy/util-retry": "^4.0.1",
    "@smithy/util-stream": "^4.1.2",
    "@smithy/util-utf8": "^4.0.0",
    "@smithy/util-waiter": "^4.0.2",
    tslib: "^2.6.2"
  },
  devDependencies: {
    "@aws-sdk/signature-v4-crt": "3.758.0",
    "@tsconfig/node18": "18.2.4",
    "@types/node": "^18.19.69",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typescript: "~5.2.2"
  },
  engines: {
    node: ">=18.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-s3"
  }
};

// node_modules/@aws-crypto/sha1-browser/build/module/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha1-browser/build/module/crossPlatformSha1.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha1-browser/build/module/webCryptoSha1.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha1-browser/node_modules/@smithy/util-utf8/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha1-browser/node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
init_checked_fetch();
init_modules_watch_stub();
var fromUtf84 = /* @__PURE__ */ __name((input) => new TextEncoder().encode(input), "fromUtf8");

// node_modules/@aws-crypto/sha1-browser/node_modules/@smithy/util-utf8/dist-es/toUint8Array.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha1-browser/node_modules/@smithy/util-utf8/dist-es/toUtf8.browser.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha1-browser/build/module/isEmptyData.js
init_checked_fetch();
init_modules_watch_stub();
function isEmptyData2(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}
__name(isEmptyData2, "isEmptyData");

// node_modules/@aws-crypto/sha1-browser/build/module/constants.js
init_checked_fetch();
init_modules_watch_stub();
var SHA_1_HASH = { name: "SHA-1" };
var SHA_1_HMAC_ALGO = {
  name: "HMAC",
  hash: SHA_1_HASH
};
var EMPTY_DATA_SHA_1 = new Uint8Array([
  218,
  57,
  163,
  238,
  94,
  107,
  75,
  13,
  50,
  85,
  191,
  239,
  149,
  96,
  24,
  144,
  175,
  216,
  7,
  9
]);

// node_modules/@aws-sdk/util-locate-window/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
var fallbackWindow = {};
function locateWindow() {
  if (typeof window !== "undefined") {
    return window;
  } else if (typeof self !== "undefined") {
    return self;
  }
  return fallbackWindow;
}
__name(locateWindow, "locateWindow");

// node_modules/@aws-crypto/sha1-browser/build/module/webCryptoSha1.js
var Sha1 = (
  /** @class */
  function() {
    function Sha13(secret) {
      this.toHash = new Uint8Array(0);
      if (secret !== void 0) {
        this.key = new Promise(function(resolve, reject) {
          locateWindow().crypto.subtle.importKey("raw", convertToBuffer2(secret), SHA_1_HMAC_ALGO, false, ["sign"]).then(resolve, reject);
        });
        this.key.catch(function() {
        });
      }
    }
    __name(Sha13, "Sha1");
    Sha13.prototype.update = function(data) {
      if (isEmptyData2(data)) {
        return;
      }
      var update = convertToBuffer2(data);
      var typedArray = new Uint8Array(this.toHash.byteLength + update.byteLength);
      typedArray.set(this.toHash, 0);
      typedArray.set(update, this.toHash.byteLength);
      this.toHash = typedArray;
    };
    Sha13.prototype.digest = function() {
      var _this = this;
      if (this.key) {
        return this.key.then(function(key) {
          return locateWindow().crypto.subtle.sign(SHA_1_HMAC_ALGO, key, _this.toHash).then(function(data) {
            return new Uint8Array(data);
          });
        });
      }
      if (isEmptyData2(this.toHash)) {
        return Promise.resolve(EMPTY_DATA_SHA_1);
      }
      return Promise.resolve().then(function() {
        return locateWindow().crypto.subtle.digest(SHA_1_HASH, _this.toHash);
      }).then(function(data) {
        return Promise.resolve(new Uint8Array(data));
      });
    };
    Sha13.prototype.reset = function() {
      this.toHash = new Uint8Array(0);
    };
    return Sha13;
  }()
);
function convertToBuffer2(data) {
  if (typeof data === "string") {
    return fromUtf84(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}
__name(convertToBuffer2, "convertToBuffer");

// node_modules/@aws-crypto/supports-web-crypto/build/module/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/supports-web-crypto/build/module/supportsWebCrypto.js
init_checked_fetch();
init_modules_watch_stub();
var subtleCryptoMethods = [
  "decrypt",
  "digest",
  "encrypt",
  "exportKey",
  "generateKey",
  "importKey",
  "sign",
  "verify"
];
function supportsWebCrypto(window2) {
  if (supportsSecureRandom(window2) && typeof window2.crypto.subtle === "object") {
    var subtle = window2.crypto.subtle;
    return supportsSubtleCrypto(subtle);
  }
  return false;
}
__name(supportsWebCrypto, "supportsWebCrypto");
function supportsSecureRandom(window2) {
  if (typeof window2 === "object" && typeof window2.crypto === "object") {
    var getRandomValues2 = window2.crypto.getRandomValues;
    return typeof getRandomValues2 === "function";
  }
  return false;
}
__name(supportsSecureRandom, "supportsSecureRandom");
function supportsSubtleCrypto(subtle) {
  return subtle && subtleCryptoMethods.every(function(methodName) {
    return typeof subtle[methodName] === "function";
  });
}
__name(supportsSubtleCrypto, "supportsSubtleCrypto");

// node_modules/@aws-crypto/sha1-browser/build/module/crossPlatformSha1.js
var Sha12 = (
  /** @class */
  function() {
    function Sha13(secret) {
      if (supportsWebCrypto(locateWindow())) {
        this.hash = new Sha1(secret);
      } else {
        throw new Error("SHA1 not supported");
      }
    }
    __name(Sha13, "Sha1");
    Sha13.prototype.update = function(data, encoding) {
      this.hash.update(convertToBuffer(data));
    };
    Sha13.prototype.digest = function() {
      return this.hash.digest();
    };
    Sha13.prototype.reset = function() {
      this.hash.reset();
    };
    return Sha13;
  }()
);

// node_modules/@aws-crypto/sha256-browser/build/module/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha256-browser/build/module/crossPlatformSha256.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha256-browser/build/module/webCryptoSha256.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha256-browser/build/module/constants.js
init_checked_fetch();
init_modules_watch_stub();
var SHA_256_HASH = { name: "SHA-256" };
var SHA_256_HMAC_ALGO = {
  name: "HMAC",
  hash: SHA_256_HASH
};
var EMPTY_DATA_SHA_256 = new Uint8Array([
  227,
  176,
  196,
  66,
  152,
  252,
  28,
  20,
  154,
  251,
  244,
  200,
  153,
  111,
  185,
  36,
  39,
  174,
  65,
  228,
  100,
  155,
  147,
  76,
  164,
  149,
  153,
  27,
  120,
  82,
  184,
  85
]);

// node_modules/@aws-crypto/sha256-browser/build/module/webCryptoSha256.js
var Sha256 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      this.toHash = new Uint8Array(0);
      this.secret = secret;
      this.reset();
    }
    __name(Sha2564, "Sha256");
    Sha2564.prototype.update = function(data) {
      if (isEmptyData(data)) {
        return;
      }
      var update = convertToBuffer(data);
      var typedArray = new Uint8Array(this.toHash.byteLength + update.byteLength);
      typedArray.set(this.toHash, 0);
      typedArray.set(update, this.toHash.byteLength);
      this.toHash = typedArray;
    };
    Sha2564.prototype.digest = function() {
      var _this = this;
      if (this.key) {
        return this.key.then(function(key) {
          return locateWindow().crypto.subtle.sign(SHA_256_HMAC_ALGO, key, _this.toHash).then(function(data) {
            return new Uint8Array(data);
          });
        });
      }
      if (isEmptyData(this.toHash)) {
        return Promise.resolve(EMPTY_DATA_SHA_256);
      }
      return Promise.resolve().then(function() {
        return locateWindow().crypto.subtle.digest(SHA_256_HASH, _this.toHash);
      }).then(function(data) {
        return Promise.resolve(new Uint8Array(data));
      });
    };
    Sha2564.prototype.reset = function() {
      var _this = this;
      this.toHash = new Uint8Array(0);
      if (this.secret && this.secret !== void 0) {
        this.key = new Promise(function(resolve, reject) {
          locateWindow().crypto.subtle.importKey("raw", convertToBuffer(_this.secret), SHA_256_HMAC_ALGO, false, ["sign"]).then(resolve, reject);
        });
        this.key.catch(function() {
        });
      }
    };
    return Sha2564;
  }()
);

// node_modules/@aws-crypto/sha256-js/build/module/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha256-js/build/module/jsSha256.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-crypto/sha256-js/build/module/constants.js
init_checked_fetch();
init_modules_watch_stub();
var BLOCK_SIZE = 64;
var DIGEST_LENGTH = 32;
var KEY = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var INIT = [
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
];
var MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;

// node_modules/@aws-crypto/sha256-js/build/module/RawSha256.js
init_checked_fetch();
init_modules_watch_stub();
var RawSha256 = (
  /** @class */
  function() {
    function RawSha2562() {
      this.state = Int32Array.from(INIT);
      this.temp = new Int32Array(64);
      this.buffer = new Uint8Array(64);
      this.bufferLength = 0;
      this.bytesHashed = 0;
      this.finished = false;
    }
    __name(RawSha2562, "RawSha256");
    RawSha2562.prototype.update = function(data) {
      if (this.finished) {
        throw new Error("Attempted to update an already finished hash.");
      }
      var position = 0;
      var byteLength = data.byteLength;
      this.bytesHashed += byteLength;
      if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH) {
        throw new Error("Cannot hash more than 2^53 - 1 bits");
      }
      while (byteLength > 0) {
        this.buffer[this.bufferLength++] = data[position++];
        byteLength--;
        if (this.bufferLength === BLOCK_SIZE) {
          this.hashBuffer();
          this.bufferLength = 0;
        }
      }
    };
    RawSha2562.prototype.digest = function() {
      if (!this.finished) {
        var bitsHashed = this.bytesHashed * 8;
        var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
        var undecoratedLength = this.bufferLength;
        bufferView.setUint8(this.bufferLength++, 128);
        if (undecoratedLength % BLOCK_SIZE >= BLOCK_SIZE - 8) {
          for (var i2 = this.bufferLength; i2 < BLOCK_SIZE; i2++) {
            bufferView.setUint8(i2, 0);
          }
          this.hashBuffer();
          this.bufferLength = 0;
        }
        for (var i2 = this.bufferLength; i2 < BLOCK_SIZE - 8; i2++) {
          bufferView.setUint8(i2, 0);
        }
        bufferView.setUint32(BLOCK_SIZE - 8, Math.floor(bitsHashed / 4294967296), true);
        bufferView.setUint32(BLOCK_SIZE - 4, bitsHashed);
        this.hashBuffer();
        this.finished = true;
      }
      var out = new Uint8Array(DIGEST_LENGTH);
      for (var i2 = 0; i2 < 8; i2++) {
        out[i2 * 4] = this.state[i2] >>> 24 & 255;
        out[i2 * 4 + 1] = this.state[i2] >>> 16 & 255;
        out[i2 * 4 + 2] = this.state[i2] >>> 8 & 255;
        out[i2 * 4 + 3] = this.state[i2] >>> 0 & 255;
      }
      return out;
    };
    RawSha2562.prototype.hashBuffer = function() {
      var _a = this, buffer = _a.buffer, state = _a.state;
      var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
      for (var i2 = 0; i2 < BLOCK_SIZE; i2++) {
        if (i2 < 16) {
          this.temp[i2] = (buffer[i2 * 4] & 255) << 24 | (buffer[i2 * 4 + 1] & 255) << 16 | (buffer[i2 * 4 + 2] & 255) << 8 | buffer[i2 * 4 + 3] & 255;
        } else {
          var u2 = this.temp[i2 - 2];
          var t1_1 = (u2 >>> 17 | u2 << 15) ^ (u2 >>> 19 | u2 << 13) ^ u2 >>> 10;
          u2 = this.temp[i2 - 15];
          var t2_1 = (u2 >>> 7 | u2 << 25) ^ (u2 >>> 18 | u2 << 14) ^ u2 >>> 3;
          this.temp[i2] = (t1_1 + this.temp[i2 - 7] | 0) + (t2_1 + this.temp[i2 - 16] | 0);
        }
        var t1 = (((state4 >>> 6 | state4 << 26) ^ (state4 >>> 11 | state4 << 21) ^ (state4 >>> 25 | state4 << 7)) + (state4 & state5 ^ ~state4 & state6) | 0) + (state7 + (KEY[i2] + this.temp[i2] | 0) | 0) | 0;
        var t2 = ((state0 >>> 2 | state0 << 30) ^ (state0 >>> 13 | state0 << 19) ^ (state0 >>> 22 | state0 << 10)) + (state0 & state1 ^ state0 & state2 ^ state1 & state2) | 0;
        state7 = state6;
        state6 = state5;
        state5 = state4;
        state4 = state3 + t1 | 0;
        state3 = state2;
        state2 = state1;
        state1 = state0;
        state0 = t1 + t2 | 0;
      }
      state[0] += state0;
      state[1] += state1;
      state[2] += state2;
      state[3] += state3;
      state[4] += state4;
      state[5] += state5;
      state[6] += state6;
      state[7] += state7;
    };
    return RawSha2562;
  }()
);

// node_modules/@aws-crypto/sha256-js/build/module/jsSha256.js
var Sha2562 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      this.secret = secret;
      this.hash = new RawSha256();
      this.reset();
    }
    __name(Sha2564, "Sha256");
    Sha2564.prototype.update = function(toHash) {
      if (isEmptyData(toHash) || this.error) {
        return;
      }
      try {
        this.hash.update(convertToBuffer(toHash));
      } catch (e2) {
        this.error = e2;
      }
    };
    Sha2564.prototype.digestSync = function() {
      if (this.error) {
        throw this.error;
      }
      if (this.outer) {
        if (!this.outer.finished) {
          this.outer.update(this.hash.digest());
        }
        return this.outer.digest();
      }
      return this.hash.digest();
    };
    Sha2564.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, this.digestSync()];
        });
      });
    };
    Sha2564.prototype.reset = function() {
      this.hash = new RawSha256();
      if (this.secret) {
        this.outer = new RawSha256();
        var inner = bufferFromSecret(this.secret);
        var outer = new Uint8Array(BLOCK_SIZE);
        outer.set(inner);
        for (var i2 = 0; i2 < BLOCK_SIZE; i2++) {
          inner[i2] ^= 54;
          outer[i2] ^= 92;
        }
        this.hash.update(inner);
        this.outer.update(outer);
        for (var i2 = 0; i2 < inner.byteLength; i2++) {
          inner[i2] = 0;
        }
      }
    };
    return Sha2564;
  }()
);
function bufferFromSecret(secret) {
  var input = convertToBuffer(secret);
  if (input.byteLength > BLOCK_SIZE) {
    var bufferHash = new RawSha256();
    bufferHash.update(input);
    input = bufferHash.digest();
  }
  var buffer = new Uint8Array(BLOCK_SIZE);
  buffer.set(input);
  return buffer;
}
__name(bufferFromSecret, "bufferFromSecret");

// node_modules/@aws-crypto/sha256-browser/build/module/crossPlatformSha256.js
var Sha2563 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      if (supportsWebCrypto(locateWindow())) {
        this.hash = new Sha256(secret);
      } else {
        this.hash = new Sha2562(secret);
      }
    }
    __name(Sha2564, "Sha256");
    Sha2564.prototype.update = function(data, encoding) {
      this.hash.update(convertToBuffer(data));
    };
    Sha2564.prototype.digest = function() {
      return this.hash.digest();
    };
    Sha2564.prototype.reset = function() {
      this.hash.reset();
    };
    return Sha2564;
  }()
);

// node_modules/@aws-sdk/util-user-agent-browser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
var import_bowser = __toESM(require_es5());
var createDefaultUserAgentProvider = /* @__PURE__ */ __name(({ serviceId, clientVersion }) => async (config) => {
  const parsedUA = typeof window !== "undefined" && window?.navigator?.userAgent ? import_bowser.default.parse(window.navigator.userAgent) : void 0;
  const sections = [
    ["aws-sdk-js", clientVersion],
    ["ua", "2.1"],
    [`os/${parsedUA?.os?.name || "other"}`, parsedUA?.os?.version],
    ["lang/js"],
    ["md/browser", `${parsedUA?.browser?.name ?? "unknown"}_${parsedUA?.browser?.version ?? "unknown"}`]
  ];
  if (serviceId) {
    sections.push([`api/${serviceId}`, clientVersion]);
  }
  const appId = await config?.userAgentAppId?.();
  if (appId) {
    sections.push([`app/${appId}`]);
  }
  return sections;
}, "createDefaultUserAgentProvider");

// node_modules/@smithy/eventstream-serde-browser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-serde-browser/dist-es/EventStreamMarshaller.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-serde-universal/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-serde-universal/dist-es/EventStreamMarshaller.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-codec/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-codec/dist-es/HeaderMarshaller.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-codec/dist-es/Int64.js
init_checked_fetch();
init_modules_watch_stub();
var Int642 = class _Int64 {
  static {
    __name(this, "Int64");
  }
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate2(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate2(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate2(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0)
      break;
  }
}
__name(negate2, "negate");

// node_modules/@smithy/eventstream-codec/dist-es/HeaderMarshaller.js
var HeaderMarshaller = class {
  static {
    __name(this, "HeaderMarshaller");
  }
  constructor(toUtf82, fromUtf85) {
    this.toUtf8 = toUtf82;
    this.fromUtf8 = fromUtf85;
  }
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = this.fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = this.fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int642.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN2.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
  parse(headers) {
    const out = {};
    let position = 0;
    while (position < headers.byteLength) {
      const nameLength = headers.getUint8(position++);
      const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
      position += nameLength;
      switch (headers.getUint8(position++)) {
        case 0:
          out[name] = {
            type: BOOLEAN_TAG,
            value: true
          };
          break;
        case 1:
          out[name] = {
            type: BOOLEAN_TAG,
            value: false
          };
          break;
        case 2:
          out[name] = {
            type: BYTE_TAG,
            value: headers.getInt8(position++)
          };
          break;
        case 3:
          out[name] = {
            type: SHORT_TAG,
            value: headers.getInt16(position, false)
          };
          position += 2;
          break;
        case 4:
          out[name] = {
            type: INT_TAG,
            value: headers.getInt32(position, false)
          };
          position += 4;
          break;
        case 5:
          out[name] = {
            type: LONG_TAG,
            value: new Int642(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
          };
          position += 8;
          break;
        case 6:
          const binaryLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: BINARY_TAG,
            value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
          };
          position += binaryLength;
          break;
        case 7:
          const stringLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: STRING_TAG,
            value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
          };
          position += stringLength;
          break;
        case 8:
          out[name] = {
            type: TIMESTAMP_TAG,
            value: new Date(new Int642(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
          };
          position += 8;
          break;
        case 9:
          const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
          position += 16;
          out[name] = {
            type: UUID_TAG,
            value: `${toHex(uuidBytes.subarray(0, 4))}-${toHex(uuidBytes.subarray(4, 6))}-${toHex(uuidBytes.subarray(6, 8))}-${toHex(uuidBytes.subarray(8, 10))}-${toHex(uuidBytes.subarray(10))}`
          };
          break;
        default:
          throw new Error(`Unrecognized header type tag`);
      }
    }
    return out;
  }
};
var HEADER_VALUE_TYPE2;
(function(HEADER_VALUE_TYPE3) {
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["short"] = 3] = "short";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["long"] = 5] = "long";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["string"] = 7] = "string";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE2 || (HEADER_VALUE_TYPE2 = {}));
var BOOLEAN_TAG = "boolean";
var BYTE_TAG = "byte";
var SHORT_TAG = "short";
var INT_TAG = "integer";
var LONG_TAG = "long";
var BINARY_TAG = "binary";
var STRING_TAG = "string";
var TIMESTAMP_TAG = "timestamp";
var UUID_TAG = "uuid";
var UUID_PATTERN2 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

// node_modules/@smithy/eventstream-codec/dist-es/splitMessage.js
init_checked_fetch();
init_modules_watch_stub();
var PRELUDE_MEMBER_LENGTH = 4;
var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
var CHECKSUM_LENGTH = 4;
var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
function splitMessage({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH) {
    throw new Error("Provided message too short to accommodate event stream message overhead");
  }
  const view = new DataView(buffer, byteOffset, byteLength);
  const messageLength = view.getUint32(0, false);
  if (byteLength !== messageLength) {
    throw new Error("Reported message length does not match received message length");
  }
  const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
  const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
  const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
  const checksummer = new Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
  if (expectedPreludeChecksum !== checksummer.digest()) {
    throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  }
  checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
  if (expectedMessageChecksum !== checksummer.digest()) {
    throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  }
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
  };
}
__name(splitMessage, "splitMessage");

// node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js
var EventStreamCodec = class {
  static {
    __name(this, "EventStreamCodec");
  }
  constructor(toUtf82, fromUtf85) {
    this.headerMarshaller = new HeaderMarshaller(toUtf82, fromUtf85);
    this.messageBuffer = [];
    this.isEndOfStream = false;
  }
  feed(message) {
    this.messageBuffer.push(this.decode(message));
  }
  endOfStream() {
    this.isEndOfStream = true;
  }
  getMessage() {
    const message = this.messageBuffer.pop();
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessage() {
        return message;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  getAvailableMessages() {
    const messages = this.messageBuffer;
    this.messageBuffer = [];
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessages() {
        return messages;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  encode({ headers: rawHeaders, body }) {
    const headers = this.headerMarshaller.format(rawHeaders);
    const length = headers.byteLength + body.byteLength + 16;
    const out = new Uint8Array(length);
    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    const checksum = new Crc32();
    view.setUint32(0, length, false);
    view.setUint32(4, headers.byteLength, false);
    view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
    out.set(headers, 12);
    out.set(body, headers.byteLength + 12);
    view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
    return out;
  }
  decode(message) {
    const { headers, body } = splitMessage(message);
    return { headers: this.headerMarshaller.parse(headers), body };
  }
  formatHeaders(rawHeaders) {
    return this.headerMarshaller.format(rawHeaders);
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/Message.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-codec/dist-es/MessageDecoderStream.js
init_checked_fetch();
init_modules_watch_stub();
var MessageDecoderStream = class {
  static {
    __name(this, "MessageDecoderStream");
  }
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const bytes of this.options.inputStream) {
      const decoded = this.options.decoder.decode(bytes);
      yield decoded;
    }
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/MessageEncoderStream.js
init_checked_fetch();
init_modules_watch_stub();
var MessageEncoderStream = class {
  static {
    __name(this, "MessageEncoderStream");
  }
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const msg of this.options.messageStream) {
      const encoded = this.options.encoder.encode(msg);
      yield encoded;
    }
    if (this.options.includeEndFrame) {
      yield new Uint8Array(0);
    }
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageDecoderStream.js
init_checked_fetch();
init_modules_watch_stub();
var SmithyMessageDecoderStream = class {
  static {
    __name(this, "SmithyMessageDecoderStream");
  }
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const message of this.options.messageStream) {
      const deserialized = await this.options.deserializer(message);
      if (deserialized === void 0)
        continue;
      yield deserialized;
    }
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageEncoderStream.js
init_checked_fetch();
init_modules_watch_stub();
var SmithyMessageEncoderStream = class {
  static {
    __name(this, "SmithyMessageEncoderStream");
  }
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const chunk of this.options.inputStream) {
      const payloadBuf = this.options.serializer(chunk);
      yield payloadBuf;
    }
  }
};

// node_modules/@smithy/eventstream-serde-universal/dist-es/getChunkedStream.js
init_checked_fetch();
init_modules_watch_stub();
function getChunkedStream(source) {
  let currentMessageTotalLength = 0;
  let currentMessagePendingLength = 0;
  let currentMessage = null;
  let messageLengthBuffer = null;
  const allocateMessage = /* @__PURE__ */ __name((size) => {
    if (typeof size !== "number") {
      throw new Error("Attempted to allocate an event message where size was not a number: " + size);
    }
    currentMessageTotalLength = size;
    currentMessagePendingLength = 4;
    currentMessage = new Uint8Array(size);
    const currentMessageView = new DataView(currentMessage.buffer);
    currentMessageView.setUint32(0, size, false);
  }, "allocateMessage");
  const iterator = /* @__PURE__ */ __name(async function* () {
    const sourceIterator = source[Symbol.asyncIterator]();
    while (true) {
      const { value, done } = await sourceIterator.next();
      if (done) {
        if (!currentMessageTotalLength) {
          return;
        } else if (currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
        } else {
          throw new Error("Truncated event message received.");
        }
        return;
      }
      const chunkLength = value.length;
      let currentOffset = 0;
      while (currentOffset < chunkLength) {
        if (!currentMessage) {
          const bytesRemaining = chunkLength - currentOffset;
          if (!messageLengthBuffer) {
            messageLengthBuffer = new Uint8Array(4);
          }
          const numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
          messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
          currentMessagePendingLength += numBytesForTotal;
          currentOffset += numBytesForTotal;
          if (currentMessagePendingLength < 4) {
            break;
          }
          allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
          messageLengthBuffer = null;
        }
        const numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
        currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
        currentMessagePendingLength += numBytesToWrite;
        currentOffset += numBytesToWrite;
        if (currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
          currentMessage = null;
          currentMessageTotalLength = 0;
          currentMessagePendingLength = 0;
        }
      }
    }
  }, "iterator");
  return {
    [Symbol.asyncIterator]: iterator
  };
}
__name(getChunkedStream, "getChunkedStream");

// node_modules/@smithy/eventstream-serde-universal/dist-es/getUnmarshalledStream.js
init_checked_fetch();
init_modules_watch_stub();
function getMessageUnmarshaller(deserializer, toUtf82) {
  return async function(message) {
    const { value: messageType } = message.headers[":message-type"];
    if (messageType === "error") {
      const unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
      unmodeledError.name = message.headers[":error-code"].value;
      throw unmodeledError;
    } else if (messageType === "exception") {
      const code = message.headers[":exception-type"].value;
      const exception = { [code]: message };
      const deserializedException = await deserializer(exception);
      if (deserializedException.$unknown) {
        const error = new Error(toUtf82(message.body));
        error.name = code;
        throw error;
      }
      throw deserializedException[code];
    } else if (messageType === "event") {
      const event = {
        [message.headers[":event-type"].value]: message
      };
      const deserialized = await deserializer(event);
      if (deserialized.$unknown)
        return;
      return deserialized;
    } else {
      throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
    }
  };
}
__name(getMessageUnmarshaller, "getMessageUnmarshaller");

// node_modules/@smithy/eventstream-serde-universal/dist-es/EventStreamMarshaller.js
var EventStreamMarshaller = class {
  static {
    __name(this, "EventStreamMarshaller");
  }
  constructor({ utf8Encoder, utf8Decoder }) {
    this.eventStreamCodec = new EventStreamCodec(utf8Encoder, utf8Decoder);
    this.utfEncoder = utf8Encoder;
  }
  deserialize(body, deserializer) {
    const inputStream = getChunkedStream(body);
    return new SmithyMessageDecoderStream({
      messageStream: new MessageDecoderStream({ inputStream, decoder: this.eventStreamCodec }),
      deserializer: getMessageUnmarshaller(deserializer, this.utfEncoder)
    });
  }
  serialize(inputStream, serializer) {
    return new MessageEncoderStream({
      messageStream: new SmithyMessageEncoderStream({ inputStream, serializer }),
      encoder: this.eventStreamCodec,
      includeEndFrame: true
    });
  }
};

// node_modules/@smithy/eventstream-serde-universal/dist-es/provider.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/eventstream-serde-browser/dist-es/utils.js
init_checked_fetch();
init_modules_watch_stub();
var readableStreamtoIterable = /* @__PURE__ */ __name((readableStream) => ({
  [Symbol.asyncIterator]: async function* () {
    const reader = readableStream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          return;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }
}), "readableStreamtoIterable");
var iterableToReadableStream = /* @__PURE__ */ __name((asyncIterable) => {
  const iterator = asyncIterable[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await iterator.next();
      if (done) {
        return controller.close();
      }
      controller.enqueue(value);
    }
  });
}, "iterableToReadableStream");

// node_modules/@smithy/eventstream-serde-browser/dist-es/EventStreamMarshaller.js
var EventStreamMarshaller2 = class {
  static {
    __name(this, "EventStreamMarshaller");
  }
  constructor({ utf8Encoder, utf8Decoder }) {
    this.universalMarshaller = new EventStreamMarshaller({
      utf8Decoder,
      utf8Encoder
    });
  }
  deserialize(body, deserializer) {
    const bodyIterable = isReadableStream2(body) ? readableStreamtoIterable(body) : body;
    return this.universalMarshaller.deserialize(bodyIterable, deserializer);
  }
  serialize(input, serializer) {
    const serialziedIterable = this.universalMarshaller.serialize(input, serializer);
    return typeof ReadableStream === "function" ? iterableToReadableStream(serialziedIterable) : serialziedIterable;
  }
};
var isReadableStream2 = /* @__PURE__ */ __name((body) => typeof ReadableStream === "function" && body instanceof ReadableStream, "isReadableStream");

// node_modules/@smithy/eventstream-serde-browser/dist-es/provider.js
init_checked_fetch();
init_modules_watch_stub();
var eventStreamSerdeProvider = /* @__PURE__ */ __name((options) => new EventStreamMarshaller2(options), "eventStreamSerdeProvider");

// node_modules/@smithy/hash-blob-browser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/chunked-blob-reader/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
async function blobReader(blob, onChunk, chunkSize = 1024 * 1024) {
  const size = blob.size;
  let totalBytesRead = 0;
  while (totalBytesRead < size) {
    const slice = blob.slice(totalBytesRead, Math.min(size, totalBytesRead + chunkSize));
    onChunk(new Uint8Array(await slice.arrayBuffer()));
    totalBytesRead += slice.size;
  }
}
__name(blobReader, "blobReader");

// node_modules/@smithy/hash-blob-browser/dist-es/index.js
var blobHasher = /* @__PURE__ */ __name(async function blobHasher2(hashCtor, blob) {
  const hash = new hashCtor();
  await blobReader(blob, (chunk) => {
    hash.update(chunk);
  });
  return hash.digest();
}, "blobHasher");

// node_modules/@smithy/invalid-dependency/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/invalid-dependency/dist-es/invalidFunction.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/invalid-dependency/dist-es/invalidProvider.js
init_checked_fetch();
init_modules_watch_stub();
var invalidProvider = /* @__PURE__ */ __name((message) => () => Promise.reject(message), "invalidProvider");

// node_modules/@smithy/md5-js/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/md5-js/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var BLOCK_SIZE2 = 64;
var DIGEST_LENGTH2 = 16;
var INIT2 = [1732584193, 4023233417, 2562383102, 271733878];

// node_modules/@smithy/md5-js/dist-es/index.js
var Md5 = class {
  static {
    __name(this, "Md5");
  }
  constructor() {
    this.reset();
  }
  update(sourceData) {
    if (isEmptyData3(sourceData)) {
      return;
    } else if (this.finished) {
      throw new Error("Attempted to update an already finished hash.");
    }
    const data = convertToBuffer3(sourceData);
    let position = 0;
    let { byteLength } = data;
    this.bytesHashed += byteLength;
    while (byteLength > 0) {
      this.buffer.setUint8(this.bufferLength++, data[position++]);
      byteLength--;
      if (this.bufferLength === BLOCK_SIZE2) {
        this.hashBuffer();
        this.bufferLength = 0;
      }
    }
  }
  async digest() {
    if (!this.finished) {
      const { buffer, bufferLength: undecoratedLength, bytesHashed } = this;
      const bitsHashed = bytesHashed * 8;
      buffer.setUint8(this.bufferLength++, 128);
      if (undecoratedLength % BLOCK_SIZE2 >= BLOCK_SIZE2 - 8) {
        for (let i2 = this.bufferLength; i2 < BLOCK_SIZE2; i2++) {
          buffer.setUint8(i2, 0);
        }
        this.hashBuffer();
        this.bufferLength = 0;
      }
      for (let i2 = this.bufferLength; i2 < BLOCK_SIZE2 - 8; i2++) {
        buffer.setUint8(i2, 0);
      }
      buffer.setUint32(BLOCK_SIZE2 - 8, bitsHashed >>> 0, true);
      buffer.setUint32(BLOCK_SIZE2 - 4, Math.floor(bitsHashed / 4294967296), true);
      this.hashBuffer();
      this.finished = true;
    }
    const out = new DataView(new ArrayBuffer(DIGEST_LENGTH2));
    for (let i2 = 0; i2 < 4; i2++) {
      out.setUint32(i2 * 4, this.state[i2], true);
    }
    return new Uint8Array(out.buffer, out.byteOffset, out.byteLength);
  }
  hashBuffer() {
    const { buffer, state } = this;
    let a2 = state[0], b2 = state[1], c2 = state[2], d2 = state[3];
    a2 = ff(a2, b2, c2, d2, buffer.getUint32(0, true), 7, 3614090360);
    d2 = ff(d2, a2, b2, c2, buffer.getUint32(4, true), 12, 3905402710);
    c2 = ff(c2, d2, a2, b2, buffer.getUint32(8, true), 17, 606105819);
    b2 = ff(b2, c2, d2, a2, buffer.getUint32(12, true), 22, 3250441966);
    a2 = ff(a2, b2, c2, d2, buffer.getUint32(16, true), 7, 4118548399);
    d2 = ff(d2, a2, b2, c2, buffer.getUint32(20, true), 12, 1200080426);
    c2 = ff(c2, d2, a2, b2, buffer.getUint32(24, true), 17, 2821735955);
    b2 = ff(b2, c2, d2, a2, buffer.getUint32(28, true), 22, 4249261313);
    a2 = ff(a2, b2, c2, d2, buffer.getUint32(32, true), 7, 1770035416);
    d2 = ff(d2, a2, b2, c2, buffer.getUint32(36, true), 12, 2336552879);
    c2 = ff(c2, d2, a2, b2, buffer.getUint32(40, true), 17, 4294925233);
    b2 = ff(b2, c2, d2, a2, buffer.getUint32(44, true), 22, 2304563134);
    a2 = ff(a2, b2, c2, d2, buffer.getUint32(48, true), 7, 1804603682);
    d2 = ff(d2, a2, b2, c2, buffer.getUint32(52, true), 12, 4254626195);
    c2 = ff(c2, d2, a2, b2, buffer.getUint32(56, true), 17, 2792965006);
    b2 = ff(b2, c2, d2, a2, buffer.getUint32(60, true), 22, 1236535329);
    a2 = gg(a2, b2, c2, d2, buffer.getUint32(4, true), 5, 4129170786);
    d2 = gg(d2, a2, b2, c2, buffer.getUint32(24, true), 9, 3225465664);
    c2 = gg(c2, d2, a2, b2, buffer.getUint32(44, true), 14, 643717713);
    b2 = gg(b2, c2, d2, a2, buffer.getUint32(0, true), 20, 3921069994);
    a2 = gg(a2, b2, c2, d2, buffer.getUint32(20, true), 5, 3593408605);
    d2 = gg(d2, a2, b2, c2, buffer.getUint32(40, true), 9, 38016083);
    c2 = gg(c2, d2, a2, b2, buffer.getUint32(60, true), 14, 3634488961);
    b2 = gg(b2, c2, d2, a2, buffer.getUint32(16, true), 20, 3889429448);
    a2 = gg(a2, b2, c2, d2, buffer.getUint32(36, true), 5, 568446438);
    d2 = gg(d2, a2, b2, c2, buffer.getUint32(56, true), 9, 3275163606);
    c2 = gg(c2, d2, a2, b2, buffer.getUint32(12, true), 14, 4107603335);
    b2 = gg(b2, c2, d2, a2, buffer.getUint32(32, true), 20, 1163531501);
    a2 = gg(a2, b2, c2, d2, buffer.getUint32(52, true), 5, 2850285829);
    d2 = gg(d2, a2, b2, c2, buffer.getUint32(8, true), 9, 4243563512);
    c2 = gg(c2, d2, a2, b2, buffer.getUint32(28, true), 14, 1735328473);
    b2 = gg(b2, c2, d2, a2, buffer.getUint32(48, true), 20, 2368359562);
    a2 = hh(a2, b2, c2, d2, buffer.getUint32(20, true), 4, 4294588738);
    d2 = hh(d2, a2, b2, c2, buffer.getUint32(32, true), 11, 2272392833);
    c2 = hh(c2, d2, a2, b2, buffer.getUint32(44, true), 16, 1839030562);
    b2 = hh(b2, c2, d2, a2, buffer.getUint32(56, true), 23, 4259657740);
    a2 = hh(a2, b2, c2, d2, buffer.getUint32(4, true), 4, 2763975236);
    d2 = hh(d2, a2, b2, c2, buffer.getUint32(16, true), 11, 1272893353);
    c2 = hh(c2, d2, a2, b2, buffer.getUint32(28, true), 16, 4139469664);
    b2 = hh(b2, c2, d2, a2, buffer.getUint32(40, true), 23, 3200236656);
    a2 = hh(a2, b2, c2, d2, buffer.getUint32(52, true), 4, 681279174);
    d2 = hh(d2, a2, b2, c2, buffer.getUint32(0, true), 11, 3936430074);
    c2 = hh(c2, d2, a2, b2, buffer.getUint32(12, true), 16, 3572445317);
    b2 = hh(b2, c2, d2, a2, buffer.getUint32(24, true), 23, 76029189);
    a2 = hh(a2, b2, c2, d2, buffer.getUint32(36, true), 4, 3654602809);
    d2 = hh(d2, a2, b2, c2, buffer.getUint32(48, true), 11, 3873151461);
    c2 = hh(c2, d2, a2, b2, buffer.getUint32(60, true), 16, 530742520);
    b2 = hh(b2, c2, d2, a2, buffer.getUint32(8, true), 23, 3299628645);
    a2 = ii(a2, b2, c2, d2, buffer.getUint32(0, true), 6, 4096336452);
    d2 = ii(d2, a2, b2, c2, buffer.getUint32(28, true), 10, 1126891415);
    c2 = ii(c2, d2, a2, b2, buffer.getUint32(56, true), 15, 2878612391);
    b2 = ii(b2, c2, d2, a2, buffer.getUint32(20, true), 21, 4237533241);
    a2 = ii(a2, b2, c2, d2, buffer.getUint32(48, true), 6, 1700485571);
    d2 = ii(d2, a2, b2, c2, buffer.getUint32(12, true), 10, 2399980690);
    c2 = ii(c2, d2, a2, b2, buffer.getUint32(40, true), 15, 4293915773);
    b2 = ii(b2, c2, d2, a2, buffer.getUint32(4, true), 21, 2240044497);
    a2 = ii(a2, b2, c2, d2, buffer.getUint32(32, true), 6, 1873313359);
    d2 = ii(d2, a2, b2, c2, buffer.getUint32(60, true), 10, 4264355552);
    c2 = ii(c2, d2, a2, b2, buffer.getUint32(24, true), 15, 2734768916);
    b2 = ii(b2, c2, d2, a2, buffer.getUint32(52, true), 21, 1309151649);
    a2 = ii(a2, b2, c2, d2, buffer.getUint32(16, true), 6, 4149444226);
    d2 = ii(d2, a2, b2, c2, buffer.getUint32(44, true), 10, 3174756917);
    c2 = ii(c2, d2, a2, b2, buffer.getUint32(8, true), 15, 718787259);
    b2 = ii(b2, c2, d2, a2, buffer.getUint32(36, true), 21, 3951481745);
    state[0] = a2 + state[0] & 4294967295;
    state[1] = b2 + state[1] & 4294967295;
    state[2] = c2 + state[2] & 4294967295;
    state[3] = d2 + state[3] & 4294967295;
  }
  reset() {
    this.state = Uint32Array.from(INIT2);
    this.buffer = new DataView(new ArrayBuffer(BLOCK_SIZE2));
    this.bufferLength = 0;
    this.bytesHashed = 0;
    this.finished = false;
  }
};
function cmn(q2, a2, b2, x2, s2, t2) {
  a2 = (a2 + q2 & 4294967295) + (x2 + t2 & 4294967295) & 4294967295;
  return (a2 << s2 | a2 >>> 32 - s2) + b2 & 4294967295;
}
__name(cmn, "cmn");
function ff(a2, b2, c2, d2, x2, s2, t2) {
  return cmn(b2 & c2 | ~b2 & d2, a2, b2, x2, s2, t2);
}
__name(ff, "ff");
function gg(a2, b2, c2, d2, x2, s2, t2) {
  return cmn(b2 & d2 | c2 & ~d2, a2, b2, x2, s2, t2);
}
__name(gg, "gg");
function hh(a2, b2, c2, d2, x2, s2, t2) {
  return cmn(b2 ^ c2 ^ d2, a2, b2, x2, s2, t2);
}
__name(hh, "hh");
function ii(a2, b2, c2, d2, x2, s2, t2) {
  return cmn(c2 ^ (b2 | ~d2), a2, b2, x2, s2, t2);
}
__name(ii, "ii");
function isEmptyData3(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}
__name(isEmptyData3, "isEmptyData");
function convertToBuffer3(data) {
  if (typeof data === "string") {
    return fromUtf8(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}
__name(convertToBuffer3, "convertToBuffer");

// node_modules/@smithy/util-body-length-browser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-body-length-browser/dist-es/calculateBodyLength.js
init_checked_fetch();
init_modules_watch_stub();
var TEXT_ENCODER = typeof TextEncoder == "function" ? new TextEncoder() : null;
var calculateBodyLength = /* @__PURE__ */ __name((body) => {
  if (typeof body === "string") {
    if (TEXT_ENCODER) {
      return TEXT_ENCODER.encode(body).byteLength;
    }
    let len = body.length;
    for (let i2 = len - 1; i2 >= 0; i2--) {
      const code = body.charCodeAt(i2);
      if (code > 127 && code <= 2047)
        len++;
      else if (code > 2047 && code <= 65535)
        len += 2;
      if (code >= 56320 && code <= 57343)
        i2--;
    }
    return len;
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  }
  throw new Error(`Body Length computation failed for ${body}`);
}, "calculateBodyLength");

// node_modules/@aws-sdk/client-s3/dist-es/runtimeConfig.shared.js
init_checked_fetch();
init_modules_watch_stub();
var getRuntimeConfig = /* @__PURE__ */ __name((config) => {
  return {
    apiVersion: "2006-03-01",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    getAwsChunkedEncodingStream: config?.getAwsChunkedEncodingStream ?? getAwsChunkedEncodingStream,
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultS3HttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("aws.auth#sigv4"), "identityProvider"),
        signer: new AwsSdkSigV4Signer()
      },
      {
        schemeId: "aws.auth#sigv4a",
        identityProvider: /* @__PURE__ */ __name((ipc) => ipc.getIdentityProvider("aws.auth#sigv4a"), "identityProvider"),
        signer: new AwsSdkSigV4ASigner()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    sdkStreamMixin: config?.sdkStreamMixin ?? sdkStreamMixin,
    serviceId: config?.serviceId ?? "S3",
    signerConstructor: config?.signerConstructor ?? SignatureV4MultiRegion,
    signingEscapePath: config?.signingEscapePath ?? false,
    urlParser: config?.urlParser ?? parseUrl,
    useArnRegion: config?.useArnRegion ?? false,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
}, "getRuntimeConfig");

// node_modules/@smithy/util-defaults-mode-browser/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@smithy/util-defaults-mode-browser/dist-es/resolveDefaultsModeConfig.js
init_checked_fetch();
init_modules_watch_stub();
var import_bowser2 = __toESM(require_es5());

// node_modules/@smithy/util-defaults-mode-browser/dist-es/constants.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];

// node_modules/@smithy/util-defaults-mode-browser/dist-es/resolveDefaultsModeConfig.js
var resolveDefaultsModeConfig = /* @__PURE__ */ __name(({ defaultsMode } = {}) => memoize(async () => {
  const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
  switch (mode?.toLowerCase()) {
    case "auto":
      return Promise.resolve(isMobileBrowser() ? "mobile" : "standard");
    case "mobile":
    case "in-region":
    case "cross-region":
    case "standard":
    case "legacy":
      return Promise.resolve(mode?.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
  }
}), "resolveDefaultsModeConfig");
var isMobileBrowser = /* @__PURE__ */ __name(() => {
  const parsedUA = typeof window !== "undefined" && window?.navigator?.userAgent ? import_bowser2.default.parse(window.navigator.userAgent) : void 0;
  const platform = parsedUA?.platform?.type;
  return platform === "tablet" || platform === "mobile";
}, "isMobileBrowser");

// node_modules/@aws-sdk/client-s3/dist-es/runtimeConfig.browser.js
var getRuntimeConfig2 = /* @__PURE__ */ __name((config) => {
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(loadConfigsForDefaultMode), "defaultConfigProvider");
  const clientSharedValues = getRuntimeConfig(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "browser",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? ((_) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
    eventStreamSerdeProvider: config?.eventStreamSerdeProvider ?? eventStreamSerdeProvider,
    maxAttempts: config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    md5: config?.md5 ?? Md5,
    region: config?.region ?? invalidProvider("Region is missing"),
    requestHandler: FetchHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
    retryMode: config?.retryMode ?? (async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE),
    sha1: config?.sha1 ?? Sha12,
    sha256: config?.sha256 ?? Sha2563,
    streamCollector: config?.streamCollector ?? streamCollector,
    streamHasher: config?.streamHasher ?? blobHasher,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? (() => Promise.resolve(DEFAULT_USE_DUALSTACK_ENDPOINT)),
    useFipsEndpoint: config?.useFipsEndpoint ?? (() => Promise.resolve(DEFAULT_USE_FIPS_ENDPOINT))
  };
}, "getRuntimeConfig");

// node_modules/@aws-sdk/client-s3/dist-es/runtimeExtensions.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/region-config-resolver/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/region-config-resolver/dist-es/extensions/index.js
init_checked_fetch();
init_modules_watch_stub();
var getAwsRegionExtensionConfiguration = /* @__PURE__ */ __name((runtimeConfig) => {
  let runtimeConfigRegion = /* @__PURE__ */ __name(async () => {
    if (runtimeConfig.region === void 0) {
      throw new Error("Region is missing from runtimeConfig");
    }
    const region = runtimeConfig.region;
    if (typeof region === "string") {
      return region;
    }
    return region();
  }, "runtimeConfigRegion");
  return {
    setRegion(region) {
      runtimeConfigRegion = region;
    },
    region() {
      return runtimeConfigRegion;
    }
  };
}, "getAwsRegionExtensionConfiguration");
var resolveAwsRegionExtensionConfiguration = /* @__PURE__ */ __name((awsRegionExtensionConfiguration) => {
  return {
    region: awsRegionExtensionConfiguration.region()
  };
}, "resolveAwsRegionExtensionConfiguration");

// node_modules/@aws-sdk/region-config-resolver/dist-es/regionConfig/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/region-config-resolver/dist-es/regionConfig/config.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/region-config-resolver/dist-es/regionConfig/resolveRegionConfig.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/region-config-resolver/dist-es/regionConfig/getRealRegion.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/region-config-resolver/dist-es/regionConfig/isFipsRegion.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@aws-sdk/client-s3/dist-es/auth/httpAuthExtensionConfiguration.js
init_checked_fetch();
init_modules_watch_stub();
var getHttpAuthExtensionConfiguration = /* @__PURE__ */ __name((runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
}, "getHttpAuthExtensionConfiguration");
var resolveHttpAuthRuntimeConfig = /* @__PURE__ */ __name((config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
}, "resolveHttpAuthRuntimeConfig");

// node_modules/@aws-sdk/client-s3/dist-es/runtimeExtensions.js
var asPartial = /* @__PURE__ */ __name((t2) => t2, "asPartial");
var resolveRuntimeExtensions = /* @__PURE__ */ __name((runtimeConfig, extensions) => {
  const extensionConfiguration = {
    ...asPartial(getAwsRegionExtensionConfiguration(runtimeConfig)),
    ...asPartial(getDefaultExtensionConfiguration(runtimeConfig)),
    ...asPartial(getHttpHandlerExtensionConfiguration(runtimeConfig)),
    ...asPartial(getHttpAuthExtensionConfiguration(runtimeConfig))
  };
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return {
    ...runtimeConfig,
    ...resolveAwsRegionExtensionConfiguration(extensionConfiguration),
    ...resolveDefaultRuntimeConfig(extensionConfiguration),
    ...resolveHttpHandlerRuntimeConfig(extensionConfiguration),
    ...resolveHttpAuthRuntimeConfig(extensionConfiguration)
  };
}, "resolveRuntimeExtensions");

// node_modules/@aws-sdk/client-s3/dist-es/S3Client.js
var S3Client = class extends Client {
  static {
    __name(this, "S3Client");
  }
  config;
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig2(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveFlexibleChecksumsConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveRegionConfig(_config_4);
    const _config_6 = resolveHostHeaderConfig(_config_5);
    const _config_7 = resolveEndpointConfig(_config_6);
    const _config_8 = resolveEventStreamSerdeConfig(_config_7);
    const _config_9 = resolveHttpAuthSchemeConfig(_config_8);
    const _config_10 = resolveS3Config(_config_9, { session: [() => this, CreateSessionCommand] });
    const _config_11 = resolveRuntimeExtensions(_config_10, configuration?.extensions || []);
    super(_config_11);
    this.config = _config_11;
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultS3HttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: /* @__PURE__ */ __name(async (config) => new DefaultIdentityProviderConfig({
        "aws.auth#sigv4": config.credentials,
        "aws.auth#sigv4a": config.credentials
      }), "identityProviderConfigProvider")
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
    this.middlewareStack.use(getValidateBucketNamePlugin(this.config));
    this.middlewareStack.use(getAddExpectContinuePlugin(this.config));
    this.middlewareStack.use(getRegionRedirectMiddlewarePlugin(this.config));
    this.middlewareStack.use(getS3ExpressPlugin(this.config));
    this.middlewareStack.use(getS3ExpressHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};

// node_modules/@aws-sdk/middleware-ssec/dist-es/index.js
init_checked_fetch();
init_modules_watch_stub();
function ssecMiddleware(options) {
  return (next) => async (args) => {
    const input = { ...args.input };
    const properties = [
      {
        target: "SSECustomerKey",
        hash: "SSECustomerKeyMD5"
      },
      {
        target: "CopySourceSSECustomerKey",
        hash: "CopySourceSSECustomerKeyMD5"
      }
    ];
    for (const prop of properties) {
      const value = input[prop.target];
      if (value) {
        let valueForHash;
        if (typeof value === "string") {
          if (isValidBase64EncodedSSECustomerKey(value, options)) {
            valueForHash = options.base64Decoder(value);
          } else {
            valueForHash = options.utf8Decoder(value);
            input[prop.target] = options.base64Encoder(valueForHash);
          }
        } else {
          valueForHash = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
          input[prop.target] = options.base64Encoder(valueForHash);
        }
        const hash = new options.md5();
        hash.update(valueForHash);
        input[prop.hash] = options.base64Encoder(await hash.digest());
      }
    }
    return next({
      ...args,
      input
    });
  };
}
__name(ssecMiddleware, "ssecMiddleware");
var ssecMiddlewareOptions = {
  name: "ssecMiddleware",
  step: "initialize",
  tags: ["SSE"],
  override: true
};
var getSsecPlugin = /* @__PURE__ */ __name((config) => ({
  applyToStack: /* @__PURE__ */ __name((clientStack) => {
    clientStack.add(ssecMiddleware(config), ssecMiddlewareOptions);
  }, "applyToStack")
}), "getSsecPlugin");
function isValidBase64EncodedSSECustomerKey(str, options) {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64Regex.test(str))
    return false;
  try {
    const decodedBytes = options.base64Decoder(str);
    return decodedBytes.length === 32;
  } catch {
    return false;
  }
}
__name(isValidBase64EncodedSSECustomerKey, "isValidBase64EncodedSSECustomerKey");

// node_modules/@aws-sdk/client-s3/dist-es/commands/PutObjectCommand.js
init_checked_fetch();
init_modules_watch_stub();
var PutObjectCommand = class extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getFlexibleChecksumsPlugin(config, {
      requestAlgorithmMember: { httpHeader: "x-amz-sdk-checksum-algorithm", name: "ChecksumAlgorithm" },
      requestChecksumRequired: false
    }),
    getCheckContentLengthHeaderPlugin(config),
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config)
  ];
}).s("AmazonS3", "PutObject", {}).n("S3Client", "PutObjectCommand").f(PutObjectRequestFilterSensitiveLog, PutObjectOutputFilterSensitiveLog).ser(se_PutObjectCommand).de(de_PutObjectCommand).build() {
  static {
    __name(this, "PutObjectCommand");
  }
};

// src/handlers/upload.ts
var S3_CLIENT = null;
function getS3Client(env) {
  if (S3_CLIENT) return S3_CLIENT;
  console.log("\u521D\u59CB\u5316 S3 \u5BA2\u6236\u7AEF...", {
    endpoint: env.R2_API_ENDPOINT,
    hasAccessKey: !!env.R2_ACCESS_KEY_ID,
    hasSecretKey: !!env.R2_SECRET_ACCESS_KEY
  });
  S3_CLIENT = new S3Client({
    region: "auto",
    endpoint: env.R2_API_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
  });
  return S3_CLIENT;
}
__name(getS3Client, "getS3Client");
async function handleUpload(request, env) {
  const headers = { ...getCorsHeadersForRequest(request), "Content-Type": "application/json" };
  try {
    console.log("\u958B\u59CB\u8655\u7406\u6A94\u6848\u4E0A\u50B3\u8ACB\u6C42");
    if (!env.R2_BUCKET || !env.R2_ENDPOINT || !env.R2_API_ENDPOINT) {
      console.error("\u7F3A\u5C11\u5FC5\u8981\u7684 R2 \u74B0\u5883\u8B8A\u6578:", {
        bucket: !!env.R2_BUCKET,
        endpoint: !!env.R2_ENDPOINT,
        apiEndpoint: !!env.R2_API_ENDPOINT
      });
      return new Response(JSON.stringify({
        success: false,
        error: "\u4F3A\u670D\u5668\u914D\u7F6E\u932F\u8AA4: R2 \u74B0\u5883\u8B8A\u6578\u672A\u8A2D\u7F6E"
      }), {
        status: 500,
        headers
      });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        success: false,
        error: "\u65B9\u6CD5\u4E0D\u5141\u8A31"
      }), {
        status: 405,
        headers
      });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    const path = formData.get("path");
    if (!file || !path) {
      console.log("\u7F3A\u5C11\u4E0A\u50B3\u53C3\u6578:", {
        hasFile: !!file,
        hasPath: !!path
      });
      return new Response(JSON.stringify({
        success: false,
        error: "\u7F3A\u5C11\u6A94\u6848\u6216\u8DEF\u5F91\u53C3\u6578"
      }), {
        status: 400,
        headers
      });
    }
    console.log("\u4E0A\u50B3\u6A94\u6848\u8CC7\u8A0A:", {
      filename: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadPath: path
    });
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({
        success: false,
        error: "\u6A94\u6848\u5927\u5C0F\u4E0D\u80FD\u8D85\u904E 10MB"
      }), {
        status: 400,
        headers
      });
    }
    const s3Client = getS3Client(env);
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);
    console.log("\u6E96\u5099\u767C\u9001\u81F3 R2...", {
      bucket: env.R2_BUCKET,
      key: path,
      contentType: file.type
    });
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: path,
          Body: fileContent,
          ContentType: file.type
        })
      );
    } catch (uploadError) {
      console.error("R2 \u4E0A\u50B3\u932F\u8AA4:", uploadError);
      return new Response(JSON.stringify({
        success: false,
        error: uploadError instanceof Error ? `R2 \u4E0A\u50B3\u932F\u8AA4: ${uploadError.message}` : "R2 \u4E0A\u50B3\u5931\u6557"
      }), {
        status: 500,
        headers
      });
    }
    const fileUrl = `https://${env.R2_ENDPOINT}/${path}`;
    console.log("\u6A94\u6848\u4E0A\u50B3\u6210\u529F\uFF0CURL:", fileUrl);
    return new Response(JSON.stringify({
      success: true,
      url: fileUrl
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("\u6A94\u6848\u4E0A\u50B3\u8655\u7406\u932F\u8AA4:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "\u8655\u7406\u6A94\u6848\u4E0A\u50B3\u6642\u767C\u751F\u932F\u8AA4"
    }), {
      status: 500,
      headers
    });
  }
}
__name(handleUpload, "handleUpload");

// src/handlers/chat.ts
init_checked_fetch();
init_modules_watch_stub();
async function handleChat(request, env) {
  const headers = { ...getCorsHeadersForRequest(request), "Content-Type": "application/json" };
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "\u65B9\u6CD5\u4E0D\u5141\u8A31" }
      }), {
        status: 405,
        headers
      });
    }
    const data = await request.json();
    if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "\u7F3A\u5C11\u804A\u5929\u8A0A\u606F" }
      }), {
        status: 400,
        headers
      });
    }
    const groqResponse = await callGroqApi(data, env);
    return new Response(JSON.stringify({
      success: true,
      data: groqResponse
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("\u804A\u5929\u8655\u7406\u932F\u8AA4:", error);
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error instanceof Error ? error.message : "\u8655\u7406\u804A\u5929\u8ACB\u6C42\u6642\u767C\u751F\u932F\u8AA4"
      }
    }), {
      status: 500,
      headers
    });
  }
}
__name(handleChat, "handleChat");
async function callGroqApi({ messages, model = "llama-3.1-8b-instant", temperature = 0.7, maxTokens = 2048 }, env) {
  try {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    if (!env.GROQ_API_KEY) {
      throw new Error("\u672A\u8A2D\u5B9A Groq API \u91D1\u9470");
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API \u932F\u8AA4: ${JSON.stringify(errorData)}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Groq API \u8ACB\u6C42\u932F\u8AA4:", error);
    throw error;
  }
}
__name(callGroqApi, "callGroqApi");

// src/handlers/faq.ts
init_checked_fetch();
init_modules_watch_stub();

// src/services/pinecone.ts
init_checked_fetch();
init_modules_watch_stub();

// src/services/embedding.ts
init_checked_fetch();
init_modules_watch_stub();
async function generateEmbedding(text) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error("\u672A\u8A2D\u5B9A OpenAI API \u91D1\u9470");
  }
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: text
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API \u932F\u8AA4: ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error("\u751F\u6210\u5D4C\u5165\u932F\u8AA4:", error);
    console.log("\u8FD4\u56DE\u6A21\u64EC\u5D4C\u5165");
    return Array(1536).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }
}
__name(generateEmbedding, "generateEmbedding");

// src/services/pinecone.ts
var PineconeClient = class {
  static {
    __name(this, "PineconeClient");
  }
  apiKey;
  environment;
  indexName;
  /**
   * 建立 Pinecone 客戶端
   * @param apiKey Pinecone API 金鑰
   * @param environment Pinecone 環境
   * @param indexName Pinecone 索引名稱
   */
  constructor(apiKey, environment, indexName) {
    this.apiKey = apiKey;
    this.environment = environment;
    this.indexName = indexName;
  }
  /**
   * 搜尋相關 FAQ
   * @param query 查詢文本
   * @param limit 結果數量限制
   * @param threshold 相似度閾值
   * @returns FAQ 搜尋結果
   */
  async searchFaqs(query, limit = 5, threshold = 0.75) {
    try {
      const embedding = await generateEmbedding(query);
      const baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
      const url = `${baseUrl}/query`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": this.apiKey
        },
        body: JSON.stringify({
          vector: embedding,
          topK: limit,
          includeMetadata: true,
          includeValues: false
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinecone API \u932F\u8AA4: ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      const results = data.matches.filter((match) => match.score >= threshold).map((match) => ({
        id: match.id,
        question: match.metadata.question,
        answer: match.metadata.answer,
        score: match.score,
        category: match.metadata.category,
        tags: match.metadata.tags || []
      }));
      return results;
    } catch (error) {
      console.error("Pinecone \u641C\u5C0B\u932F\u8AA4:", error);
      throw error;
    }
  }
  /**
   * 添加 FAQ 到 Pinecone
   * @param faq FAQ 數據
   * @returns 操作結果
   */
  async addFaq(faq) {
    try {
      const embedding = await generateEmbedding(faq.question);
      const baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
      const url = `${baseUrl}/vectors/upsert`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": this.apiKey
        },
        body: JSON.stringify({
          vectors: [{
            id: faq.id,
            values: embedding,
            metadata: {
              question: faq.question,
              answer: faq.answer,
              category: faq.category || "general",
              tags: faq.tags || []
            }
          }]
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinecone API \u932F\u8AA4: ${JSON.stringify(errorData)}`);
      }
      return true;
    } catch (error) {
      console.error("\u6DFB\u52A0 FAQ \u932F\u8AA4:", error);
      throw error;
    }
  }
};

// src/handlers/faq.ts
async function handleFaq(request, env) {
  const headers = { ...getCorsHeadersForRequest(request), "Content-Type": "application/json" };
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "\u65B9\u6CD5\u4E0D\u5141\u8A31" }
      }), {
        status: 405,
        headers
      });
    }
    const { query, limit = 5, threshold = 0.75 } = await request.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "\u8ACB\u63D0\u4F9B\u6709\u6548\u7684\u67E5\u8A62" }
      }), {
        status: 400,
        headers
      });
    }
    const pinecone = new PineconeClient(
      env.PINECONE_API_KEY,
      env.PINECONE_ENVIRONMENT,
      env.PINECONE_INDEX
    );
    const results = await pinecone.searchFaqs(query, limit, threshold);
    return new Response(JSON.stringify({
      success: true,
      results
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("FAQ \u67E5\u8A62\u8655\u7406\u932F\u8AA4:", error);
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error instanceof Error ? error.message : "\u8655\u7406 FAQ \u67E5\u8A62\u6642\u767C\u751F\u932F\u8AA4"
      }
    }), {
      status: 500,
      headers
    });
  }
}
__name(handleFaq, "handleFaq");

// src/index.ts
var src_default = {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return handleCors(request);
    }
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/chat") {
        return handleChat(request, env);
      }
      if (url.pathname === "/api/faq") {
        return handleFaq(request, env);
      }
      if (url.pathname === "/api/upload") {
        return handleUpload(request, env);
      }
      if (url.pathname === "/api/health") {
        return new Response(JSON.stringify({ status: "ok" }), {
          status: 200,
          headers: {
            ...getCorsHeadersForRequest(request),
            "Content-Type": "application/json"
          }
        });
      }
      return new Response(JSON.stringify({ error: "\u8DEF\u5F91\u4E0D\u5B58\u5728" }), {
        status: 404,
        headers: {
          ...getCorsHeadersForRequest(request),
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error("API \u932F\u8AA4:", error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : "\u4F3A\u670D\u5668\u5167\u90E8\u932F\u8AA4"
      }), {
        status: 500,
        headers: {
          ...getCorsHeadersForRequest(request),
          "Content-Type": "application/json"
        }
      });
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-tOsIuT/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-tOsIuT/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
