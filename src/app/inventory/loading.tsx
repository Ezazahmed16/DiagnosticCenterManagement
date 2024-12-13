import Loader from '@/components/common/Loader'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-screen justify-center items-center'>
        <Loader />
    </div>
  )
}

export default loading