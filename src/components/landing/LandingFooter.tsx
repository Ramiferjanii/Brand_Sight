"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo/logo-removebg-preview.png"
                alt="Logo"
                width={160}
                height={42}
                className="dark:hidden"
              />
              <Image
                src="/images/logo/logo-removebg-preview.png"
                alt="Logo"
                width={160}
                height={42}
                className="hidden dark:block"
              />
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
              Platform for Real-Time Brand Monitoring. 
              Understand your public image with ease and speed.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BrandSight. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
