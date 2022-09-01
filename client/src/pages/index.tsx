import DownloadFile from "@components/DownloadFile";
import DropZoneComponent from "@components/DropZoneComponent";
import RenderFile from "@components/RenderFile";
import axios from "axios";
import { useState } from "react";
export default function Home() {
  const [file,setFile] = useState(null);
  const [id, setId] = useState(null);
  const [downloadPageLink, setDownloadPageLink] = useState(null);
  const [uploadState, setUploadState] = useState<"Uploading"|"Upload Failed"|"Uploaded"|"Upload">("Upload");
  // debo hacer npm install --save react-dropzone

  const handleUpload = async () => {
    if (uploadState === "Uploading") return;
    setUploadState("Uploading");
    const formData= new FormData();// es el objeto encargado de representar los datos de los formularios HTML.
    formData.append("myFile",file);
    try {
      const {data} = await axios({
        method:"post",
        data:formData,
        url:"api/files/upload",
        headers:{
          "Content-Type":"multipart/form-data",
        }
      });
      setDownloadPageLink(data.downloadPageLink);
      setId(data.id);
    } catch (error) {
      console.log(error.response.data);
      setUploadState("Upload Failed")
    }
  };
  //console.log({file});
  const resetComponent=()=>{
    setFile(null);
    setDownloadPageLink(null);
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">
        Got a File? Share it like fake news
      </h1>
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-96 rounded-xl">
        {/*dropzone*/}
        {!downloadPageLink && <DropZoneComponent setFile={setFile}></DropZoneComponent>}
        
        {/*render file*/}
        {file && (
        <RenderFile file={{format:file.type.split("/")[1],name:file.name,sizeInBytes:file.size}} />)}
        {file?.name}
        {/*upload button */}
        {!downloadPageLink && file && (
          <button className="p-2 my-5 bg-gray-900 rounded-md w-44 focus:outline-none" 
          onClick={handleUpload}>{uploadState}</button>
        )}
        
        { downloadPageLink && (
          <div className="p-2 text-center">
            <DownloadFile downloadPageLink={downloadPageLink} />
            
            <button className="p-2 my-5 bg-gray-900 rounded-md w-44 focus:outline-none"
                    onClick={resetComponent}>
              Upload New File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}