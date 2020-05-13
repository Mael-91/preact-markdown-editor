import { h, render } from "preact";
import Editor from './editor'

let editors = document.querySelectorAll('markdown-editor')

editors.forEach((editor) => {
  let textarea = editor.querySelector("textarea")
  let value = textarea.value
  let name = textarea.getAttribute('name')
  editor.innerHTML = ''
  render(<Editor value={value} name={name}></Editor>, editor, editor.firstChild)
})