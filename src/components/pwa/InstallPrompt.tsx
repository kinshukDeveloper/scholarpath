"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X, Smartphone } from "lucide-react"

const T = {
  bg:         "#0d1829",
  border:     "rgba(255,255,255,0.09)",
  text:       "#f8fafc",
  textDim:    "rgba(248,250,252,0.55)",
  accent:     "#34d399",
  accentDim:  "rgba(52,211,153,0.10)",
  accentRing: "rgba(52,211,153,0.28)",
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISSED_KEY = "sp_install_dismissed"

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible,        setVisible]        = useState(false)
  const [installing,     setInstalling]     = useState(false)
  const [isIOS,          setIsIOS]          = useState(false)
  const [showIOSGuide,   setShowIOSGuide]   = useState(false)

  useEffect(() => {
    // Don't show if user already dismissed within 7 days
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return

    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return

    // iOS detection (no beforeinstallprompt on iOS)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
      && !(window.navigator as { standalone?: boolean }).standalone
    setIsIOS(ios)

    if (ios) {
      // Show iOS manual install guide after 30s
      setTimeout(() => setVisible(true), 30_000)
      return
    }

    // Android/Chrome — listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show banner after 20 seconds
      setTimeout(() => setVisible(true), 20_000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()))
    setVisible(false)
  }

  async function install() {
    if (!deferredPrompt) return
    setInstalling(true)
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setVisible(false)
    } else {
      setInstalling(false)
    }
    setDeferredPrompt(null)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "110%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80
                     z-[55] rounded-2xl shadow-2xl p-4"
          style={{ background: T.bg, border: `1px solid ${T.border}`,
                   boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          <button onClick={dismiss}
            className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center
                       justify-center"
            style={{ color: "rgba(248,250,252,0.3)" }}>
            <X size={13} />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
              <Smartphone size={18} style={{ color: T.accent }} />
            </div>
            <div>
              <p className="text-[14px] font-bold pr-6" style={{ color: T.text }}>
                Install ScholarPath
              </p>
              <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: T.textDim }}>
                Add to home screen for faster access and offline support.
              </p>
            </div>
          </div>

          {isIOS ? (
            <>
              {!showIOSGuide ? (
                <motion.button onClick={() => setShowIOSGuide(true)}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 rounded-xl text-[13px] font-bold"
                  style={{ background: T.accent, color: "#020817" }}>
                  How to install
                </motion.button>
              ) : (
                <div className="space-y-2">
                  {[
                    "1. Tap the Share button (□↑) at the bottom of Safari",
                    "2. Scroll down and tap \"Add to Home Screen\"",
                    "3. Tap \"Add\" in the top right",
                  ].map((step, i) => (
                    <p key={i} className="text-[12px] leading-relaxed"
                      style={{ color: T.textDim }}>
                      {step}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : (
            <motion.button
              onClick={install}
              disabled={installing}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                         text-[13px] font-bold disabled:opacity-60"
              style={{ background: T.accent, color: "#020817" }}>
              {installing
                ? <span className="animate-pulse">Installing…</span>
                : <><Download size={14} /> Install app</>
              }
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
