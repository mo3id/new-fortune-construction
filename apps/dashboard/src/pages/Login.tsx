import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HardHat, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { authStorage } from '../lib/auth'
import toast from 'react-hot-toast'
import { useFormSchema, loginSchema, LoginFormData, FormInput, Form, Button } from '@fortune/shared-ui'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useFormSchema({
    schema: loginSchema,
    defaultValues: { username: '', password: '' }
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', data)
      authStorage.setToken(res.data.token)
      authStorage.setUser({ username: res.data.username })
      toast.success('Welcome back!')
      navigate('/')
    } catch {
      toast.error('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-700">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-600 rounded-full shadow-2xl shadow-teal-500/20 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <HardHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Fortune Construction</h1>
          <p className="text-slate-500 text-sm font-medium mt-2 uppercase tracking-[0.2em]">Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-teal-600" />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Please sign in to access your dashboard.</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInput 
                  name="username" 
                  label="Administrator Username" 
                  placeholder="admin" 
                  disabled={loading}
                />
                <FormInput 
                  name="password" 
                  label="Secret Password" 
                  type="password" 
                  placeholder="••••••••" 
                  disabled={loading}
                />
              </div>
              
              <Button type="submit" className="w-full shadow-xl shadow-teal-500/20" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : 'Sign Into Dashboard'}
              </Button>
            </form>
          </Form>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Protected by Fortune Security
              </p>
            </div>
          </div>
        </div>

        {/* Credentials Tip */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-top-4 delay-500 duration-1000 fill-mode-both">
          <p className="text-xs text-slate-600 font-medium">
            Demo Credentials: <span className="text-slate-400 mx-1 underline decoration-teal-500/30 underline-offset-4 cursor-help" title="Username: admin / Password: admin123">Hover to reveal</span>
          </p>
        </div>
      </div>
    </div>
  )
}
