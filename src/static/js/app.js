// For dashboard logic and setting up non-react functions.
// This is not yet linked to index.html.
import React from "react";
import { FetchTester, LikeButton } from './index.jsx'
import { SkillSearchBox } from './optionSearchBox.jsx'
import ReactDOM from 'react-dom'
import regeneratorRuntime from "regenerator-runtime";

function buttontest(el) {
  console.log("rawr");
}

ReactDOM.render(<FetchTester />, document.getElementById("fetch-tester"));
ReactDOM.render(<LikeButton />, document.getElementById("simple-react-test"));
ReactDOM.render(<SkillSearchBox />, document.getElementById("skill-search-box"));

