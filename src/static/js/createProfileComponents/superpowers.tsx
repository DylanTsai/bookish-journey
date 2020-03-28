import * as React from 'react';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';

import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../../styles/index.css';
import styleConsts from '../../styles/constants.css';

let categories = ["Engineering", "Marketing", "Business"];

let catsByRow: [[string]] = [];
categories.forEach((el, idx) => {
  if (idx % 3 == 0) {
    catsByRow.push([el]);
  } else {
    catsByRow[catsByRow.length - 1].push(el);
  }
});

export class Superpowers extends React.Component {
  render() {
    return <>
      <div className={`${bs['col-lg-12']} ${bs['col-md-12']} ${bs['text-center']}`}>
        <div className={bs.row}>
          <div id="top-icon" className={`${bs['col-lg-12']} ${bs['col-md-12']}`}>
            <img src="https://via.placeholder.com/100"/>
          </div>
        </div>
        <div className={`${bs.row} ${index['superpowers-row']}`}>
          <div className={`${bs['col-lg-12']} ${bs['col-md-12']}`}>
            <h3>Tell us about your superpowers and<br /> positions of interest</h3>
          </div>
        </div>
        {
          catsByRow.map(row =>
            <div className={`${bs.row} ${index['superpowers-row']}`}>
              {
                row.map(title => 
                  <div className={`${bs['col-lg-4']} ${bs['col-md-4']}`}>
                    <div className={`${bs.card} ${bs.shadow} ${index['power-card']}`}>
                      <div className={`${bs['card-body']} ${bs['text-center']}`}>
                        <img src="https://via.placeholder.com/100"/>
                        <h5>{title}</h5>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          )
        }
        <div className={bs.row}>
          <div className={index.spacer}></div>
        </div>
        <div className={bs.row}>
          <div className={`${bs['col-lg-12']} ${bs['col-md-12']} ${index['superpowers-row']}`}>
            <button className={`${bs.btn} ${bs['btn-link']}`}>
              <KeyboardArrowLeftOutlinedIcon />
              Back
            </button>
            <button className={`${bs.btn} ${bs['btn-primary']}`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>;
  }
}