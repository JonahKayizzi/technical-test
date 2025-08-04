import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/layout/input.layout'
import Button from '@/layout/button.layout'
import { useLoginMutation, useVerifySessionQuery } from '@/service/auth.service'

const LoginPage: React.FC = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const [login, { isLoading: isLoggingIn }] = useLoginMutation()
    const { data: session, isLoading: isCheckingSession } = useVerifySessionQuery()

    useEffect(() => {
        if (session?.user) {
            router.push('/products')
        }
    }, [session, router])

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        setEmailError('')
    }

    const validateEmail = (email: string): string => {
        if (!email.trim()) {
            return 'Email is required'
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address'
        }
        return ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const error = validateEmail(email)
        if (error) {
            setEmailError(error)
            return
        }

        try {
            await login({ email }).unwrap()
            router.push('/products')
        } catch (error: any) {
            setEmailError(error.data?.error || 'Login failed. Please try again.')
        }
    }

    if (isCheckingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Checking session...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to continue
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            error={emailError}
                            required
                            disabled={isLoggingIn}
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full"
                        >
                            {isLoggingIn ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage 