import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { EditorContent } from '@tiptap/react'
import {
    FaBold,
    FaHeading,
    FaItalic,
    FaListOl,
    FaListUl,
    FaQuoteLeft,
    FaRedo,
    FaStrikethrough,
    FaUnderline,
    FaUndo
} from "react-icons/fa";
import { BsList, BsTable, BsTextCenter, BsTextLeft, BsTextRight } from 'react-icons/bs';
import { RiDeleteColumn, RiDeleteRow, RiInsertColumnLeft, RiInsertColumnRight, RiInsertRowBottom, RiInsertRowTop } from 'react-icons/ri';
import { TbTableOff } from 'react-icons/tb';
import './style.css'
import { useTranslation } from 'react-i18next';


const RegisterTemplate = ({ setTemplate, template, createHandler, editor }) => {

    const {t} = useTranslation()

    if (!editor) {
        return null;
    }
    return (
        <div className="my-4 shadow-lg">
            <div className="w-full text-sm border border-collapse">
                <div className="bg-alotrade">
                    <div className="border border-collapse p-2">
                        <div className='bg-alotrade py-1'>
                            <p className='text-center text-[18px] font-bold text-white'>{t("Nomi")}</p>
                        </div>
                        <div className='bg-alotrade text-center py-1'>
                            <input
                                value={template?.name}
                                placeholder={t("Shablon nomi kiritish")}
                                className="w-[200px] border outline-0 rounded-sm p-1"
                                onChange={(e) => {
                                    setTemplate({ ...template, name: e.target.value })
                                }}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="border border-collapse p-2">
                        <div className='py-1'>
                            <p className='text-center text-[18px] font-bold text-white'>{t("Shablon")}</p>
                            <div className="flex gap-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaBold />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleItalic().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaItalic />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaUnderline />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleStrike().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaStrikethrough />
                                    </button>
                                    <button
                                        onClick={() =>
                                            editor.chain().focus().toggleHeading({ level: 6 }).run()
                                        }
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaHeading className="heading3" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaListUl />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaListOl />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaQuoteLeft />
                                    </button>
                                </div>
                                <div>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().undo().run()}>
                                        <FaUndo />
                                    </button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().redo().run()}>
                                        <FaRedo />
                                    </button>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <BsTextLeft />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <BsTextCenter />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <BsTextRight />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <BsList />
                                    </button>
                                    {/* <button
                                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                    className="bg-slate-200 rounded-g p-2"
                                >
                                    justify
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().unsetTextAlign().run()}>unsetTextAlign</button> */}
                                </div>
                                <div className='flex gap-2 flex-wrap'>
                                    <button className="bg-slate-200 rounded-g p-2"
                                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                                        }
                                    >
                                        <BsTable />
                                    </button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addColumnBefore().run()}>
                                        <RiInsertColumnLeft />
                                    </button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addColumnAfter().run()}><RiInsertColumnRight /></button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteColumn().run()}><RiDeleteColumn /></button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addRowBefore().run()}><RiInsertRowTop /></button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addRowAfter().run()}><RiInsertRowBottom /></button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteRow().run()}><RiDeleteRow /></button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteTable().run()}><TbTableOff /></button>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <div className='bg-white w-[28cm]'>
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                    </div>
                    <div className="border border-collapse py-2 bg-white px-2 text-right">
                        <button
                            className="px-8 py-1 bg-teal-500 text-white hover:bg-teal-600 rounded-sm "
                            onClick={createHandler}
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} className="text-base" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterTemplate;
