'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user') // Or check cookies/session
    if (!user) {
      router.push('/')
    }
  }, [])

  return (
    <div className='h-screen flex '>
     <div className="p-6">
             <h1 className="text-2xl font-bold">Hello There!</h1>
             <p className="mt-4">Welcome to the dashboard. Here you can see All Detils</p>
      </div>
    </div>
  )
}
