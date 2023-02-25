import React from "react";

import Dashboard from "./components/dashboard";

const App = () => {
    //TODO: implement to saves all changes, stops the authoring process and leads back to the onboarding
    const saveSequence = (e) => {
        e.preventDefault();
    }

  return (
    <div className="main">
      <Dashboard />
        <div className="toolbar"><div className="btn btn-success m-1 px-5" onClick={saveSequence}>Save</div></div>
    </div>
  );
};

export default App;
