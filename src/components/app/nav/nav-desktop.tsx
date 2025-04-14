"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { mainItems, MenuItem } from "./nav-data"
import Logo from "@/components/logo"


export function NavDesktop() {
  return (
    <NavigationMenu >
      <NavigationMenuList>
        <NavigationMenuItem value="logo">
          <NavigationMenuTrigger>
            <Logo />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[260px]  ">
              {mainItems.map((item, i) => (
                <NavLink
                  key={i}
                  href={item.href}
                  item={item}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}


interface NavLinkProps extends LinkProps {
  className?: string;
  item: MenuItem;
}

function NavLink({
  item,
  ...props
}: NavLinkProps) {
  return (<li>
    <NavigationMenuLink asChild>
      <Link
        {...props}
        className={cn(
          "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ",
          "hover:bg-background hover:text-accent-foreground",
          "focus-visible:bg-background focus-visible:text-accent-foreground",
        )}
      >
        <div className="group flex flex-col">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium leading-none">{item.label}</div>
            {item.icon && <item.icon className="size-6 text-muted-foreground group-focus-visible:text-pink-500 group-hover:text-pink-500" />}
          </div>
        </div>
      </Link>
    </NavigationMenuLink>
  </li>)
}
