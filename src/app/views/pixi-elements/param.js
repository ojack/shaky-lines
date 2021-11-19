module.exports = (_param) => {
   const param = _param
   param.baseValue = param.get()
   param.set = (val) => {
       param.baseValue = val
       // check whether there is an update function or not
       if(!param._update) param._set(val)
   }
   param.update = (code = "") => {
       console.log(code)

       param.code = code
       if(code === "") {
           delete param._update
           console.log('deleting', param)
       }
       param._update = (p, t) => {
         // console.log(code,  p, t)
          if(code === "") {
            delete param._update
            console.log('deleting', param)
        } else {
            try {
                const val = eval(code)
                console.log('evaled',val)
                param._set(val)
            } catch {
                console.warn('could not eval', code)
            }
        }
       }
   }

   return param 
}