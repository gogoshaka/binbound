import { i18n } from 'i18next'
import React from 'react'

export const LogoBase = ({ i18n, lng }: { i18n: i18n, lng: string}) => {
    const t = i18n.getFixedT(lng, "logo")
    return (
    <div className='text-slate-900'>
        <div className='flex'>
            <div className='text-4xl font-thin logo'>
                <span className='text-gray-600'>Bin</span><span className='text-gray-400'>Bound</span>
            </div>
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="35,26 20,50 35,71" stroke="#000" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="65,26 80,50 65,71" stroke="#000" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="47" y1="26" x2="53" y2="71" stroke="#D30000" strokeWidth="7" strokeLinecap="round" />
            </svg>
        </div>

        <div>
            {/* {t('headline')} */}
        </div>

    </div>

    )
}