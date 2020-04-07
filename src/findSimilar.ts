import { readFileSync } from 'fs';
import stringSimilarity from 'string-similarity';

const findTermInList = (term: string, list: string[]): [string, string][] => {
  return list.map(item => {
    if(stringSimilarity.compareTwoStrings(item, term) > 0.7) {
      return [term, item];
    }
    return ['', ''];
  })
};

const compareTLOs = (items1Path: string, items2Path: string) => {
  const items1: string[] = JSON.parse(readFileSync(items1Path, { encoding: 'utf8' }));
  const items2: string[] = JSON.parse(readFileSync(items2Path, { encoding: 'utf8' }));

  const mapped = items1.map(item => {
    const matches = findTermInList(item, items2);
    const filteredByEmptyTuple = matches.filter(item => item[0] !== '')
    return filteredByEmptyTuple;
  });
  const filtered = mapped.filter(item => item.length > 0);
  const objected = filtered.map(item => {
    return {
      source: item[0][0],
      target: item[0][1]
    };
  })
  return JSON.stringify(objected);
};

interface list {
  name: string,
  path: string
}

export const findSimilar = (comparisons: [list, list][]) => {
  comparisons.forEach(item => {
    console.log(`${item[0].name} in ${item[1].name}: ${compareTLOs(item[0].path, item[1].path)}`);
  });
};



