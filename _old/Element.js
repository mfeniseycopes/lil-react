
const createElement = (type, props, ...children) => ({
  type,
  props: { ...props, children }, 
}) 


export default createElement 
