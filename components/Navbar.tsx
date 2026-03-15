"use client";

import Link from 'next/link';


export default function Navbar() {


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="logo">
          <span className="logo-icon">📱</span>
          <h1>알뜰런 계산기</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link
            href="/"
            className="nav-link"
          >
            계산기
          </Link>
          <Link
            href="/guide"
            className="nav-link"
          >
            사용가이드
          </Link>
          <Link
            href="/privacy"
            className="nav-link"
          >
            개인정보처리방침
          </Link>
        </div>

        {/* Mobile menu place holder */}
        <div className="nav-mobile-menu">
          <Link href="/privacy" className="nav-link">
            메뉴
          </Link>
        </div>
      </div>
    </nav>
  );
}
