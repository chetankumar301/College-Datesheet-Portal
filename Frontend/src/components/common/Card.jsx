export default function Card({

title,

value,

icon,

color="#2563eb"

}){

return(

<div

className="card"

style={{

borderLeft:`6px solid ${color}`

}}

>

<div

className="card-icon"

style={{

color

}}

>

{icon}

</div>

<div>

<h3>

{title}

</h3>

<h1>

{value}

</h1>

</div>

</div>

);

}