import React, { useCallback, useEffect, useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Button,
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";
import { FileUpload } from "./fileUpLoad/FileUpload";
import { useHttp } from "../hooks/http.hook";
import { useToast } from "@chakra-ui/react";
import { checkDirectorData } from "./checkData";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../loader/Loader";

export const DirectorRegistor = ({ onFinishCreate, directorData }) => {
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
  const [load, setLoad] = useState(false);

  const { request, loading } = useHttp();


  const [director, setDirector] = useState({
    image: null,
  });
  //====================================================================
  //====================================================================
  //====================================================================
  //====================================================================
  const [baseUrl, setBaseUrl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request("/api/baseurl", "GET", null);
      setBaseUrl(data.baseUrl);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);
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
  const handleImage = async (e) => {
    if (director.image) {
      return notify({
        title: "Diqqat! Surat avval yuklangan",
        description:
          "Suratni qayta yulash uchun suratni ustiga bir marotaba bosib uni o'chiring!",
        status: "error",
      });
    }
    const files = e.target.files[0];
    const data = new FormData();
    data.append("file", files);
    setLoad(true);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const file = await res.json();
    setDirector({ ...director, image: file.filename });
    setLoad(false);
    notify({
      status: "success",
      description: "",
      title: "Surat muvaffaqqiyatli yuklandi",
    });
  };

  const removeImage = async (filename) => {
    try {
      const data = await request(`/api/upload/del`, "POST", { filename });
      setDirector({ ...director, image: null });
      document.getElementById("default-btn").value = null;
      notify({
        status: "success",
        description: "",
        title: data.accept,
      });
    } catch (error) {
      notify({
        status: "error",
        description: "",
        title: error,
      });
    }
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const changeHandler = (e) => {
    setDirector({ ...director, [e.target.name]: e.target.value });
  };

  const history = useHistory();

  const onHandler = () => {
    if (director?._id) {
      updateHandler()
    } else {
      createHandler()
    }
  }

  const createHandler = async () => {
    if (checkDirectorData(director)) {
      return notify(checkDirectorData(director));
    }
    try {
      const data = await request("/api/director/register", "POST", {
        ...director,
      });
      localStorage.removeItem('clinicaData')
      localStorage.setItem(
        "director",
        JSON.stringify({
          director: data,
        })
      );
      notify({
        title: `Tabriklaymiz ${data?.user?.firstname + " " + director?.user?.lastname
          }! Siz uchun direktor bo'limi ham muvaffaqqiyatli yaratildi.`,
        description: "",
        status: "success",
      });
      onFinishCreate()
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };

  const updateHandler = async () => {
    if (checkDirectorData(director)) {
      return notify(checkDirectorData(director));
    }
    try {
      const data = await request("/api/director/update", "PUT", {
        ...director,
      });
      localStorage.setItem(
        "director",
        JSON.stringify({
          director: data,
        })
      );
      notify({
        title: `Tabriklaymiz ${director.firstname + " " + director.lastname
          }! Siz uchun direktor bo'limi ham muvaffaqqiyatli yaratildi.`,
        description: "",
        status: "success",
      });
      onFinishCreate()
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
      return onHandler();
    }
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  useEffect(() => {
    getBaseUrl();
  }, [getBaseUrl]);

  useEffect(() => {
    setDirector(directorData);
  }, [directorData])

  useEffect(() => {
    const clinica = JSON.parse(localStorage.getItem("clinicaData"));
    if (clinica?.clinica?._id) {
      setDirector({ ...director, clinica: clinica?.clinica?._id })
    }
  }, [])

  //====================================================================
  //====================================================================

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="page-content container-fluid">
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
              <form className="row g-3">
                <div className="col-md-6">
                  <div className="col-md-12">
                    <FormControl isRequired>
                      <FormLabel
                        style={{ color: "#38B2AC", marginTop: "1rem" }}
                      >
                        Ism
                      </FormLabel>
                      <Input
                        onKeyUp={keyPressed}
                        className="is-valid"
                        placeholder="Ismni kiriting"
                        size="sm"
                        style={styled}
                        value={director.firstname && director.firstname}
                        onChange={changeHandler}
                        name="firstname"
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-12">
                    <FormControl isRequired>
                      <FormLabel
                        style={{ color: "#38B2AC", marginTop: "1rem" }}
                      >
                        Familiya
                      </FormLabel>
                      <Input
                        onKeyUp={keyPressed}
                        placeholder="Familiya kiriting"
                        size="sm"
                        style={{ borderColor: "#eee", boxShadow: "none" }}
                        name="lastname"
                        value={director.lastname && director.lastname}
                        onChange={changeHandler}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-12">
                    <FormControl>
                      <FormLabel
                        style={{ color: "#38B2AC", marginTop: "1rem" }}
                      >
                        Otasining ismi
                      </FormLabel>
                      <Input
                        onKeyUp={keyPressed}
                        placeholder="Otasini ismini kiriting"
                        size="sm"
                        style={{ borderColor: "#eee", boxShadow: "none" }}
                        value={director.fathername && director.fathername}
                        name="fathername"
                        onChange={changeHandler}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-12">
                    <FormControl isRequired>
                      <FormLabel
                        style={{ color: "#38B2AC", marginTop: "1rem" }}
                      >
                        Phone
                      </FormLabel>
                      <InputGroup>
                        <InputLeftAddon
                          children="+998"
                          style={{ height: "32px" }}
                        />
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Telefon nomerni kiriting"
                          size="sm"
                          type="number"
                          style={{ borderColor: "#eee", boxShadow: "none" }}
                          value={director.phone && director.phone}
                          name="phone"
                          onChange={changeHandler}
                        />
                      </InputGroup>
                    </FormControl>
                  </div>
                  <div className="col-md-12">
                    <FormControl isRequired>
                      <FormLabel
                        htmlFor="first-name"
                        style={{ color: "#38B2AC", marginTop: "1rem" }}
                      >
                        Parol
                      </FormLabel>
                      <PasswordInput
                        keyPressed={keyPressed}
                        name={"password"}
                        changeHandler={changeHandler}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-12">
                    <FormControl isRequired>
                      <FormLabel
                        htmlFor="first-name"
                        style={{ color: "#38B2AC", marginTop: "1rem" }}
                      >
                        Parol
                      </FormLabel>
                      <PasswordInput
                        keyPressed={keyPressed}
                        name={"confirmPassword"}
                        changeHandler={changeHandler}
                      />
                    </FormControl>
                  </div>
                </div>
                <div className="col-md-6">
                  <FormControl isRequired>
                  
                    <FileUpload
                      removeImage={removeImage}
                      handleImage={handleImage}
                      load={load}
                      img={director.image}
                      imgUrl={
                        baseUrl &&
                        director.image &&
                        `${baseUrl}/api/upload/file/${director.image}`
                      }
                    />
                  </FormControl>
                </div>


                <div className="col-md-6 text-center mt-2">
                  {loading || load ? (
                    <Button
                      isLoading
                      colorScheme="teal"
                      variant="solid"
                    ></Button>
                  ) : (
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      onClick={onHandler}
                    >
                      Registratsiya
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
