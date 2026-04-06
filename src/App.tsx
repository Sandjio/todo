// import { useState } from 'react'
import { SideBar, Main } from "./components";
import "./App.css";

function App() {
  return (
    <main className="flex">
      <SideBar />
      <Main />
    </main>
  );
}

export default App;
