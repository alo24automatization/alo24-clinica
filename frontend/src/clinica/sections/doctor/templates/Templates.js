import React, { useCallback, useContext, useEffect, useState } from 'react';
import RegisterTemplate from "./RegisterTemplate";
import { Modal } from "./../components/Modal";
import { useToast } from "@chakra-ui/react";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { ExcelCols } from "./uploadExcel/ExcelCols";
import TableTemplate from "./TableTemplate";
import { checkTemplates } from "./uploadExcel/checkData";

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from "@tiptap/extension-underline";
import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from "@tiptap/extension-text-style"
import { useTranslation } from 'react-i18next';

const Templates = () => {
    //====================================================================
    //====================================================================
    // Pagenation
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastTemplate = (currentPage + 1) * countPage
    const indexFirstTemplate = indexLastTemplate - countPage
    const [currentTemplates, setCurrentTemplates] = useState([])
    const [searchStorage, setSearchStrorage] = useState()

    //====================================================================
    //====================================================================
    const {t} = useTranslation()
    //====================================================================
    //====================================================================
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [remove, setRemove] = useState()

    const clearInputs = useCallback(() => {
        const inputs = document.getElementsByTagName('textarea')
        for (const input of inputs) {
            input.value = ''
        }
    }, [])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const toast = useToast()

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            })
        },
        [],
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const { request, loading } = useHttp()
    const auth = useContext(AuthContext)

    const [templates, setTemplates] = useState([])
    const [template, setTemplate] = useState({})

    const [templateText, setTemplateText] = useState('')

    const getTemplates = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/template/getall`,
                'POST',
                { clinica: auth.clinica._id, doctor: auth.user._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setTemplates(data)
            setSearchStrorage(data)
            setCurrentTemplates(data.slice(indexFirstTemplate, indexLastTemplate))
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [
        request,
        auth,
        notify,
        setCurrentTemplates,
        indexLastTemplate,
        indexFirstTemplate,
        setSearchStrorage,
    ])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [imports, setImports] = useState([])
    const [changeImports, setChangeImports] = useState([])
    const sections = [
        { name: 'Shablon nomi', value: 'name' },
        { name: "Shablon", value: 'template' }
    ]
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentTemplates(templates.slice(0, e.target.value))
        },
        [templates],
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Handlers

    const checkUploadData = () => {
        if (checkTemplates(changeImports))
            return notify(checkTemplates(imports))
        createAllHandler()
    }

    const createHandler = async () => {
        if (!template.name) {
            return notify({
                title: t("Diqqat! Shablon nomini kiriting."),
                description: '',
                status: 'error',
            })
        }
        if (!templateText) {
            return notify({
                title: t("Diqqat! Shablonni kiriting."),
                description: '',
                status: 'error',
            })
        }
        try {
            const data = await request(
                `/api/doctor/template/create`,
                'POST',
                { template: { ...template, template: templateText, clinica: auth.clinica._id, doctor: auth.user._id } },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} ${t("shabloni yaratildi!")}`,
                description: '',
                status: 'success',
            })
            getTemplates()
            setTemplate({})
            setTemplateText('')
            clearInputs()
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }

    const createAllHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/template/createall`,
                'POST',
                { templates: [...changeImports], clinica: auth.clinica._id, doctor: auth.user._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            localStorage.setItem("data", data)
            notify({
                title: t(`Shablonlar yaratildi!`),
                description: '',
                status: 'success',
            })
            getTemplates()
            clearInputs()
            setModal2(false)
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, notify, clearInputs, getTemplates, changeImports])

    const deleteHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/template/delete`,
                'POST',
                { template: { ...remove } },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} ${t("shabloni o'chirildi!")}`,
                description: '',
                status: 'success',
            })
            getTemplates()
            setRemove()
            clearInputs()
            setModal(false)
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, getTemplates, remove, notify, clearInputs])

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // SEARCH

    const searchTemplate = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.template.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setTemplates(searching)
            setCurrentTemplates(searching.slice(0, countPage))
        },
        [searchStorage, countPage],
    )

    const searchName = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.name.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setTemplates(searching)
            setCurrentTemplates(searching.slice(0, countPage))
        },
        [searchStorage, countPage],
    )
    //====================================================================
    //====================================================================

    const editor = useEditor({
        extensions: [
            StarterKit,
            Document,
            Paragraph,
            Text,
            Gapcursor,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setTemplateText(html);
        },
    })

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState()
    useEffect(() => {
        if (!s) {
            setS(1)
            getTemplates()
        }
    }, [getTemplates, s])
    //====================================================================
    //====================================================================

    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <RegisterTemplate
                        template={template}
                        setTemplate={setTemplate}
                        createHandler={createHandler}
                        templateText={templateText}
                        setTemplateText={setTemplateText}
                        editor={editor}
                    />

                    <TableTemplate
                        setTemplate={(e) => {
                            setTemplate(e)
                            setTemplateText(e.template)
                            if (editor) {
                                editor.commands.setContent(e.template);
                            }
                        }}
                        templates={templates}
                        currentTemplates={currentTemplates}
                        setModal={setModal}
                        setCurrentTemplates={setCurrentTemplates}
                        setModal2={setModal2}
                        countPage={countPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setRemove={setRemove}
                        loading={loading}
                        setImports={setImports}
                        setPageSize={setPageSize}
                        searchName={searchName}
                        searchTemplate={searchTemplate}
                    />

                    <Modal
                        modal={modal2}
                        setModal={setModal2}
                        handler={checkUploadData}
                        text={
                            <ExcelCols
                                createdData={changeImports}
                                setData={setChangeImports}
                                data={imports}
                                sections={sections}
                            />
                        }
                    />

                    <Modal
                        modal={modal}
                        setModal={setModal}
                        handler={deleteHandler}
                        text={t("shablonini ochirishni tasdiqlaysizmi?")}
                        basic={remove && remove.name}
                    />
                </div>
            </div>
        </div>
    );
};

export default Templates;
