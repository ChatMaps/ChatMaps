async function Home() {
    
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
                        <a href="/login"><button>Login</button></a>
                        <a href="/register"><button>Signup</button></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;