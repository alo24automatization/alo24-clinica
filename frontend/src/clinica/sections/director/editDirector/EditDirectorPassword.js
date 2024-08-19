import React, { useCallback, useEffect, useState, useContext } from "react";
import { Input, FormControl, FormLabel, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../../../context/AuthContext";
import {  checkDirectorUpdatePassword } from "../../../loginAndRegister/checkData";
import { useHttp } from "../../../hooks/http.hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export const EditDirectorPassword = () => {
  //====================================================================
  //====================================================================
  const toast = useToast();

  const notify = useCallback(
    (data) => {
      toast({
        title: data.title && data.title,
        description: data.description && data.description,
        status: data.status && data.status,
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast]
  );
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const { request,  loading } = useHttp();
  const auth = useContext(AuthContext);

  const [director, setDirector] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword:""
  });
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const styled = {
    borderColor: "#eee",
    boxShadow: "none",
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const changeHandler = (e) => {
    setDirector({ ...director, [e.target.name]: e.target.value });
  };

  const updateHandler = async () => {
    if (checkDirectorUpdatePassword(director)) {
      return notify(checkDirectorUpdatePassword(director));
    }
    try {
      const data = await request("/api/director/updatepassword", "PUT", {
        ...director,
        directorId: auth.userId,
      });
      notify({
        title: `Tabriklaymiz ${
          auth.user.firstname + " " + auth.user.lastname
        }! Parolingiz yangilandi.`,
        description: "",
        status: "success",
      });
      localStorage.setItem("director", data);
      // window.location.reload();
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const keyPressed = (e) => {
    if (e.key === "Enter") {
      return updateHandler();
    }
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  useEffect(() => {

  }, []);
  //====================================================================
  //====================================================================

  return (
    <>
      {/* {loading ? <Loader /> : ""} */}
      <div className="page-content mt-5 container-fluid">
        <div className="row">
          <div className="col-xl-7 mx-auto">
            <div className="card " style={{ borderTop: "4px solid #38B2AC " }}>
              <div className="card-body p-5">
                <div
                  className="card-title d-flex align-items-center"
                  style={{ fontSize: "20pt", color: "#38B2AC" }}
                >
                  <div>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <h5 className="mb-0 fs-5 ml-2" style={{ fontWeight: "600" }}>
                    Direktor
                  </h5>
                </div>
                <hr />
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          className="m-0 mt-3"
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Hozirgi parol
                        </FormLabel>
                        <Input
                          id="password"
                          defaultValue={
                            director &&
                            director.oldpassword &&
                            director.oldpassword
                          }
                          onKeyUp={keyPressed}
                          className="is-valid"
                          placeholder="Hozirgi parolni kiriting"
                          size="sm"
                          style={styled}
                          onChange={changeHandler}
                          name="oldpassword"
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Yangi parol
                        </FormLabel>
                        <Input
                          id="newpassword"
                          defaultValue={
                            director &&
                            director.newpassword &&
                            director.newpassword
                          }
                          onKeyUp={keyPressed}
                          placeholder="Yangi parolni kiriting"
                          size="sm"
                          style={{ borderColor: "#eee", boxShadow: "none" }}
                          name="newpassword"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Yangi parolni qayta kiritish
                        </FormLabel>
                        <Input
                          id="confirmpassword"
                          defaultValue={
                            director &&
                            director.confirmpassword &&
                            director.confirmpassword
                          }
                          onKeyUp={keyPressed}
                          placeholder="Yangi parolni qayta kiriting"
                          size="sm"
                          style={{ borderColor: "#eee", boxShadow: "none" }}
                          name="confirmpassword"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-6 text-center mt-3">
                    {loading ? (
                      <Button
                        isLoading
                        colorScheme="teal"
                        variant="solid"
                      ></Button>
                    ) : (
                      <Button
                        className="d-block w-100"
                        colorScheme="teal"
                        variant="solid"
                        onClick={updateHandler}
                      >
                        Saqlash
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
