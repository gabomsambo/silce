"use client"

import type React from "react"

import { useState } from "react"
import Button from "./Button"

export default function NewsletterSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    interests: [] as string[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  const interests = ["Philly Hotels", "Cape May", "Special Offers", "Events & Experiences"]

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">STAY IN THE KNOW</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Be the first to hear about new properties, exclusive offers, and insider experiences. Join our community of
          discerning travelers.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent outline-none transition-all duration-300"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent outline-none transition-all duration-300"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent outline-none transition-all duration-300 mb-6"
            required
          />

          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-4">I'm interested in:</p>
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest) => (
                <label key={interest} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleCheckboxChange(interest)}
                    className="mr-3 w-4 h-4 text-tan border-gray-300 rounded focus:ring-tan"
                  />
                  <span className="text-sm text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <Button text="SUBSCRIBE" variant="primary" />
        </form>
      </div>
    </section>
  )
}
