import Image from 'next/image'

export default function Logo({width = 70, height = 70}: {width?: number, height?: number}) {
  return (
    <>
      <Image
        src="/logo.webp"
        alt="Logo"
        width={width}
        height={height}
        className='rounded-2xl opacity-70'
      />
    </>
  )
}