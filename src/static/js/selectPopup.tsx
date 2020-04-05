import React from 'react';
import { Key } from 'ts-keycode-enum';
import { List } from 'react-virtualized';
import { ListPropsOmitGridCoreProps } from './virtualization'
import { StrictOmit } from './typeUtils'

// @ts-ignore
import TempLoadingSpinner from '../assets/symba-full-name.png';

export type SelectPopupProps<optionT, T extends Element> = {
  /**
   * The popup's anchor. The popup will be rendered directly beneath the anchor.
   * @param setVisibility - [setVisibility(true)] displays the popup, 
   * [setVisibility(false)] hides it.
   * @param handleKeyDown - returns true iff key was handled. If more 
   * details are needed, see [SelectPopup.handleKeyDown].
   */
  renderAnchor: (forwardRef: React.RefObject<T>, setVisibility: (b: boolean) => void) => T;

  /**
   * Renderer for an option
   */
  renderOption: (opt: optionT, isSelected: boolean) => JSX.Element;

  /**
   * Callback for selecting an option
   */
  select: (opt: optionT) => void;

  /**
   * The list of options. Defaults to [].
   */
  options: optionT[];

  /**
   * Called whenever user selects an option by pressing ENTER.
   */
  onEnterSelect?: () => void;

  /**
   * When true, renders a loading icon on the popup instead of options.
   */
  isLoading?: () => boolean;

  /**
   * When [true], the popup is hidden.
   * When [false], behavior follows the documentation for [SelectPopup].
   */
  shouldHidePopup: () => boolean;

  /**
   * Props for the react-virtualization list that contains the options.
   */
  virtualizedListProps: StrictOmit<ListPropsOmitGridCoreProps, "rowCount"
    | "rowRenderer"
    | "width"
    | "scrollToIndex">;
}

type SelectPopupState = {
  focusedIdx: number,
  visible: boolean
}

/**
 * Renders a popup to display options, similar to a SELECT html element,
 * directly below an "anchor" element.
 *
 * Options can be "focused" by mouse hover or up and down arrow keys.
 * 
 * Options are "selected" when they are clicked or the user pres
 * 
 * Becomes visible when focus is given to the popup or the anchor, becomes invisible
 * when focus is lost.
 * 
 */
export class SelectPopup<optionT, anchorT extends Element>
  extends React.Component<SelectPopupProps<optionT, anchorT>, SelectPopupState> {

  private thisContainerRef: React.RefObject<HTMLDivElement>;
  private anchorRef: React.RefObject<anchorT>;

  constructor(props: SelectPopupProps<optionT, anchorT>) {
    super(props);
    this.state = {
      focusedIdx: 0,
      visible: false
    };
    this.thisContainerRef = React.createRef();
    this.anchorRef = React.createRef();
    this.setVisibility = this.setVisibility.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.renderOptionContainer = this.renderOptionContainer.bind(this);
    this.changeVisibilityBasedOnClick = this.changeVisibilityBasedOnClick.bind(this);
  }

  componentDidMount() {
    // Setup for displaying/hiding on clicks in/out of the popup.
    document.addEventListener('mousedown', this.changeVisibilityBasedOnClick);
  }

  componentWillUnmount() {
    // Teardown for displaying/hiding on clicks in/out of the popup.
    document.removeEventListener('mousedown', this.changeVisibilityBasedOnClick);
  }

  /**
   * Event listener to display the popup on clicks inside the component and 
   * hide the popup on clicks outside the component. Only to be used in
   * [document.addEventListener] and [document.removeEventListener].
   */
  private changeVisibilityBasedOnClick(event): void {
    if (this.thisContainerRef.current) {
      let clickIsInsideMe = this.thisContainerRef.current.contains(event.target);
      if (this.state.visible != clickIsInsideMe) {
        this.setVisibility(clickIsInsideMe);
      }
    }
  }

  /**
   * If [shouldBeVisible], displays popup; else, hides popup.
   * Also resets [state.selectedIndex] to 0.
   * @param shouldBeVisible
   */
  private setVisibilityAndResetIndex(shouldBeVisible: boolean) {
    this.setVisibility(shouldBeVisible);
    this.setState({ focusedIdx: 0 });
  }

  /**
   * If [shouldBeVisible], displays popup; else, hides popup.
   */
  setVisibility(shouldBeVisible: boolean): void {
    this.setState({ visible: shouldBeVisible });
  }

  /**
   * Returns true iff keydown was handled.
   * Moves focus on up/down arrows.
   * Selects focused option on enter.
   * Makes popup disappear on esc.
   */
  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): boolean {
    console.log("onKeyDown");
    if (event.keyCode == Key.DownArrow) {
      event.preventDefault();
      this.setState(state => {
        if (state.focusedIdx + 1 < this.props.options.length) {
          return { focusedIdx: state.focusedIdx + 1 }
        }
        return { focusedIdx: state.focusedIdx }
      });
      return true;
    }
    if (event.keyCode == Key.UpArrow) {
      event.preventDefault();
      this.setState(state => {
        if (state.focusedIdx > 0) {
          return { focusedIdx: state.focusedIdx - 1 }
        }
        return { focusedIdx: state.focusedIdx }
      });
      return true;
    }
    if (event.keyCode == Key.Enter) {
      if (this.state.focusedIdx < this.props.options.length) {
        event.preventDefault();
        this.props.select(this.props.options[this.state.focusedIdx]);
        if (this.props.onEnterSelect) {
          this.props.onEnterSelect();
        }
        return true;
      }
    }
    if (event.keyCode == Key.Escape) {
      event.preventDefault();
      this.setVisibilityAndResetIndex(false);
      return true;
    } else if (String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) {
      // guard is taken from https://stackoverflow.com/questions/4179708/how-to-detect-if-the-pressed-key-will-produce-a-character-inside-an-input-text
      this.setVisibilityAndResetIndex(true);
    }
    return false;
  }

  /**
   * Renders a single option, which is a row in the popup.
   * @param params - as in react-virtualization/List
   */
  private renderOptionContainer(params: {
    key, // Unique key within array of rows
    index: number, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }): JSX.Element {
    let optionIdx = params.index;
    let option = this.props.options[optionIdx];
    let isFocused = this.state.focusedIdx == optionIdx
    return <div key={params.key} onClick={() => this.props.select(option)}
      onMouseOver={() => this.setState({ focusedIdx: optionIdx })}
      style={params.style}>
      {this.props.renderOption(option, isFocused)}
    </div>;
  }

  /**
   * Renders a single inactive row to indicate the list is empty.
   */
  private renderEmptyContainer(): JSX.Element {
    return <div style={{ textAlign: 'center', color: '#979797', height: '100%', display: 'flex' }}>
      <span style={{ margin: 'auto auto' }}>No results...</span>
    </div>
  }


  /**
   * Renders a wrapper around [inner] that provides styling and key event handling.
   */
  private renderPopupWrapper(inner: JSX.Element): JSX.Element {
    let width = 0;
    if (this.anchorRef.current !== null) {
      width = this.anchorRef.current.clientWidth;
    }
    return <div onKeyDown={this.handleKeyDown} style={{ width: width }}>
      {inner}
    </div>;
  }

  /**
   * Renders anchor and popup.
   */
  renderInner(): JSX.Element {
    let anchor = <div>
      {this.props.renderAnchor(this.anchorRef, this.setVisibility)}
    </div>;
    if (!this.state.visible) {
      return anchor;
    }

    let width = this.anchorRef.current ? this.anchorRef.current.clientWidth : 0;

    let popup;
    if (this.props.shouldHidePopup()) {
      popup = <></>
    } else if (this.props.isLoading && this.props.isLoading()) {
      popup = <TempLoadingSpinner /> // TODO this (temporary) loading spinner doesn't work
    } else {
      popup = <List
        {...this.props.virtualizedListProps}
        rowRenderer={this.renderOptionContainer}
        rowCount={this.props.options.length}
        scrollToIndex={this.state.focusedIdx}
        width={width}
        noRowsRenderer={this.renderEmptyContainer}
      />;
    }
    return <>
      {anchor}
      {popup}
    </>
  }

  render() {
    let inner = this.renderInner();
    return <div ref={this.thisContainerRef}>
      {this.renderPopupWrapper(inner)}
    </div >;
  }
}