'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const navigator = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault() 

    const payload = {
      email,
      password,
      ...(fullName && { fullName }) 
    }

    try {
      let response;
      if (isLogin) {
        response = await axios.post('http://localhost:8000/api/login', payload, { withCredentials: true })
        localStorage.setItem('token', response.data.token);
        navigator('/dashboard')
      } else {
        response = await axios.post('http://localhost:8000/api/signup', payload)
      }

      console.log(response.data) 
      if(response.data.success){
        alert(response.data.message)
      }
 
    } catch (error:any) {
      console.error('Error:', error.response?.data || error.message) // Handle error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 bg-opacity-50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 bg-opacity-50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 bg-opacity-50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={toggleForm}
              className="text-gray-300 hover:text-blue-400 focus:outline-none transition duration-300"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Log In'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
