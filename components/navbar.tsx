import React from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'

const NavBar = ({
  apiLimitCount = 0,
  isPro
}:{
  apiLimitCount: number,
  isPro: boolean,
}) => {
  return (
    <div className="flex items-center p-4">
        <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro}/>
        <div className="flex w-full justify-end">
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}

export default NavBar
