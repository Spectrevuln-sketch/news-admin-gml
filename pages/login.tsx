import React, { useEffect, useState } from 'react';
import axios from 'axios'
import JsCookie from 'js-cookie'
import { useRouter } from 'next/router';

interface LoginCookie {
  cookie: string,
  baseUrl: string
}



export default function login(props: LoginCookie) {
  const router = useRouter()
  const [state, setState] = useState({
    username: '',
    password: ''
  })
  useEffect(() => {
    const cookieCheck = () => {
      const token = JsCookie.get('token')
      console.log('Cookie', token)
      if (token !== null || !token) return router.push('/login');
    }
    cookieCheck()
  }, [])

  const SubmitLogin = async (e: any) => {
    e.preventDefault()
    try {
      const Login = await axios.post(`${props?.baseUrl}/candidates/login`, state)
      if (Login.status === 200) {
        JsCookie.set('token', `${Login.data.data.token}`, { expires: 7, path: '' })
        return router.push('/')
      }

    } catch (err: any) {
      console.log(err?.response?.data)
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                <input type="username" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@example.com" required onChange={(e) => setState({
                  ...state,
                  username: e.target.value
                })} />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={(e) => setState({
                  ...state,
                  password: e.target.value
                })} />
              </div>
              <div className="flex items-center justify-between">
                {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div> */}

              </div>
              <button type="submit" className="flex flex-1 justify-center items-center bg-blue-300 mx-auto px-10 py-4 text-white font-bold rounded-md" onClick={SubmitLogin}>Sign in</button>

            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps(ctx: any) {
  const cookies = JsCookie.get('token') ? JsCookie.get('token') : null
  console.log('cookies', cookies)
  return {
    props: {
      cookies,
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
    },

  }
}
