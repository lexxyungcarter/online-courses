import { FC } from 'react'

import type {Metadata} from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ApiDashboard from '@/components/ApiDashboard';
import RequestApiKey from '@/components/RequestApiKey';

export const metadata: Metadata = {
    title: 'Similarity API | Dashboard',
    description: 'Free and open source similarity API'
}

const page = async () => {
    const session = await getServerSession(authOptions);

    if(!session) return notFound();

    const apiKey = await db.apiKey.findFirst({
        where: {
            userId: session.user.id,
            enabled: true,
        }
    })
    return <div className='max-w-7xl mx-auto mt-16'>
        {apiKey ? (
            // @ts-expect-error Server Component
            <ApiDashboard />
        ): <RequestApiKey />}
    </div>
}

export default page