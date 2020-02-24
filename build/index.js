"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml_js_1 = require("xml-js");
const fs_1 = require("fs");
const jsonpath_1 = __importDefault(require("jsonpath"));
const convertXML2JSON = () => {
    const xml = fs_1.readFileSync('data/emis/schemas/OpenHR001.xsd', { encoding: 'utf8' });
    const result1 = xml_js_1.xml2json(xml, { compact: true, spaces: 4 });
    // const result2 = xml2json(xml, { compact: false, spaces: 4 });
    // console.log(result1);
    fs_1.writeFileSync('data/emis/schemas/openHR001.json', result1);
};
const testStructure = () => {
    const json = JSON.parse(fs_1.readFileSync('data/emis/schemas/openHR001.json', { encoding: 'utf8' }));
    const tlos = jsonpath_1.default.query(json, `$.schema.complexType[*]._attributes.name`);
    const attributes = jsonpath_1.default.query(json, `$.schema.complexType[*].sequence.element[*].name`);
    console.log(attributes);
};
const detectStructure = item => {
    var _a, _b, _c, _d, _e, _f;
    if ((_c = (_b = (_a = item.complexContent) === null || _a === void 0 ? void 0 : _a.extension) === null || _b === void 0 ? void 0 : _b.sequence) === null || _c === void 0 ? void 0 : _c.element) {
        const attributes = item.complexContent.extension.sequence.element;
        return attributes.length ? attributes.map(attr => attr._attributes.name) : [(_d = attributes._attributes) === null || _d === void 0 ? void 0 : _d.name];
    }
    if ((_e = item.complexContent) === null || _e === void 0 ? void 0 : _e.extension) {
        return [item.complexContent.extension._attributes.base];
    }
    if ((_f = item.sequence) === null || _f === void 0 ? void 0 : _f.element) {
        return item.sequence.element.length ? item.sequence.element.map(element => element._attributes.name) : [item.sequence.element._attributes.name];
    }
};
const simplify = () => {
    const json = JSON.parse(fs_1.readFileSync('data/emis/schemas/openHR001.json', { encoding: 'utf8' }));
    const complexType = json['schema']['complexType'];
    const lift = complexType.map(item => {
        const liftedAttributes = detectStructure(item);
        return {
            [item._attributes.name]: liftedAttributes
        };
    });
    fs_1.writeFileSync('data/emis/schemas/openHR001-simple.json', JSON.stringify(lift));
};
const topLevel = () => {
    const json = JSON.parse(fs_1.readFileSync('data/emis/schemas/openHR001.json', { encoding: 'utf8' }));
    const complexType = json['schema']['complexType'];
    const lift = complexType.map(item => {
        return item._attributes.name;
    });
    fs_1.writeFileSync('data/emis/schemas/openHR001-tl.json', JSON.stringify(lift));
};
topLevel();
//# sourceMappingURL=index.js.map