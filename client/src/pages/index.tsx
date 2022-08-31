import DropZoneComponent from "@components/DropZoneComponent";
import RenderFile from "@components/RenderFile";
import { useState } from "react";
export default function Home() {
  const [file,setFile] = useState(null);
  // debo hacer npm install --save react-dropzone
  console.log({file});
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">
        Got a File? Share it like fake news
      </h1>
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-96 rounded-xl">
        {/*dropzone*/}
        <DropZoneComponent setFile={setFile}></DropZoneComponent>
        {/*render file*/}
        {file && (
        <RenderFile file={{format:file.type.split("/")[1],name:file.name,sizeInBytes:file.size}} />)}
        {file?.name}
        {/*upload button */}
        <button></button>
      </div>
    </div>
  );
}