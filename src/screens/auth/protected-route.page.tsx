'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useVerifySessionQuery } from '@/service/auth.service'
import Loading from '@/layout/loading.layout'

interface ProtectedRouteProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    fallback
}) => {
    const router = useRouter()
    const { data: session, isLoading, error } = useVerifySessionQuery()

    useEffect(() => {
        if (error || !session?.user) {
            router.push('/login')
        }
    }, [error, session, router])

    if (isLoading) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center">
                <Loading text="Checking authentication..." />
            </div>
        )
    }

    if (error || !session?.user) {
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute 