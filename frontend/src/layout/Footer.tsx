import React from 'react'
import myLogo from '../assets/Logo.svg'
import { Mail, Phone, MapPin } from 'lucide-react'
function Footer() {
    return (
        <footer className='bg-(--color-dark) text-white px-6 md:px-10 py-12'>
            {/* Grid layout: 1 cột trên mobile, 5 cột trên desktop */}
            <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8'>

                {/* Cột 1: Thông tin liên hệ (Chiếm 2 cột trên desktop) */}
                <div className='md:col-span-2 flex flex-col items-center md:items-start gap-4'>
                    <img src={myLogo} alt="The Reader Logo" className='mx-auto h-40 w-auto mb-2' />

                    <div className='space-y-3 mx-auto text-sm text-gray-300'>
                        <div className='flex items-start gap-3'>
                            <MapPin size={18} className="shrink-0 text-(--color-brand)" />
                            <span><span className='font-bold text-white'>Address:</span> 268 Ly Thuong Kiet Street, District 10, HCMC</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Phone size={18} className="shrink-0 text-(--color-brand)" />
                            <span><span className='font-bold text-white'>Phone:</span> +84 12345 6789</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Mail size={18} className="shrink-0 text-(--color-brand)" />
                            <span><span className='font-bold text-white'>Email:</span> thereader@hcmut.edu.vn</span>
                        </div>
                    </div>
                </div>

                {/* Cột 2: About Us */}
                <div className='flex flex-col gap-4'>
                    <h4 className='font-bold text-lg uppercase tracking-wider'>About Us</h4>
                    <ul className='space-y-2 text-sm text-gray-400'>
                        <li className='hover:text-white cursor-pointer transition-colors'>Our Story</li>
                        <li className='hover:text-white cursor-pointer transition-colors'>Team</li>
                        <li className='hover:text-white cursor-pointer transition-colors'>Careers</li>
                    </ul>
                </div>

                {/* Cột 3: Products */}
                <div className='flex flex-col gap-4'>
                    <h4 className='font-bold text-lg uppercase tracking-wider'>Products</h4>
                    <ul className='space-y-2 text-sm text-gray-400'>
                        <li className='hover:text-white cursor-pointer transition-colors'>New Arrivals</li>
                        <li className='hover:text-white cursor-pointer transition-colors'>Best Sellers</li>
                        <li className='hover:text-white cursor-pointer transition-colors'>Sale</li>
                    </ul>
                </div>

                {/* Cột 4: Support */}
                <div className='flex flex-col gap-4'>
                    <h4 className='font-bold text-lg uppercase tracking-wider'>Support</h4>
                    <ul className='space-y-2 text-sm text-gray-400'>
                        <li className='hover:text-white cursor-pointer transition-colors'>FAQs</li>
                        <li className='hover:text-white cursor-pointer transition-colors'>Contact</li>
                        <li className='hover:text-white cursor-pointer transition-colors'>Shipping</li>
                    </ul>
                </div>

            </div>

            {/* Bottom Bar: Bản quyền */}
            <div className='mt-12 pt-8  text-center text-xs text-gray-500'>
                © {new Date().getFullYear()} THE READER. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer