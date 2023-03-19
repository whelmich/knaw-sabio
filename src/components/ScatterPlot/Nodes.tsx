import { FunctionComponent, useEffect, useRef, useState } from 'react';
import debounce from 'debounce';
import { Container, useApp, useTick } from '@inlet/react-pixi';

import {
  LoaderResource,
  Container as PIXIContainer,
  MIPMAP_MODES,
  Texture,
  Resource,
  Sprite,
  Loader,
} from 'pixi.js';
import { Result, ResultObject } from '../../interfaces/Result';
import { Query } from '../../interfaces/Query';
import {
  CONTAINER_OFFSET_X,
  CONTAINER_OFFSET_Y,
  EVENT_HIGHLIGHT_WORD,
  EVENT_RENDERING,
  MANY_NODES_NO_ANIMATION,
} from '../../config/constants';

import { setSelectedObject } from '../../util/events';

import ObjectSprite from './ObjectSprite';
import { EventRendering } from '../../interfaces/Events';

interface Props {
  result: Result | null;
  query: Query | null;
  attribute: number;
  margin: number;
  zoom: number;
  selectedObject: ResultObject | null;
  setNodes: (nodes: ObjectSprite[]) => void;
  setHoverObject: (object: ResultObject | null) => void;
}

const nodeTextureUrl = '/images/textures/node-256.png';
const nodeSelectedTextureUrl = '/images/textures/node-selected-256.png';

interface ResourceMap {
  [key: string]: LoaderResource;
}

const Nodes: FunctionComponent<Props> = ({
  result,
  query,
  attribute,
  selectedObject,
  margin,
  zoom,
  setNodes,
  setHoverObject,
}) => {
  const lastZoom = useRef(0);
  const lastDimensions = useRef('');
  const lastNodes = useRef<{ [key: string]: ObjectSprite } | null>(null);
  const [localNodes, setLocalNodes] = useState<ObjectSprite[]>([]);
  const [nodeTexture, setNodeTexture] = useState<
    Texture<Resource> | undefined
  >();
  const [nodeSelectedTexture, setNodeSelectedTexture] = useState<
    Texture<Resource> | undefined
  >();

  const [highlightWord, setHighlightWord] = useState<string>('');
  const app = useApp();

  // Start rendering event
  useEffect(() => {
    const event = new CustomEvent<EventRendering>(EVENT_RENDERING, {
      detail: {
        rendering: true,
      },
    });
    window.dispatchEvent(event);
  }, [result]);

  // Stop rendering event
  useEffect(() => {
    const event = new CustomEvent<EventRendering>(EVENT_RENDERING, {
      detail: {
        rendering: false,
      },
    });
    window.dispatchEvent(event);
  }, [localNodes]);

  // Highlight word listener
  useEffect(() => {
    const highlightWordListener = debounce((e: CustomEvent) => {
      setHighlightWord(e.detail.highlightWord as string);
    }, 50) as unknown as EventListener & { clear(): void };

    window.addEventListener(EVENT_HIGHLIGHT_WORD, highlightWordListener);
    return () => {
      highlightWordListener.clear();
      window.removeEventListener(EVENT_HIGHLIGHT_WORD, highlightWordListener);
    };
  }, []);

  // Load node texture
  useEffect(() => {
    // add textures
    if (!Loader.shared.resources[nodeTextureUrl]) {
      Loader.shared.add(nodeTextureUrl);
    }
    if (!Loader.shared.resources[nodeSelectedTextureUrl]) {
      Loader.shared.add(nodeSelectedTextureUrl);
    }
    // Load files, set node textures
    Loader.shared.load((_, resources: ResourceMap) => {
      const texture = resources[nodeTextureUrl].texture;
      if (texture) {
        texture.baseTexture.mipmap = MIPMAP_MODES.POW2;
        setNodeTexture(texture);
      }

      const selectedTexture = resources[nodeSelectedTextureUrl].texture;
      if (selectedTexture) {
        selectedTexture.baseTexture.mipmap = MIPMAP_MODES.POW2;
        setNodeSelectedTexture(selectedTexture);
      }
    });
  }, []);

  // Update node positions
  useTick((delta) => {
    if (delta === undefined) {
      return;
    }
    const deltaS = Math.min(2, delta) / 5;

    localNodes.forEach((node) => {
      node.dirtyPosition && node.updatePosition(deltaS);
      node.dirtyScale && node.updateScale(deltaS);
    });
  }, localNodes.length < MANY_NODES_NO_ANIMATION);

  // Update node properties
  useEffect(() => {
    // store zoom
    lastZoom.current = zoom;

    // require textures and a query
    if (
      nodeTexture &&
      nodeSelectedTexture &&
      query?.engineMaxScore !== undefined
    ) {
      const width = app.screen.width - margin * 2;
      const height = app.screen.height - margin * 2;

      const manyNodes = localNodes.length > MANY_NODES_NO_ANIMATION;

      lastDimensions.current = width + '_' + height;
      const baseScale = getBaseScale(localNodes.length, zoom);

      localNodes.forEach((node) => {
        const active =
          selectedObject !== null && selectedObject === node.object;
        const highlighted =
          highlightWord &&
          Object.keys(node.object.score_details).includes(highlightWord);
        node.sprite.texture = active ? nodeSelectedTexture : nodeTexture;
        node.setPosition(
          CONTAINER_OFFSET_X + margin + node.object.x[attribute] * width,
          CONTAINER_OFFSET_Y +
            margin +
            height -
            (height * (node.object.score - query.engineMinScore)) /
              (query.engineMaxScore - query.engineMinScore)
        );
        // node.scale.set(active ? baseScale * 1.5 : baseScale * 1.25);
        node.setScale(active ? baseScale * 1.5 : baseScale * 1.25, manyNodes);
        node.sprite.alpha =
          node._y > app.screen.height - margin
            ? 0
            : active || highlighted
            ? 1
            : highlightWord && !highlighted
            ? 0.2
            : 0.8;
        node.sprite.tint = active || highlighted ? 0xffce06 : 0x1470a4;
        node.lastScale = node._scale;
        node.lastAlpha = node.sprite.alpha;
        node.active = active;
      });
    }
    setNodes([...localNodes]);
  }, [
    setNodes,
    nodeTexture,
    nodeSelectedTexture,
    query?.engineMinScore,
    query?.engineMaxScore,
    app.screen.width,
    app.screen.height,
    attribute,
    margin,
    selectedObject,
    highlightWord,
    zoom,
    localNodes,
  ]);

  const container = useRef<PIXIContainer>(null);

  // Update sprites in container
  useEffect(() => {
    if (!container.current || !result || !nodeTexture) {
      return;
    }
    // clear
    container.current.removeChildren();

    // rebuild
    const nodeIndex: { [key: string]: ObjectSprite } = {};
    const existingNodes: { [key: string]: ObjectSprite } = lastNodes.current
      ? lastNodes.current
      : {};
    const nodes: ObjectSprite[] = [];
    let node: ObjectSprite;
    for (let i = 0, len = result.results.length; i < len; i++) {
      const existingNode = existingNodes[result.results[i].id];
      if (existingNode) {
        node = existingNode;
        node.object = result.results[i];
      } else {
        const sprite = new Sprite(nodeTexture);
        node = new ObjectSprite(sprite, result.results[i]);
        node.object = result.results[i];
        node.onSelect = setSelectedObject;
        node.onHover = setHoverObject;
      }
      node.animate = result.results.length < MANY_NODES_NO_ANIMATION;

      nodes.push(node);
      nodeIndex[node.object.id] = node;
      container.current.addChild(node.sprite);
    }

    lastNodes.current = nodeIndex;

    setLocalNodes(nodes);
  }, [result, nodeTexture, setNodes, setHoverObject]);

  return <Container ref={container}></Container>;
};

const getBaseScale = (nodesCount: number, zoom: number) =>
  0.5 *
  Math.min(0.08, Math.max(0.04, 0.04 + 10 / nodesCount) / (0.9 + zoom / 20));

export default Nodes;
