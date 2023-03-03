import { Link } from "react-router-dom";
import Dashboard from "../UI/components/dashboard";

const Editor = () => {
    //TODO: implement to saves all changes, stops the authoring process and leads back to the onboarding
    const saveSequence = () => {
    }

    return (
        <div className="editor">
        <Dashboard />
            <div className="toolbar">
                <Link to="/">
                    <div className="btn btn-success m-1 px-5" onClick={saveSequence}>Save</div>
                </Link>  
            </div>
        </div>
    );
}

export default Editor;