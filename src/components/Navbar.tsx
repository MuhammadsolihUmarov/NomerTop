'use client';

import Link from 'next/link';
import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky-nav">
      <div className="container nav-content">
        <Link href="/" className="logo-text font-heading text-white no-underline">
          NOMER<span className="text-blue-500">TOP</span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-links">
          <Link href="/search" className="no-underline">Search</Link>
          <Link href="/dashboard" className="no-underline">Dashboard</Link>
          
          <Link href="/login" className="btn-login no-underline">
            <User size={18} />
            <span>Log In</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-container glass"
          >
            <div className="mobile-links">
              <Link href="/search" onClick={() => setIsOpen(false)}>Search</Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <Link href="/login" className="btn-primary-large" onClick={() => setIsOpen(false)}>
                Log In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

    </nav>
  );
}
