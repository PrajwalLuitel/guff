"use client";

import { pusherClient } from '@/utils/pusher';
import { toPusherKey } from '@/utils/uitls';
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsSidebarOptionsProps {
    initialUnseenRequestCount: number;
    sessionId: string
}

const FriendRequestsSidebarOptions: FC<FriendRequestsSidebarOptionsProps> = ({sessionId, initialUnseenRequestCount}) => {


    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
        initialUnseenRequestCount
    )

    const friendRequestHandler = () => {
        setUnseenRequestCount((prev) => prev + 1)
    }

    const addedFriendHandler = () => {
        setUnseenRequestCount((prev) => prev - 1)
    }
    
    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        );
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));
        
        pusherClient.bind("incoming_friend_requests", friendRequestHandler);
        pusherClient.bind('new_friend', addedFriendHandler);
        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
            pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
            
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
            pusherClient.unbind('new_friend', addedFriendHandler);

            }
    },[sessionId])


    return <Link href='/dashboard/requests' className="text-gray-700 hover:text-emerald-700 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ">
        <div className="text-emerald-700 border-emerald-200 group-hover:border-emerald-700 group-hover:text-emerald-700 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text=[0.625rem] font-medium bg-white ">
            <User className='h-4 w-4'/>
        </div>
        <p className='truncate' >
            Friend Requests
        </p>

        {unseenRequestCount > 0 ? (
            <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-emerald-800'>
                {unseenRequestCount}
            </div>
        ): null}

  </Link>
}

export default FriendRequestsSidebarOptions