/*
 Uses esprima and error checking from code evaluation to show linter errors
To do: switcht to js lint!
*/
export const jsLinter = () => (view) => {
    // console.log('calling linter', view, window.lintInfo)
    const doc = view.state.doc

    if(window.lintInfo !== undefined && window.lintInfo.hasBeenShown === false) {
        const { lineNumber, index, message } = window.lintInfo
        const line = doc.line(lineNumber).from 
        //+ index
        window.lintInfo.hasBeenShown = true
        return [{
            from: line,
            message: message,
            severity: 'error',
            to: line
        }]
    }
    const currString = view.state.doc.toString()

    try {
        const parsed = esprima.parseScript(currString)
    } catch (e) {
        // console.log('caught linter', e)
        const from = doc.line(e.lineNumber).from + e.column
        // console.log('from', from)
        return [{
            from: from - 1,
            message: e.description,
            severity: 'warning',
            to: from
        }]
    }

    // console.log('view', view, doc)
    return [{ severity: 'info', message: '//', from: 0, to: 0}]
}

// shows runtime errors inside of linting panel
// export const evalLinter = () => (view) => {

    // DETECT ERRORS FROM RUNNING CODE --- note: this should not happen here! only when code is run


//     window.lintInfo = {}
//     const showLint = (err) => {
//         console.log('lint', err)
//         const stack = err.stack.split("\n")
//         const lines = stack[1].split(':')
//         const lineNumber = parseFloat(lines[1]) - 1
//         const index = lines[2]
//         //  const from = doc.line(lineNumber).from + e.column
//         console.log('lineNumber', lineNumber, index)
//         window.lintInfo = { lineNumber, index, message: err.message }
//     }

//     const jsString = `try {
// ${currString}
// } catch (err) {
//         console.log('CAUGHT ERROR', err)
//         const showLint = ${showLint}
//         showLint(err)
// }`

//     console.log('STRING', jsString, window.lintInfo)


//     var element = document.createElement("script");

//     try {
//         element.language = "javascript";
//         element.type = "text/javascript";
//         element.defer = true;
//         element.innerHTML = jsString

//         //element.text = "try{callingAnonymousMethod();} catch(ex) {alert('error caught');}";
//         var head = document.getElementsByTagName('head')[0];
//         head.appendChild(element);
//     } catch (err) {
//         console.log("error caught", err);
//         //   return[]
//     } finally {
//         console.log('run at the end', window.lintInfo)
//         if (window.lintInfo && window.lintInfo.message) {
//             const { lineNumber, index, message } = window.lintInfo
//             const from = doc.line(lineNumber).from + parseFloat(index)
//             //+ index
//             return [{
//                 from: from - 1,
//                 severity: 'error',
//                 message: message,
//                 to: from
//             }]
//         } else {
//             return []
//         }
//         document.head.removeChild(element)
//     }
 