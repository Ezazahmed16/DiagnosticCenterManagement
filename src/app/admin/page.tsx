import Dashboard from '@/components/Dashboard/Dashboard'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { role } from '@/lib/data'
import React from 'react'

const page = () => {
    return (
        <DefaultLayout>
            <Dashboard />
        </DefaultLayout>
    )
}

export default page