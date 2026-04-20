import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import { vi } from 'vitest'
import { useTranslation } from '@/components/LanguageProvider'

// Mock the useTranslation hook
vi.mock('@/components/LanguageProvider', () => ({
  useTranslation: vi.fn(),
}))

describe('Footer Component', () => {
  it('renders localized content correctly', () => {
    // Mock the translation strings
    const mockT = {
      nav: { search: 'Search', dashboard: 'Dashboard' },
      dashboard: { myFleet: 'My Fleet' },
      footer: {
        copy: '© 2026 NomerTop. All rights reserved.',
        tagline: 'Simple and fast',
        contacts: 'Contacts',
        agreement: 'Agreement',
        privacy: 'Privacy',
        navigation: 'Navigation',
        support: 'Support',
        rights: 'All rights reserved.'
      }
    }

    ;(useTranslation as any).mockReturnValue({ t: mockT })

    render(<Footer />)

    // Check if the tagline and buttons are present
    expect(screen.getByText('Simple and fast')).toBeInTheDocument()
    expect(screen.getByText('Contacts')).toBeInTheDocument()
    expect(screen.getByText(/2026 NomerTop/)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    const mockT = {
      nav: { search: 'Search', dashboard: 'Dashboard' },
      dashboard: { myFleet: 'MF' },
      footer: { copy: 'C', tagline: 'T', contacts: 'C', agreement: 'A', privacy: 'P', navigation: 'N', support: 'S', rights: 'R' }
    }
    ;(useTranslation as any).mockReturnValue({ t: mockT })
    
    render(<Footer />)
    
    // Check for navigation links
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})
