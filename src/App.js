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
    console.log("navigator", navigator);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._updateUserLocation);
    } else console.error("error");
  };

  _updateUserLocation = position => {
    console.log("position", position);
    const order = getLocationOrder(
      position.coords.latitude,
      position.coords.longitude
    );
    console.log("order", order);
    this.setState({ order });
  };

  _next = () => this.reactSwipe.next();

  _prev = () => this.reactSwipe.prev();

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
          Prev
        </button>
        <button type="button" onClick={this._next}>
          Next
        </button>
      </div>
    );
  };

  _renderWelcome = () => {
    return (
      <div className="container">
        Wir zeigen dir die Denkmäler in deiner Umgebung. Dafür brauchen deine
        genaue Position und werden dich danach fragen.<button
          onClick={this._askForLocation}
        >
          Okay, los geht's!
        </button>
      </div>
    );
  };

  render() {
    console.log("state", this.state);
    const { order } = this.state;
    return (
      <div className="App">
        <header>
          <h1>Denkmal Magdeburg</h1>
        </header>
        {order === null ? this._renderWelcome() : this._renderMonuments()}
        <footer>Code for Magdeburg – Johannes Filter</footer>
      </div>
    );
  }
}

export default App;
