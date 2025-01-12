import { useState } from "react"

export default function Image({ src, title }: { src: string, title: string }) {
    const [finished, setFinished] = useState(false);

    const handleLoad = () => {
        setFinished(true)
    }
    return (
        <>
            <img className={`object-cover ${finished ? "block" : "none"} mx-auto`} src={src} alt={title} onLoad={handleLoad} />            {
                finished ? "" : (
                    <div className="h-full w-full flex justify-center items-center">
                        <div
                            className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
                        ></div>
                    </div>
                )
            }
        </>
    )
}
