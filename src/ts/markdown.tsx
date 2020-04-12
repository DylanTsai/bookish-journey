import React from "react";
import ReactMarkdown from 'react-markdown';

export default class Markdown extends React.Component<{ src_fpath: string }, { md_text: string | null }> {

  constructor(props) {
    super(props)
    this.state = {
      md_text: null
    }
  }

  componentDidMount() {
    let fpath = this.props.src_fpath;
    fetch(fpath)
      .then(resp => {
        return resp.body!.getReader().read();
      })
      .then((result) => {
        let decoder = new TextDecoder("utf-8");
        this.setState({ md_text: decoder.decode(result.value) });
      });
  }

  render() {
    if (this.state.md_text === null) {
      return <></>;
    }
    return <ReactMarkdown source={this.state.md_text!} />
  }
}