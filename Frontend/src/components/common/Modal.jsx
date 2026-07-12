export default function Modal({

open,

title,

children,

onClose

}){

if(!open)return null;

return(

<div className="modal-overlay">

<div className="modal">

<h2>

{title}

</h2>

{children}

<button

onClick={onClose}

>

Close

</button>

</div>

</div>

);

}