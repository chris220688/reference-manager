import React, { Component } from 'react';
import { ReactiveBase, ReactiveList, DataSearch, ResultList } from '@appbaseio/reactivesearch';

const { ResultListWrapper } = ReactiveList;

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
            fuzziness="AUTO"
            showFilter={true}
          />
          <ReactiveList
              react={{
                  "and": ["mainSearch"]
              }}
              componentId="SearchResult"
          >
              {({ data, error, loading }) => (
                  <ResultListWrapper>
                      {
                          data.map(item => (
                              <ResultList key={item._id}>
                                  <ResultList.Content>
                                      <ResultList.Title>
                                      {item.title}
                                      </ResultList.Title>
                                      <ResultList.Description>
                                          <div>
                                              <div>{item.description}</div>
                                              <div>
                                                  ({item.rating})
                                              </div>
                                          </div>
                                      </ResultList.Description>
                                  </ResultList.Content>
                              </ResultList>
                          ))
                      }
                  </ResultListWrapper>
              )}
          </ReactiveList>
        </ReactiveBase>
    );
  }
}

export default App;