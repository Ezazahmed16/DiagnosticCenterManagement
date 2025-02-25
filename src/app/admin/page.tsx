export const dynamic = "force-dynamic"; 

import Dashboard from '@/components/Dashboard/Dashboard'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const page = () => {
    return (
        <DefaultLayout userRole=''>
            <Dashboard />
        </DefaultLayout>
    )
}

export default page;