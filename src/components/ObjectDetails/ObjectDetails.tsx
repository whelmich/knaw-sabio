import { FunctionComponent, useEffect, useState } from 'react';
import { ObjectDetails } from '../../interfaces/ObjectDetails';
import PercentageLabel from '../PercentageLabel/PercentageLabel';
import LogoMark from '../Logo/LogoMark';
import './ObjectDetails.scss';
import colors from '../../config/colors';
import Highlighter from 'react-highlight-words';
import classnames from 'clsx';
import { findChunksFullWord } from '../../util/chunk';

interface Props {
  object: ObjectDetails;
  score: number;
  highlightWords: string[];
  highlightExactWords: boolean;
}

const DESCRIPTION_LENGTH = 500;

const ObjectDetailsComponent: FunctionComponent<Props> = ({
  object,
  score,
  highlightWords,
  highlightExactWords,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  // Hide full description when switching object
  useEffect(() => {
    setShowDescription(false);
  }, [object.id]);

  const description = showDescription
    ? object.description
    : object.description.length > DESCRIPTION_LENGTH
    ? object.description.slice(0, DESCRIPTION_LENGTH) + '…'
    : object.description;

  const findChunks = highlightExactWords ? findChunksFullWord : undefined; // undefined = default

  return (
    <div className="ObjectDetails">
      {object.image_url && (
        <a href={object.source_url} target="_blank" rel="noopener noreferrer">
          <div
            className="image-container"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.65)), url("' +
                object.image_url +
                '")',
            }}
          >
            <img src={object.image_url} alt={object.name} />
          </div>
        </a>
      )}
      <div className="details">
        <h2>
          {score !== null && (
            <span className="score">
              <LogoMark color={colors.PRIMARY} width={11} height={11} />
              <PercentageLabel value={score} />
            </span>
          )}
          <Highlighter
            highlightClassName="highlight"
            searchWords={highlightWords}
            autoEscape={true}
            textToHighlight={object.name}
            findChunks={findChunks}
          />
        </h2>
        <div className="attributes">
          {object.attributes &&
            Object.entries(object.attributes).map(([name, value]) => (
              <div
                className={classnames('icon-attribute-' + name, {
                  large: value.length > 40,
                })}
                key={name}
              >
                {value || '-'}
              </div>
            ))}
          <div className="icon-attribute-id" key="id">
            {object.id}
          </div>
        </div>
        <p>
          <Highlighter
            highlightClassName="highlight"
            searchWords={highlightWords}
            autoEscape={true}
            textToHighlight={description}
            findChunks={findChunks}
          />
          {object.description.length > DESCRIPTION_LENGTH && (
            <span
              className="read-more"
              onClick={() => {
                setShowDescription((v) => !v);
              }}
            >
              Read {showDescription ? 'less' : 'more'}
            </span>
          )}
        </p>
        <a
          className="btn primary icon-button-link"
          href={object.source_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View source
        </a>
      </div>
    </div>
  );
};

export default ObjectDetailsComponent;
