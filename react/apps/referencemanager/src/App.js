import React, { Component } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';

class App extends Component {
  render() {
    return (
        <ReactiveBase
          app="referencemanager"
          url="http://localhost:80/api/consumer/search/"
        >
          <DataSearch
            componentId="mainSearch"
            dataField={["title", "description"]}
            queryFormat="or"
            placeholder="Search"
            debounce={100}
            highlight={true}
            fuzziness="AUTO"
            showFilter={true}
          />
        </ReactiveBase>
    );
  }
}

export default App;