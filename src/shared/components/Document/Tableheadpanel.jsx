/* eslint-disable react/prop-types */
import useAuth from '../../services/store/useAuth';

export default function Tableheadpanel(props) {
    const { addform, Clientdata } = props;
    const { userdetails } = useAuth();

    return (
        <>
            <div className="flex flex-col items-center justify-between px-6 py-4 space-y-4 lg:flex-row lg:space-y-0">
                <div className=''>
                    <table className="border border-black text-sm">
                        <tr className='border-b border-black'>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Region</td>
                            <td className='border-r border-black p-1'>{Clientdata.Region}</td>
                            <td className='border-r border-black p-1 bg-gray-200 font-bold'>Customer Name</td>
                            <td className='p-1'>{Clientdata.Name}</td>   
                        </tr>
                        <tr className='border-b border-black'>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Location</td>
                            <td className='border-r border-black p-1'>{Clientdata.Location}</td>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Company Name</td>
                            <td className='p-1'>{Clientdata.Company_Name}</td>  
                        </tr>
                        <tr className='border-b border-black'>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Product</td>
                            <td className='border-r border-black p-1'>{Clientdata.Product}</td>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Campaign Name</td>
                            <td className='p-1'>{Clientdata.Campaign_Name}</td>  
                        </tr>
                        <tr className='border-b border-black'>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Mobile</td>
                            <td className='border-r border-black p-1'>{Clientdata.Mobile1}</td>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Alternative</td>
                            <td className='p-1'>{Clientdata.Alternative}</td>  
                        </tr>
                        <tr>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Loan Product</td>
                            <td className='border-r border-black p-1'>{Clientdata.Loan_Product}</td>
                            <td className='border-r border-black p-1 font-bold bg-gray-200'>Financiers Name</td>
                            <td className='p-1'>{Clientdata.Financiers_Name}</td>  
                        </tr>
                    </table>
                </div>

                <div className="md:flex items-center px-2 py-2 lg:flex-row gap-x-2">
                    <div className="flex mb-3 md:mb-0 justify-between">
                        {userdetails()?.Role === 'SuperAdmin' && (
                            <button onClick={addform} className="md:me-2 inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-md shadow-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                                <i className="fi fi-rr-add"></i> <span className="hidden 2xl:block">Add New</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
