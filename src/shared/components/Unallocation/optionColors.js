
export const getDispositionColor = (option) => {
    switch (option) {
        case 'Submit Lead':
            return '#FF99C8';
        case 'Not Int':
            return '#FEC8C3';
        case 'Call Back':
            return '#FCF6BD';
        case 'DNE':
            return '#D0F4DE';
        case 'Followup':
            return '#A9DEF9';
        case 'Future Followup':
            return '#E4C1F9';
        case 'Lead Submitted':
            return '#22F038';
        case 'Lead Accepted':
            return '#C8B6FF';
        case 'Lead Declined':
            return '#EA720D';
        default:
            return null;
    }
};

export const getSubDispositionColor = (option) => {
    switch (option) {
        case 'Docs to be collected':
        case 'Login Pending':
        case 'Interested':
            return '#FBB1BD';
        case 'No Need Loan':
        case 'No Need as of Now':
        case 'High ROI':
        case 'Recently Availed':
        case 'Reason Not Mentioned':
            return '#E6B8A2';
        case 'RNR':
        case 'Call Waiting':
        case 'Call Not Reachable':
        case 'Busy Call after Some time':
            return '#DDE5B6';
        case 'Wrong No':
        case 'Call Not Connected':
        case 'Doesnt Exisit':
        case 'Customer is irate':
        case 'Switched Off':
            return '#95D5B2';
        case 'Option M':
        case 'Option N':
        case 'Option O':
            return '#00B4D8';
        case 'Option W':
        case 'Option X':
        case 'Option Y':
            return '#FF8FAB';
        case 'Logged WIP':
        case 'In Credit':
        case 'ABND':
        case 'Login Pending':
        case 'Declined Re-look':
        case 'Fully Declined':
        case 'Docs to be collected':
            return '#9688C0';
        case 'Customer Cancelled':
            return '#9687C0';
        default:
            return null;
    }
};
