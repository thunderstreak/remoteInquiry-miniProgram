/**
 * dom元素放大缩小、拖拽工具类
 */

class ZoomUtil {
  constructor(config) {
    const { maxSize = 3, minSize = 1 } = config || {};
    this.maxSize = maxSize;
    this.minSize = minSize;

    this.dragging = false;
    this.originScale = 1;
    this.scale = 1;
    this.dragOffset = { x: 0, y: 0 };
    this.innerDOM = null;
    this.outerDOM = null;

    this.pageX = 0;
    this.pageY = 0;
    this.pageX2 = 0;
    this.pageY2 = 0;
  }

  destroy() {
    this.dragging = false;
    this.scale = 1;
    this.originScale = 1;
    this.dragOffset = { x: 0, y: 0 };
    this.innerDOM = null;
    this.outerDOM = null;

    this.pageX = 0;
    this.pageY = 0;
    this.pageX2 = 0;
    this.pageY2 = 0;
  }

  /**
   * 处理鼠标按下事件
   *
   * @param e
   * @param innerDOM
   * @param outerDOM
   */
  handleMouseDown(e, innerDOM, outerDOM) {
    if (this.scale > 1) {
      this.dragging = true;
    }

    this.innerDOM = innerDOM;
    this.outerDOM = outerDOM;

    const { x, y } = this.dragOffset;

    this.pageX = e.clientX - x; // 图片初始位置
    this.pageY = e.clientY - y; // 图片初始位置
  }

  /**
   * 处理触摸开始事件
   *
   * @param touchEvent
   * @param innerDOM
   * @param outerDOM
   */
  handleTouchStart(touchEvent, innerDOM, outerDOM) {
    this.innerDOM = innerDOM;
    this.outerDOM = outerDOM;
    const touches = touchEvent.touches;
    const events = touches[0];
    const events2 = touches[1];

    this.dragging = true;

    if (events2) {
      this.pageX = events.pageX;
      this.pageY = events.pageY;
      this.pageX2 = events2.pageX;
      this.pageY2 = events2.pageY;
    } else {
      this.pageX = events.pageX - this.dragOffset.x;
      this.pageY = events.pageY - this.dragOffset.y;
    }

    this.originScale = this.scale;
  }

  handleTouchMove(e, innerDOM, outerDOM, onSetScale, onSetDragOffset) {
    if (!this.dragging) {
      return;
    }

    this.innerDOM = innerDOM;
    this.outerDOM = outerDOM;

    let events = e;
    const touches = e.touches || [];

    if (touches.length > 1) {
      events = touches[0];
      const events2 = touches[1];

      // 双指
      if (events2) {
        const getDistance = (start, stop) => Math.hypot(stop.x - start.x, stop.y - start.y);

        const zoom =
          getDistance(
            { x: events.pageX, y: events.pageY },
            { x: events2.pageX, y: events2.pageY }
          ) / getDistance({ x: this.pageX, y: this.pageY }, { x: this.pageX2, y: this.pageY2 });

        const scale = this.originScale * zoom;

        this.handleZoomScale(scale, onSetScale, onSetDragOffset);
      }
    } else {
      if (this.scale === 1) return;

      events = touches[0];
      // 拖拽
      let offsetX = events.pageX - this.pageX; // x向移动距离
      let offsetY = events.pageY - this.pageY; // y向移动距离

      const { transX, transY } = this.calculateDragBoundary(
        this.innerDOM,
        this.outerDOM,
        offsetX,
        offsetY
      );

      offsetX = transX ?? offsetX;
      offsetY = transY ?? offsetY;

      this.dragOffset = { x: offsetX, y: offsetY };

      onSetDragOffset && onSetDragOffset(this.dragOffset);
    }
  }

  /**
   * 处理触摸结束事件
   */
  handleTouchEnd() {
    this.dragging = false;

    this.pageX = 0;
    this.pageY = 0;
    this.pageX2 = 0;
    this.pageY2 = 0;
  }

  /**
   * 滚轮缩放
   */
  handleMouseWheel(e, onSetScale, onSetDragOffset) {
    e.preventDefault();
    const { deltaY, ctrlKey } = e;

    if (!deltaY || !ctrlKey) {
      return;
    }

    const scale = this.scale + deltaY * -0.01;

    this.handleZoomScale(scale, onSetScale, onSetDragOffset);
  }

  /**
   * 更新放大缩小倍数
   *
   */
  updateZoomScale(scale, onSetScale, onSetDragOffset) {
    if (scale !== this.scale) {
      this.scale = scale;

      this.dragOffset = {
        x: 0,
        y: 0
      };

      onSetScale && onSetScale(this.scale);
      onSetDragOffset && onSetDragOffset(this.dragOffset);
    }
  }

  /**
   * 计算拖拽的边界限制
   *
   * @private
   */
  calculateDragBoundary(innerDOM, outerDOM, offsetX, offsetY) {
    const { clientWidth: innerWidth, clientHeight: innerHeight } = innerDOM;
    const { clientWidth: outerWidth, clientHeight: outerHeight } = outerDOM;

    let transX = offsetX;
    let transY = offsetY;

    const scaledInnerWidth = innerWidth;
    const scaledInnerHeight = innerHeight;

    const maxX = (scaledInnerWidth - outerWidth) / 2;
    const minX = (outerWidth - scaledInnerWidth) / 2;

    const maxY = (scaledInnerHeight - outerHeight) / 2;
    const minY = (outerHeight - scaledInnerHeight) / 2;

    if (scaledInnerWidth > outerWidth) {
      // 如果内部元素宽度大于等于外部容器宽度，则限制横向拖拽
      transX = Math.max(Math.min(transX, maxX), minX);
    } else {
      // 如果内部元素宽度小于外部容器宽度，则居中显示
      transX = minX;
    }

    if (scaledInnerHeight > outerHeight) {
      transY = Math.max(Math.min(transY, maxY), minY);
    } else {
      transY = minY;
    }

    return { transX, transY };
  }

  /**
   * 处理放大、缩小倍数
   *
   * @private
   */
  handleZoomScale(scale, onSetScale, onSetDragOffset) {
    scale = +Math.min(Math.max(this.minSize, scale), this.maxSize).toFixed(2);

    if (scale !== this.scale) {
      this.scale = scale;

      if (this.scale === 1) {
        this.dragOffset = {
          x: 0,
          y: 0
        };
      }

      onSetScale && onSetScale(this.scale);
      onSetDragOffset && onSetDragOffset(this.dragOffset);
    }
  }
}

const zoomUtil = new ZoomUtil();

export { zoomUtil };

export default ZoomUtil;
