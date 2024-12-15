import React from 'react'
import Sidebar from '../clock2/[id]/components/Navbar'
import TaskForm from './components/addtask'

const Page = () => {
  return (
    <div className='ml-[100px]'>
      <Sidebar/>
      <TaskForm/>
    </div>
  )
}

export default Page
