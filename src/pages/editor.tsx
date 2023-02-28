import Dashboard from "../UI/components/dashboard";

const Editor = () => {
    //TODO: implement to saves all changes, stops the authoring process and leads back to the onboarding
    const saveSequence = () => {
    }

    return (
        <div className="main">
        <Dashboard />
            <div className="toolbar"><div className="btn btn-success m-1 px-5" onClick={saveSequence}>Save</div></div>
        </div>
    );
}

export default Editor;