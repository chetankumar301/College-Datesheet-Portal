import { useRef } from "react";

import { FaCloudUploadAlt } from "react-icons/fa";

export default function DragDropUpload({

    file,

    setFile

}){

    const inputRef=useRef();

    const onDrop=(e)=>{

        e.preventDefault();

        const selected=e.dataTransfer.files[0];

        validate(selected);

    };

    const validate=(selected)=>{

        if(!selected)return;

        if(selected.type!=="application/pdf"){

            alert("Only PDF Allowed");

            return;

        }

        if(selected.size>10*1024*1024){

            alert("Maximum Size 10 MB");

            return;

        }

        setFile(selected);

    };

    return(

        <div

            className="drop-area"

            onDragOver={(e)=>e.preventDefault()}

            onDrop={onDrop}

            onClick={()=>inputRef.current.click()}

        >

            <FaCloudUploadAlt size={70}/>

            <h2>

                Drag & Drop PDF Here

            </h2>

            <p>

                or Click to Select

            </p>

            <input

                ref={inputRef}

                hidden

                type="file"

                accept=".pdf"

                onChange={(e)=>validate(e.target.files[0])}

            />

        </div>

    );

}