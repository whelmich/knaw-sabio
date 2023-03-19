import { Sprite, Container } from 'pixi.js';
import { ResultObject } from '../../interfaces/Result';

class ObjectSprite {
  public sprite: Sprite;
  public object: ResultObject;

  public lastScale: number;
  public lastAlpha: number;
  public _x: number;
  public _y: number;
  public _scale: number;
  public active: boolean;
  public animate: boolean;
  public hover: boolean;
  public dirtyPosition: boolean;
  public dirtyScale: boolean;
  public onSelect: ((object: ResultObject) => void) | undefined = undefined;
  public onHover: ((object: ResultObject | null) => void) | undefined =
    undefined;

  constructor(sprite: Sprite, object: ResultObject) {
    this.sprite = sprite;
    this.object = object;
    this.lastScale = 1;
    this.lastAlpha = 0;
    this.hover = false;

    this._x = 0;
    this._y = 0;
    this.dirtyPosition = false;

    this._scale = 0;
    this.dirtyScale = false;
    this.animate = false;
    this.active = false;

    this.sprite.x = Math.random() * window.innerWidth - 300;
    this.sprite.y =
      window.innerHeight + Math.random() * 0.5 * window.innerHeight;

    this.sprite.alpha = 0;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0);

    this.sprite.on('pointerover', this.pointerover);
    this.sprite.on('pointerout', this.pointerout);

    this.sprite.on('click', this.onClick);
    this.sprite.on('touchstart', this.onClick);
  }

  onClick = () => {
    this.onSelect && this.onSelect(this.object);
    this.active ? this.sendToBack() : this.toTop();
  };

  updatePosition(delta: number) {
    this.sprite.x = this.sprite.x + delta * (this._x - this.sprite.x);
    this.sprite.y = this.sprite.y + delta * (this._y - this.sprite.y);
    this.dirtyPosition = !(
      Math.abs(this.sprite.x - this._x) < 0.1 &&
      Math.abs(this.sprite.y - this._y) < 0.1
    );
  }

  updateScale(delta: number) {
    this.sprite.scale.set(
      this.sprite.scale.x + delta * (this._scale - this.sprite.scale.x)
    );
    this.dirtyScale = Math.abs(this.sprite.scale.x - this._scale) > 0.0001;
  }

  pointerover = () => {
    if (this.hover) {
      return;
    }
    this.onHover && this.onHover(this.object);
    this.hover = true;
    this.lastScale = this._scale;
    this.lastAlpha = this.sprite.alpha;
    this.setScale(this.lastScale * 1.5);
    this.sprite.alpha = 1;
  };

  pointerout = () => {
    if (!this.hover) {
      return;
    }
    this.hover = false;
    this.setScale(this.lastScale);
    this.sprite.alpha = this.lastAlpha;
    this.onHover && this.onHover(null);
  };

  setPosition(x: number, y: number, force: boolean = false) {
    force = this.animate === false || force;
    this._x = x;
    this._y = y;
    this.dirtyPosition = !force;
    if (force) {
      this.sprite.x = this._x;
      this.sprite.y = this._y;
    }
  }

  setScale(scale: number, force = false) {
    force = this.animate === false || force;
    this._scale = scale;
    this.dirtyScale = !force;
    if (force) {
      this.sprite.scale.set(scale);
    }
  }

  sendToBack() {
    const parent = this.sprite.parent as Container;
    if (parent.children) {
      for (
        let keyIndex = 0, len = parent.children.length;
        keyIndex < len;
        keyIndex++
      ) {
        if (parent.children[keyIndex] === this.sprite) {
          parent.children.splice(keyIndex, 1);
          break;
        }
      }
      parent.children.splice(0, 0, this.sprite);
    }
  }

  toTop() {
    const parent = this.sprite.parent as Container;
    parent.removeChild(this.sprite);
    parent.addChild(this.sprite);
  }
}

export default ObjectSprite;
