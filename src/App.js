import React, { Component } from "react";
import ReactSwipe from "react-swipe";

import "./App.css";
import Monument from "./Monument";
import { getLocationOrder } from "./geolocation";

const PAGE_SIZE = 5;

class App extends Component {
  state = {
    currentLocation: null,
    order: null,
    numMomumentToShow: PAGE_SIZE,
    startSlide: 0
  };

  componentDidMount() {}

  _askForLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._updateUserLocation);
    } else console.error("error");
  };

  _updateUserLocation = position => {
    const order = getLocationOrder(
      position.coords.latitude,
      position.coords.longitude
    );
    this.setState({ order });
  };

  _next = () => this.reactSwipe.next();

  _prev = () => this.reactSwipe.prev();

  // get new bunch of momuments
  _nextPage = () => {
    const { numMomumentToShow, startSlide } = this.state;
    if (this.reactSwipe.getPos() + 1 !== numMomumentToShow) return;
    this.setState({
      numMomumentToShow: numMomumentToShow + PAGE_SIZE,
      startSlide: numMomumentToShow - 2
    });
  };

  _renderMonuments = () => {
    const { order, numMomumentToShow, startSlide } = this.state;

    return (
      <div>
        <ReactSwipe
          ref={reactSwipe => (this.reactSwipe = reactSwipe)}
          className="container"
          swipeOptions={{
            continuous: false,
            callback: this._nextPage,
            startSlide
          }}
          key={numMomumentToShow}
        >
          {order.slice(0, numMomumentToShow).map(x => (
            <div key={x[0]}>
              <Monument id={x[0]} />
            </div>
          ))}
        </ReactSwipe>
        <button type="button" onClick={this._prev}>
          zurück
        </button>
        <button type="button" onClick={this._next}>
          nächste
        </button>
      </div>
    );
  };

  _renderWelcome = () => {
    return (
      <div className="container welcome">
        Wir zeigen dir Informationen zu Denkmälern in deiner Umgebung. Dafür
        brauchen deine genaue Position und werden dich danach fragen.
        <br />
        <br />
        <div className="cta-wrapper">
          <button className="cta" onClick={this._askForLocation}>
            Okay, los geht's!
          </button>
        </div>
        <br />
        <small>
          Diese Daten bleiben jedoch auf deinem Gerät und werden auf keinen
          Server übertragen.
        </small>
        <br />
        <br />
        <small>
          Es wird dir immer ein Denkmal angezeigt, du kannst aber nach rechts
          swipen um das Nächste anzusehen. Oder auf dem Desktop-PC die Pfeile
          benutzen.
        </small>
      </div>
    );
  };

  render() {
    const { order } = this.state;
    return (
      <div className="App">
        <header>
          <h1>Denkmal Magdeburg</h1>
        </header>
        {order === null ? this._renderWelcome() : this._renderMonuments()}
        <footer>
          <a href="https://codefor.de/magdeburg/">Code for Magdeburg</a>
          {" – "}
          <a href="https://johannesfilter.com/">Johannes Filter</a>
          <br />
          <br />
          Daten:{" "}
          <a href="http://denkmalverzeichnis.magdeburg.de/">
            Denkmalverzeichnis Magdeburg
          </a>
          <br />
          <br />
          Code:{" "}
          <a href="https://github.com/code-for-magdeburg/denkmal-magdeburg">
            auf GitHub
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
