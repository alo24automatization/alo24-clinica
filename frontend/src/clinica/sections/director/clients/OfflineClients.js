import { useToast } from "@chakra-ui/react";
import {
  faPenAlt,
  faPrint,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Print from "./components/Print";
import { Pagination } from "../components/Pagination";
import { DatePickers } from "../../reseption/offlineclients/clientComponents/DatePickers";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const conns = [
  {
    _id: "67694f10edf8ede436f36a2a",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "6761042680fc11bbab8ea573",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "УЛУГБЕК",
      lastname: "ОЧИЛОВ",
      fathername: "ЖУРАЕВИЧ",
      fullname: "УЛУГБЕК ОЧИЛОВ",
      isDisability: false,
      card_number: null,
      born: "1988-11-01T00:00:00.000Z",
      department: "66d1e8b4d7462285ffecfeb9",
      gender: "man",
      phone: "991297772",
      address: "БУХОРО ШАХАР МУСТАКИЛЛИК КУЧАСИ 37 ДОМ 10 ХОНАДОН",
      connectors: [
        "6761042680fc11bbab8ea57e",
        "67626a5280fc11bbabb0f21c",
        "6765471f80fc11bbabf3cc5b",
        "6766446a80fc11bbabfb609f",
        "67694f10edf8ede436f36a2a",
      ],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1005822,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-17T04:55:02.090Z",
      updatedAt: "2024-12-23T11:52:48.045Z",
      __v: 5,
    },
    services: [
      {
        _id: "67694f10edf8ede436f36a33",
        client: "6761042680fc11bbab8ea573",
        connector: "67694f10edf8ede436f36a2a",
        serviceid: {
          _id: "66d1ec42d7462285ffed0201",
          servicetype: {
            _id: "66d1e884d7462285ffecfe92",
            name: "УРОЛОГ ДАВЛАТ",
          },
        },
        service: {
          _id: "66d1ec42d7462285ffed0201",
          name: "АВИМ - 1",
          price: 80000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 45,
        },
        department: {
          _id: "66d1e87dd7462285ffecfe83",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 5,
        tables: [],
        files: [],
      },
      {
        _id: "67694f10edf8ede436f36a3a",
        client: "6761042680fc11bbab8ea573",
        connector: "67694f10edf8ede436f36a2a",
        serviceid: {
          _id: "66d1ec42d7462285ffed01f2",
          servicetype: {
            _id: "66d1e884d7462285ffecfe92",
            name: "УРОЛОГ ДАВЛАТ",
          },
        },
        service: {
          _id: "66d1ec42d7462285ffed01f2",
          name: "ЭЛЕКТРОСТИМУЛЯЦИЯ",
          price: 20000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 20,
        },
        department: {
          _id: "66d1e87dd7462285ffecfe83",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 5,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 0,
    accept: false,
    isSended: false,
    payments: [
      {
        _id: "67694f18edf8ede436f36cee",
        total: 100000,
        payment: 100000,
        type: "cash",
        cash: 100000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "6761042680fc11bbab8ea573",
        connector: "67694f10edf8ede436f36a2a",
        debt: 0,
        isArchive: false,
        services: ["67694f10edf8ede436f36a33", "67694f10edf8ede436f36a3a"],
        products: [],
        createdAt: "2024-12-23T11:52:56.718Z",
        updatedAt: "2024-12-23T11:52:56.718Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T11:52:48.035Z",
    totalprice: 100000,
  },
  {
    _id: "676948dbedf8ede436f30ba2",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "676948dbedf8ede436f30b9f",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "САМАНДАР ПРАВЫЙ",
      lastname: "КУЛДОШЕВ",
      fathername: "САЛОХИДДИНОВИЧ",
      fullname: "КУЛДОШЕВ САМАНДАР ПРАВЫЙ",
      isDisability: false,
      card_number: null,
      born: "1989-02-26T00:00:00.000Z",
      department: "66d1e9dfd7462285ffecffb4",
      gender: "man",
      phone: "934524800",
      address: "КОГОН ШАХАР АХИЛЛИК КУЧАСИ 32 УЙ",
      connectors: ["676948dbedf8ede436f30ba2"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1006196,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-23T11:26:19.364Z",
      updatedAt: "2024-12-23T11:26:19.369Z",
      __v: 1,
    },
    services: [
      {
        _id: "676948dbedf8ede436f30be3",
        client: "676948dbedf8ede436f30b9f",
        connector: "676948dbedf8ede436f30ba2",
        serviceid: {
          _id: "66d1ec46d7462285ffed04c7",
          servicetype: {
            _id: "66d1e9e7d7462285ffecffc3",
            name: "МРТ",
          },
        },
        service: {
          _id: "66d1ec46d7462285ffed04c7",
          name: "МРТ лучезапястного сустава и кисти ( каждый )",
          price: 220000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 20000,
          counterAgentProcient: 5000,
          counterDoctorProcient: 40000,
        },
        department: {
          _id: "66d1e9dfd7462285ffecffb4",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 27,
        tables: [],
        files: [],
      },
      {
        _id: "676948dbedf8ede436f30c66",
        client: "676948dbedf8ede436f30b9f",
        connector: "676948dbedf8ede436f30ba2",
        serviceid: {
          _id: "66e597e0ce28cd3da17b84f7",
          servicetype: {
            _id: "66d2d30dd7462285ffed2bb3",
            name: "Клизма",
          },
        },
        service: {
          _id: "66e597e0ce28cd3da17b84f7",
          name: "ЗАПИСЬ НА ДИСК",
          price: 10000,
          priceNDS: 0,
        },
        department: {
          _id: "66d2d303d7462285ffed2ba1",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 55,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 0,
    accept: false,
    isSended: false,
    payments: [
      {
        _id: "6769490eedf8ede436f32191",
        total: 230000,
        payment: 230000,
        type: "cash",
        cash: 230000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "676948dbedf8ede436f30b9f",
        connector: "676948dbedf8ede436f30ba2",
        debt: 0,
        isArchive: false,
        services: ["676948dbedf8ede436f30be3", "676948dbedf8ede436f30c66"],
        products: [],
        createdAt: "2024-12-23T11:27:10.411Z",
        updatedAt: "2024-12-23T11:27:10.411Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T11:26:19.367Z",
    totalprice: 230000,
  },
  {
    _id: "676947b3edf8ede436f2c28a",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "676947b3edf8ede436f2c288",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "МЕРДАН",
      lastname: "КУРБОНОВ",
      fathername: "АЛИМУХАММЕДОВИЧ",
      fullname: "КУРБОНОВ МЕРДАН",
      isDisability: false,
      card_number: null,
      born: "1997-06-01T00:00:00.000Z",
      department: "66d1e987d7462285ffecff63",
      gender: "man",
      phone: "916470033",
      address: "БУХОРО ШАХАР ЗУЛФИЯ КУЧАСИ ",
      connectors: ["676947b3edf8ede436f2c28a"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1006195,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-23T11:21:23.646Z",
      updatedAt: "2024-12-23T11:21:23.672Z",
      __v: 1,
    },
    services: [
      {
        _id: "676947b3edf8ede436f2c2aa",
        client: "676947b3edf8ede436f2c288",
        connector: "676947b3edf8ede436f2c28a",
        serviceid: {
          _id: "66d1ec42d7462285ffed023d",
          servicetype: {
            _id: "66d1e999d7462285ffecff72",
            name: "РЕНТГЕН",
          },
        },
        service: {
          _id: "66d1ec42d7462285ffed023d",
          name: "Рентген грудной клетки",
          price: 50000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 10000,
          counterAgentProcient: 1000,
          counterDoctorProcient: 10000,
        },
        department: {
          _id: "66d1e987d7462285ffecff63",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 9,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 0,
    accept: false,
    isSended: false,
    payments: [
      {
        _id: "676947e6edf8ede436f2d560",
        total: 50000,
        payment: 50000,
        type: "cash",
        cash: 50000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "676947b3edf8ede436f2c288",
        connector: "676947b3edf8ede436f2c28a",
        debt: 0,
        isArchive: false,
        services: ["676947b3edf8ede436f2c2aa"],
        products: [],
        createdAt: "2024-12-23T11:22:14.714Z",
        updatedAt: "2024-12-23T11:22:14.714Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T11:21:23.660Z",
    totalprice: 50000,
  },
  {
    _id: "67693f06edf8ede436f131f0",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "67693f06edf8ede436f131ed",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "ОТАБЕК",
      lastname: "ХАЙИТОВ",
      fathername: "НУРАГДИЕВИЧ",
      fullname: "ОТАБЕК ХАЙИТОВ",
      isDisability: false,
      card_number: null,
      born: "1990-11-04T00:00:00.000Z",
      department: "66d1e9fcd7462285ffecffcf",
      gender: "man",
      phone: "914171216",
      address: "БУХОРО ШАХАР Т.ФАРОГИЙ КУЧАСИ 26 УЙ 19",
      connectors: ["67693f06edf8ede436f131f0"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1006194,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-23T10:44:22.834Z",
      updatedAt: "2024-12-23T11:37:49.237Z",
      __v: 1,
    },
    services: [
      {
        _id: "67693f07edf8ede436f13224",
        client: "67693f06edf8ede436f131ed",
        connector: "67693f06edf8ede436f131f0",
        serviceid: {
          _id: "66d1ecbcd7462285ffed07cb",
          servicetype: {
            _id: "66d1ea02d7462285ffecffde",
            name: "МСКТ",
          },
        },
        service: {
          _id: "66d1ecbcd7462285ffed07cb",
          name: "МСКТ придаточных пазух носа",
          price: 230000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 20000,
          counterAgentProcient: 5000,
          counterDoctorProcient: 60000,
        },
        department: {
          _id: "66d1e9fcd7462285ffecffcf",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 14,
        tables: [],
        files: [],
      },
      {
        _id: "67693f07edf8ede436f13248",
        client: "67693f06edf8ede436f131ed",
        connector: "67693f06edf8ede436f131f0",
        serviceid: {
          _id: "66d1ec41d7462285ffed0152",
          servicetype: {
            _id: "66d1e79ed7462285ffecfde9",
            name: "ЛОР",
          },
        },
        service: {
          _id: "66d1ec41d7462285ffed0152",
          name: "ОСМОТР ЖАМШИД АМИНОВИЧ",
          price: 60000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 50,
        },
        department: {
          _id: "66d1e797d7462285ffecfdda",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 10,
        tables: [],
        files: [],
      },
      {
        _id: "67694b8dedf8ede436f33460",
        client: "67693f06edf8ede436f131ed",
        connector: "67693f06edf8ede436f131f0",
        serviceid: {
          _id: "66d1ec45d7462285ffed03aa",
          servicetype: {
            _id: "66d1e9cad7462285ffecffa8",
            name: "ФИЗИОТЕРАПИЯ",
          },
        },
        service: {
          _id: "66d1ec45d7462285ffed03aa",
          name: "Электрофорез (поток)",
          price: 20000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 10,
          counterAgentProcient: 1,
          counterDoctorProcient: 10,
        },
        department: {
          _id: "66d1e9c2d7462285ffecff99",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 9,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 0,
    accept: false,
    isSended: false,
    payments: [
      {
        _id: "67693f5aedf8ede436f14e15",
        total: 290000,
        payment: 290000,
        type: "cash",
        cash: 290000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "67693f06edf8ede436f131ed",
        connector: "67693f06edf8ede436f131f0",
        debt: 0,
        isArchive: false,
        services: ["67693f07edf8ede436f13224", "67693f07edf8ede436f13248"],
        products: [],
        createdAt: "2024-12-23T10:45:46.430Z",
        updatedAt: "2024-12-23T11:38:46.357Z",
        __v: 0,
      },
      {
        _id: "67694bc6edf8ede436f342c1",
        total: 310000,
        payment: 20000,
        type: "cash",
        cash: 20000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "67693f06edf8ede436f131ed",
        connector: "67693f06edf8ede436f131f0",
        debt: 0,
        isArchive: false,
        services: ["67694b8dedf8ede436f33460"],
        products: [],
        createdAt: "2024-12-23T11:38:46.375Z",
        updatedAt: "2024-12-23T11:38:46.375Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T10:44:22.847Z",
    totalprice: 310000,
  },
  {
    _id: "67693e7dedf8ede436f10d46",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "675ff98880fc11bbab84da13",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "ЖАСУР",
      lastname: "ХАМРОЕВ",
      fathername: "ТЕМИРОВИЧ",
      fullname: "ЖАСУР ХАМРОЕВ",
      isDisability: false,
      card_number: null,
      born: "1990-01-17T00:00:00.000Z",
      department: "66d1e89bd7462285ffecfe9e",
      gender: "man",
      phone: "972810802",
      address: "ВОБКЕНТ ТУМАНИ ХАРГУШТ МФЙ ",
      connectors: ["675ff98880fc11bbab84da16", "67693e7dedf8ede436f10d46"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1005801,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-16T09:57:28.552Z",
      updatedAt: "2024-12-23T10:45:04.753Z",
      __v: 2,
    },
    services: [
      {
        _id: "67693e7dedf8ede436f10d4e",
        client: "675ff98880fc11bbab84da13",
        connector: "67693e7dedf8ede436f10d46",
        serviceid: {
          _id: "66d1ec41d7462285ffed0152",
          servicetype: {
            _id: "66d1e79ed7462285ffecfde9",
            name: "ЛОР",
          },
        },
        service: {
          _id: "66d1ec41d7462285ffed0152",
          name: "ОСМОТР ЖАМШИД АМИНОВИЧ",
          price: 60000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 50,
        },
        department: {
          _id: "66d1e797d7462285ffecfdda",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 9,
        tables: [],
        files: [],
      },
      {
        _id: "67693f30edf8ede436f13fcb",
        client: "675ff98880fc11bbab84da13",
        connector: "67693e7dedf8ede436f10d46",
        serviceid: {
          _id: "66d1ecbcd7462285ffed07cb",
          servicetype: {
            _id: "66d1ea02d7462285ffecffde",
            name: "МСКТ",
          },
        },
        service: {
          _id: "66d1ecbcd7462285ffed07cb",
          name: "МСКТ придаточных пазух носа",
          price: 230000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 20000,
          counterAgentProcient: 5000,
          counterDoctorProcient: 60000,
        },
        department: {
          _id: "66d1e9fcd7462285ffecffcf",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 15,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 0,
    accept: false,
    isSended: false,
    payments: [
      {
        _id: "67693e91edf8ede436f1123a",
        total: 60000,
        payment: 60000,
        type: "cash",
        cash: 60000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "675ff98880fc11bbab84da13",
        connector: "67693e7dedf8ede436f10d46",
        debt: 0,
        isArchive: false,
        services: ["67693e7dedf8ede436f10d4e"],
        products: [],
        createdAt: "2024-12-23T10:42:25.663Z",
        updatedAt: "2024-12-23T10:47:56.063Z",
        __v: 0,
      },
      {
        _id: "67693fdcedf8ede436f179a1",
        total: 290000,
        payment: 230000,
        type: "card",
        cash: 0,
        card: 230000,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "675ff98880fc11bbab84da13",
        connector: "67693e7dedf8ede436f10d46",
        debt: 0,
        isArchive: false,
        services: ["67693f30edf8ede436f13fcb"],
        products: [],
        createdAt: "2024-12-23T10:47:56.071Z",
        updatedAt: "2024-12-23T10:47:56.071Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T10:42:05.690Z",
    totalprice: 290000,
  },
  {
    _id: "67693c6dedf8ede436f0a3e2",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "67693c6dedf8ede436f0a3da",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "ЖАХОНГИР",
      lastname: "БАХТИЁРОВ",
      fathername: "ЖАМОЛОВИЧ",
      fullname: "БАХТИЁРОВ ЖАХОНГИР",
      isDisability: false,
      card_number: null,
      born: "2002-05-16T00:00:00.000Z",
      department: "66d1e8b4d7462285ffecfeb9",
      gender: "man",
      phone: "943286668",
      address: "РОМИТАН ТУМАН ДУСТЛИК МФЙ ",
      connectors: ["67693c6dedf8ede436f0a3e2"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1006193,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-23T10:33:17.778Z",
      updatedAt: "2024-12-23T10:33:17.825Z",
      __v: 1,
    },
    services: [
      {
        _id: "67693c6dedf8ede436f0a3f5",
        client: "67693c6dedf8ede436f0a3da",
        connector: "67693c6dedf8ede436f0a3e2",
        serviceid: {
          _id: "66d1ec42d7462285ffed020b",
          servicetype: {
            _id: "66d1e8bed7462285ffecfec8",
            name: "УРОЛОГ ХУСНИДДИН МУРАДУЛЛАЕВИЧ",
          },
        },
        service: {
          _id: "66d1ec42d7462285ffed020b",
          name: "ОСМОТР ВРАЧА ХУСНИДДИН МУРАДУЛЛАЕВИЧ",
          price: 80000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 50,
        },
        department: {
          _id: "66d1e8b4d7462285ffecfeb9",
          probirka: false,
        },
        counterdoctor: {
          _id: "66d1ea17d7462285ffecffea",
          firstname: "Navruz",
          lastname: "Ochilov",
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 7,
        tables: [],
        files: [],
      },
      {
        _id: "67693c6dedf8ede436f0a438",
        client: "67693c6dedf8ede436f0a3da",
        connector: "67693c6dedf8ede436f0a3e2",
        serviceid: {
          _id: "66d1ecbfd7462285ffed09dd",
          servicetype: {
            _id: "66d1ea7bd7462285ffed0049",
            name: "Клинические анализы",
          },
        },
        service: {
          _id: "66d1ecbfd7462285ffed09dd",
          name: "Мазок (Суртма) для мужчин",
          price: 50000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 10,
          counterAgentProcient: 2,
          counterDoctorProcient: 20,
        },
        department: {
          _id: "66d1ea17d7462285ffecffea",
          probirka: true,
        },
        counterdoctor: {
          _id: "66d1ea17d7462285ffecffea",
          firstname: "Navruz",
          lastname: "Ochilov",
        },
        templates: [],
        refuse: false,
        accept: true,
        turn: 29,
        column: {
          _id: "66d6df1ad7462285ffedf720",
          col1: "Наименование",
          col2: "Результат",
          col3: "Норма",
        },
        tables: [
          {
            _id: "66d6df10d7462285ffedf6fa",
            col1: " Лейкоцитлар",
            col2: "25",
            col3: "-",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf6fd",
            col1: " Эпителей",
            col2: "бол.кол",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf700",
            col1: " Шиллик ",
            col2: "+",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf703",
            col1: " Микрофлора ",
            col2: "+",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf706",
            col1: "Кокки",
            col2: "+",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf709",
            col1: " Trichomonas vaginalis",
            col2: "-",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf70c",
            col1: " Candida albicans",
            col2: "+",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf70f",
            col1: " Chlamydia trachomatis",
            col2: "-",
            accept: true,
          },
          {
            _id: "66d6df10d7462285ffedf712",
            col1: " Gardnerella vaginalis",
            col2: "-",
            accept: true,
          },
        ],
        files: [],
      },
      {
        _id: "67693c6eedf8ede436f0a482",
        client: "67693c6dedf8ede436f0a3da",
        connector: "67693c6dedf8ede436f0a3e2",
        serviceid: {
          _id: "66d1ecbfd7462285ffed0992",
          servicetype: {
            _id: "66d1ea7bd7462285ffed0049",
            name: "Клинические анализы",
          },
        },
        service: {
          _id: "66d1ecbfd7462285ffed0992",
          name: "Общий анализ мочи",
          price: 30000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 10,
          counterAgentProcient: 2,
          counterDoctorProcient: 20,
        },
        department: {
          _id: "66d1ea17d7462285ffecffea",
          probirka: true,
        },
        templates: [],
        refuse: false,
        accept: true,
        turn: 29,
        column: {
          _id: "66d1ed57d7462285ffed1390",
          col1: "Наименование",
          col2: "Результат",
          col3: "Норма",
        },
        tables: [
          {
            _id: "66d1ed53d7462285ffed10b0",
            col1: "СИЙДИК КИМЁВИЙ ХОССАЛАРИ",
            col2: "*******************************",
            col3: "*******************************",
            col4: "*******************************",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10b2",
            col1: "LEU- Лейкоцит",
            col2: "-",
            col3: "отр (-)",
            col4: "Leu/mkl",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10b4",
            col1: "NIT- Нитрит",
            col2: "отр (-)",
            col3: "отр (-)",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10b6",
            col1: "URO- Уробилиноген",
            col2: "-",
            col3: "норма",
            col4: "≥ 0,2 Mg/dl",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10b8",
            col1: "PRO- Оқсил",
            col2: "-",
            col3: "отр (-)",
            col4: "g/L",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10ba",
            col1: "pH- Муҳити",
            col3: "рН-5-6",
            col2: "6,5",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10bc",
            col1: "BLD- Эритроцит",
            col2: "-",
            col3: "отр (-)",
            col4: "Ery/mkl",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10be",
            col1: "SG- Солиш. Оғир",
            col3: "1018-125",
            col4: "g/L",
            col2: "1,025",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10c0",
            col1: "KET- Кетон таначаси",
            col2: "-",
            col3: "отр (-)",
            col4: "Mmol/L",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10c2",
            col1: "BIL- Билирубин",
            col2: "-",
            col3: "отр (-)",
            col4: "Mmol/L",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10c4",
            col1: "GLU- Глюкоза",
            col2: "-",
            col3: "отр (-)",
            col4: "Mmol/L",
            accept: true,
          },
          {
            _id: "66d1ed53d7462285ffed10c6",
            col1: "ASC- Аскорбин к-си",
            col2: "-",
            col3: "отр (-)",
            col4: "Mmol/L",
            accept: true,
          },
        ],
        files: [],
      },
      {
        _id: "67693c6eedf8ede436f0a4d3",
        client: "67693c6dedf8ede436f0a3da",
        connector: "67693c6dedf8ede436f0a3e2",
        serviceid: {
          _id: "66d1ecbfd7462285ffed09a1",
          servicetype: {
            _id: "66d1ea7bd7462285ffed0049",
            name: "Клинические анализы",
          },
        },
        service: {
          _id: "66d1ecbfd7462285ffed09a1",
          name: "Спермограмма по ВОЗ",
          price: 80000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 10,
          counterAgentProcient: 2,
          counterDoctorProcient: 20,
        },
        department: {
          _id: "66d1ea17d7462285ffecffea",
          probirka: true,
        },
        templates: [],
        refuse: false,
        accept: true,
        turn: 29,
        column: {
          _id: "66d6dae3d7462285ffedf3fd",
          col1: "Наименование",
          col2: "Результат",
          col3: "Норма",
          col4: "-",
        },
        tables: [
          {
            _id: "66d6dadcd7462285ffedf3b3",
            col1: "Количество",
            col3: "> 1.4 мл",
            col4: "",
            col2: "3",
            accept: true,
          },
          {
            _id: "66d6dadcd7462285ffedf3b6",
            col1: "Цвет",
            col3: "Серый",
            col4: "",
            col2: "Cерый",
            accept: true,
          },
          {
            _id: "66d6dadcd7462285ffedf3b9",
            col1: "Запах",
            col3: "Нормал",
            col4: "",
            col2: "Нормал",
            accept: true,
          },
          {
            _id: "66d6dadcd7462285ffedf3bc",
            col1: "PH",
            col3: "7,2-8,0",
            col4: "",
            col2: "7,4",
            accept: true,
          },
          {
            _id: "66d6dadcd7462285ffedf3bf",
            col1: "Воздержание (день)",
            col3: "2-7 день",
            col4: "",
            col2: "-\n",
            accept: true,
          },
          {
            _id: "66d6dadcd7462285ffedf3c2",
            col1: "Время разжижения",
            col3: "60 минут",
            col4: "",
            col2: "40",
            accept: true,
          },
          {
            _id: "66d6dadcd7462285ffedf3c5",
            col1: "Вязкость",
            col3: "Нормал",
            col4: "",
            col2: "Нормал",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3c8",
            col1: "------------------------------",
            col2: "------------------------------",
            col3: "------------------------------",
            col4: "",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3cb",
            col1: "          АНАЛИЗ",
            col2: "      РЕЗУЛЬТАТ",
            col3: "        НОРМА",
            col4: "",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3ce",
            col1: "Всего подвиж-х сперм (A+B+C)",
            col3: "(A+B+C) >42%\n(A+B) >32%",
            col4: "",
            col2: "83,16",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3d4",
            col1: "Быстрое, плавное движение (A)",
            col4: "",
            col3: ">30%",
            col2: "11,8",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3d7",
            col1: "Неравномерное движение (B)",
            col3: ">10%",
            col4: "",
            col2: "26,62",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3da",
            col1: "Непрогрессивное движения (C)",
            col3: "<2%",
            col4: "",
            col2: "44,74",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3dd",
            col1: "Неподвижные  (D)",
            col4: "",
            col2: "16,84",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3e0",
            col1: "Лейкоциты",
            col3: "<1млн/мл",
            col4: "",
            col2: "0,75-1млн",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3e3",
            col1: "------------------------------",
            col2: "------------------------------",
            col3: "------------------------------",
            col4: "",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3e6",
            col1: "Средняя скорость по пути:",
            col3: "Процент линейных движений:",
            col4: "33,68",
            col2: "13,61",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3e9",
            col1: "Криволинейная скорость:",
            col3: "Линейность:",
            col4: "34,50",
            col2: "22,35",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3ec",
            col1: "Прямолинейная скорость:",
            col3: "Прямолинейность:",
            col4: "56,68",
            col2: "7,71",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3ef",
            col1: "Амплитуда боковой движение головки:",
            col3: "Колебания:",
            col4: "60,88",
            col2: "0,68",
            accept: true,
          },
          {
            _id: "66d6daddd7462285ffedf3f2",
            col1: "Частота пересечения долей:",
            col3: "Cредний угол перемещения в градусах:",
            col4: "10,42",
            col2: "1,32",
            accept: true,
          },
        ],
        files: [],
      },
      {
        _id: "67693c6eedf8ede436f0a550",
        client: "67693c6dedf8ede436f0a3da",
        connector: "67693c6dedf8ede436f0a3e2",
        serviceid: {
          _id: "66e5984ace28cd3da17b8518",
          servicetype: {
            _id: "66d2d30dd7462285ffed2bb3",
            name: "Клизма",
          },
        },
        service: {
          _id: "66e5984ace28cd3da17b8518",
          name: "ЗАБОР",
          price: 10000,
          priceNDS: 0,
        },
        department: {
          _id: "66d2d303d7462285ffed2ba1",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 54,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 330,
    accept: true,
    isSended: false,
    payments: [
      {
        _id: "67693c7dedf8ede436f0a901",
        total: 250000,
        payment: 250000,
        type: "cash",
        cash: 250000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "67693c6dedf8ede436f0a3da",
        connector: "67693c6dedf8ede436f0a3e2",
        debt: 0,
        isArchive: false,
        services: [
          "67693c6dedf8ede436f0a3f5",
          "67693c6dedf8ede436f0a438",
          "67693c6eedf8ede436f0a482",
          "67693c6eedf8ede436f0a4d3",
          "67693c6eedf8ede436f0a550",
        ],
        products: [],
        createdAt: "2024-12-23T10:33:33.389Z",
        updatedAt: "2024-12-23T10:33:33.389Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T10:33:17.822Z",
    totalprice: 250000,
  },
  {
    _id: "6769377aedf8ede436eff128",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "6769377aedf8ede436eff125",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "ХАМИД",
      lastname: "БАЗАРОВ",
      fathername: "ОЧИЛОВИЧ",
      fullname: "БАЗАРОВ ХАМИД",
      isDisability: false,
      card_number: null,
      born: "1986-08-23T00:00:00.000Z",
      department: "66d1e9c2d7462285ffecff99",
      gender: "man",
      phone: "907110019",
      address: "КОГОН ШАХАР НАВРУЗ КУЧАСИ ",
      connectors: ["6769377aedf8ede436eff128"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1006192,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-23T10:12:10.586Z",
      updatedAt: "2024-12-23T10:12:10.605Z",
      __v: 1,
    },
    services: [
      {
        _id: "6769377aedf8ede436eff144",
        client: "6769377aedf8ede436eff125",
        connector: "6769377aedf8ede436eff128",
        serviceid: {
          _id: "66d1ec41d7462285ffed013e",
          servicetype: {
            _id: "66d1e9cad7462285ffecffa8",
            name: "ФИЗИОТЕРАПИЯ",
          },
        },
        service: {
          _id: "66d1ec41d7462285ffed013e",
          name: "Капельница ДНЕВНОЙ",
          price: 30000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 10,
        },
        department: {
          _id: "66d1e9c2d7462285ffecff99",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 8,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 0,
    accept: false,
    isSended: false,
    payments: [
      {
        _id: "676937bfedf8ede436f0130b",
        total: 30000,
        payment: 30000,
        type: "transfer",
        cash: 0,
        card: 0,
        transfer: 30000,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "6769377aedf8ede436eff125",
        connector: "6769377aedf8ede436eff128",
        debt: 0,
        isArchive: false,
        services: ["6769377aedf8ede436eff144"],
        products: [],
        createdAt: "2024-12-23T10:13:19.698Z",
        updatedAt: "2024-12-23T10:13:19.698Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T10:12:10.595Z",
    totalprice: 30000,
  },
  {
    _id: "676931d9edf8ede436ef10ac",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "676931d9edf8ede436ef10aa",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "ФЕРУЗА",
      lastname: "САЛИМОВА",
      fathername: "САМИЖОНОВНА",
      fullname: "ФЕРУЗА САЛИМОВА",
      isDisability: false,
      card_number: null,
      born: "1990-05-28T00:00:00.000Z",
      department: "66d1e9dfd7462285ffecffb4",
      gender: "woman",
      phone: "914454101",
      address: "ГИЖДУВОН ТУМАН ОЛИМХУЖА КУЧАСИ",
      connectors: ["676931d9edf8ede436ef10ac"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1006191,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-23T09:48:09.854Z",
      updatedAt: "2024-12-23T11:14:25.639Z",
      __v: 1,
    },
    services: [
      {
        _id: "676931d9edf8ede436ef10ec",
        client: "676931d9edf8ede436ef10aa",
        connector: "676931d9edf8ede436ef10ac",
        serviceid: {
          _id: "66d1ec46d7462285ffed0468",
          servicetype: {
            _id: "66d1e9e7d7462285ffecffc3",
            name: "МРТ",
          },
        },
        service: {
          _id: "66d1ec46d7462285ffed0468",
          name: "МРТ шейного отдела позвоночника",
          price: 280000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 20000,
          counterAgentProcient: 5000,
          counterDoctorProcient: 60000,
        },
        department: {
          _id: "66d1e9dfd7462285ffecffb4",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 26,
        tables: [],
        files: [],
      },
      {
        _id: "676931ddedf8ede436ef118c",
        client: "676931d9edf8ede436ef10aa",
        connector: "676931d9edf8ede436ef10ac",
        serviceid: {
          _id: "66e597e0ce28cd3da17b84f7",
          servicetype: {
            _id: "66d2d30dd7462285ffed2bb3",
            name: "Клизма",
          },
        },
        service: {
          _id: "66e597e0ce28cd3da17b84f7",
          name: "ЗАПИСЬ НА ДИСК",
          price: 10000,
          priceNDS: 0,
        },
        department: {
          _id: "66d2d303d7462285ffed2ba1",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 53,
        tables: [],
        files: [],
      },
      {
        _id: "67694611edf8ede436f27fa2",
        client: "676931d9edf8ede436ef10aa",
        connector: "676931d9edf8ede436ef10ac",
        serviceid: {
          _id: "66d1ecc3d7462285ffed0c3a",
          servicetype: {
            _id: "66d1eaa2d7462285ffed0071",
            name: "Ревматоидный панел",
          },
        },
        service: {
          _id: "66d1ecc3d7462285ffed0c3a",
          name: "Ревмо Проба",
          price: 80000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 10,
          counterAgentProcient: 2,
          counterDoctorProcient: 20,
        },
        department: {
          _id: "66d1ea17d7462285ffecffea",
          probirka: true,
        },
        templates: [],
        refuse: false,
        accept: true,
        turn: 30,
        column: {
          _id: "66d1ed5dd7462285ffed1937",
          col1: "Наименование",
          col2: "Результат",
          col3: "Норма",
        },
        tables: [
          {
            _id: "66d1ed58d7462285ffed1489",
            col1: "Ревмо Фактор",
            col3: "OTP",
            col2: "Отр",
            accept: true,
          },
          {
            _id: "66d1ed58d7462285ffed148b",
            col1: "ASLO ",
            col3: "OTP",
            col2: "Пол (+)",
            accept: true,
          },
          {
            _id: "66d1ed58d7462285ffed148e",
            col1: "СРБ",
            col3: "ОТР",
            col2: "Пол (++)",
            accept: true,
          },
        ],
        files: [],
      },
      {
        _id: "67694611edf8ede436f27faf",
        client: "676931d9edf8ede436ef10aa",
        connector: "676931d9edf8ede436ef10ac",
        serviceid: {
          _id: "66e5984ace28cd3da17b8518",
          servicetype: {
            _id: "66d2d30dd7462285ffed2bb3",
            name: "Клизма",
          },
        },
        service: {
          _id: "66e5984ace28cd3da17b8518",
          name: "ЗАБОР",
          price: 10000,
          priceNDS: 0,
        },
        department: {
          _id: "66d2d303d7462285ffed2ba1",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 53,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 331,
    accept: true,
    isSended: false,
    payments: [
      {
        _id: "67694007edf8ede436f18864",
        total: 290000,
        payment: 290000,
        type: "cash",
        cash: 290000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "676931d9edf8ede436ef10aa",
        connector: "676931d9edf8ede436ef10ac",
        debt: 0,
        isArchive: false,
        services: ["676931d9edf8ede436ef10ec", "676931ddedf8ede436ef118c"],
        products: [],
        createdAt: "2024-12-23T10:48:39.821Z",
        updatedAt: "2024-12-23T11:14:48.055Z",
        __v: 0,
      },
      {
        _id: "67694628edf8ede436f2849d",
        total: 380000,
        payment: 90000,
        type: "cash",
        cash: 90000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "676931d9edf8ede436ef10aa",
        connector: "676931d9edf8ede436ef10ac",
        debt: 0,
        isArchive: false,
        services: ["67694611edf8ede436f27fa2", "67694611edf8ede436f27faf"],
        products: [],
        createdAt: "2024-12-23T11:14:48.066Z",
        updatedAt: "2024-12-23T11:14:48.066Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T09:48:09.864Z",
    totalprice: 380000,
  },
  {
    _id: "6769314aedf8ede436eedfb5",
    clinica: {
      _id: "66d1e410d7462285ffecfcad",
      name: '"AZIMED HOSPITAL" ',
      image: "c679e365f0a96a8462305ff55bd98cba.png",
      phone1: "919250303",
    },
    client: {
      _id: "6769314aedf8ede436eedfb3",
      clinica: "66d1e410d7462285ffecfcad",
      isArchive: false,
      firstname: "МАРЗИЯ",
      lastname: "ХОТАМОВА",
      fathername: "ТИЛАВОВНА",
      fullname: "ХОТАМОВА МАРЗИЯ",
      isDisability: false,
      card_number: null,
      born: "1948-02-03T00:00:00.000Z",
      department: "66d1e9dfd7462285ffecffb4",
      gender: "woman",
      phone: "973010903",
      address: "БУХОРО ШАХАР МИРЗАФАЁЗ 18 УЙ",
      connectors: ["6769314aedf8ede436eedfb5"],
      reseption: "66d2d8aed7462285ffed2da2",
      id: 1006190,
      national: "uzb",
      was_online: false,
      brondate: null,
      bronTime: null,
      createdAt: "2024-12-23T09:45:46.418Z",
      updatedAt: "2024-12-23T09:45:46.423Z",
      __v: 1,
    },
    services: [
      {
        _id: "6769314aedf8ede436eedff1",
        client: "6769314aedf8ede436eedfb3",
        connector: "6769314aedf8ede436eedfb5",
        serviceid: {
          _id: "66d1ec46d7462285ffed04d6",
          servicetype: {
            _id: "66d1e9e7d7462285ffecffc3",
            name: "МРТ",
          },
        },
        service: {
          _id: "66d1ec46d7462285ffed04d6",
          name: "МРТ тазобедренного сустава",
          price: 300000,
          priceNDS: 0,
          shortname: "АБС",
          doctorProcient: 20000,
          counterAgentProcient: 5000,
          counterDoctorProcient: 60000,
        },
        department: {
          _id: "66d1e9dfd7462285ffecffb4",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 25,
        tables: [],
        files: [],
      },
      {
        _id: "6769314aedf8ede436eee063",
        client: "6769314aedf8ede436eedfb3",
        connector: "6769314aedf8ede436eedfb5",
        serviceid: {
          _id: "66e597e0ce28cd3da17b84f7",
          servicetype: {
            _id: "66d2d30dd7462285ffed2bb3",
            name: "Клизма",
          },
        },
        service: {
          _id: "66e597e0ce28cd3da17b84f7",
          name: "ЗАПИСЬ НА ДИСК",
          price: 10000,
          priceNDS: 0,
        },
        department: {
          _id: "66d2d303d7462285ffed2ba1",
          probirka: false,
        },
        templates: [],
        refuse: false,
        accept: false,
        turn: 52,
        tables: [],
        files: [],
      },
    ],
    products: [],
    probirka: 0,
    accept: false,
    isSended: false,
    payments: [
      {
        _id: "67693256edf8ede436ef3fd2",
        total: 310000,
        payment: 310000,
        type: "cash",
        cash: 310000,
        card: 0,
        transfer: 0,
        isPayDebt: false,
        clinica: "66d1e410d7462285ffecfcad",
        client: "6769314aedf8ede436eedfb3",
        connector: "6769314aedf8ede436eedfb5",
        debt: 0,
        isArchive: false,
        services: ["6769314aedf8ede436eedff1", "6769314aedf8ede436eee063"],
        products: [],
        createdAt: "2024-12-23T09:50:14.077Z",
        updatedAt: "2024-12-23T09:50:14.077Z",
        __v: 0,
      },
    ],
    createdAt: "2024-12-23T09:45:46.420Z",
    totalprice: 310000,
  },
];

const OfflineClients = () => {
  //=================================================
  //=================================================
  const { t } = useTranslation();
  //=================================================
  //=================================================
  // AUTH

  const { request, loading } = useHttp();

  const auth = useContext(AuthContext);

  //=================================================
  //=================================================

  const history = useHistory();

  //=================================================
  //=================================================

  const toast = useToast();

  const notify = useCallback((data) => {
    toast({
      title: data.title && data.title,
      description: data.description && data.description,
      status: data.status && data.status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  }, []);

  //=================================================
  //=================================================

  const [currentPage, setCurrentPage] = useState(0);
  const [countPage, setCountPage] = useState(10);

  const indexLastUser = (currentPage + 1) * countPage;
  const indexFirstUser = indexLastUser - countPage;

  //=================================================
  //=================================================

  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

  //=================================================
  //=================================================

  const [currentClients, setCurrentClients] = useState([]);
  const [searchStorage, setSearchStrorage] = useState([]);

  const getConnectors = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/offlineclient/client/getall`,
          "POST",
          { clinica: auth.clinica._id, beginDay, endDay },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setSearchStrorage(data);
        setCurrentClients(data.slice(indexFirstUser, indexLastUser));
      } catch (error) {
        notify({
          title: t(`${error}`),
          description: "",
          status: "error",
        });
      }
    },
    [request, auth, notify, setSearchStrorage, indexFirstUser, indexLastUser]
  );

  const deleteClient = async (connector) => {
    try {
      const data = await request(
        `/api/offlineclient/client/delete`,
        "POST",
        { clinica: auth.clinica._id, ...connector },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      await getConnectors(beginDay, endDay);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  //=================================================
  //=================================================

  const [name, setName] = useState("");

  const getByClientName = async () => {
    try {
      const data = await request(
        `/api/offlineclient/client/getallreseption`,
        "POST",
        { clinica: auth && auth?.clinica?._id, name },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setSearchStrorage(data);
      setCurrentClients(data);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  //=================================================
  //=================================================

  const getConnectorsByClientBorn = async (e) => {
    try {
      const data = await request(
        `/api/offlineclient/client/getallreseption`,
        "POST",
        { clinica: auth && auth.clinica._id, clientborn: new Date(e) },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setSearchStrorage(data);
      setCurrentClients(data);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  //=================================================
  //=================================================

  const [baseUrl, setBaseUrl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request("/api/baseurl", "GET", null);
      setBaseUrl(data.baseUrl);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  //=================================================
  //=================================================

  const componentRef = useRef();
  const print = useReactToPrint({
    content: () => componentRef.current,
  });

  const [printBody, setPrintBody] = useState({
    connector: {},
    client: {},
    services: [],
  });

  const handlePrint = (connector) => {
    setPrintBody(connector);
    setTimeout(() => {
      print();
    }, 1000);
  };

  const searchName = (e) => {
    const searching = searchStorage.filter((item) =>
      item.client.fullname.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setCurrentClients(searching.slice(0, countPage));
    setName(e.target.value);
  };

  const setPageSize = (e) => {
    setCurrentPage(0);
    setCountPage(e.target.value);
    setCurrentClients(searchStorage.slice(0, e.target.value));
  };

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
  };

  const changeEnd = (e) => {
    const date = new Date(
      new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
        0,
        0,
        0,
        0
      )
    );
    setEndDay(date);
    getConnectors(beginDay, date);
  };

  const [s, setS] = useState();
  useEffect(() => {
    if (!s) {
      setS(1);
      getConnectors(beginDay, endDay);
      getBaseUrl();
    }
  }, [getConnectors, getBaseUrl, beginDay, endDay]);

  //=================================================
  //=================================================
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [national, setNational] = useState(null);

  const changeNational = (e) => {
    setNational(e.target.value);
  };

  const changeGender = (e) => {
    setGender(e.target.value);
  };

  const setSearch = () => {
    if (!age && !gender && !national) {
      setCurrentClients([...searchStorage]);
    } else if (age && gender && !national) {
      setCurrentClients(
        [...searchStorage].filter(
          (connector) =>
            new Date().getFullYear() -
              new Date(connector?.client?.born).getFullYear() ===
              age && connector?.client?.gender === gender
        )
      );
    } else if (age && national && !gender) {
      setCurrentClients(
        [...searchStorage].filter(
          (connector) =>
            new Date().getFullYear() -
              new Date(connector?.client?.born).getFullYear() ===
              age &&
            connector?.client?.national &&
            connector?.client?.national === national
        )
      );
    } else if (gender && national && !age) {
      setCurrentClients(
        [...searchStorage].filter(
          (connector) =>
            connector?.client?.gender === gender &&
            connector?.client?.national &&
            connector?.client?.national === national
        )
      );
    } else if (age && gender && national) {
      setCurrentClients(
        [...searchStorage].filter(
          (connector) =>
            new Date().getFullYear() -
              new Date(connector?.client?.born).getFullYear() ===
              age &&
            connector?.client?.national &&
            connector?.client?.national === national &&
            connector?.client?.gender === gender
        )
      );
    } else {
      age &&
        setCurrentClients(
          [...searchStorage].filter(
            (connector) =>
              new Date().getFullYear() -
                new Date(connector?.client?.born).getFullYear() ===
              age
          )
        );
      national &&
        setCurrentClients(
          [...searchStorage].filter(
            (connector) =>
              connector?.client?.national &&
              connector?.client?.national === national
          )
        );
      gender &&
        setCurrentClients(
          [...searchStorage].filter(
            (connector) => connector?.client?.gender === gender
          )
        );
    }
  };

  //=================================================
  //=================================================

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <Print
            baseUrl={baseUrl}
            clinica={auth && auth.clinica}
            connector={printBody}
          />
        </div>
      </div>
      <div className="content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="border-0 table-container">
              <div className="border-0 table-container">
                <div className="table-responsive">
                  <div className="bg-white flex items-center justify-between gap-2 p-2">
                    <div>
                      <select
                        className="form-control form-control-sm selectpicker"
                        placeholder={t("Bo'limni tanlang")}
                        onChange={setPageSize}
                        style={{ minWidth: "50px" }}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div>
                      <input
                        onChange={searchName}
                        style={{ maxWidth: "200px", minWidth: "100px" }}
                        type="search"
                        className="w-100 form-control form-control-sm selectpicker"
                        placeholder={t("F.I.Sh")}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (name
                            ? getByClientName()
                            : getConnectors(beginDay, endDay))
                        }
                      />
                    </div>
                    <div className="text-right">
                      <DatePickers changeDate={changeStart} />
                    </div>
                    <div>
                      <DatePickers changeDate={changeEnd} />
                    </div>
                    <div>
                      <Pagination
                        setCurrentDatas={setCurrentClients}
                        datas={searchStorage}
                        setCurrentPage={setCurrentPage}
                        countPage={countPage}
                        totalDatas={searchStorage.length}
                      />
                    </div>
                    <div>
                      <input
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          getConnectorsByClientBorn(e.target.value)
                        }
                        type="date"
                        name="born"
                        // onChange={(e) => setClientBorn(e.target.value)}
                        className="form-control inp"
                        placeholder=""
                        style={{ color: "#999" }}
                      />
                    </div>
                    <div>
                      <input
                        onChange={(e) =>
                          e.target.value === 0
                            ? setAge(0)
                            : e.target.value > 0
                            ? setAge(+e.target.value)
                            : setAge(null)
                        }
                        style={{ maxWidth: "200px", minWidth: "100px" }}
                        type="number"
                        className="w-100 form-control form-control-sm selectpicker"
                        placeholder={t("Yoshi")}
                      />
                    </div>
                    <div>
                      <select
                        className="form-control form-control-sm selectpicker"
                        placeholder={t("Jinsi")}
                        onChange={changeGender}
                        style={{ minWidth: "50px" }}
                      >
                        <option value={""}>{t("Jinsi")}</option>
                        <option value={"man"}>{t("Erkak")}</option>
                        <option value={"woman"}>{t("Ayol")}</option>
                      </select>
                    </div>
                    <div>
                      <select
                        className="form-control form-control-sm selectpicker"
                        placeholder={t("Fuqoroligi")}
                        onChange={changeNational}
                        style={{ minWidth: "50px" }}
                      >
                        <option value={""}>{t("Fuqoroligi")}</option>
                        <option value={"uzb"}>{t("Uzbek")}</option>
                        <option value={"foreigner"}>{t("Chet'ellik")}</option>
                      </select>
                    </div>
                    <div>
                      <button
                        className="btn btn-success py-0"
                        onClick={(e) => {
                          e.preventDefault();
                          setSearch();
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                  <table className="table m-0">
                    <thead>
                      <tr>
                        <th className="border-right bg-alotrade text-[16px]">
                          №
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Kelgan vaqti")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("F.I.Sh")}
                          {/* <Sort
                                                    data={currentUsers}
                                                    setData={setCurrentUsers}
                                                    property={'lastname'}
                                                /> */}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("ID")}
                        </th>

                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Tel")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Manzil")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Yoshi")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Jinsi")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Fuqoroligi")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Tug'ilgan san'asi")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px]">
                          {t("Yunaltiruvchi shifokor")}
                        </th>
                        <th className="border-right bg-alotrade text-[16px] text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentClients.length > 0 &&
                        conns.map((connector, key) => {
                          return (
                            <tr key={key}>
                              <td className="border-right text-[16px] font-weight-bold">
                                {key + 1}
                              </td>
                              <td className="border-right text-[16px]">
                                {new Date(
                                  connector?.createdAt
                                ).toLocaleDateString()}{" "}
                                {
                                  new Date(connector?.createdAt)
                                    .toLocaleTimeString()
                                    .split(" ")[0]
                                }
                              </td>
                              <td className="border-right text-[16px]">
                                {connector?.client?.fullname}
                              </td>
                              <td className="border-right text-[16px]">
                                {connector?.client?.id}
                              </td>
                              <td className="border-right text-[16px]">
                                {"+998" + connector?.client?.phone}
                              </td>
                              <td className="border-right text-[16px]">
                                {connector?.client?.address}
                              </td>
                              <td className="border-right text-[16px]">
                                {new Date().getFullYear() -
                                  new Date(
                                    connector?.client?.born
                                  ).getFullYear()}
                              </td>
                              <td className="border-right text-[16px]">
                                {connector?.client?.gender
                                  ? connector?.client?.gender === "man"
                                    ? t("Erkak")
                                    : t("Ayol")
                                  : ""}
                              </td>
                              <td className="border-right text-[16px]">
                                {connector?.client?.national
                                  ? connector?.client?.national === "uzb"
                                    ? t("Uzbek")
                                    : t("Chet'ellik")
                                  : ""}
                              </td>
                              <td className="border-right text-[16px]">
                                {new Date(
                                  connector?.client?.born
                                ).toLocaleDateString()}
                              </td>
                              <td className="border-right text-[16px]">
                                {connector.services.find(
                                  (el) => el?.counterdoctor
                                )?.counterdoctor && (
                                  <span>
                                    {
                                      connector.services.find(
                                        (el) => el?.counterdoctor
                                      ).counterdoctor.firstname
                                    }{" "}
                                    {
                                      connector.services.find(
                                        (el) => el?.counterdoctor
                                      ).counterdoctor.lastname
                                    }
                                  </span>
                                )}
                              </td>
                              <td className="border py-1 text-center text-[16px]">
                                {loading ? (
                                  <button className="btn btn-success" disabled>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Loading...
                                  </button>
                                ) : (
                                  <div className={"flex flex-row gap-x-3"}>
                                    <button
                                      onClick={() =>
                                        history.push(
                                          "/alo24/statsionarclient_history",
                                          {
                                            connector,
                                            clinica: auth?.clinica,
                                            user: auth?.user,
                                            baseUrl,
                                          }
                                        )
                                      }
                                      className="btn btn-primary py-0"
                                    >
                                      <FontAwesomeIcon icon={faPenAlt} />
                                    </button>

                                    <button
                                      onClick={() => deleteClient(connector)}
                                      className="btn btn-danger py-0"
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfflineClients;
