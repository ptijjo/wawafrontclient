import ReserveForm from './components/ReserveForm'

const Reserver = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A] mt-15">
            <section className="flex flex-col md:flex-row items-center justify-between w-full gap-8 px-4 md:px-20 py-20">
                <ReserveForm />
                <div className='border text-[#D4AF37] w-1/2 h-96 flex items-center justify-center bg-black'>
                    image
                </div>
            </section>

        </main>
    )
}

export default Reserver