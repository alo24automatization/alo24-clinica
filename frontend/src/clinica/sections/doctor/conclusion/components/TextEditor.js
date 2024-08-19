import { useEditor, EditorContent } from '@tiptap/react'
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
    FaUndo,
} from "react-icons/fa";
import { BsList, BsTextCenter, BsTextLeft, BsTextRight } from 'react-icons/bs';


const TextEditor = ({ value, onChange, index }) => {
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
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            //   handleChangeTemplate(html, index, section._id)
            onChange(html, index)
        },
    })

    return <div>
        <div className='py-1'>
            <p className='text-center text-[18px] font-bold text-white'>Shablon</p>
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
            </div>
            <div className='flex gap-2 flex-wrap mt-2'>
                <button className="bg-slate-200 rounded-g p-2"
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                >
                    вставить таблицу
                </button>
                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addColumnBefore().run()}>
                    добавить столбец перед
                </button>
                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addColumnAfter().run()}>добавить столбец после</button>
                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteColumn().run()}>удалть столбец</button>
                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addRowBefore().run()}>добавить строку перед</button>
                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addRowAfter().run()}>добавить строку после</button>
                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteRow().run()}>удалить строку</button>
                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteTable().run()}>удалить таблицу</button>
            </div>
        </div>
        <div className='flex justify-center'>
            <div className=''>
                <EditorContent editor={editor} />
            </div>
        </div>
    </div>
}

export default TextEditor;