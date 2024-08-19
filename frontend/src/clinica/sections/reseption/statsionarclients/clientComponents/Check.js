import React from 'react'

export const Check = ({ connector, qr }) => {
  return (
    <div>
      <div className="container px-5">
        <div className="row">
          <table className="table ">
            <tbody>
              <tr>
                <td>
                  <ul className="list-unstyled  text-start ml-3 mb-0">
                    <li
                      className=""
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        {' '}
                        {connector.clinica && connector.clinica.image}
                      </strong>
                    </li>
                    <li style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Manzil:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.address}
                    </li>
                    <li style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Bank:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.bank}
                    </li>
                    <li style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      {' '}
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        MFO:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.mfo}
                    </li>
                    <li style={{ textAlign: '', fontSize: '11pt' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        INN:
                      </strong>{' '}
                      {connector.clinica && connector.clinica.inn}
                    </li>
                    <li style={{ textAlign: '', fontSize: '11pt' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Hisob raqam:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.bankNumber}
                    </li>
                    <li style={{ textAlign: '', fontSize: '11pt' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Telefon raqam:{' '}
                      </strong>

                      {connector.clinica &&
                        connector.clinica.phone1 &&
                        '+998' + connector.clinica &&
                        connector.clinica.phone1}
                      <br />
                      {connector.clinica &&
                        connector.clinica.phone2 &&
                        '+998' + connector.clinica &&
                        connector.clinica.phone2}
                      <br />
                      {connector.clinica &&
                        connector.clinica.phone3 &&
                        '+998' + connector.clinica &&
                        connector.clinica.phone3}
                      <br />
                    </li>
                  </ul>
                </td>
                <td className="text-center">
                  <img
                    className="mr-3"
                    width="200"
                    src={connector.clinica && connector.clinica.image}
                    alt="logo"
                  />
                  <br />
                  {connector.probirka && connector.probirka ? (
                    <h6
                      className="d-inline-block"
                      style={{ fontSize: '27pt', fontFamily: 'times' }}
                    >
                      NAMUNA: {connector.probirka}
                    </h6>
                  ) : (
                    ''
                  )}
                  <div className="ml-3 fs-5">
                    {connector &&
                      new Date(connector.createdAt).toLocaleDateString() +
                        ' ' +
                        new Date(connector.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="text-right">
                  <img
                    width="140"
                    className="mr-3 d-inline "
                    src={qr && qr}
                    alt="QR"
                  />
                  <br />
                  <p className="pr-3 mr-1 mb-0 " style={{ fontSize: '11pt' }}>
                    Bu yerni skanerlang
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="invoice-from ps-4">
              <h6
                className="d-inline-block"
                style={{
                  textTransform: 'uppercase',
                  fontFamily: 'times',
                  fontSize: '14pt',
                }}
              >
                ID: {connector.client && connector.client.id}
              </h6>
            </div>
          </div>
          <div className="col-4">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '14pt', fontFamily: 'times' }}
              >
                F.I.O: {connector.client && connector.client.lastname}{' '}
                {connector.client && connector.client.firstname}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '14pt', fontFamily: 'times' }}
              >
                Yil:{' '}
                {new Date(
                  connector.client && connector.client.born,
                ).toLocaleDateString()}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-right pr-4">
              <h6
                className="d-inline-block"
                style={{ fontSize: '14pt', fontFamily: 'times' }}
              >
                Tel: +998{connector.client && connector.client.phone}
              </h6>
            </div>
          </div>

          <div className="col-lg-12">
            <div
              className="table-responsive"
              style={{ overflow: 'hidden', outline: 'none' }}
            >
              <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: '11pt', fontFamily: 'times' }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Bo'lim
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Navbat
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Soni
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Summasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {service.service.name}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.turn}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.service.price * service.pieces}
                          </td>
                        </tr>
                      )
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={4}
                      className="text-right font-weight-bold border border"
                    >
                      Jami:
                    </td>
                    <td className="text-right border font-weight-bold">
                      {connector.products &&
                        connector.services &&
                        connector.services.reduce((summ, service) => {
                          return (
                            summ +
                            service.service.price * parseInt(service.pieces)
                          )
                        }, 0) +
                          connector.products.reduce((summ, product) => {
                            return (
                              summ +
                              product.product.price * parseInt(product.pieces)
                            )
                          }, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className=" fs-5" style={{ fontFamily: 'Times' }}>
                Mijoz imzosi: ________________
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ border: '2px dashed black', margin: '50px 0' }}></div>
      <div className="container px-5">
        <div className="row">
          <table className="table ">
            <tbody>
              <tr>
                <td>
                  <ul className="list-unstyled  text-start ml-3 mb-0">
                    <li
                      className=""
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        {' '}
                        {connector.clinica && connector.clinica.image}
                      </strong>
                    </li>
                    <li style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Manzil:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.address}
                    </li>
                    <li style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Bank:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.bank}
                    </li>
                    <li style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      {' '}
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        MFO:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.mfo}
                    </li>
                    <li style={{ textAlign: '', fontSize: '11pt' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        INN:
                      </strong>{' '}
                      {connector.clinica && connector.clinica.inn}
                    </li>
                    <li style={{ textAlign: '', fontSize: '11pt' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Hisob raqam:{' '}
                      </strong>{' '}
                      {connector.clinica && connector.clinica.bankNumber}
                    </li>
                    <li style={{ textAlign: '', fontSize: '11pt' }}>
                      <strong style={{ fontSize: '11pt', fontFamily: 'times' }}>
                        Telefon raqam:{' '}
                      </strong>

                      {connector.clinica &&
                        connector.clinica.phone1 &&
                        '+998' + connector.clinica &&
                        connector.clinica.phone1}
                      <br />
                      {connector.clinica &&
                        connector.clinica.phone2 &&
                        '+998' + connector.clinica &&
                        connector.clinica.phone2}
                      <br />
                      {connector.clinica &&
                        connector.clinica.phone3 &&
                        '+998' + connector.clinica &&
                        connector.clinica.phone3}
                      <br />
                    </li>
                  </ul>
                </td>
                <td className="text-center">
                  <img
                    className="mr-3"
                    width="200"
                    src={connector.clinica && connector.clinica.image}
                    alt="logo"
                  />
                  <br />
                  {connector.probirka && connector.probirka ? (
                    <h6
                      className="d-inline-block"
                      style={{ fontSize: '27pt', fontFamily: 'times' }}
                    >
                      NAMUNA: {connector.probirka}
                    </h6>
                  ) : (
                    ''
                  )}
                  <div className="ml-3 fs-5">
                    {connector &&
                      new Date(connector.createdAt).toLocaleDateString() +
                        ' ' +
                        new Date(connector.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="text-right">
                  <img
                    width="140"
                    className="mr-3 d-inline "
                    src={qr && qr}
                    alt="QR"
                  />
                  <br />
                  <p className="pr-3 mr-1 mb-0 " style={{ fontSize: '11pt' }}>
                    Bu yerni skanerlang
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="invoice-from ps-4">
              <h6
                className="d-inline-block"
                style={{
                  textTransform: 'uppercase',
                  fontFamily: 'times',
                  fontSize: '14pt',
                }}
              >
                ID: {connector.client && connector.client.id}
              </h6>
            </div>
          </div>
          <div className="col-4">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '14pt', fontFamily: 'times' }}
              >
                F.I.O: {connector.client && connector.client.lastname}{' '}
                {connector.client && connector.client.firstname}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '14pt', fontFamily: 'times' }}
              >
                Yil:{' '}
                {new Date(
                  connector.client && connector.client.born,
                ).toLocaleDateString()}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-right pr-4">
              <h6
                className="d-inline-block"
                style={{ fontSize: '14pt', fontFamily: 'times' }}
              >
                Tel: +998{connector.client && connector.client.phone}
              </h6>
            </div>
          </div>

          <div className="col-lg-12">
            <div
              className="table-responsive"
              style={{ overflow: 'hidden', outline: 'none' }}
            >
              <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: '11pt', fontFamily: 'times' }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Bo'lim
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Navbat
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Soni
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Summasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {service.service.name}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.turn}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.service.price * service.pieces}
                          </td>
                        </tr>
                      )
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={4}
                      className="text-right font-weight-bold border border"
                    >
                      Jami:
                    </td>
                    <td className="text-right border font-weight-bold">
                      {connector.products &&
                        connector.services &&
                        connector.services.reduce((summ, service) => {
                          return (
                            summ +
                            service.service.price * parseInt(service.pieces)
                          )
                        }, 0) +
                          connector.products.reduce((summ, product) => {
                            return (
                              summ +
                              product.product.price * parseInt(product.pieces)
                            )
                          }, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className=" fs-5" style={{ fontFamily: 'Times' }}>
                Mijoz imzosi: ________________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
