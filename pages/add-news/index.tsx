import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Layouts from "../../components/layouts";
import { parseCookies } from "../../helpers";

interface AddedNews {
  baseUrl: string;
  token: string;
}
export default function AddNews(props: AddedNews) {
  const router = useRouter()
  const [addedState, setAddedState] = useState({
    id: '',
    title: '',
    body: '',
    image: '',
  })



  const CreateNewNews = async (e: any) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('title', addedState.title);
      formData.append('body', addedState.body);
      formData.append('image', addedState.image);
      const addedNews = await axios.post(`${props.baseUrl}/candidates/add_news`, formData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      if (addedNews.status === 200) {
        alert('Success Added News')
        return router.push('/')
      }
    } catch (err: any) {
      if (err?.response) {
        alert(err.response.data.message)
      }
    }
  }
  const getImageValue = async (e: any) => {
    setAddedState({
      ...addedState,
      image: e.target.files[0],
    })
  }
  return (
    <Layouts>
      <div className='flex flex-1 px-3 my-5'>
        <div className="text-xl">
          <p>Added News</p>
        </div>
        <div className="flex-1 justify-start items-center mt-24 border-2 px-20 py-6" style={{
          width: '100vh'
        }}>
          <form className="flex flex-1 flex-col gap-5" method='post' onSubmit={CreateNewNews}>
            <div>

              <div>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                <input type="text" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={addedState.title} onChange={(e) => setAddedState({
                  ...addedState,
                  title: e.target.value
                })} />
              </div>
              <div>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Body</label>
                <textarea id="about" name="about" required className="w-full bg-transparent border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 resize-none placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Let the world know who you are" rows={5} defaultValue={""} value={addedState.body}
                  onChange={(e) => setAddedState({
                    ...addedState,
                    body: e.target.value
                  })} />
              </div>
              <div>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>

                <input type="file" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => getImageValue(e)} />

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

  return {
    props: {
      token: parseToken.token,
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
    },
  }
}
