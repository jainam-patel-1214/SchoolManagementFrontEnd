import bgimg from "../assets/bg.jpg"
import { LoginRegisterForm } from "./LoginRegisterform"
import '../styles/signin.css'
export const SignIn = ()=>{
    return(
        <div id="signInPage">
            <div id="section-one">
                <img src={bgimg} alt="background" />
            </div>
            <div id="section-two">
                < LoginRegisterForm/>
            </div>
        </div>
    )
}