import type { GetServerSideProps } from 'next'
import { useState } from 'react'
import { prisma } from '../lib/prisma'
import { useRouter } from 'next/router' 

interface Work{
  work: {
    id: string
    task: string
  
  }[]
}

interface FormData {
  task: string
  id: string
}

const Home = ({work}: Work) => {
  const [form, setForm] = useState<FormData>({task: '', id: ''});
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath)
  };

  async function create(data: FormData) {
    try {
      fetch('/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(() => {
        if(data.id) {
          deleteWorks(data.id)
          setForm({task: '', id: ''})
          refreshData()
        } else {
          setForm({task: '', id: ''})
          refreshData()

        }
    }
      )
    } catch (error) {
      console.log(error)
    }
  };

  async function deleteWorks(id: string) {
    try {
      fetch(`/api/work/${id}`, {
        headers: {
          'content-Type': 'application/json'
        },
        method: 'DELETE'
      }).then(() => {
        refreshData()
      })
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmit = async (data: FormData) => {
    try {
      create(data)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen ml-4 mr-4">
      <h1 className="text-center font-bold text-3xl mt-4">TODO-LIST</h1>
      <form onSubmit={e => {
        e.preventDefault(),
        handleSubmit(form)
      }} className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch">
        <input type="text" 
        placeholder="Add task here...." 
        value={form.task} 
        onChange={e => setForm({...form, task: e.target.value})}
        className="border-2 rounded border-gray-600 p-1" />

        <button type="submit" className="bg-green-500 text-white rounded p-1">Add</button>

      </form>
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-start">
        <ul>
          {work.map(works => (
            <li key={works.id} className="border-b border-x-gray-600 p-2">
              <div className="flex">
                <div className="flex-1">
                  <h3 className="font-bold">{works.task}</h3>
                  
                </div>
                <input type="checkbox"
                className="border-2 rounded border-gray-600 p-1 ml-4"/>
                <button onClick={() => setForm({task: works.task, id: works.id})} className="bg-purple-400 mr-2 px-3 text-white rounded ml-3 shadow-md">Update</button>
                <button onClick={() => deleteWorks(works.id)} className="bg-red-500 px-3 text-center text-white ml-2 rounded">x</button>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const work = await prisma.work.findMany({
    select: {
      id: true,
      task: true
    }
  })

  return {
    props: {
      work
    }
  }
}