import { readFileSync } from 'fs';
import stringSimilarity from 'string-similarity';

const reduceListAgainstOneTerm = (term: string, list: string[]): number => {
  return list.reduce((acc, item) => {
    const match = stringSimilarity.compareTwoStrings(item, term);
    return acc === 1 || match > 0.7 ? 1 : 0;
  }, 0);
};

const compareTLOs = (items1Path: string, items2Path: string) => {
  const items1: string[] = JSON.parse(readFileSync(items1Path, { encoding: 'utf8' }));
  const items2: string[] = JSON.parse(readFileSync(items2Path, { encoding: 'utf8' }));

  return items1.reduce((acc, next) => {
    const match = reduceListAgainstOneTerm(next, items2);
    return match + acc;
  }, 0) / items1.length * 100;
};

interface list {
  name: string,
  path: string
}

export const percentageSimilar = (comparisons: [list, list][]) => {
  comparisons.forEach(item => {
    console.log(`${item[0].name} in ${item[1].name}: ${Math.round(compareTLOs(item[0].path, item[1].path))}%`);
  });
};




