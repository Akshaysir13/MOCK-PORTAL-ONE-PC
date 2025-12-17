import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Shield, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('akshaymoghe5@gmail.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // Initialize auth state
  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error)
      }
      setUser(session?.user ?? null)
      setInitializing(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Handle login
  const handleLogin = async () => {
    setLoading(true)
    setError('')

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.')
      setLoading(false)
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      console.log('Attempting login for:', email)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      })

      if (signInError) {
        console.error('Supabase auth error:', signInError)
        
        // Handle specific error cases
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in.')
        } else if (signInError.message.includes('User not found')) {
          setError('No account found with this email. Please sign up first.')
        } else {
          setError(signInError.message)
        }
      } else if (data.user) {
        console.log('Login successful:', data.user.email)
        setUser(data.user)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Connection error. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Unexpected logout error:', err)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin()
    }
  }

  // Show loading state while initializing
  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Dashboard view (logged in)
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600 mt-2">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">User ID: {user.id}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Available Mock Tests
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-white border border-gray-300 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="font-semibold text-gray-800">
                    JEE B.Arch Mock Test - 1
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: 3 hours | Questions: 77
                  </div>
                </button>
                <button className="w-full bg-white border border-gray-300 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="font-semibold text-gray-800">
                    JEE B.Arch Mock Test - 2
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: 3 hours | Questions: 77
                  </div>
                </button>
                <button className="w-full bg-white border border-gray-300 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="font-semibold text-gray-800">
                    JEE B.Arch Practice Test
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: 1 hour | Questions: 25
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">JEE B.Arch</h1>
          <p className="text-gray-600 mt-2">Mock Test Portal</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                placeholder="your.email@example.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Login Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => alert('Sign up page - to be implemented')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Debug Info (Remove in production) */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-2">
            <strong>Test Credentials:</strong>
          </p>
          <p className="text-xs text-gray-600 text-center">
            Email: akshaymoghe5@gmail.com<br />
            Password: (use the one you set in Supabase)
          </p>
        </div>
      </div>
    </div>
  )
}
