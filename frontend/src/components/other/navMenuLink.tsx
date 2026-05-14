import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

interface NavMenuLinkProps {
    name: string;
    to?: string;
    active?: boolean;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>; // Thêm kiểu cho onClick ở đây
}

export const NavMenuLink = React.forwardRef<HTMLAnchorElement, NavMenuLinkProps>(
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
                        (isActive || props.active) && "text-(--color-brand)"
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
                                (isActive || props.active) ? "opacity-100" : "opacity-0"
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