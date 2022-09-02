import RenderFile from "@components/RenderFile";
import axios from "axios";
import { IFile } from "libs/types";
import { GetServerSidePropsContext, NextPage } from "next";

const index: NextPage<{file:IFile}>=({file:{format,name,sizeInBytes,id}})=>{
    return (
    <div className="flex flex-col items-center justify-center py-3 space-y-4 bg-gray-800 rounded-md shadow-xl w-96">
        {!id? (
            <span>oops! File does not exist! check the URL</span>
        ) : (
            <>
                <img src="/images/file-download.png" alt="" className="w-16 h-16"></img>
                <h1 className="text-xl">Your file is ready to be downloaded</h1>
                <RenderFile file={{format,name,sizeInBytes}}></RenderFile>
                <button className="button">Download</button>
            </>
        )}

    </div>)
};// 1:57:32

export default index;

export async function getServerSideProps(context:GetServerSidePropsContext) {
    const {id}=context.query;// el id lo saca del nombre de la 
    let file;
    try {
        const {data} = await axios.get(`http://localhost:8000/api/files/${id}`);
        file = data;
    } catch (error) {
        console.log(error.response.data);
        file = {};
    }

    return {
        props: {
            file,
        }, // will be passed to the page component as props
    };
}
