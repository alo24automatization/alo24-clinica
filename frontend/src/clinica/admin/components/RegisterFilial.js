import Select from 'react-select'
import React from 'react'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

const RegisterFilial = ({
    checkData,
    loading,
    changeMainClinica,
    clinicas,
    selectedFilial,
    changeFilial,
    mainClinica
}) => {
    return (
        <div className="row gutters">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Filiallarni bog'lash</div>
                    </div>
                    <div className="card-body">
                        <div className="row gutters">
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="fullName">Bosh shifoxona</label>
                                    <Select
                                        value={mainClinica}
                                        onChange={changeMainClinica}
                                        components={animatedComponents}
                                        options={clinicas}
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 0,
                                            padding: 0,
                                            height: 0,
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="inputEmail">Filiallar</label>
                                    <Select
                                        value={selectedFilial}
                                        onChange={changeFilial}
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        options={clinicas}
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 0,
                                            padding: 0,
                                            height: 0,
                                        })}
                                        isMulti
                                    />
                                </div>
                            </div>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="text-right">
                                    {loading ? (
                                        <button className="bg-alotrade rounded text-white py-2 px-3" disabled>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Loading...
                                        </button>
                                    ) : (
                                        <button onClick={checkData} className="bg-alotrade rounded text-white py-2 px-3">
                                            Saqlash
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterFilial