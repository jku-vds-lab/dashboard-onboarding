import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Editor from "./editor";
import Onboarding from './onboarding';

const Main = () => {
  return (
    <Routes>
      <Route path='/' element={<Onboarding/>}></Route>
      <Route path='/editor' element={<Editor/>}></Route>
    </Routes>
  );
}

export default Main;