import React from 'react'
import Sidebar from '../clock1/components/Navbar'
import TaskForm from './components/addtask'

const Page = () => {
  return (
    <div>
      <Sidebar/>
      <TaskForm/>
    </div>
  )
}

export default Page
