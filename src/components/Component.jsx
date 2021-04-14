import { useParams } from "react-router-dom";
import Appointment from "./appointment/Appointment";
import Consultant from "./consultant/Consultant";
import Designation from "./designation/Designation";
import LightExercise from "./lightExercise/LightExercise";
import Music from "./music/Music";
import Notification from "./notification/Notification";
import Orders from "./orders/Orders";
import PinVideo from "./pinVideo/PinVideo";
import Products from "./products/Products";
import TipsAndTricks from "./tipsAndTrics/TipsAndTricks";

const Component = () => {
    const { name } = useParams();
    if (name === 'appointments') return <Appointment />
    else if (name === 'designations and services') return <Designation />
    else if (name === 'consultants') return <Consultant />
    else if (name === 'tips and tricks') return <TipsAndTricks />
    else if (name === 'pin videos') return <PinVideo />
    else if (name === 'light exercises') return <LightExercise />
    else if (name === 'music') return <Music />
    else if (name === 'products') return <Products />
    else if (name === 'orders') return <Orders />
    else if (name === 'notification') return <Notification />
    else return <h1>Page not found.....</h1>
}

export default Component;