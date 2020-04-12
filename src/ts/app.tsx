import React from "react";
import ReactDOM from 'react-dom';
import Markdown from './markdown';
import webconfig from './constants/webconfig';

ReactDOM.render(<div>
  <h3>Below is some markdown rendered by React!</h3>
  <Markdown src_fpath={webconfig.make_template_path("test.md")} />
</div>, document.getElementById("main-container"));



