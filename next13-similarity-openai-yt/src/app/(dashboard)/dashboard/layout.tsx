import React, { FC } from 'react'

interface layoutProps {
    children: React.ReactNode
}

const layout: FC<layoutProps> = ({ children }) => {
    return <section className='pt-20'>{children}</section>
}

export default layout