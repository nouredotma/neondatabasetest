"use client"

import { useState } from "react"
import { toast } from "sonner"
import { subscribeEmail } from "./actions"
import { User, Mail, Phone, MessageSquare, FileText, Camera, Send } from "lucide-react"

export default function HomePage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await subscribeEmail(formData)
    setLoading(false)

    if (result.success) {
      toast.success("Submission successful!")
      const form = document.querySelector('form') as HTMLFormElement
      form?.reset()
    } else {
      toast.error(result.error || "Something went wrong.")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#262624]">
      <div className="w-full max-w-lg space-y-6">
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1.5">
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#d97757] transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#d97757] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#d97757] transition-all"
            />

            {/* Phone */}
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#d97757] transition-all"
            />
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder="Your Message..."
            required
            rows={3}
            className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-[2rem] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#d97757] transition-all resize-none"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Resume Upload */}
            <label className="relative flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 hover:border-[#d97757]/40 transition-all group overflow-hidden">
              <div className="p-2 bg-[#d97757]/10 rounded-full group-hover:scale-110 transition-transform">
                <FileText size={18} className="text-[#d97757]" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Resume</p>
                <p className="text-[10px] text-white/30 mt-0.5 truncate max-w-[120px] filename-resume">PDF / DOCX</p>
              </div>
              <input
                name="resume"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  const p = e.target.parentElement?.querySelector('.filename-resume');
                  if (p && e.target.files?.[0]) p.textContent = e.target.files[0].name;
                }}
              />
            </label>

            {/* Profile Image Upload */}
            <label className="relative flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 hover:border-[#d97757]/40 transition-all group overflow-hidden">
              <div className="p-2 bg-[#d97757]/10 rounded-full group-hover:scale-110 transition-transform">
                <Camera size={18} className="text-[#d97757]" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Photo</p>
                <p className="text-[10px] text-white/30 mt-0.5 truncate max-w-[120px] filename-photo">JPG / PNG</p>
              </div>
              <input
                name="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const p = e.target.parentElement?.querySelector('.filename-photo');
                  if (p && e.target.files?.[0]) p.textContent = e.target.files[0].name;
                }}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#d97757] text-white text-sm font-bold rounded-full hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <Send size={16} />
                Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
