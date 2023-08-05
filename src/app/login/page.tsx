"use client";
import Animation from "../../components/animations/animation"
import Login from "../../../auth/roblox/login"
import { useEffect, useState } from "react";

export default function () {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ws, setWs] = useState('')

  useEffect(() => {
    const submitButton = document.getElementById("config")

    console.log(submitButton)
    if (!username || !password || !ws) submitButton.classList.add('bg-red-700')
    else {
      submitButton.classList.remove('bg-red-700')
      submitButton.classList.add('bg-gray-800')
    }
  }, [password, username, ws])

  function submit() {

    // Login()
  }

  return (<div className=" w-screen h-screen bg-gradient-to-tr from-indigo-300 via-transparent to-blue-300 flex justify-center items-center select-none">
    <div className="w-[110rem] h-[50rem] bg-cyan-800 rounded-xl bg-opacity-60 flex overflow-hidden">
      <div className="h-full w-[70%] p-11 flex flex-col gap-[15rem]">
        <div>
          <h1 className="text-white text-4xl font-bold uppercase">Roblox Tool Login</h1>
        </div>
        <div>
          <label htmlFor="username" className="block text-gray-700 mb-2">Type your Account username here</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-xl h-12 w-[28rem] bg-gray-400 ps-3 text-white mb-4" autoComplete="off" />

          <label htmlFor="password" className="block text-gray-700 mb-2">Type your Account password here</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl h-12 w-[28rem] bg-gray-400 ps-3 text-white mb-4" autoComplete="off" />

          <label htmlFor="ws" className="block text-gray-700 mb-2">Type you gateway url here</label>
          <input type="text" id="ws" value={ws} onChange={(e) => setWs(e.target.value)} className="rounded-xl h-12 w-[28rem] bg-gray-400 ps-3 text-white" autoComplete="off" />

          <button id="config" className="block rounded-xl h-12 w-[28rem] bg-gray-800 ps-3 text-white mt-7 text-3xl font-bold" onClick={submit}>Login</button>
        </div>
      </div>
      <div className="h-full w-[30%] shadow-lg">
        <h1 className="text-center text-3xl text-white p-5 font-bold ">Fast Login</h1>
        <Animation fileName="rocket-animation.json" />
      </div>
    </div>
  </div>)
}