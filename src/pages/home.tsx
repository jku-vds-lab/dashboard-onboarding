import { setDivisor } from "../onboarding/ts/sizes";
import Onboarding from "./onboarding";

const Home = () => {
    setDivisor(1);

    return (
        <Onboarding/>
    );
}

export default Home;