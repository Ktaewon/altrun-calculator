"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="brand" onClick={closeMenu}>
          <img src="/phone-cost-mark.svg" alt="휴대폰 비용 계산기 로고" className="brand-mark" />
          <span className="brand-text">
            <span className="brand-name">휴대폰 비용 계산기</span>
            <span className="brand-caption">요금제 · 유지비 · 알뜰런 비교</span>
          </span>
        </Link>

        <div className="nav-tools">
          <ThemeToggle />

          <div className="nav-links">
            <Link href="/" className="nav-link">비용 계산</Link>
            <Link href="/guide" className="nav-link">구매 방식 가이드</Link>
            <Link href="/privacy" className="nav-link">개인정보처리방침</Link>
          </div>
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

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div className="mobile-backdrop" onClick={closeMenu} />
        )}

        {/* Mobile Dropdown */}
        <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-theme-toggle">
            <ThemeToggle />
          </div>
          <Link href="/" className="mobile-dropdown-link" onClick={closeMenu}>비용 계산</Link>
          <Link href="/guide" className="mobile-dropdown-link" onClick={closeMenu}>구매 방식 가이드</Link>
          <Link href="/privacy" className="mobile-dropdown-link" onClick={closeMenu}>개인정보처리방침</Link>
        </div>
      </div>
    </nav>
  );
}
