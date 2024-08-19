import React from 'react'

const CheckboxCard = ({text, onchange, market, value}) => {
    return (
        <div className='checkbox-card'>
            <input type='flex items-center justify-center' checked={value}
                   onChange={(e) => onchange(market, text === 'Aloqa' ? 1 : 2, e.target.checked)} />
        </div>
    )
}

export default CheckboxCard