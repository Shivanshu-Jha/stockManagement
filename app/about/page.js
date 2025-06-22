import React from 'react'
import Link from 'next/link'


const About = () => {
    return (
        <>

            <div className='mx-auto max-w-2xl bg-red-200 my-16 p-8 rounded-lg shadow-lg scale-90 md:scale-100'>
                <h1 className='font-bold text-2xl text-center mb-3 underline'>About Stock Management</h1>
                <p className='text-sm mb-4'>
                    Welcome to our Stock Management System! This application is designed to help you efficiently manage your stock items with ease.
                    Whether you are a small business owner or just looking to keep track of your personal inventory, our system provides a simple and intuitive interface to add, update, and delete stock items.
                </p>
                <p className='text-sm mb-4'>
                    With features like item categorization, stock level tracking, and user-friendly navigation, you can quickly find what you need and ensure your stock is always up to date.
                    Our goal is to streamline your stock management process, saving you time and effort.
                </p>

            </div>

            <div className='flex justify-center items-center'>
                <button className='bg-red-200 hover:bg-red-300 px-2 py-1 border shadow-lg rounded-lg text-center'><Link href={"/"}>Home 🏠</Link></button>
            </div>
        </>
    )
}

export default About