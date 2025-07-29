export default function Footer()
{
    return(
        <div className="flex flex-col items-center bg-[#e7dbc6] p-4 gap-2 justify-end">
            <img src="internet.png" alt="" className="h-10 w-10"/>
            <div className="flex flex-col  items-center">
                <p className='text-[#5c4928] text-xs text-center pb-4'>BRAINY — A personal project powered by free weather APIs.  Data and icons are credited to their rightful owners.</p>
                <p className='text-[#5c4928] text-xs '>Get to know me better: <a href="https://juliusasheraustria.vercel.app/" className="underline">juliusasheraustria.vercel.app</a> </p>
                <p className="text-[#5c4928] text-xs">© {new Date().getFullYear()} All rights reserved.</p>
               <p className='text-[#5c4928] text-xs '>Made by Joash </p>
               </div>
        </div>
    );
}