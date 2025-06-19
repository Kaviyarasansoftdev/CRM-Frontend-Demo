import React from 'react'

export default function OutlookPage() {
    return (
        <section className="bg-white border rounded-2xl">
            <div className='p-3'>
                <iframe src="https://outlook.office.com/mail/" width="100%" height="600px" style={{ border: "none" }} ></iframe>
            </div>
        </section>
    )
}
