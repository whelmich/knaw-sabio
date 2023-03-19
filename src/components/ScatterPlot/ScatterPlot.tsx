import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import debounce from 'debounce';

import { Stage } from '@inlet/react-pixi';
import useDimensions from 'react-cool-dimensions';
import { Viewport as PIXIViewport } from 'pixi-viewport';
import { DisplayObject, InteractionEvent, Rectangle } from 'pixi.js';
import { Result, ResultObject } from '../../interfaces/Result';
import { Query } from '../../interfaces/Query';
import Viewport from './Viewport';
import Nodes from './Nodes';
import Area from './Area';
import XAxis from './XAxis';
import YAxis from './YAxis';

import './ScatterPlot.scss';
import {
  CONTAINER_OFFSET_X,
  CONTAINER_OFFSET_Y,
  EVENT_RESET_VIEWPORT,
  EVENT_SELECT_OBJECT,
  EVENT_UPDATE_MOUSE,
  VIEWPORT_MARGIN,
} from '../../config/constants';
import Border from './Border';
import Background from './BackGround';
import ObjectSprite from './ObjectSprite';
import { floatToPercentage } from '../../util/numbers';
import {
  getMaxAttributeValue,
  getMinAttributeValue,
} from '../../util/resultObjectBoundaries';
import { Point } from '../../interfaces/Point';
import { MouseUpdateEvent } from '../../interfaces/Events';

const stageOptions = {
  antialias: true,
  autoDensity: true,
  autoResize: true,
  backgroundColor: 0xeef2f4,
  resolution: window.devicePixelRatio,
  sharedTicker: false,
};

interface Props {
  attribute: number;
  result: Result | null;
  query: Query | null;
  selectedObject: ResultObject | null;
  setSelectedObject: (object: ResultObject | null) => void;
  setVisibleObjects: (objects: ResultObject[]) => void;
  setHoverObject: (object: ResultObject | null) => void;
  setAttribute: (attribute: number) => void;
}

const preventDefault = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  event.button === 0 && event.preventDefault();
};

const visibleBoundsPadding = 3;

const ScatterPlot: FunctionComponent<Props> = ({
  result,
  query,
  attribute,
  selectedObject,
  setSelectedObject,
  setVisibleObjects,
  setHoverObject,
  setAttribute,
}) => {
  // viewport instance
  const viewportRef = useRef<DisplayObject>(null);
  // viewport dimensions
  const { observe, width, height } = useDimensions();
  // viewport zoom
  const [zoom, setZoom] = useState(1);
  // zoom buckets
  const zoomBucket = zoom > 15 ? (zoom > 50 ? 100 : 15) : 1;
  // nodes
  const [nodes, setNodes] = useState<ObjectSprite[]>([]);
  // visible bounds
  const [visibleBounds, setVisibleBounds] = useState<Rectangle | null>(null);

  // Set visible bounds on nodes update
  useEffect(() => {
    const viewport = viewportRef.current
      ? (viewportRef.current as PIXIViewport)
      : null;
    if (!viewport) {
      return;
    }
    setVisibleBounds(viewport.getVisibleBounds());
  }, [nodes]);

  // Update maxZoom based on number of results
  useEffect(() => {
    if (!result || !viewportRef.current) {
      return;
    }
    const viewport = viewportRef.current as PIXIViewport;
    viewport.clampZoom({
      minScale: 1,
      maxScale: 4 + result.results.length / 5,
    });
  }, [result]);

  // Update visible bounds on viewChange
  useEffect(() => {
    const viewport = viewportRef.current
      ? (viewportRef.current as PIXIViewport)
      : null;
    if (!viewport) {
      return;
    }
    const updateVisibleObjects = debounce(() => {
      setVisibleBounds(viewport.getVisibleBounds());
    }, 200);

    viewport
      .on('zoomed-end', updateVisibleObjects)
      .on('moved-end', updateVisibleObjects);
    return () => {
      updateVisibleObjects.clear();
      viewport
        .off('zoomed-end', updateVisibleObjects)
        .off('moved-end', updateVisibleObjects);
    };
  }, []);

  // Update visible nodes within visibleBounds
  useEffect(() => {
    if (!result || !viewportRef.current || !visibleBounds || selectedObject) {
      return;
    }
    const visibleObjects: ResultObject[] = [];
    const paddedBounds = visibleBounds
      .clone()
      .pad(visibleBoundsPadding / zoomBucket);
    nodes.forEach((node) => {
      if (paddedBounds.contains(node._x, node._y)) {
        visibleObjects.push(node.object);
      }
    });
    setVisibleObjects(visibleObjects);
  }, [
    visibleBounds,
    setVisibleObjects,
    result,
    selectedObject,
    nodes,
    zoomBucket,
  ]);

  // Update zoom limits
  useEffect(() => {
    const viewport = viewportRef.current
      ? (viewportRef.current as PIXIViewport)
      : null;
    if (!viewport) {
      return;
    }
    const updateZoom = debounce(() => {
      setZoom(viewport.width / viewport.worldWidth);
    }, 200);

    viewport.on('zoomed-end', updateZoom);
    return () => {
      updateZoom.clear();
      viewport.off('zoomed-end', updateZoom);
    };
  }, []);

  // Reset viewport listener
  useEffect(() => {
    const resetViewport = () => {
      if (!viewportRef.current) {
        return;
      }
      const viewport = viewportRef.current as PIXIViewport;
      viewport.animate({ width: viewport.width, time: 1000 });
    };
    window.addEventListener(EVENT_RESET_VIEWPORT, resetViewport);
    return () => {
      window.removeEventListener(EVENT_RESET_VIEWPORT, resetViewport);
    };
  }, []);

  // Toggle selected object listener
  useEffect(() => {
    const toggleSelectedObject = ((e: CustomEvent) => {
      const object = e.detail.object as ResultObject;
      setSelectedObject(object === selectedObject ? null : object);
    }) as EventListener;

    window.addEventListener(EVENT_SELECT_OBJECT, toggleSelectedObject);
    return () => {
      window.removeEventListener(EVENT_SELECT_OBJECT, toggleSelectedObject);
    };
  }, [selectedObject, setSelectedObject]);

  // Get pointer information relative to the content area and share it with the application
  // using an event
  const lastPointerPos = useRef<Point>({ x: 0, y: 0 });
  const onPointerMove = useCallback(
    (e?: InteractionEvent) => {
      if (!visibleBounds) {
        return;
      }

      if (e) {
        lastPointerPos.current = e.data.global;
      }
      // Relative X/Y in full viewport
      const rx =
        ((lastPointerPos.current.x / width) * visibleBounds.width +
          visibleBounds.x) /
        width;

      const ry =
        ((lastPointerPos.current.y / height) * visibleBounds.height +
          visibleBounds.y) /
        height;

      // Corrected size and position with offset and margin
      const areaWidth = (width - 2 * VIEWPORT_MARGIN) / width;
      const areaHeight = (height - 2 * VIEWPORT_MARGIN) / height;
      const ox = (CONTAINER_OFFSET_X + VIEWPORT_MARGIN) / width;
      const oy = (CONTAINER_OFFSET_Y + VIEWPORT_MARGIN) / height;

      // Calculate corrected x,y values within plot area
      const x = Math.min(1, Math.max(0, (rx - ox) / areaWidth));
      const y = Math.min(1, Math.max(0, (ry - oy) / areaHeight));

      // Global position, restricted to view bounds
      const global = { x: 0, y: 0 };

      global.x =
        (CONTAINER_OFFSET_X + VIEWPORT_MARGIN - visibleBounds.x) * zoom +
        x * (width - 2 * VIEWPORT_MARGIN) * zoom;
      global.y =
        (CONTAINER_OFFSET_Y + VIEWPORT_MARGIN - visibleBounds.y) * zoom +
        y * (height - 2 * VIEWPORT_MARGIN) * zoom;
      emitMouseUpdate({ x, y }, global);
    },
    [visibleBounds, width, height, zoom]
  );

  return (
    <div className="ScatterPlot" ref={observe} onMouseDown={preventDefault}>
      <Stage width={width} height={height} options={stageOptions}>
        <Viewport
          ref={viewportRef}
          screenWidth={width}
          screenHeight={height}
          worldWidth={width}
          worldHeight={height}
        >
          <Background
            width={width}
            height={height}
            onClick={() => {
              setSelectedObject(null);
            }}
            onPointerMove={onPointerMove}
          />
          <Area
            width={width}
            height={height}
            margin={VIEWPORT_MARGIN - 15}
            x={CONTAINER_OFFSET_X}
            y={CONTAINER_OFFSET_Y}
          />
          <Nodes
            setNodes={setNodes}
            attribute={attribute}
            margin={VIEWPORT_MARGIN}
            result={result}
            query={query}
            zoom={zoomBucket}
            selectedObject={selectedObject}
            setHoverObject={setHoverObject}
          />
          {visibleBounds && (
            <Border
              x={visibleBounds.x}
              y={visibleBounds.y}
              width={visibleBounds.width}
              height={visibleBounds.height}
              color={0x1470a4}
              lineWidth={2 / zoom}
              opacity={0.05}
            />
          )}
        </Viewport>
      </Stage>

      <XAxis
        minValue={
          zoom < 1.1 && result && result.results.length > 0
            ? getMinAttributeValue(result.results, attribute)
            : ''
        }
        maxValue={
          zoom < 1.1 && result && result.results.length > 0
            ? getMaxAttributeValue(result.results, attribute)
            : ''
        }
        attribute={attribute}
        setAttribute={setAttribute}
        attributes={result ? result.attributes : []}
      />

      <YAxis
        title="Indicator Score"
        minValue={
          zoom < 1.1 && query
            ? floatToPercentage(query.engineMinScore, 1).replace('.0', '') + '%'
            : ''
        }
        maxValue={
          zoom < 1.1 && query
            ? floatToPercentage(query.engineMaxScore, 1).replace('.0', '') + '%'
            : ''
        }
        offsetY={CONTAINER_OFFSET_Y}
      />
    </div>
  );
};

const emitMouseUpdate = (position: Point, globalPosition: Point) => {
  const event = new CustomEvent<MouseUpdateEvent>(EVENT_UPDATE_MOUSE, {
    detail: { position, globalPosition },
  });
  window.dispatchEvent(event);
};

export default ScatterPlot;
