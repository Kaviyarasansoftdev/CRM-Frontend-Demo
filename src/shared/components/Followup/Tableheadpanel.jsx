export default function Tableheadpanel (  ) {
   
    return (
        <div className="items-center justify-between px-6 py-1 space-y-3 lg:space-y-0 lg:flex">
            <div>
                <h2 className="mx-1 text-xl font-semibold text-gray-800">
                    Follow Up
                </h2>
            </div>
            <div>
                <div className="inline-flex lg:gap-x-2 gap-x-3">
                    <input type="text" placeholder="Search..." className="px-4 py-2 border outline-none rounded-xl" onChange={(e) => setglobalfilter(e.target.value)} />
                </div>
            </div>
            
        </div>
    );
}