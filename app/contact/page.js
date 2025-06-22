import React from 'react'
import Link from 'next/link'

const contactUs = () => {
    return (
        <>
            <div className='mx-auto max-w-lg bg-red-200 my-16 p-8 rounded-lg scale-90 shadow-lg translate-y-20 md:scale-100 md:translate-y-0'>
                <h1 className='font-bold text-2xl text-center mb-3 underline'>Contact Us</h1>
                <p className='text-center mb-4'>For any inquiries, please reach out to us at:</p>
                <p className='text-center font-semibold'><a href="mailto:shivanshu1221@gmail.com">shivanshu1221@gmail.com</a></p>
            </div>
            <div className='flex justify-center items-center'>
                <button className='bg-red-200 hover:bg-red-300 px-2 py-1 border shadow-lg rounded-lg text-center mt-16'><Link href={"/"}>Home 🏠</Link></button>
            </div>
        </>
    )
}

export default contactUs