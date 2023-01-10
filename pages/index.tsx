import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layouts from '../components/layouts'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Parallax, Pagination, Navigation } from "swiper";
import { useEffect } from 'react'
import JsCookie from 'js-cookie'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cookieCheck = () => {
      const token = JsCookie.get('token')
      console.log('Cookie', token)
      if (token === undefined || token === null || !token) return router.push('/login');
    }
    cookieCheck()
  }, [])

  return (
    <>
      <Layouts>
        <div className='flex flex-1 justify-center mx-10 my-5'>
          <p>Dashboard</p>
        </div>
      </Layouts >
    </>
  )
}
