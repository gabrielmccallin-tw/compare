import { readFileSync, writeFileSync } from 'fs';
import jsonpath from 'jsonpath';
import { xml2json } from 'xml-js';

export const extractOpenEHR = () => {
    const concepts = readFileSync('data/openEHR/archetypes.htm', { encoding: 'utf8' });

    const matches = concepts.match(/(<a href=")(.*)(<\/a>)/g);

    const matchStrip = matches?.map(item => item.match(/>(.*)<\/a>/));
    const justConcept = matchStrip?.map(item => item && item[1]);
    const removeCKM = justConcept?.filter(item => item !== 'CKM');

    writeFileSync('data/openEHR/archetypes.json', JSON.stringify(removeCKM));

};

export const convertXML2JSON = (readPath: string, writePath: string) => {
    const xml = readFileSync(readPath, { encoding: 'utf8' });
    const result = xml2json(xml, { compact: true, spaces: 4 });

    writeFileSync(writePath, JSON.stringify(result));
};

export const testStructure = () => {
    const json = JSON.parse(readFileSync('data/emis/schemas/openHR001.json', { encoding: 'utf8' }));

    const tlos = jsonpath.query(json, `$.schema.complexType[*]._attributes.name`);

    const attributes = jsonpath.query(json, `$.schema.complexType[*].sequence.element[*].name`);
    console.log(attributes);
};

export const detectStructure = item => {
    if (item.complexContent?.extension?.sequence?.element) {
        const attributes = item.complexContent.extension.sequence.element;
        return attributes.length ? attributes.map(attr => attr._attributes.name) : [attributes._attributes?.name];
    }

    if (item.complexContent?.extension) {
        return [item.complexContent.extension._attributes.base];
    }

    if (item.sequence?.element) {
        return item.sequence.element.length ? item.sequence.element.map(element => element._attributes.name) : [item.sequence.element._attributes.name];
    }

};

const extractEmis = (input: {}): {} => {
    const complexType: any[] = input['schema']['complexType'];

    return complexType.map(item => {
        const liftedAttributes = detectStructure(item);
        return {
            [item._attributes.name]: liftedAttributes
        }
    });
};

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const read = (path: string): {} => {
    return JSON.parse(readFileSync(path, { encoding: 'utf8' }))
};

const write = (path: string) => {
    return (data: {}) => {
        writeFileSync(path, JSON.stringify(data));
        return 'SUCCESS';
    }
};

export const etl = (
    { extract, transform, load }: {
        extract: string,
        transform: (input: {}) => {},
        load: string
    }) => {

    pipe(
        read,
        transform,
        write(load),
    )(extract);
};

