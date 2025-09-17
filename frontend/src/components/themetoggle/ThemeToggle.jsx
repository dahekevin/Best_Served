"use client"

import { useState, useEffect } from "react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setIsDark(savedTheme === "dark")
      document.documentElement.setAttribute("data-theme", savedTheme)
    } else if (prefersDark) {
      setIsDark(true)
      document.documentElement.setAttribute("data-theme", "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Modo Claro" : "Modo Escuro"}>
      {isDark ? "☀️" : "🌙"}
    </button>
  )
}
