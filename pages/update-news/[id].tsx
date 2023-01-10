import React, { useState } from 'react';
import axios from "axios";
import Layouts from "../../components/layouts";
import { parseCookies } from "../../helpers";
import { useRouter } from 'next/router';

interface UpdateNewsProps {
  token: string,
  detailNews: any,
  baseUrl: string
}


export default function UpdateNews(props: UpdateNewsProps) {
  const router = useRouter()
  const [updateState, setUpdateState] = useState({
    id: props.detailNews.id,
    title: props.detailNews.title,
    body: props.detailNews.body,
    image: props.detailNews.image,
    update: true,
  })

  const UpdateImage = () => {
    setUpdateState({
      ...updateState,
      update: false,
    })
  }

  const UpdateNewsData = async (e: any) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('title', updateState.title);
      formData.append('body', updateState.body);
      if (typeof updateState.image === 'string') {
        const fileName: any = updateState.image.split('/').at(-1);
        const dataFile = fetch(updateState.image)
          .then(async response => {
            // const contentType: any = response.headers.get('content-type')
            const blob: any = await response.blob()
            const file = new File([blob], fileName, {})
            return file
          })
        formData.append('image', await dataFile);
        // console.log('FILE IMAGE', await dataFile)
      }
      if (typeof updateState.image === 'object') {
        formData.append('image', updateState.image);
      }
      const updateNews = await axios.post(`${props.baseUrl}/candidates/update_news/${updateState.id}`, formData, {
        headers: {
          Authorization: `${props.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      if (updateNews.status === 200) {
        alert('Success Update News')
        return router.push('/list-news')
      }
    } catch (err: any) {
      if (err?.response) {
        alert(err.response.data.message)
      }
    }
  }
  const getImageValue = async (e: any) => {
    setUpdateState({
      ...updateState,
      image: e.target.files[0],
    })
  }
  return (
    <Layouts>
      <div className='flex flex-1 px-3'>
        <div className="text-xl">
          <p>Update News</p>
        </div>
        <div className="flex-1 justify-start items-center mt-20 border-2 px-20 py-6" style={{
          width: '100vh'
        }}>
          <form className="flex flex-1 flex-col gap-5" method='post' onSubmit={UpdateNewsData}>
            <div>

              <div>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                <input type="text" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={updateState.title} onChange={(e) => setUpdateState({
                  ...updateState,
                  title: e.target.value
                })} />
              </div>
              <div>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Body</label>
                <textarea id="about" name="about" required className="w-full bg-transparent border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 resize-none placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Let the world know who you are" rows={5} defaultValue={""} value={updateState.body}
                  onChange={(e) => setUpdateState({
                    ...updateState,
                    body: e.target.value
                  })} />
              </div>
              <div>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
                {!updateState.update && (

                  <input type="file" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => getImageValue(e)} />
                )}
                {updateState.update && (
                  <div className='flex flex-1 flex-row justify-around'>
                    <img src={`${updateState.image}`} />
                    <button className='bg-yellow-300 text-white px-4 py-3' onClick={UpdateImage}>
                      Update
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </form>
        </div>
      </div>
    </Layouts>
  )
}

export async function getServerSideProps(ctx: any) {
  const parseToken = parseCookies(ctx.req)
  const GetDetailsNews = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/candidates/detail_news/${ctx.params.id}`, {
    headers: {
      Authorization: `Bearer ${parseToken.token}`,
    },
  })
  console.log('List News', GetDetailsNews.data.data)
  return {
    props: {
      token: parseToken.token,
      detailNews: GetDetailsNews.data.data,
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
    },
  }
}
