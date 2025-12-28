import React from 'react'
import { Outlet } from 'react-router-dom'
import "@pages/social/Social.scss"
import Header from "@components/header/Header"
import Sidebar from '@components/sidebar/Sidebar'
import PageLoader from '@components/page-loader/PageLoader'
import { Suspense } from 'react'

const Social = () => {
  return (
    <>
      <Header />
      <div className='dashboard'>
        <div className='dashboard-sidebar'>
          <Sidebar />
        </div>
        <div className='dashboard-content'>
          <Suspense fallback={PageLoader}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default Social
