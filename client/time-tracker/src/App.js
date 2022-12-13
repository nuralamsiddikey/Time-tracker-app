import React from 'react';
import ShowSessionById from './components/ShowSessionById';
import Timer from './components/Timer';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={<Timer />}
          />
          <Route
            path="/session/:id"
            element={<ShowSessionById />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;