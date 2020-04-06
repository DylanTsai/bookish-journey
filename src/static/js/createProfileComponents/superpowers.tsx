import React from 'react';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../../styles/index.css';
import styleConsts from '../../styles/constants.css';
import { clJoin } from '../stringUtils';

export enum Superpower {
  Engineering = "Engineering",
  Marketing = "Marketing",
  Business = "Business",
}

type catData = {
  name: Superpower,
  imgUrl: string,
  isSelected: boolean
}

const initCategories: catData[] = [
  {
    name: Superpower.Engineering,
    imgUrl: "https://via.placeholder.com/100",
    isSelected: false
  },
  {
    name: Superpower.Marketing,
    imgUrl: "https://via.placeholder.com/100",
    isSelected: false
  },
  {
    name: Superpower.Business,
    imgUrl: "https://via.placeholder.com/100",
    isSelected: false
  }
];

export type SuperpowersProps = {
  updateInfo: (selectedCats: string[]) => void,
  renderNextBut
}

export type SuperpowersState = {
  catsByRow: catData[][]
}

export class Superpowers extends React.Component<SuperpowersProps, SuperpowersState> {
  constructor(props) {
    super(props);

    let catsByRow: catData[][] = [];
    initCategories.forEach((el, idx) => {
      if (idx % 3 == 0) {
        catsByRow.push([el]);
      } else {
        catsByRow[catsByRow.length - 1].push(el);
      }
    });

    this.state = { catsByRow };
  }

  private toggleSelection(row: number, col: number) {
    let copy = [...this.state.catsByRow];
    copy[row][col].isSelected = !copy[row][col].isSelected;
    this.setState({ catsByRow: copy });
  }

  render() {
    let teardown = () => {
      let selectedCatNames = this.state.catsByRow.flat().filter(cat => cat.isSelected).map(c => c.name);
      this.props.updateInfo(selectedCatNames);
    };
    let nextBtn = this.props.renderNextBut(teardown, "Next", false);

    return <>
      <div className={clJoin({ 'bs': ['col-lg-12', 'col-md-12', 'text-center'] })}>
        <div className={bs.row}>
          <div id="top-icon" className={clJoin({ 'bs': ['col-lg-12', 'col-md-12'] })}>
            <img src="https://via.placeholder.com/100" />
          </div>
        </div>
        <div className={clJoin({ 'bs': ['row'], 'index': ['superpowers-row'] })}>
          <div className={clJoin({ 'bs': ['col-lg-12', 'col-md-12'] })}>
            <h3>Tell us about your superpowers and<br /> positions of interest</h3>
          </div>
        </div>
        {
          this.state.catsByRow.map((row, rowIdx) =>
            <div className={clJoin({ 'bs': ['row'], 'index': ['superpowers-row'] })}>
              {
                row.map((category, colIdx) => {
                  let selectedClass = category.isSelected ? index['power-card-selected'] : index['power-card'];
                  let toggleSelect = () => this.toggleSelection(rowIdx, colIdx);

                  return <div className={clJoin({ 'bs': ['col-lg-4', 'col-md-4'] })}>
                    <div className={clJoin({ 'bs': ['card', 'shadow'] }) + ' ' + selectedClass} onClick={toggleSelect}>
                      <div className={clJoin({ 'bs': ['card-body', 'text-center', 'd-flex', 'flex-column', 'justify-content-between'] })}>
                        <div style={{ height: "100px" }}>
                          {
                            category.isSelected
                              ? <CheckCircleOutlineIcon style={{ color: "#17b298", fontSize: 90 }} />
                              : <img src={category.imgUrl} />
                          }
                        </div>
                        <h6>{category.name}</h6>
                      </div>
                    </div>
                  </div>;
                })
              }
            </div>
          )
        }
        <div className={bs.row}>
          <div className={index.spacer}></div>
        </div>
        <div className={bs.row}>
          <div className={clJoin({ 'bs': ['col-lg-12', 'col-md-12'], 'index': ['superpowers-row'] })}>
            <button className={clJoin({ 'bs': ['btn', 'btn-link'] })}>
              <KeyboardArrowLeftOutlinedIcon />
              Back
            </button>
            {nextBtn}
          </div>
        </div>
      </div>
    </>;
  }
}