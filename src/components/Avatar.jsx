"use client"

export const Avatar = ({name}) => {
   
    return (
        <div className="rounded-full relative shrink-0  size-10 overflow-hidden bg-gray-9 flex justify-center items-center">
            {name}
        </div>
    )
}