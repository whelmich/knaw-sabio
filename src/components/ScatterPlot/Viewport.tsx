import React, { forwardRef } from 'react';

import { PixiComponent, useApp } from '@inlet/react-pixi';

import * as PixiViewport from 'pixi-viewport';

import { Application, DisplayObject } from 'pixi.js';

interface PixiComponentProps {
  app: Application;
}

interface PixiComponentChildrenProps {
  children: React.ReactNode;
}

export const PixiViewportComponent = PixiComponent('Viewport', {
  create(
    props: PixiComponentProps &
      PixiComponentChildrenProps &
      PixiViewport.IViewportOptions
  ) {
    const { app, ...viewportProps } = props;

    const viewport = new PixiViewport.Viewport({
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction,
      ...viewportProps,
    });

    viewport.drag();
    viewport.wheel();
    viewport.pinch();
    viewport.decelerate();

    viewport.clampZoom({ minScale: 1, maxScale: 12 });
    viewport.setZoom(1);
    viewport.bounce();

    return viewport;
  },
  applyProps(viewport, _oldProps, _newProps) {
    const { children: newChildren, ...newProps } = _newProps;

    Object.assign(viewport, newProps);

    (viewport as PixiViewport.Viewport).clamp({
      direction: 'all',
    });
  },
});

// create a component that can be consumed
// that automatically passes down the app
const Viewport = (
  props: PixiComponentChildrenProps & PixiViewport.IViewportOptions,
  ref: React.ForwardedRef<DisplayObject>
) => {
  const app = useApp();

  return (
    <PixiViewportComponent
      ref={ref}
      app={app}
      interaction={app.renderer.plugins.interaction}
      {...props}
    />
  );
};

export default forwardRef(Viewport);
