import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { receptionSettingForm } from "./inputs.data";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { GoTrashcan } from "react-icons/go";
import { BsCloudUploadFill } from "react-icons/bs";
import { useToast } from "@chakra-ui/react";
const SettingForms = () => {
  const auth = useContext(AuthContext);
  const [requiredFields, setRequiredFieds] = useState(null);
  const [cashNavigate, setCashNavigate] = useState(false);
  const [turnCheck, setTurnCheck] = useState(false);
  const [connectorDoctor_client, setConnectorDoctor_client] = useState(false);
  const [ad, setAd] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const { request, loading } = useHttp();
  useEffect(() => {
    getRequiredFields();
    getConnectorDoctor();
    getReseptionPayAccess();
    getLastCardNumber();
    getReseptionCheckVisible();
    getAd();
  }, []);
  //====================================================================
  //====================================================================
  // Required Fields
  const getRequiredFields = useCallback(async () => {
    try {
      const data = await request(
        `/api/clinica/requiredFields/${auth.clinica._id}`,
        "GET",
        null
      );
      setRequiredFieds(data.requiredFields);
    } catch (error) {
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  });
  // Required Fields
  const getReseptionPayAccess = useCallback(async () => {
    try {
      const { reseption_and_pay } = await request(
        `/api/clinica/reseption_pay/${auth.clinica._id}`,
        "GET",
        null
      );
      setCashNavigate(reseption_and_pay);
    } catch (error) {
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  });
  const getReseptionCheckVisible = useCallback(async () => {
    try {
      const { turnCheckVisible } = await request(
        `/api/clinica/reseption_check/${auth.clinica._id}`,
        "GET",
        null
      );
      setTurnCheck(turnCheckVisible);
    } catch (error) {
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  });
  const getConnectorDoctor = useCallback(async () => {
    try {
      const { connectorDoctor_client } = await request(
        `/api/clinica/connector_doctor_has/${auth.clinica._id}`,
        "GET",
        null
      );
      setConnectorDoctor_client(connectorDoctor_client);
    } catch (error) {
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  });
  const getLastCardNumber = useCallback(async () => {
    try {
      const { card_number } = await request(
        `/api/offlineclient/client/lastCardNumber/${auth.clinica._id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setCardNumber(card_number);
    } catch (error) {
      console.log("error :", error);
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  });
  const handleChangeReceptionFormSwitch = async (name, value) => {
    try {
      await request(
        `/api/clinica/requiredFields/${auth.clinica._id}`,
        "PATCH",
        { requiredFields: { ...requiredFields, [name]: value } }
      );
      getRequiredFields();
    } catch (error) {
      console.log(error);
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  };
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
  const handleImage = async (e) => {
    if (auth.clinica.queueAd) {
      return notify({
        title: "Diqqat! File avval yuklangan",
        description:
         "",
        status: "error",
      });
    }
    const files = e.target.files[0];
    const data = new FormData();
    data.append("file", files);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const file = await res.json();
    await updateClinicaTurnAd(file.filename);
    notify({
      status: "success",
      description: "",
      title: "File muvaffaqqiyatli yuklandi",
    });
  };
  const getAd = async () => {
    try {
      const { ad } = await request(
        `/api/clinica/getAd/${auth.clinica._id}`,
        "GET"
      );
      setAd(ad);
    } catch (error) {
      notify({
        title: `${error}`,
        description: "",
        status: "error",
      });
    }
  };
  const updateClinicaTurnAd = async (ad) => {
    try {
      await request(`/api/clinica/updateAd/${auth.clinica._id}`, "PATCH", {
        ad,
      });
      if(!ad){
        notify({
          status: "success",
          description: "",
          title: "File muvaffaqqiyatli o'chirildi",
        });
      }
      getAd()
    } catch (error) {
      notify({
        title: `${error}`,
        description: "",
        status: "error",
      });
    }
  };
  const deleteTurnAd = async () => {
    await updateClinicaTurnAd(null);
  };
  const handleChangeReceptionPaySwitch = async (value) => {
    try {
      await request(`/api/clinica/reseption_pay/${auth.clinica._id}`, "PATCH", {
        reseption_and_pay: value,
      });
      getReseptionPayAccess();
    } catch (error) {
      console.log(error);
      notify({
        title: `${error}`,
        description: "",
        status: "error",
      });
    }
  };
  const handleChangeReceptionCheckSwitch = async (value) => {
    try {
      await request(
        `/api/clinica/reseption_check/${auth.clinica._id}`,
        "PATCH",
        {
          turnCheckVisible: value,
        }
      );
      getReseptionCheckVisible();
    } catch (error) {
      console.log(error);
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  };
  const handleChangeReceptionConnectorDoctorHasSwitch = async (value) => {
    try {
      await request(
        `/api/clinica/connector_doctor_has/${auth.clinica._id}`,
        "PATCH",
        {
          connectorDoctor_client: value,
        }
      );
      getConnectorDoctor();
    } catch (error) {
      console.log(error);
      // notify({
      //   title: t(`${error}`),
      //   description: "",
      //   status: "error",
      // });
    }
  };
  const cardNumberFunctionRef = useRef(null);
  const handleChangeCardNumber = (e) => {
    setCardNumber(e.target.value);

    // Clear the previous timeout
    if (cardNumberFunctionRef.current) {
      clearTimeout(cardNumberFunctionRef.current);
    }

    // Set a new timeout
    if (e.target.value !== "") {
      cardNumberFunctionRef.current = setTimeout(async () => {
        changeCardNumber(e.target.value);
      }, 2000);
    }
  };

  // Function to make API request to change card number
  const changeCardNumber = async (newCardNumber) => {
    try {
      await request(
        `/api/offlineclient/client/changeLastCardNumber/${auth.clinica._id}`,
        "PATCH",
        { card_number: newCardNumber },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      getLastCardNumber();
      console.log("Card number updated");
    } catch (error) {
      console.log(error);
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (cardNumberFunctionRef.current) {
        clearTimeout(cardNumberFunctionRef.current);
      }
    };
  }, []);

  return (
    <div className="container-fluid flex">
      <div className="pb-6 pt-4 col-xl-4 border-r borer-4">
        <h1 className="text-center font-semibold text-lg mb-3">
          Qabulxona sozlamalari
        </h1>
        <span className="font-medium">
          Mijoz ro'yxatdan o'tkazish sozlamalari
        </span>
        <ul className="my-2 ml-2">
          {receptionSettingForm.map((item) => (
            <li key={item.key} className="border-b py-1">
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
                onChange={({ target }) =>
                  handleChangeReceptionFormSwitch(
                    item.input_name,
                    target.checked
                  )
                }
              >
                <FormLabel htmlFor="email-alerts" mb="0">
                  {item.name}
                </FormLabel>
                <Switch
                  disabled={loading}
                  isChecked={
                    !requiredFields ? true : requiredFields[item.input_name]
                  }
                  id={item.input_name}
                />
              </FormControl>
            </li>
          ))}
        </ul>
        <span className="font-medium">Qabulda kassaga yo'naltirish</span>
        <ul className="my-2 ml-2">
          <li className="border-b py-1">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
              onChange={({ target }) =>
                handleChangeReceptionPaySwitch(target.checked)
              }
            >
              <FormLabel htmlFor="email-alerts" mb="0">
                Yo'naltirish
              </FormLabel>
              <Switch
                disabled={loading}
                isChecked={cashNavigate}
                id={"cashNavigate"}
              />
            </FormControl>
          </li>
        </ul>
        <span className="font-medium">Yo'nlanma shifokor</span>
        <ul className="my-2 ml-2">
          <li className="border-b py-1">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
              onChange={({ target }) =>
                handleChangeReceptionConnectorDoctorHasSwitch(target.checked)
              }
            >
              <FormLabel htmlFor="email-alerts" mb="0">
                Ochish
              </FormLabel>
              <Switch
                disabled={loading}
                isChecked={connectorDoctor_client}
                id={"connectorDoctor_client"}
              />
            </FormControl>
          </li>
        </ul>
        <span className="font-medium"> Ohirgi karta raqam</span>
        <ul className="mt-2 ml-2">
          <li className="border-b py-1">
            <FormControl display="block" onChange={handleChangeCardNumber}>
              <Input
                id="card_number"
                className="is-valid"
                placeholder="Karta raqam"
                size="sm"
                value={cardNumber}
                type="number"
                style={{
                  borderColor: "#eee",
                  boxShadow: "none",
                }}
                name="card_number"
              />
            </FormControl>
          </li>
        </ul>
      </div>
      <div className={"pb-6 pt-4 col-xl-4 border-r borer-4"}>
        <h1 className="text-center font-semibold text-lg mb-3">
          Kassa sozlamalari
        </h1>
        <span className="font-medium">Navbat cheki</span>
        <ul className="my-2 ml-2">
          <li className="border-b py-1">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
              onChange={({ target }) =>
                handleChangeReceptionCheckSwitch(target.checked)
              }
            >
              <FormLabel htmlFor="email-alerts" mb="0">
                Ochish
              </FormLabel>
              <Switch
                disabled={loading}
                isChecked={turnCheck}
                id={"cashNavigate"}
              />
            </FormControl>
          </li>
        </ul>
      </div>
      <div className={"pb-6 pt-4 col-xl-4 border-r borer-4"}>
        <h1 className="text-center font-semibold text-lg mb-3">
          Navbat sozlamalari
        </h1>
        <span className="font-medium">Reklama (rasm yoki video)</span>
        <ul className="my-2 ml-2">
          <li className="border-b py-1">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
              onChange={handleImage}
            >
              <FormLabel htmlFor="email-alerts" mb="0">
                <label className="flex cursor-pointer items-center gap-x-2">
                  <input type="file" accept="image/*, video/*" hidden />
                  Yuklash
                  <BsCloudUploadFill />
                </label>
              </FormLabel>
              {ad && (
                <Button
                  disabled={loading}
                  isChecked={turnCheck}
                  id={"cashNavigate"}
                  colorScheme="red"
                  onClick={deleteTurnAd}
                >
                  <GoTrashcan />
                </Button>
              )}
            </FormControl>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingForms;
