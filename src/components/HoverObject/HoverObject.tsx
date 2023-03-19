import { FunctionComponent, memo, useLayoutEffect, useRef } from 'react';
import LogoMark from '../Logo/LogoMark';
import './HoverObject.scss';
import colors from '../../config/colors';
import { ResultObject } from '../../interfaces/Result';
import PercentageLabel from '../PercentageLabel/PercentageLabel';
import classnames from 'clsx';

interface Props {
  object: ResultObject;
  attributes: string[];
  x: number;
  y: number;
}
const HoverObject: FunctionComponent<Props> = ({
  object,
  x,
  y,
  attributes,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Prevent popup going outside of screen
  useLayoutEffect(() => {
    const elem = ref.current;
    if (!elem) {
      return;
    }

    const margin = 2;

    elem.style.transform = '';

    const translate = { x: 0, y: 0 };
    const rect = elem.getBoundingClientRect();
    if (rect.x < 0) {
      translate.x = rect.x;
    }
    if (rect.right > window.innerWidth - margin) {
      translate.x = window.innerWidth - rect.right - margin;
    }
    if (rect.y < 0) {
      translate.y = rect.y;
    }
    if (rect.bottom > window.innerHeight - margin) {
      translate.y = window.innerHeight - rect.bottom - margin;
    }
    elem.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
  }, []);

  return (
    <div className="HoverObject" ref={ref} style={{ left: x, top: y }}>
      <div
        className="image"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(' +
            object.thumbnail_url +
            ')',
        }}
      >
        <div style={{ backgroundImage: 'url(' + object.thumbnail_url + ')' }} />
      </div>
      <div className="details">
        <h2>{object.name}</h2>

        <div className="attributes">
          {object.values &&
            object.values.slice(0, 3).map((value, index) => (
              <div
                className={classnames(
                  'icon-attribute-' +
                    (index < attributes.length
                      ? attributes[index].toLowerCase()
                      : 'unknown'),
                  { large: value.length > 40 }
                )}
                key={index}
              >
                {value || '-'}
              </div>
            ))}
          <div className="icon-attribute-id" key="id">
            {object.id}
          </div>
        </div>

        <span className="score">
          <LogoMark color={colors.PRIMARY} width={11} height={11} />
          <PercentageLabel value={object.score} />
        </span>
      </div>
    </div>
  );
};

export default memo(HoverObject);
