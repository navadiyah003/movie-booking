import DataTable from "react-data-table-component";
import {PiSpinnerGapThin} from 'react-icons/pi'

export const CustomDataTable = ({ columns, data, className, ...rest }) => {
    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                className={className}               
                
                progressComponent={<div className="animate-spin"><PiSpinnerGapThin size={40} /></div>}
                {...rest}
                // noHeader // Hide the default table header
                customStyles={{
                    headRow: {
                        style: {
                            // Center the column names (headers)
                            // textAlign: 'center',
                            // backgroundColor: '#4f46e580', // Change the background color of the column headers
                            // color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '15px',
                        },
                    },
                }}
            />
        </>
    )
}
