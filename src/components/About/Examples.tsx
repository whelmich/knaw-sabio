import { FunctionComponent } from 'react';
import Example from './Example';
import './Examples.scss';
import useExamples from '../../hooks/useExamples';

interface Props {
  onExampleClick?: () => void;
}

const Examples: FunctionComponent<Props> = ({ onExampleClick }) => {
  const examples = useExamples();

  return (
    <div
      className="Examples"
      onClick={
        onExampleClick
          ? (e) => {
              (e.target as Element).classList.contains('image') &&
                onExampleClick();
            }
          : undefined
      }
    >
      <h2>Examples</h2>
      <div className="cases">
        {examples === null ? (
          ''
        ) : examples.length > 0 ? (
          examples.map((example, index) => (
            <Example
              key={index}
              imageUrl={example.thumbnail_url}
              score={example.score}
              title={example.title}
              engine={example.engine}
              url={example.url}
            />
          ))
        ) : (
          <h3>No examples available for this API</h3>
        )}
      </div>
    </div>
  );
};

export default Examples;
