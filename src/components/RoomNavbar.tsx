import { ExtendedMember, roomI } from "@/contexts/RoomsProvider";
import useClickOutside from "@/hooks/useClickOutside";
import { useState, useRef, useEffect } from "react";
import RoomAddMember from "./RoomAddMember";

const RoomNavbar = ({ room }: { room: roomI }) => {
  return (
    <div className='flex items-center justify-between w-ful px-4 py-4 border-b border-b-palblack-800'>
      <h1 className='text-2xl font-bold text-palblack-50'>{room.name}</h1>
      <RoomSettings room={room} />
    </div>
  )
}
interface RoomSettingsProps {
  room: roomI
}

const RoomSettings = ({ room }: RoomSettingsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      <button onClick={() => setShowSettings(!showSettings)}
        className='w-8 h-8 rounded-full group hover:bg-palblack-800 flex items-center justify-center'><svg width={24}
          className='text-palblack-200 group-hover:text-gray-50'
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd"
            clipRule="evenodd"
            d="M11.0779 2.25C10.1613 2.25 9.37909 2.91265 9.22841 3.81675L9.04974 4.88873C9.02959 5.00964 8.93542 5.1498 8.75311 5.23747C8.40905 5.40292 8.07967 5.5938 7.7674 5.8076C7.60091 5.92159 7.43259 5.9332 7.31769 5.89015L6.29851 5.50833C5.44019 5.18678 4.4752 5.53289 4.01692 6.32666L3.09493 7.92358C2.63665 8.71736 2.8194 9.72611 3.52704 10.3087L4.36756 11.0006C4.46219 11.0785 4.53629 11.2298 4.52119 11.4307C4.50706 11.6188 4.49988 11.8086 4.49988 12C4.49988 12.1915 4.50707 12.3814 4.52121 12.5695C4.53632 12.7704 4.46221 12.9217 4.36758 12.9996L3.52704 13.6916C2.8194 14.2741 2.63665 15.2829 3.09493 16.0767L4.01692 17.6736C4.4752 18.4674 5.44019 18.8135 6.29851 18.4919L7.31791 18.11C7.43281 18.067 7.60113 18.0786 7.76761 18.1925C8.07982 18.4063 8.40913 18.5971 8.75311 18.7625C8.93542 18.8502 9.02959 18.9904 9.04974 19.1113L9.22841 20.1832C9.37909 21.0874 10.1613 21.75 11.0779 21.75H12.9219C13.8384 21.75 14.6207 21.0874 14.7713 20.1832L14.95 19.1113C14.9702 18.9904 15.0643 18.8502 15.2466 18.7625C15.5907 18.5971 15.9201 18.4062 16.2324 18.1924C16.3988 18.0784 16.5672 18.0668 16.6821 18.1098L17.7012 18.4917C18.5596 18.8132 19.5246 18.4671 19.9828 17.6733L20.9048 16.0764C21.3631 15.2826 21.1804 14.2739 20.4727 13.6913L19.6322 12.9994C19.5376 12.9215 19.4635 12.7702 19.4786 12.5693C19.4927 12.3812 19.4999 12.1914 19.4999 12C19.4999 11.8085 19.4927 11.6186 19.4785 11.4305C19.4634 11.2296 19.5375 11.0783 19.6322 11.0004L20.4727 10.3084C21.1804 9.72587 21.3631 8.71711 20.9048 7.92334L19.9828 6.32642C19.5246 5.53264 18.5596 5.18654 17.7012 5.50809L16.6818 5.89C16.5669 5.93304 16.3986 5.92144 16.2321 5.80746C15.9199 5.59371 15.5906 5.40289 15.2466 5.23747C15.0643 5.1498 14.9702 5.00964 14.95 4.88873L14.7713 3.81675C14.6207 2.91265 13.8384 2.25 12.9219 2.25H11.0779ZM12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z"
            fill="transparent" />
        </svg>
      </button>
      {showSettings && <RoomSettingsModal room={room}
        setShowSettings={setShowSettings} />}
    </>
  )
}
interface RoomSettingsModal {
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  room: roomI;
}

const RoomSettingsModal = ({ setShowSettings, room }: RoomSettingsModal) => {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside([ref], () => setShowSettings(false))
  return (
    <div ref={ref}
      className='absolute top-12 right-7 w-64 h-fit backdrop-blur-xl rounded-lg border border-palblack-600 transition-all flex flex-col px-4 py-2 gap-2 max-h-full'>
      <h1 className='text-palblack-200 text-lg font-semibold'>Settings</h1>
      <RenameRoom room={room} />
      <MembersList members={room.members}
        addMember={room.addMember} />
      <DeleteRoom room={room} />
    </div>
  )
}

interface DeleteRoomProps {
  room: roomI;
}

const DeleteRoom = ({ room }: DeleteRoomProps) => {
  const [buttonText, setButtonText] = useState("Delete Room")
  const [toggleDelete, setToggleDelete] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside([ref], () => {
    if (toggleDelete) {
      setToggleDelete(false)
      setButtonText("Delete Room")
    }
  })
  return (
    <div
      ref={ref}
      onClick={() => {
        if (!toggleDelete) {
          setButtonText("Confirm")
          setToggleDelete(true)
        }
      }}
      className={`${toggleDelete ? "bg-red-500/20  border-red-800/60" : "hover:bg-red-500/20 border-transparent cursor-pointer"} border flex items-center gap-2 text-red-500 p-2 rounded-md transition-all`}>
      {buttonText}
      <div className={`${!toggleDelete && "hidden"} w-full justify-end flex gap-2`}>
        <svg
          onClick={() => {
            room.delete()
            setToggleDelete(false)
          }}
          className="text-red-500 p-1 rounded-md bg-red-400/30 hover:bg-red-400/40"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd"
            clipRule="evenodd"
            d="M16.5001 4.47819V4.70498C17.4548 4.79237 18.4017 4.90731 19.3398 5.04898C19.6871 5.10143 20.0332 5.15755 20.3781 5.2173C20.7863 5.28799 21.0598 5.67617 20.9891 6.0843C20.9184 6.49244 20.5302 6.76598 20.1221 6.69529C20.0525 6.68323 19.9829 6.67132 19.9131 6.65957L18.9077 19.7301C18.7875 21.2931 17.4842 22.5 15.9166 22.5H8.08369C6.51608 22.5 5.21276 21.2931 5.09253 19.7301L4.0871 6.65957C4.0174 6.67132 3.94774 6.68323 3.87813 6.69529C3.47 6.76598 3.08183 6.49244 3.01113 6.0843C2.94043 5.67617 3.21398 5.28799 3.62211 5.2173C3.96701 5.15755 4.31315 5.10143 4.66048 5.04898C5.59858 4.90731 6.5454 4.79237 7.50012 4.70498V4.47819C7.50012 2.91371 8.71265 1.57818 10.3156 1.52691C10.8749 1.50901 11.4365 1.5 12.0001 1.5C12.5638 1.5 13.1253 1.50901 13.6847 1.52691C15.2876 1.57818 16.5001 2.91371 16.5001 4.47819ZM10.3635 3.02614C10.9069 3.00876 11.4525 3 12.0001 3C12.5478 3 13.0934 3.00876 13.6367 3.02614C14.3913 3.05028 15.0001 3.68393 15.0001 4.47819V4.59082C14.0078 4.53056 13.0075 4.5 12.0001 4.5C10.9928 4.5 9.99249 4.53056 9.00012 4.59082V4.47819C9.00012 3.68393 9.6089 3.05028 10.3635 3.02614ZM10.0087 8.97118C9.9928 8.55727 9.64436 8.23463 9.23045 8.25055C8.81654 8.26647 8.49391 8.61492 8.50983 9.02882L8.85599 18.0288C8.8719 18.4427 9.22035 18.7654 9.63426 18.7494C10.0482 18.7335 10.3708 18.3851 10.3549 17.9712L10.0087 8.97118ZM15.4895 9.02882C15.5054 8.61492 15.1828 8.26647 14.7689 8.25055C14.355 8.23463 14.0065 8.55727 13.9906 8.97118L13.6444 17.9712C13.6285 18.3851 13.9512 18.7335 14.3651 18.7494C14.779 18.7654 15.1274 18.4427 15.1433 18.0288L15.4895 9.02882Z"
            fill="currentColor" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            setToggleDelete(false)
            setButtonText("Delete Room")
          }}
          className="text-gray-50 p-1 rounded-md bg-palblack-50/30 hover:bg-palblack-50/40"
          height={24}
          viewBox="0 0 24 24"
          fill="currentColor"
          width={24}><path d="M0 0h24v24H0V0z"
            fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg>
      </div>
    </div>
  )
}

const RenameRoom = ({ room }: { room: roomI }) => {
  const [newName, setNewName] = useState(room.name)
  const [toggleRename, setToggleRename] = useState(false)
  const renameBox = useRef<HTMLInputElement>(null);
  const renameContainer = useRef<HTMLButtonElement>(null);
  useClickOutside([renameContainer], () => {
    if (toggleRename) {
      setToggleRename(false)
      setNewName(room.name)
    }
  })
  const handleRename = () => {
    room.rename(newName);
    setToggleRename(false)
  }
  useEffect(() => {
    if (toggleRename) {
      renameBox.current?.focus()
    }
  }, [toggleRename])
  return (
    <button
      onClick={() => {
        if (!toggleRename)
          setToggleRename(true)
      }}
      className={`flex text-palblack-50 justify-between gap-2 px-2 py-2 rounded-md w-full font-semibold border ${toggleRename ? "bg-palblack-50/10 border-palblack-500" : "hover:bg-palblack-50/20 border-transparent"}`}
      ref={renameContainer}>
      <input type="text"
        ref={renameBox}
        onChange={(e) => {
          setNewName(e.currentTarget.value)
        }}
        placeholder="Room Name"
        value={newName}
        readOnly={!toggleRename}
        className={`${!toggleRename && "cursor-pointer"} bg-transparent w-full outline-none text-palblack-50`} />
      <div className={`${!toggleRename && "hidden"} flex gap-2`}>
        <svg xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={handleRename}
          className="text-green-500 p-1 rounded-md bg-green-400/30 hover:bg-green-400/40"><polyline points="20 6 9 17 4 12" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            setNewName(room.name)
            setToggleRename(false)
          }}
          className="text-red-500 p-1 rounded-md bg-red-400/30 hover:bg-red-400/40"
          height={24}
          viewBox="0 0 24 24"
          fill="currentColor"
          width={24}><path d="M0 0h24v24H0V0z"
            fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg"
        className={`text-palblack-50 transition-all p-1 rounded-md ${toggleRename && "hidden"}`}
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="transparent"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    </button>
  )
}

interface MembersListProps {
  members: ExtendedMember[];
  addMember: (email: string) => void;
}

const MembersList = ({ members, addMember }: MembersListProps) => {
  const [showMembers, setShowMembers] = useState(false)
  return (
    <div className={`${showMembers ? "bg-palblack-50/10 rounded-md border-palblack-500 max-h-44" : "border-transparent"} border overflow-hidden flex flex-col`}>
      <button className={`flex text-palblack-50 justify-between gap-2 px-2 py-2 rounded-md w-full ${showMembers ? "border-palblack-50 hover:bg-palblack-50/10" : "hover:bg-palblack-50/20"}`}
        onClick={() => setShowMembers(!showMembers)}>Members <svg xmlns="http://www.w3.org/2000/svg"
          className={`text-palblack-50 ${showMembers ? 'transform rotate-180' : ''} transition-all`}
          stroke="transparent"
          fill="currentColor"
          height={24}
          viewBox="0 0 24 24"
          width={24}><path d="M8.12 14.71L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.39-.39-1.02-.39-1.41 0L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.38 1.03.39 1.42 0z" /></svg>
      </button>
      {showMembers && <>
        <div className="w-full h-[1px] bg-palblack-500"></div>
        <ul className="flex flex-col items-start px-2 flex-grow overflow-auto">
          {members.map(member => <Member key={member.id}
            member={member} />)}
        </ul>
        <div className="w-full h-[1px] bg-palblack-500"></div>
        <RoomAddMember members={members}
          addMember={addMember} />
      </>}
    </div>
  )
}
interface MemberProps {
  member: ExtendedMember
}

const Member = ({ member }: MemberProps) => {
  return <span className="text-xs py-2 flex justify-between items-center w-full"
    key={member.id}>{member.email}
    <button onClick={() => member.remove()}
      className="text-palblack-50 hover:text-red-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg"
        height={24}
        viewBox="0 0 24 24"
        fill="currentColor"
        width={24}><path d="M0 0h24v24H0V0z"
          fill="none" /><path d="M7 12c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zm5-10C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
    </button>
  </span>
}
export default RoomNavbar;