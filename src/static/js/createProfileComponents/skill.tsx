import * as React from 'react';
import { TypeAheadModel, TypeAheadView, TypeAheadSelectionRenderHelpers, TextInputMonitor } from '../textUtils';

type skill = string;

export type EnterSkillsProps = {
  updateInfo: (skills: string[]) => void,
  renderSubmitBtn: (teardown: () => void, titleTxt: string, isDisabled: boolean) => JSX.Element
}

export class EnterSkills extends React.Component<EnterSkillsProps, {}> {
  private typeAheadModel: TypeAheadModel<skill>;

  constructor(props: EnterSkillsProps) {
    super(props);
    this.fetchSkills = this.fetchSkills.bind(this);
    this.typeAheadModel = new TypeAheadModel(this.fetchSkills, (s1, s2) => s1 == s2, false, false);
    this.renderInputBox = this.renderInputBox.bind(this);
    this.renderSelectedSkill = this.renderSelectedSkill.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  componentDidMount() {
    this.typeAheadModel.addViewCallBack(() => this.forceUpdate());
  }

  /**
   * Returns the skills matching [input].
   * TODO get from database.
   */
  private fetchSkills(input: string) {
    input = input.toLowerCase();
    return Promise.resolve(
      ["python", "typescript", "javascript",
        "python1", "typescript1", "javascript1",
        "python2", "typescript2", "javascript2",
        "python3", "typescript3", "javascript3",
        "python4", "typescript4", "javascript4"
      ].filter(
        (skill) => !this.typeAheadModel.selection.includes(skill) && skill.includes(input)
      )
    );
  }

  /**
   * The section above the input box.
   */
  get headRender(): JSX.Element {
    return <>TODO: the header</>;
  }

  /**
   * As in [TypeAheadViewProps.renderInputBox].
   * Renders the text box in which users will enter / search for their skills.
   * @param onInputChange - callback to call on new input whenever input changes
   * @param anchorRef - reference for the input element
   * @param setPopupVisibility - sets visibility of the options popup.
   */
  private renderInputBox(onInputChange: (input: string) => void,
    anchorRef: React.RefObject<HTMLInputElement>,
    setPopupVisibility: (b: boolean) => void): Element {
    let onChange = (ev) => {
      let val = ev.target.value;
      onInputChange(val);
      if (val == "") {
        setPopupVisibility(false);
      }
    }

    return <input
      ref={anchorRef}
      type="text" value={this.typeAheadModel.input} autoFocus={true} onChange={onChange}
      placeholder="Search for skills"
    /> as unknown as Element;
    // ^ type casting is a bandaid for a bug in @react/dom-types https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31734
  }

  /**
   * As in [TypeAheadViewProps.renderOption].
   * Renders a skill on the options popup.
   * @param skill - The skill to be rendered.
   * @param isFocused - true iff this skill is the focused skill
   */
  private renderOption(skill: skill, isFocused: boolean): JSX.Element {
    return <span style={{ color: isFocused ? "blue" : "black" }}>
      | {skill} |
     </span>
  }

  /**
   * Renders the selected skill [skill].
   * @param skill - Render helpers for the selected skill.
   * @param key - The key for the object (for React)
   */
  private renderSelectedSkill(skill: TypeAheadSelectionRenderHelpers<skill>, key: number) {
    return <div key={`enterSkill-selectedSkill-${key}`}>
      <span>
        {skill.option}
      </span>
      <span>
        <button onClick={skill.deselect}></button>
      </span>
    </div>
  }

  render() {
    return <div>
      <div>
        {this.headRender}
      </div>
      <div style={{ height: 100 }}>
        <TypeAheadView
          model={this.typeAheadModel}
          renderOption={this.renderOption}
          renderInputBox={this.renderInputBox}
        />
      </div>
      <div>
        {this.typeAheadModel.selectionRenderHelpers.map(this.renderSelectedSkill)}
      </div>
    </div>
  }
}
