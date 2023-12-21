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
        <div className="logo-sec">
          <Link to="/" className='logo'>
            {/* <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000"
                preserveAspectRatio="xMidYMid meet">
                <metadata>
                Created by potrace 1.10, written by Peter Selinger 2001-2011
                </metadata>
                <g transform="translate(0.000000,300.000000) scale(0.050000,-0.050000)"
                fill="#e8d9d9" stroke="none">
                <path d="M0 3000 l0 -3000 3000 0 3000 0 0 3000 0 3000 -3000 0 -3000 0 0
                -3000z m2560 1530 c0 -445 5 -810 11 -810 6 0 47 19 91 41 704 359 1640 -86
                1851 -881 280 -1054 -839 -2002 -1830 -1549 -59 27 -111 49 -115 49 -5 0 -8
                -88 -8 -195 l0 -195 -440 0 -440 0 0 2175 0 2175 440 0 440 0 0 -810z"/>
                <path d="M1900 3160 l0 -1940 201 0 c217 0 242 10 266 106 19 76 180 234 237
                234 26 0 118 -23 206 -51 614 -194 1212 58 1449 611 64 150 83 589 32 762
                -169 582 -837 893 -1481 689 -199 -63 -221 -63 -301 -2 -143 109 -149 146
                -149 877 l0 654 -230 0 -230 0 0 -1940z m1607 94 c495 -227 601 -872 209
                -1270 -672 -683 -1684 362 -1042 1076 227 252 544 326 833 194z"/>
                <path d="M2989 3054 c-338 -162 -429 -587 -185 -864 338 -384 966 -149 963
                360 -2 400 -424 673 -778 504z"/>
                </g>
            </svg> */}
              MyBlog
          </Link>
        </div>
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