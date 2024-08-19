import React from 'react';

const Prepayment = ({
                        inputPayment,
                        totalpayment,
                        checkPayment,
                        debtComment,
                        changeDebt,
                        serviceComment,
                        productComment,
                        discountComment,
                        discount,
                        changeDiscount,
                        setPayment,
                        changeProduct,
                        changeService,
                        discounts,
                        payments,
                        payment,
                        client,
                        index,
                        services,
                        products,
                        setSetvices,
                        setProducts,
                        loading,
                        connector
                    }) => {
    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">
                    To'lov qabul qilish
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend w-25">
                                                <span
                                                    className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                                    id="inputGroup-sizing-sm"
                                                    style={{fontSize: "9pt"}}>
                                                    Chegirma
                                                </span>
                                </div>
                                {
                                    discount.procient ?
                                        <input
                                            onChange={changeDiscount}
                                            type="number"
                                            className="form-control"
                                            placeholder="Chegirma foizi yoki summasini kiriting"
                                            defaultValue={discount.discount}
                                        /> : <input
                                            onChange={changeDiscount}
                                            type="number"
                                            className="form-control"
                                            placeholder="Chegirma foizi yoki summasini kiriting"
                                            value={discount.discount || 0}
                                        />}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend w-25">
                                    <label
                                        className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                        htmlFor="inputGroupSelect01"
                                        style={{fontSize: "9pt"}}
                                    >
                                        Izoh</label>
                                </div>
                                <select
                                    onChange={discountComment}
                                    className="custom-select"
                                    id="inputGroupSelect01"
                                >
                                    <option value="delete">Tanglang</option>
                                    <option value="Kam ta'minlangan">Kam ta'minlangan</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend w-25">
                                                <span
                                                    className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                                    id="inputGroup-sizing-sm"
                                                    style={{fontSize: "9pt"}}>
                                                    Qarz
                                                </span>
                                </div>
                                <input
                                    onChange={changeDebt}
                                    type="number"
                                    className="form-control"
                                    placeholder="Qarz summasini kiriting"
                                    value={payment.debt || 0}
                                />
                            </div>
                        </div>
                        <div className="form-group m-0 mb-3">
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend w-25">
                                                <span
                                                    className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                                    id="inputGroup-sizing-sm"
                                                    style={{fontSize: "9pt"}}>
                                                    Izoh
                                                </span>
                                </div>
                                <input
                                    onChange={debtComment}
                                    type="text"
                                    className="form-control"
                                    placeholder="Qarz izohini kiriting"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 ">
                        <div className="btn-group mb-3 w-100" role="group" aria-label="Basic example">
                            <button
                                onClick={() => {
                                    setPayment({
                                        ...payment,
                                        type: "cash",
                                        cash: payment.payment,
                                        card: 0,
                                        transfer: 0
                                    })
                                }}
                                type="button"
                                className={`btn btn-sm py-1 ${payment.type === "cash" ? "btn-warning" : "btn-success"}`}
                            >
                                Naqt
                            </button>
                            <button
                                onClick={() => {
                                    setPayment({
                                        ...payment,
                                        type: "card",
                                        cash: 0,
                                        card: payment.payment,
                                        transfer: 0
                                    })
                                }}
                                type="button"
                                className={`btn btn-sm py-1 ${payment.type === "card" ? "btn-warning" : "btn-success"}`}
                            >
                                Plastik
                            </button>
                            <button
                                onClick={() => {
                                    setPayment({
                                        ...payment,
                                        type: "transfer",
                                        cash: 0,
                                        card: 0,
                                        transfer: payment.payment
                                    })
                                }}
                                type="button"
                                className={`btn btn-sm py-1 ${payment.type === "transfer" ? "btn-warning" : "btn-success"}`}
                            >
                                O'tkazma
                            </button>
                            <button
                                onClick={() => {
                                    setPayment({
                                        ...payment,
                                        type: "mixed",
                                        cash: 0,
                                        card: 0,
                                        transfer: 0
                                    })
                                }}
                                type="button"
                                className={`btn btn-sm py-1 ${payment.type === "mixed" ? "btn-warning" : "btn-success"}`}
                            >
                                Aralash
                            </button>
                        </div>
                        {(payment.type === "cash" || payment.type === "mixed") &&
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend w-25">
                                                <span
                                                    className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                                    id="inputGroup-sizing-sm"
                                                    style={{fontSize: "9pt"}}>
                                                    Naqt
                                                </span>
                                </div>
                                <input
                                    disabled={payment.type === "cash"}
                                    type="number"
                                    className="form-control"
                                    placeholder="Naqt to'lov"
                                    value={payment.cash || 0}
                                    name="cash"
                                    onChange={inputPayment}
                                />
                            </div>}
                        {(payment.type === "card" || payment.type === "mixed") &&
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend w-25">
                                                <span
                                                    className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                                    id="inputGroup-sizing-sm"
                                                    style={{fontSize: "9pt"}}>
                                                    Plastik
                                                </span>
                                </div>
                                <input
                                    disabled={payment.type === "card"}
                                    type="number"
                                    className="form-control"
                                    placeholder="Karta orqali to'lov to'lov"
                                    value={payment.card || 0}
                                    name="card"
                                    onChange={inputPayment}
                                />
                            </div>}
                        {(payment.type === "transfer" || payment.type === "mixed") &&
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend w-25">
                                                <span
                                                    className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                                    id="inputGroup-sizing-sm"
                                                    style={{fontSize: "9pt"}}>
                                                    O'tkazma
                                                </span>
                                </div>
                                <input
                                    disabled={payment.type === "transfer"}
                                    type="number"
                                    className="form-control"
                                    placeholder="O'tkazma to'lov"
                                    value={payment.transfer || 0}
                                    name="transfer"
                                    onChange={inputPayment}
                                />
                            </div>}

                    </div>
                </div>

            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3">
                <div className="text-right">
                    {loading ? (
                        <button className="btn btn-warning" disabled>
                            <span className="spinner-border spinner-border-sm"></span>
                            Loading...
                        </button>
                    ) : (
                        <button onClick={checkPayment} className="btn btn-warning w-100">
                            Qabul qilish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Prepayment;
