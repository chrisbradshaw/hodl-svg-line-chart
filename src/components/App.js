import React, { Component } from 'react';
import moment from 'moment';
import '../css/App.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import InfoBox from './InfoBox';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null,
      hoverLoc: null,
      activePoint: null,
    };
  }
  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint,
    });
  }
  componentDidMount() {
    const getData = () => {
      const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';

      fetch(url)
        .then(r => r.json())
        .then(bitcoinData => {
          const sortedData = [];
          let count = 0;
          for (let date in bitcoinData.bpi) {
            sortedData.push({
              d: moment(date).format('MMM DD'),
              p: bitcoinData.bpi[date].toLocaleString('us-EN', {
                style: 'currency',
                currency: 'USD',
              }),
              x: count, //previous days
              y: bitcoinData.bpi[date], //numerical price for chart
            });
            count++;
          }
          this.setState({
            data: sortedData,
            fetchingData: false,
          });
        })
        .catch(e => {
          console.log(e);
        });
    };
    getData();
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <h1>HODL Chart: BTC Price Mapped Over 30 Days</h1>
        </div>
        <div className="row">
          {!this.state.fetchingData && <InfoBox data={this.state.data} />}
        </div>
        <div className="row">
          <div className="popup">
            {this.state.hoverLoc && (
              <ToolTip
                hoverLoc={this.state.hoverLoc}
                activePoint={this.state.activePoint}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="chart">
            {!this.state.fetchingData && (
              <LineChart
                data={this.state.data}
                onChartHover={(a, b) => this.handleChartHover(a, b)}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div id="coindesk">
            Powered by{' '}
            <a href="http://www.coindesk.com">
              <img
                src="https://www.coindesk.com/wp-content/themes/coindesk2/images/header-logo-new.png"
                alt="Coindesk"
                width="100px"
              />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
