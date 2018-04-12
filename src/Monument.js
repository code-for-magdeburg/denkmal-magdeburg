import React, { Component } from "react";

class Monument extends Component {
  state = {
    loading: false,
    id: null,
    denkmalbereich: null,
    objektart: null,
    denkmalverzeichnisId: null,
    image: null,
    anschrift: null,
    objektbezeichnung: null,
    description: null,
    stadteil: null
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const response = await fetch("data/location/" + this.props.id);
    const jsonResponse = await response.json();
    this.setState({ loading: false, ...jsonResponse });
  }

  render() {
    const {
      loading,
      id,
      denkmalbereich,
      objektart,
      denkmalverzeichnisId,
      image,
      anschrift,
      objektbezeichnung,
      description,
      stadteil
    } = this.state;
    return (
      <div className="monument">
        {loading === false && (
          <div>
            <img src={image} />
            <div>{objektbezeichnung}</div>
            <div>{description}</div>
            <div>{stadteil}</div>
            <div>{objektart}</div>
            <div>{denkmalbereich}</div>
            <div>{anschrift}</div>
          </div>
        )}
      </div>
    );
  }
}

export default Monument;
