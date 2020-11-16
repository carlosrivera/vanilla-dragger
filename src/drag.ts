export {};

declare global {
  interface HTMLElement {
    sdrag(
      onDrag: (
        e: HTMLElement | SVGElement,
        pageX: number,
        startX: number,
        pageY: number,
        startY: number
      ) => void,
      onStop: (
        e: HTMLElement | SVGElement,
        pageX: number,
        startX: number,
        pageY: number,
        startY: number
      ) => void,
      direction?: string | undefined,
      skipX?: boolean | undefined,
      skipY?: boolean | undefined
    ): void;
  }
}

HTMLElement.prototype.sdrag = function sdrag(
  onDrag: (
    e: HTMLElement | SVGElement,
    pageX: number,
    startX: number,
    pageY: number,
    startY: number
  ) => void,
  onStop: (
    e: HTMLElement | SVGElement,
    pageX: number,
    startX: number,
    pageY: number,
    startY: number
  ) => void,
  direction?: string | undefined,
  skipX?: boolean | undefined,
  skipY?: boolean | undefined
): void {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const that = this;
  let startX = 0;
  let startY = 0;
  let dragging = false;

  function move(e: MouseEvent): void {
    onDrag && onDrag(that, e.pageX, startX, e.pageY, startY);

    if ("vertical" !== direction) {
      if (false === skipX) {
        that.style.left = e.pageX - startX + "px";
      }
    }
    if ("horizontal" !== direction) {
      if (false === skipY) {
        that.style.top = e.pageY - startY + "px";
      }
    }
  }

  function startDragging(e: MouseEvent): void {
    if (
      e.currentTarget instanceof HTMLElement ||
      e.currentTarget instanceof SVGElement
    ) {
      dragging = true;
      const left = that.style.left ? parseInt(that.style.left) : 0;
      const top = that.style.top ? parseInt(that.style.top) : 0;
      startX = e.pageX - left;
      startY = e.pageY - top;
      window.addEventListener("mousemove", move);
    } else {
      throw new Error("Your target must be an html element");
    }
  }

  that.addEventListener("mousedown", startDragging);
  window.addEventListener("mouseup", (e) => {
    if (true === dragging) {
      dragging = false;
      window.removeEventListener("mousemove", move);
      onStop && onStop(that, e.pageX, startX, e.pageY, startY);
    }
  });
};
