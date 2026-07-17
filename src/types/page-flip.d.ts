/**
 * Minimal ambient types for `page-flip` (StPageFlip), which ships JS only.
 * Covers just the surface we use in Flipbook.tsx.
 */
declare module "page-flip" {
  export interface FlipSetting {
    startPage: number;
    size: "fixed" | "stretch";
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export interface FlipEvent {
    data: number;
    object: PageFlip;
  }

  export type FlipEventName =
    | "flip"
    | "changeState"
    | "changeOrientation"
    | "init"
    | "update";

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<FlipSetting>);
    loadFromImages(images: string[]): void;
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void;
    updateFromImages(images: string[]): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    destroy(): void;
    update(): void;
    on(event: FlipEventName, callback: (e: FlipEvent) => void): void;
  }
}
