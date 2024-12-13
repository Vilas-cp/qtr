import React from 'react'
import Flowable from './components/flowable'
import Sidebar from '../clock2/[id]/components/Navbar'

const Page = () => {
  return (
    <div className='pl-[100px]'>
        <Sidebar/>
      <Flowable/>
    </div>
  )
}

export default Page
