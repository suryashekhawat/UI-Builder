import saveAs from 'file-saver';
import JSZip from 'jszip';
import { getBeautifiedHtml } from './dom';
import {
    defaultHtmlFilename, defaultZipFilename, defaultJavaScriptFilename,
    defaultBundledHtmlFilename
} from '../shared';
import { generateSharedJSCode, getThemeContent } from './jsoup';

$('#dialog-form').find('input[type=radio]').checkboxradio();
const form = $('#dialog-form').find('form');
form.find('label').tooltip();
const themesForm = $('#themes-dialog').find('form');

const dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 350,
    width: 600,
    modal: true,
    buttons: {
        Export() {
            const value = $('input[name=file]:checked', form).val();
            if (value === defaultBundledHtmlFilename
                || value === defaultHtmlFilename
                || value === defaultZipFilename) {
                const text = getBeautifiedHtml(window.FrameDocument, false, value === defaultBundledHtmlFilename);
                if (value === defaultBundledHtmlFilename || value === defaultHtmlFilename) {
                    const blob = new Blob([text], { type: "text/html;charset=utf-8" });
                    saveAs(blob, value);
                } else {
                    const zip = new JSZip();
                    zip.file(defaultHtmlFilename, text);
                    zip.file(defaultJavaScriptFilename, generateSharedJSCode());
                    zip.generateAsync({ type: 'blob' }).then(blob => {
                        saveAs(blob, defaultZipFilename);
                    });
                }
            } else if (value === defaultJavaScriptFilename) {
                const js = generateSharedJSCode();
                const blob = new Blob([js], { type: 'text/javascript;charset=utf-8' });
                saveAs(blob, defaultJavaScriptFilename);
            }
        },
        Cancel() {
            dialog.dialog('close');
        }
    },
    close: function () {
        form[0].reset();
    }
});

const themesDialog = $("#themes-dialog").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
        Apply() {
            const value = $('input[name=file]:checked', form).val();
            if (value === defaultBundledHtmlFilename
                || value === defaultHtmlFilename
                || value === defaultZipFilename) {
                const text = getBeautifiedHtml(window.FrameDocument, false, value === defaultBundledHtmlFilename);
                if (value === defaultBundledHtmlFilename || value === defaultHtmlFilename) {
                    const blob = new Blob([text], { type: "text/html;charset=utf-8" });
                    saveAs(blob, value);
                } else {
                    const zip = new JSZip();
                    zip.file(defaultHtmlFilename, text);
                    zip.file(defaultJavaScriptFilename, generateSharedJSCode());
                    zip.generateAsync({ type: 'blob' }).then(blob => {
                        saveAs(blob, defaultZipFilename);
                    });
                }
            } else if (value === defaultJavaScriptFilename) {
                const js = generateSharedJSCode();
                const blob = new Blob([js], { type: 'text/javascript;charset=utf-8' });
                saveAs(blob, defaultJavaScriptFilename);
            }
        },
        Download() {
            const filename = themesForm.find('select option:selected').val();
            getThemeContent(filename).then(data => {
                const blob = new Blob([data], { type: 'text/css;charset=utf-8' });
                saveAs(blob, filename);
            });
        }
    },
    close: function () {
        themesForm[0].reset();
    }
});

export {
    dialog,
    themesDialog,
    themesForm
};