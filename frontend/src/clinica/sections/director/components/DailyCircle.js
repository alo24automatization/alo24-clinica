import React from 'react'

function DailyCircle({ label, text, nth }) {
    const circleBorderStyles = (nth) => {
        switch (nth) {
            case 1:
                return 'border-warning-400 shadow-[0_0_25px_rgb(253,176,34)]'
            case 2:
                return 'border-success-400 shadow-[0_0_25px_rgb(18,183,106)]'
            case 3:
                return 'border-error-400 shadow-[0_0_25px_rgb(240,68,56)]'
            default:
                return 'border-primary-700 shadow-[0_0_25px_rgb(0,180,204)]'
        }
    }
    return (
        <div
            className={`daily-circle w-[12.5rem] h-[12.5rem] rounded-full border-[5.5px] bg-transparent shadow-inner-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[1px] flex items-center justify-center ${circleBorderStyles(nth)}`}>
            <div
                className='main-circle w-[10.625rem] h-[10.625rem] bg-background shadow-[0_30px_50px_rgba(0,0,0,0.25)] hover:shadow-none transition-all ease-linear duration-200 rounded-full flex items-center justify-center flex-col'>
                <h3 className={`text-black-700 font-bold text-[1.5rem] leading-[2.375rem]`}>{text}</h3>
                <h5 className={'text-black-500 font-semibold text-[1rem] leading-[1.75rem]'}>{label}</h5>
            </div>
        </div>
    )
}

export default DailyCircle