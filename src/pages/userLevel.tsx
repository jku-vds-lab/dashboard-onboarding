import { Link } from "react-router-dom";
import * as global from "../onboarding/ts/globalVariables";
import MyReport from "./report";

export default function UserLevel() {
  return (
    <div className="userLevel">
      <Link to="/">
        <div className="btn btn-secondary btn-dark ms-2">Launch Onboarding</div>
      </Link>
    </div>
  );
}
