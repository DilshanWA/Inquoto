'use client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const name  = localStorage.getItem('name')

  return (
    <div className='flex '>
     <div className="p-6">
             <h1 className="text-2xl font-bold">Hello {name}</h1>
             <p className="mt-4">Welcome to the dashboard. Here you can see All Detils</p>
      </div>
    </div>
  )
}
