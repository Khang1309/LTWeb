import React from 'react'
import { useState } from 'react'
import myLogo from '../assets/Logo.svg'
import {
    SearchIcon,
    ShoppingBasketIcon,
    CircleUserIcon,
} from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

import { useUserStore } from '@/store/userStore'

function Header({ leftTrigger }: { leftTrigger: any }) {

    const userData = useUserStore(s => s.user)

    return (
        <header className={('flex min-h-20 w-full bg-white')}>
            <div className='flex flex-1 justify-start items-center cursor-pointer md:hidden'>
                {leftTrigger}
            </div>
            <div className='flex-1 flex justify-center items-center md:items-start h-full overflow-hidden'>
                <img
                    src={myLogo}
                    alt="Logo"
                    className="max-h-full w-auto object-contain cursor-pointer py-4"
                />
            </div>
            <div className='hidden md:flex md:flex-3 lg:flex-5 justify-center items-center '>
                <InputGroup className='w-full'>
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className='flex-1 flex text-xs md:text-sm lg:text-base gap-8 justify-end px-4'>
                <div className='flex-1 flex justify-center items-center flex-col cursor-pointer'>
                    <ShoppingBasketIcon />
                    <div>Cart</div>
                </div>
                <div className='flex-1 flex justify-center items-center flex-col cursor-pointer'>
                    <CircleUserIcon />
                    {
                        !userData ?
                            <div>
                                Log in
                            </div> :

                            <div>
                                Hello, {userData.name}
                            </div>
                    }
                </div>
            </div>
        </header>

    )
}

export default Header