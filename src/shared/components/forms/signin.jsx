/* eslint-disable react/prop-types */
const SignIn = (props) => {

    const { handlechange, handlelogin } = props;

    return (
        <section className="relative flex items-center justify-center overflow-hidden bg-no-repeat bg-cover h-dvh">
            <div className="max-w-[30rem] w-full px-4 md:px-6  mx-auto">
                <div className="">
                    <img src="/images/logo.svg" alt="" />
                </div>
                <div className="grid grid-cols-1 px-2 mb-10 2xl:mb-0 ">
                    <div className="relative">
                        <div className="relative z-10 p-10 overflow-hidden bg-white border rounded-xl">
                            <div className="mb-10">
                                <h1 className="text-2xl font-semibold text-primary">Sign In</h1>
                            </div>
                            <form className="space-y-5" onSubmit={handlelogin}>
                                <div>
                                    <input type="text" onChange={handlechange} name="UserName" id="UserName " className="w-full px-4 py-3 border outline-none rounded-xl placeholder-slate-500" placeholder="Username" required/>
                                </div>
                                <div>
                                    <input type="password" onChange={handlechange} name="Password" id="Password" className="w-full px-4 py-3 border outline-none rounded-xl placeholder-slate-500" placeholder="Password" required/>
                                </div>
                                <div>
                                    <button type="submit" className="w-full px-4 py-3 text-white bg-green-400 border rounded-xl">
                                        Sign In
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignIn;