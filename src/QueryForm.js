import React from "react";

export function QueryForm(params) {
  const handleChange = (event) => {
    let newQueryObject = { ...params.formObject };
    newQueryObject[event.target.name] = event.target.value;
    params.setFormObject(newQueryObject);
  };

  function onSubmitClick(event) {
    event.preventDefault();
    if (!params.formObject.queryName) {
      alert("Please provide a name for the query!");
      return;
    }
    if (!params.formObject.q || params.formObject.q.length === 0) {
      alert("Please provide some text for the query field!");
      return;
    }
    params.submitToParent(params.formObject);
  }

  function currentUserIsAdmin() {
    if (params.currentUser && params.currentUser.user === "admin") {
      return true;
    }
    return false;
  }

  return (
    <div>
      <form>
        <div>
          <label htmlFor="queryName">Query Name: </label>
          <input
            type="text"
            size={10}
            id="queryName"
            name="queryName"
            value={params.formObject.queryName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="q">Query Text: </label>
          <input
            type="text"
            size={10}
            id="q"
            name="q"
            value={params.formObject.q}
            onChange={handleChange}
          />
        </div>
        {currentUserIsAdmin() && (
          <div>
            <div>
              <label htmlFor="language">Language: </label>
              <input
                type="text"
                size={10}
                id="language"
                name="language"
                value={params.formObject.language}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="pageSize">Page Size: </label>
              <input
                type="number"
                size={10}
                id="pageSize"
                name="pageSize"
                value={params.formObject.pageSize}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
        <div className={currentUserIsAdmin() ? "visible" : "hidden"} style={{ border: "solid black 1px" }}>
          {/* Extra fields */}
          <div>
            <label htmlFor="language">Language: </label>
            <input
              type="text"
              size={10}
              id="language"
              name="language"
              value={params.formObject.language}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="pageSize">Page Size: </label>
            <input
              type="number"
              size={10}
              id="pageSize"
              name="pageSize"
              value={params.formObject.pageSize}
              onChange={handleChange}
            />
          </div>
        </div>
        <span style={{ display: "block", backgroundColor: "#eee" }}>
          <input type="button" value="Submit" onClick={onSubmitClick} />
        </span>
      </form>
    </div>
  );
}