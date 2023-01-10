import Layouts from "../../components/layouts";
import { parseCookies } from "../../helpers";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FaSortAmountDownAlt } from 'react-icons/fa'
import Link from "next/link";
import React, { useState } from 'react'



interface ListNews {
  baseUrl: string;
  token: string;
  list_news: Array<any>;
}




export default function ListNews(props: ListNews) {
  const [list_news, setListNews] = useState(props?.list_news);
  const [showModal, setShowModal] = useState({
    id: '',
    show: false,
    title: ''
  })
  const columns = [

    {
      name: "Title",
      selector: (row: any) => `${row.title.substring(0, 100)}`,
      sortable: true,
      reorder: true,
    },

    {
      name: "Action",
      cell: (data: any) => (
        <div className="flex flex-1 justify-center items-center gap-3">
          <Link href={`/update-news/${data.id}`} className="bg-yellow-400 px-3 py-2 text-white font-bold rounded-md">
            Update
          </Link>
          <button onClick={() => ShowModalConfrim({ id: data.id, title: data.title })} className="bg-red-400 px-3 py-2 text-white font-bold rounded-md" data-modal-target="default" data-modal-toggle="defaultModal">
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
      width: "270px",
    },
  ];

  const ShowModalConfrim = async (data: any) => {
    setShowModal({
      show: true,
      id: data.id,
      title: data.title
    })
  }
  const DeleteNews = async (data: any) => {
    console.log(data)
    console.log('token', data.token)
    try {
      const DeleteNews = await axios.post(`https://www.onegml.com/dlsapi/index.php/candidates/delete_news`, {
        idnews: parseInt(data.id)
      }, {
        headers: {
          Authorization: `Bearer ${props?.token}`,
        },
      })
      console.log('Delete news', DeleteNews)
      const GetListNews = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/candidates/list_news`, {
        headers: {
          Authorization: `Bearer ${props?.token}`,
        },
      })
      setListNews(GetListNews.data.data)
      setShowModal({
        show: false,
        id: '',
        title: ''
      })

    } catch (err: any) {
      if (err?.response) {
        alert(err.response.data.message)
      }
    }
  }

  return (
    <Layouts>

      <div className='flex flex-1 justify-center mx-10 my-5'>
        {/* content */}
        <div>
          {/* looping */}
          <DataTable
            title="List News"
            noDataComponent={"Data tidak ditemukan"}
            columns={columns}
            data={list_news}
            defaultSortFieldId={1}
            sortIcon={<FaSortAmountDownAlt />}
            pagination
            striped
          />

        </div>
        {showModal.show === true && (
          <div>
            {/* Modal toggle */}
            {/* Main modal */}
            <div id="defaultModal" tabIndex={-1} aria-hidden="true" className=" flex flex-1 justify-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-y-auto md:inset-0 h-modal md:h-full">
              <div className="relative w-full h-full max-w-2xl md:h-auto">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  {/* Modal header */}
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Terms of Service
                    </h3>
                    <button onClick={(e: any) => setShowModal({
                      ...showModal,
                      show: !showModal.show
                    })} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                      <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <div className="p-6 space-y-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      Are You Sure  Want To Delete {showModal.title}
                    </p>

                  </div>
                  {/* Modal footer */}
                  <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button data-modal-hide="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => DeleteNews({ id: showModal.id })}>I accept</button>
                    <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={(e: any) => setShowModal({
                      ...showModal,
                      show: !showModal.show
                    })}>Decline</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layouts >
  )
}

export async function getServerSideProps(ctx: any) {
  const parseToken = parseCookies(ctx.req)
  const GetListNews = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/candidates/list_news`, {
    headers: {
      Authorization: `Bearer ${parseToken.token}`,
    },
  })
  console.log('List News', GetListNews.data.data)
  return {
    props: {
      token: parseToken.token,
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      list_news: GetListNews.data.data
    },
  }
}
