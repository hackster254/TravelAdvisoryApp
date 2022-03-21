import React, {useRef, useState} from 'react'

import {Room, Cancel} from '@material-ui/icons'

import './register.css'
import axios from 'axios'

function Register({setShowRegister}) {

    const [success, setSuccess]= useState(false)
    const [error, setError] = useState(false)

    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const newUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        try {
            await axios.post('http://localhost:8000/api/users/register', newUser)
            setError(false)
            setSuccess(true)
            
        } catch (error) {
            setError(true)
        }
    }
  return (
    <div className='registerContainer'>
        <div className='logo'>
        <Room />
        EJENZI
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={usernameRef}/>
              <input type="email" placeholder="email" 
               ref={emailRef}
              />
              <input type="password" placeholder="password" 
                    ref={passwordRef}  
            />
        
            <button className='registerBtn'>Register</button>
            
            {success &&(
                  <span className='success'>Successful! You can login
                  </span>
            )}
           {error &&(
                  <span className='failure'>Err! Something went wrong
                  </span>
           )}

              
        </form>
        <Cancel className='registerCancel' 
            onClick={()=>setShowRegister(false)}
        />

    </div>
  )
}

export default Register