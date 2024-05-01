import React, { useState, useEffect } from 'react';
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { exampleQuery, exampleData, cannedQueryList } from './data';
import { SavedQueries } from './SavedQueries';
import { LoginForm } from './LoginForm';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery);
  const [data, setData] = useState(exampleData);
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: '', password: '' });
  const urlNews = '/news';
  const urlQueries = '/queries';
  const urlUsersAuth = '/users/authenticate';
  const [showQueryDetails, setShowQueryDetails] = useState(false);

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
        console.log('savedQueries has been retrieved: ');
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
      console.log('savedQueries array has been persisted:');
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  async function login() {
    if (currentUser) {
      setCurrentUser(null);
      return;
    }

    try {
      const response = await fetch(urlUsersAuth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.status === 200) {
        setCurrentUser(credentials.user);
        setCredentials({ user: '', password: '' });
      } else {
        alert('Error during authentication. Please update credentials and try again.');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setCurrentUser(null);
    }
  }

  function currentUserMatches(user) {
    return currentUser === user;
  }

  function onFormSubmit(queryObject) {
    if (currentUser === null) {
      alert('Log in if you want to create new queries!');
      return;
    }
    if (savedQueries.length >= 3 && currentUserMatches('guest')) {
      alert(
        'Guest users cannot submit new queries once saved query count is 3 or greater!'
      );
      return;
    }

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

  function resetSavedQueries() {
    if (window.confirm('Are you sure you want to erase the list?')) {
      const exampleQuery02 = {
        queryName: "Query02",
        q: "sports",
        language: "en",
        pageSize: 10
      };
      const exampleQuery03 = {
        queryName: "Query03",
        q: "music",
        language: "en",
        pageSize: 10
      };
      const emptySavedQueries = [exampleQuery03, exampleQuery02, exampleQuery ];
      saveQueryList(emptySavedQueries);
      setSavedQueries(emptySavedQueries);
    }
  }

  async function getNews(queryObject) {
    if (!queryObject.q) {
      setData({});
    } else {
      try {
        const response = await fetch(urlNews, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryObject),
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
      <LoginForm
        login={login}
        credentials={credentials}
        currentUser={currentUser}
        setCredentials={setCredentials}
      />
      <div>
        <section className="parent">
          {currentUser ? (
            <div className="box">
              <span className="title">Query Form</span>
              <QueryForm
                currentUser={currentUser}
                setFormObject={setQueryFormObject}
                formObject={queryFormObject}
                submitToParent={onFormSubmit}
              />
            </div>
          ) : null}
          <div className="box">
            <span className="title">Saved Queries</span>
            {currentUser && <button onClick={resetSavedQueries}>Reset</button>}
            <SavedQueries
              savedQueries={savedQueries}
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
              currentUser={currentUser}
            />
          </div>
          <div className="box">
            <span className="title">Articles List</span>
            <Articles
              query={query}
              data={data}
              showQueryDetails={showQueryDetails}
              toggleQueryDetails={() =>
                setShowQueryDetails(!showQueryDetails)
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}