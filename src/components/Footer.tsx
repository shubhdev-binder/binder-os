import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import binderLogo from "@/assets/binder-logo.png";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-2xl font-extrabold tracking-tight text-foreground"
              >
                Binder<span className="text-accent">OS</span>
              </a>
              <span className="hidden md:block w-px h-6 bg-border/50" />
              <div className="flex items-center gap-2">
                <img
                  src={binderLogo}
                  alt="Binder 33 Labs"
                  className="h-5 w-5 object-contain animate-[logo-pulse_3.2s_ease-in-out_infinite]"
                />
                <span className="text-xs text-muted-foreground">
                  A product of{" "}
                  <span className="font-semibold text-foreground/80">
                    Binder 33 Labs
                  </span>
                </span>
              </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {[
                { label: "Product", href: "#inventory" },
                { label: "Features", href: "#features" },
                {
                  label: "About Binder 33 Labs",
                  href: "https://binder33labs.com",
                },
                { label: "Contact", href: "#cta" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full origin-left" />
                </a>
              ))}
            </nav>

            <motion.a
              href="https://x.com/binder33labs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Binder 33 Labs on X"
              className="w-10 h-10 rounded-xl border border-border/40 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300"
              whileHover={{ y: -3, scale: 1.05 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </motion.a>
          </div>
        </AnimatedSection>

        <div className="mt-12 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Binder 33 Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
