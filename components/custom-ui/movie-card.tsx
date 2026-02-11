import { Card, CardContent, CardFooter } from '../ui/card'
import Image from 'next/image'

const MovieCard = () => {
    const bgUrl = 'https://image.tmdb.org/t/p/w342/wkhcqUXVi2J7kmZk0x6cnDn5GBK.jpg'
    const bgStyle = {
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }
    return (
        <Card className='group/card cursor-pointer truncate flex flex-col p-0 bg-transparent shadow-none ring-0 duration-300 hover:scale-102 transition-transform relative'>
            <CardContent
                style={bgStyle}
                className='flex-1 p-0.5 rounded-lg overflow-hidden ring-0 group-hover/card:ring-1 group-hover/card:ring-primary group-hover/card:ring-inset group-hover/card:shadow-lg group-hover/card:shadow-primary/20 transition-all'
            >
                <Image src={bgUrl} alt='movie-card' width={200} height={200} className=' w-full h-full object-cover rounded-lg' />
            </CardContent>
            <CardFooter className='shadow-none ring-0 py-0 px-2 text-center w-full flex items-center justify-center'>
                <p className='text-foreground/80 font-medium text-base truncate group-hover/card:text-foreground'>Prawnik z Linkolna</p>
            </CardFooter>
        </Card>


    )
}

export default MovieCard