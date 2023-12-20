import { useContext, useState } from 'react'
import './pagesStyle.css'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function LoginPage(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const {setUserInfo}=useContext(UserContext);
    const { userInfo } = useContext(UserContext);

    // If user is already logged in, redirect to another page
    if (userInfo) {
        return <Navigate to={'/'} />;
    }

    async function login(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login',{
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-type' : 'application/json'},
            credentials: 'include', 

        })
        console.log('Response status:', response.status);
        if (response.ok){
            response.json().then(userInfo=>{
                setUserInfo(userInfo);
                setRedirect(true);
            })
        }
        else{
            alert("wrong credentials. ")
        }
    }
    if (redirect){
        return <Navigate to={'/profile'}/>
    }   
    return(
        <>
            <form className="box" onSubmit={login}>
                <h1 className="box-title">Login</h1>
                <input type="text" 
                    className="box-input" 
                    name="username" 
                    placeholder="username"
                    value={username}
                    onChange={ev=>setUsername(ev.target.value)}/>
                <input type="password" 
                    className="box-input" 
                    name="password" 
                    id="id_password" 
                    placeholder="password"
                    value={password}
                    onChange={ev=>setPassword(ev.target.value)}/>
                <button className="box-button">Login</button>
                <p className="box-register">Not have an account yet? <a href="/register">Register</a></p>
		    </form>
        </>

    )
}