import { Link } from "react-router-dom";
import MainLayout from "../UI/main-layout";
import { useEffect } from "react";
import { setIsEditor } from "../onboarding/ts/globalVariables";

const Editor = () => {
  useEffect(() => {
    setIsEditor(true);
  },[]);
  
  return (
    <div className="editor">
      <MainLayout/>
    </div>
  );
};

export default Editor;
