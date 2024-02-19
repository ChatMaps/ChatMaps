function Home() {
    return (
        <div>
            <div className="absolute right-[6%] top-[4%]">
                <button>Download</button>
            </div>
            <div className="grid h-screen place-items-center">
                <div>
                    <img src="logos/logo_transparent_inverse.png"/>
                    <span className="text-[36px]">
                        Chat with friends!
                    </span>
                    <div className="m-5">
                        <button>Login</button>
                        <button>Signup</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;