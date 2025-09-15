export function Footer() {
  const year = new Date().getFullYear();

  const linkBase =
    "text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">Pdf Reader</h3>
            <p className="text-sm text-white/60">
              © {year} All rights reserved.
            </p>
          </div>

          <nav aria-label="Footer" className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Ar0manKhan"
                  className={linkBase}
                  aria-label="GitHub profile"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="/" className={linkBase} aria-label="Project website">
                  Project
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ar0mankhan/"
                  className={linkBase}
                  aria-label="LinkedIn profile"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">Side business</h4>
            <div className="space-y-1">
              <a
                href="some-url-for-now"
                className={`${linkBase} inline-flex items-center`}
                aria-label="BizzGrow.in website"
              >
                BizzGrow.in
              </a>
              <p className="text-sm text-white/60">
                Website development consultancy
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-xs leading-relaxed text-white/50">
            Thanks to shadcn/ui, React, Zustand, Tailwind CSS, TypeScript, and
            more.
          </p>
        </div>
      </div>
    </footer>
  );
}
