"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">📱</span>
          <h1>알뜰런 계산기</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link href="/" className="nav-link">계산기</Link>
          <Link href="/guide" className="nav-link">사용가이드</Link>
          <Link href="/privacy" className="nav-link">개인정보처리방침</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        {/* Mobile Dropdown */}
        <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          <Link href="/" className="mobile-dropdown-link" onClick={closeMenu}>계산기</Link>
          <Link href="/guide" className="mobile-dropdown-link" onClick={closeMenu}>사용가이드</Link>
          <Link href="/privacy" className="mobile-dropdown-link" onClick={closeMenu}>개인정보처리방침</Link>
        </div>
      </div>
    </nav>
  );
}
