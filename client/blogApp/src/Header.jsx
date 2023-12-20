import './App.css'
import { useEffect, useState, useContext } from "react"
import {Link} from "react-router-dom"
import { UserContext } from "./UserContext"

export default function Header(){
  const {userInfo, setUserInfo}=useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Not logged in'); // Or handle unauthorized status separately
        }
        return response.json();
      })
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((error) => {
        console.error('Profile fetch error:', error);
        setUserInfo(null); // Update userInfo context to indicate user is not logged in
      });
  }, []);
  

  function logout(){
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    }).then((response) => {
      if (response.ok) {
          setUserInfo({}); // Reset userInfo to an empty object upon successful logout
      } else {
          throw new Error('Logout failed');
      }
    }).catch((error) => {
      console.error('Logout error:', error);
      // Handle logout error, if needed
    })  
  }

  const username=userInfo?.username;
  
    return(
        <>
        <header>
          <Link to="/" className='logo'>MyBlog</Link>

          <nav>
            {username && (
              <>
                <Link to="/create">Create new post</Link>
                <a href='/' className="logout" onClick={logout}>Logout</a>
              </>
            )}
            {!username && (
              <>
                <Link to="/login" className="login">Login</Link>
                <Link to="/register" className="register">Register</Link>
              </>
            )}
          </nav>
        </header>
        </>
    )
}