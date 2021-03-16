import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';


const RichTextEditor = ({ text, setText }) => {
    const editorConfiguration = {
        toolbar: [ 'heading', 'bold', 'italic', 'bulletedList', 'numberedList', 'outdent', 'indent', 'blockQuote', 'insertTable', 'undo', 'redo' ]
    };

    return (
        <CKEditor
            editor={ClassicEditor}
            config={ editorConfiguration }
            data={text}
            onChange={(e, editor) => {
                const data = editor.getData();
                setText(data);
            }}
        />
    )
}

export default RichTextEditor;
