import React from 'react'
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

    if (isLoading) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center">
                <Loading text="Checking authentication..." />
            </div>
        )
    }

    if (error || !session?.user) {
        router.push('/login')
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute 