"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { registerUser } from "@/lib/actions/auth-actions"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = () => {
    let valid = true
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required"
      valid = false
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
        const formDataObj = new FormData()
        formDataObj.append("email", formData.email)
        formDataObj.append("password", formData.password)
        formDataObj.append("name", formData.name)

        const result = await registerUser(formDataObj)

        if (result.error) {
          setErrors({
            ...errors,
            email: result.error,
          })
          setIsLoading(false)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Registration error:", error)
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Purple background with title */}
      <div className="bg-[#4c4895] text-white flex flex-col justify-center p-8 md:p-16 md:w-1/2">
        <div className="max-w-md mx-auto md:mx-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cash Management Dashboard</h1>
          <p className="text-lg opacity-90">Real-time Cash Reconciliation – Ensuring Accuracy & Transparency</p>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="bg-white flex flex-col justify-center p-8 md:p-16 md:w-1/2">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-[#664895] text-2xl md:text-3xl font-semibold mb-8">Create Your Account</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-1">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Full Name
                </label>
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 border border-[#e2e8f0] rounded"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <div className="mb-1">
                <label htmlFor="email" className="text-sm text-gray-600">
                  Email Address
                </label>
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-[#e2e8f0] rounded"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="mb-1">
                <label htmlFor="password" className="text-sm text-gray-600">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full p-3 border border-[#e2e8f0] rounded"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <div className="mb-1">
                <label htmlFor="confirmPassword" className="text-sm text-gray-600">
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full p-3 border border-[#e2e8f0] rounded"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
                "Create Account"
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-[#64748b] text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-[#664895] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-auto pt-16 text-center text-[#94a3b8] text-sm">Powered by Aestriks</div>
        </div>
      </div>
    </div>
  )
}
