import Button from "./Button";

export default class SpeechButton extends Button {

    shortcut = 'Ctrl-N'

    render (props, state) {
        return window.hasOwnProperty('webkitSpeechRecognition') ? super.render(props, state) : null
    }

    icon (props, {listening}) {
        let style = null
        if (listening) {
            style = 'fill: #FF0000'
        }
        return <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style={style}>
                <path d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96
            96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48
            250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84
            0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71
            418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"/>
            </svg>
            {this.buttonText()}
        </div>
    }

    buttonText() {
        return this.props.buttonText
    }

    action (editor) {
        let recognition = new webkitSpeechRecognition()
        recognition.lang = 'fr-FR'
        recognition.continuous = false
        recognition.interimResults = false
        recognition.start()
        this.setState({listening: true})
        recognition.onresult = (e) => {
            let result = e.results.item(e.resultIndex)
            if (result.isFinal === true) {
                let transcript = result.item(0).transcript
                if (this.shouldCapitalize()) {
                    transcript = this.capitalize(transcript)
                }
                editor.getDoc().replaceSelection(transcript)
            }
            this.setState({listening: false})
        }
        editor.focus()
    }

    shouldCapitalize () {
        let cursor = this.props.editor.getCursor()
        let startSentence = this.props.editor.getDoc().getRange({
            line: cursor.line,
            ch: 0
        }, cursor).trim().endsWith('.')
        if (cursor.ch === 0 || startSentence) {
            return true
        }
    }

    capitalize (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
}