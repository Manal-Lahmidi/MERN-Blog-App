import { useState } from 'react'

import {Link} from "react-router-dom"
import './pagesStyle.css'

export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev){
        ev.preventDefault();
            const response=await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers: {'Content-type': 'application/json'},
            })
            if(response.status !== 200){
                alert("Registration failed.Try an other username.")
            }else{
                alert("you have registered successfuly.")
            }
        }
    
    return(
        <>
            <form className="box" onSubmit={register}>
                <h1 className="box-title">Register</h1>
                <input type="text" 
                    className="box-input" 
                    placeholder="username" 
                    required 
                    value={username}
                    onChange={ev=>setUsername(ev.target.value)}
                />
                <input type="password" 
                    className="box-input" 
                    placeholder="password" 
                    required 
                    value={password}
                    onChange={ev=>setPassword(ev.target.value)}
                />
                <button className="box-button">Register</button>
                <p className="box-register">Already registered? <a href="/login">Login</a></p>
	        </form>
        </>
    )
}