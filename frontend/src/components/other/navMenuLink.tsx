import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

// Sử dụng React.forwardRef để nhận ref từ NavigationMenuLink
const NavMenuLink = React.forwardRef<HTMLAnchorElement, { name: string; to?: string }>(
    ({ name, to = "/", ...props }, ref) => {
        return (
            <NavLink
                {...props} // Spread các props (onClick, onMouseEnter...) từ Radix truyền xuống
                ref={ref}   // Gán ref vào đây
                to={to}
                className={({ isActive }) =>
                    cn(
                        navigationMenuTriggerStyle(),
                        "group/nav relative flex flex-col items-start h-auto py-2",
                        isActive && "text-(--color-brand)"
                    )
                }
            >
                {({ isActive }) => (
                    <>
                        <div>{name}</div>
                        <div
                            className={cn(
                                "w-full h-0.5 bg-(--color-brand) transition-all duration-300",
                                "group-hover/nav:opacity-100",
                                isActive ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </>
                )}
            </NavLink>
        )
    }
)

NavMenuLink.displayName = "NavMenuLink"

export default NavMenuLink