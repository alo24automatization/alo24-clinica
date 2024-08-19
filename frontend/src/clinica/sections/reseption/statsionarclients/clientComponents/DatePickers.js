import React, {useState} from 'react'
import DatePicker from 'react-datepicker'

export const DatePickers = ({changeDate}) => {
    const [startDate, setStartDate] = useState()
    const years = Array.from(
        {length: 80},
        (v, k) => k + new Date().getFullYear() - 80,
    )
    const months = [
        'Yanvar',
        'Fevral',
        'Mart',
        'Aprel',
        'May',
        'Iyun',
        'Iyul',
        'Avgust',
        'Sentabr',
        'Oktabr',
        'Noyabr',
        'Dekabr',
    ]
    return (
        <div
            className="form-control form-control-sm"
            style={{overflow: 'hidden'}}
        >
            <DatePicker
                onSelect={(e) => {
                    changeDate(e)
                }}
                dateFormat="dd/MM/yyyy"
                renderCustomHeader={({
                                         date,
                                         changeYear,
                                         changeMonth,
                                         decreaseMonth,
                                         increaseMonth,
                                         prevMonthButtonDisabled,
                                         nextMonthButtonDisabled,
                                     }) => (
                    <div
                        style={{
                            margin: 10,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            {'<'}
                        </button>
                        <select
                            value={new Date(date).getFullYear()}
                            onChange={({target: {value}}) => changeYear(value)}
                            className="border"
                        >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                            <option defaultValue={new Date().getFullYear()}>
                                {new Date().getFullYear()}
                            </option>
                        </select>

                        <select
                            className="border"
                            value={months[new Date(date).getMonth()]}
                            onChange={({target: {value}}) =>
                                changeMonth(months.indexOf(value))
                            }
                        >
                            {months.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            {'>'}
                        </button>
                    </div>
                )}
                selected={startDate}
                isClearable
                placeholderText="17/04/1994"
                onChange={(date) => setStartDate(date)}
            />
        </div>
    )
}
