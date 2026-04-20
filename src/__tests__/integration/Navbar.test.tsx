import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '@/components/Navbar'
import { LanguageProvider } from '@/components/LanguageProvider'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Navbar Integration', () => {
  it('renders logo and navigation links', () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    )

    expect(screen.getByText('NOMER')).toBeInTheDocument()
    expect(screen.getByText('TOP')).toBeInTheDocument()
  })

  it('switches language when clicking language pills', () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    )

    // Default locale is 'ru' in LanguageProvider
    // Check if RU pill is active (has class lang-pill-active)
    const ruButton = screen.getByText('RU').closest('button')
    const uzButton = screen.getByText('UZ').closest('button')

    expect(ruButton).toHaveClass('lang-pill-active')
    expect(uzButton).not.toHaveClass('lang-pill-active')

    // Click UZ
    fireEvent.click(uzButton!)

    expect(uzButton).toHaveClass('lang-pill-active')
    expect(ruButton).not.toHaveClass('lang-pill-active')
  })
})
