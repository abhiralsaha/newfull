"use client"

import type React from "react"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        setIsLoading(false)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side */}
      <div className="bg-[#4c4895] text-white flex flex-col justify-center p-8 md:p-16 md:w-1/2">
        <div className="max-w-md mx-auto md:mx-0">
          <h1 className="text-3xl md:text-3xl font-bold mb-4 whitespace-nowrap">Cash Management Dashboard</h1>
          <p className="text-lg font-medium opacity-90 whitespace-nowrap">
            Real-time Cash Reconciliation – Ensuring Accuracy & Transparency
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="relative bg-white flex flex-col justify-center items-center p-6 md:p-16 md:w-1/2">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center">
          <h2 className="text-[#664895] text-2xl md:text-3xl font-semibold text-center mb-6 whitespace-nowrap">
            Sign In to Your Dashboard
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="admin@example.com"
                className="w-full p-3 border border-[#e2e8f0] rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                className="w-full p-3 border border-[#e2e8f0] rounded"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ee632b] hover:bg-[#e05a25] text-white py-3 px-4 rounded transition-colors flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Login to dashboard"
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-[#64748b] text-sm">
                  Remember me
                </label>
              </div>

              <Link href="#" className="text-[#64748b] text-sm hover:text-[#4c4895]">
                Forgot password
              </Link>
            </div>

            <div className="text-center mt-4">
              <p className="text-[#64748b] text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#664895] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 text-center text-[#94a3b8] text-sm">Powered by Aestriks</div>
      </div>
    </div>
  )
}
