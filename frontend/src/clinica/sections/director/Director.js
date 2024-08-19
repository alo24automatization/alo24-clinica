import React, { useContext } from "react";
import { DirectorRouter } from "./DirectorRouter";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./navbar_and_footer/Navbar";
import { AuthContext } from "../../context/AuthContext";

export const Director = () => {
  const auth = useContext(AuthContext);
  if (auth.user.clinica.isClose) {
    setTimeout(() => {
      localStorage.removeItem("userData");
    }, 3000);

    return (
      <div className="w-full mt-[50px] flex justify-center items-center">
        <div className="text-white text-[32px] font-bold text-center">
          <div className="text-[200px] px-[100px] inline rounded-[50%] border-[5px] border-[#fff]">
            !
          </div>
          <div>DIQQAT!</div>
          <div>
            Abonent to'lovi amalga oshirilmaganligi sababli <br /> tizimga
            kirish vaqtincha cheklandi!
          </div>
          <div>Iltimos to'lovni amalga oshiring!</div>
          <div>Murojat uchun: +998(99)-223-42-44</div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Router>
        <Navbar clinica={auth?.clinica} />
        <DirectorRouter />
      </Router>
    </div>
  );
};
