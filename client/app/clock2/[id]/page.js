import React from 'react'
import Page2 from './components/page1' 
import Sidebar from './components/Navbar'

const Page = async ({ params }) => {
  const { id } = await params;  
  
  
  return (
    <div>
      <Sidebar />
      <Page2 id={id} /> 
    </div>
  );
}

export default Page;
