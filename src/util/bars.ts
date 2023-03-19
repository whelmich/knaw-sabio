import { ResultObject } from '../interfaces/Result';
import { Bar } from '../interfaces/Bar';

export interface Scores {
  [key: string]: number;
}

interface Props {
  resultObjects: Array<ResultObject>;
  unit: string;
}

export const getBarsFromResults = ({
  resultObjects,
  unit = '%',
}: Props): Array<Bar> => {
  const scores: Scores = {};

  // get scores
  resultObjects.forEach((resultObject) => {
    Object.entries(resultObject.score_details).forEach(([word, score]) => {
      if (!scores[word]) {
        scores[word] = 0;
      }
      scores[word] += score;
    });
  });

  const totalObjects = resultObjects.length;

  // create bars and order by score
  return Object.entries(scores)
    .map(([name, value]) => ({
      name,
      value: value / totalObjects,
      unit,
    }))
    .sort((a, b) => (a.value === b.value ? 0 : b.value - a.value));
};
