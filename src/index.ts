// import { findSimilar } from "./findSimilar";
import { percentageSimilar } from "./percentageSimilar";

const emis = {
  name: 'EMIS',
  path: 'data/emis/schemas/openHR001-tl.json'
};

const systmOne = {
  name: 'SystmOne',
  path: 'data/systmone/systmone-schema.json'
};

const fhir = {
  name: 'FHIR',
  path: 'data/fhir/fhir-resources.json'
};

const openEHR = {
  name: 'openEHR',
  path: 'data/openEHR/archetypes.json'
};

percentageSimilar([
  [emis, fhir],
  [systmOne, fhir],
  [emis, openEHR],
  [systmOne, openEHR],
  [systmOne, emis],
  [emis, systmOne]
]);



