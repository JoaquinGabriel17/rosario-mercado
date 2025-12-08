import Login from "../components/Login";
import Register from "../components/Register";
import { useState } from "react";

function Auth(){

    const [isLogin, setIsLogin] = useState(true);

    return(
        <div className="auth-container">
            <h2 className="auth-title">Authentication Page</h2>
            <div className="button-group">
            
            <button
                onClick={() => setIsLogin(true)}
                className="auth-btn"
            >Login</button>
            <button 
                onClick={() => setIsLogin(false)}
                className="auth-btn"
            >Register</button>
            </div>
            {isLogin ? <Login /> : <Register />}
        </div>
    );
}

export default Auth;