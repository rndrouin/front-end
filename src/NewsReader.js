import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery, exampleData } from './data';
import { SavedQueries } from './SavedQueries';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery);
  const [data, setData] = useState(exampleData);
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);
  const urlNews = "/news";
  const urlQueries = "/queries";

  useEffect(() => {
    getNews(query);
  }, [query]);

  useEffect(() => {
    getQueryList();
  }, []);

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ");
        setSavedQueries(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("savedQueries array has been persisted:");
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  function onFormSubmit(queryObject) {
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    console.log(JSON.stringify(newSavedQueries));
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);
    setQuery(queryObject);
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  async function getNews(queryObject) {
    if (!queryObject.q) {
      setData({});
    } else {
      try {
        const response = await fetch(urlNews, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(queryObject)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Error getting news:', error);
        setData({});
      }
    }
  }

  return (
    <div>
      <div>
        <section className="parent">
          <div className="box">
            <span className='title'>Query Form</span>
            <QueryForm
              setFormObject={setQueryFormObject}
              formObject={queryFormObject}
              submitToParent={onFormSubmit}
            />
          </div>
          <div className="box">
            <span className='title'>Saved Queries</span>
            <SavedQueries
              savedQueries={savedQueries}
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
            />
          </div>
          <div className="box">
            <span className='title'>Articles List</span>
            <Articles query={query} data={data} />
          </div>
        </section>
      </div>
    </div>
  );
}