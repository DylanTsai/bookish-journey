import { CellMeasurerCache, OnScrollParams, Index, ListRowRenderer, Alignment } from "react-virtualized";
import { OverscanIndicesGetter, GridCoreProps } from "react-virtualized/dist/es/Grid";

/**
 * COPIED from [ListProps] in react-virtualized. Allows for intellisense and 
 * type checking, since the real [ListProps] is an intersection type with 
 * [GridCoreProps], which includes the parameter [key: string].
 */
export type a = GridCoreProps
export type ListPropsOmitGridCoreProps = {
  deferredMeasurementCache?: CellMeasurerCache;
  /**
   * Removes fixed height from the scrollingContainer so that the total height
   * of rows can stretch the window. Intended for use with WindowScroller
   */
  autoHeight?: boolean;
  /** Optional CSS class name */
  className?: string;
  /**
   * Used to estimate the total height of a List before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   */
  estimatedRowSize?: number;
  /** Height constraint for list (determines how many actual rows are rendered) */
  height: number;
  /** Optional renderer to be used in place of rows when rowCount is 0 */
  noRowsRenderer?: () => JSX.Element;
  /**
   * Callback invoked with information about the slice of rows that were just rendered.
   * ({ startIndex, stopIndex }): void
   */
  onRowsRendered?: (info: {
    overscanStartIndex: number;
    overscanStopIndex: number;
    startIndex: number;
    stopIndex: number;
  }) => void;
  /**
   * Number of rows to render above/below the visible bounds of the list.
   * These rows can help for smoother scrolling on touch devices.
   */
  overscanRowCount?: number;
  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   * ({ clientHeight, scrollHeight, scrollTop }): void
   */
  onScroll?: (params: OnScrollParams) => void;
  /** See Grid#overscanIndicesGetter */
  overscanIndicesGetter?: OverscanIndicesGetter;
  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index.
   * ({ index: number }): number
   */
  rowHeight: number | ((info: Index) => number);
  /** Responsible for rendering a row given an index; ({ index: number }): node */
  rowRenderer: ListRowRenderer;
  /** Number of rows in list. */
  rowCount: number;
  /** See Grid#scrollToAlignment */
  scrollToAlignment?: Alignment;
  /** Row index to ensure visible (by forcefully scrolling if necessary) */
  scrollToIndex?: number;
  /** Vertical offset. */
  scrollTop?: number;
  /** Optional inline style */
  style?: React.CSSProperties;
  /** Tab index for focus */
  tabIndex?: number | null;
  /** Width of list */
  width: number;
};