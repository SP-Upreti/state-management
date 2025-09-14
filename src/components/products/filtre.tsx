import React, { ReactNode, useState } from "react"

export default function Filtre({ children }: { children: ReactNode }) {
    const [rangeValue, setRangeValue] = useState<number>(3);
    return (
        <section className="py-4 relative">
            <div className="w-full max-w-7xl mx-auto  ">
                <div className="grid grid-cols-12 relative">
                    <div className="hidden md:block  h-fit col-span-12 md:col-span-2 w-full max-md:max-w-md max-md:mx-auto">
                        <div className="box rounded-xl border border-gray-300 bg-white px-4 py-4 w-full md:max-w-sm">
                            <h6 className="font-medium text-base leading-7 text-black mb-2">Price Range</h6>
                            <div className="flex items-center mb-5 gap-1">
                                <div className="relative w-full">
                                    <select id="FROM"
                                        className="h-8 border border-gray-300 text-gray-900 text-xs font-medium rounded-lg block w-full py-1 px-2  appearance-none relative focus:outline-none bg-white">
                                        <option selected>Min</option>
                                        <option value="option 1">option 1</option>
                                        <option value="option 2">option 2</option>
                                        <option value="option 3">option 3</option>
                                        <option value="option 4">option 4</option>
                                    </select>
                                    <svg className="absolute top-1/2 -translate-y-1/2 right-1 z-50" width="16" height="16"
                                        viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609" stroke="#111827"
                                            stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div className="relative w-full">
                                    <select id="FROM"
                                        className="h-8 border border-gray-300 text-gray-900 text-xs font-medium rounded-lg block w-full py-1 px-2 appearance-none relative focus:outline-none bg-white">
                                        <option selected>Max</option>
                                        <option value="option 1">option 1</option>
                                        <option value="option 2">option 2</option>
                                        <option value="option 3">option 3</option>
                                        <option value="option 4">option 4</option>
                                    </select>
                                    <svg className="absolute top-1/2 -translate-y-1/2 right-1 z-50" width="16" height="16"
                                        viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609" stroke="#111827"
                                            stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-600 w-full">Brand</label>
                            <div className="relative w-full mb-4">
                                <input id="FROM"
                                    className="h-10 border border-gray-300 text-gray-900 text-xs font-medium rounded-md block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white" />
                            </div>
                            <button
                                className="w-full py-2.5 flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white font-semibold text-xs shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-200  ">
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.4987 13.9997L13.1654 12.6663M13.832 7.33301C13.832 10.6467 11.1457 13.333 7.83203 13.333C4.51832 13.333 1.83203 10.6467 1.83203 7.33301C1.83203 4.0193 4.51832 1.33301 7.83203 1.33301C11.1457 1.33301 13.832 4.0193 13.832 7.33301Z"
                                        stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                Apply Filtre
                            </button>
                        </div>

                        <div className="mt-7 box rounded-xl border border-gray-300 bg-white p-4 w-full md:max-w-sm">
                            <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-4">
                                <p className="font-medium text-base leading-7 text-black ">Filter Plans</p>
                                <p
                                    className="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-indigo-600">
                                    RESET</p>
                            </div>


                            <div className="w-full mb-4">
                                <div className="flex items-center mb-5 gap-1">
                                    <div className="relative w-full">
                                        <select id="FROM"
                                            className="h-8 border border-gray-300 text-gray-900 text-xs font-medium rounded-lg block w-full py-1 px-4 appearance-none relative focus:outline-none bg-white">
                                            <option selected>Availabile Stock</option>
                                            <option value="option 1">Min 5</option>
                                            <option value="option 2">Min 10</option>
                                            <option value="option 4">Above 20</option>
                                        </select>
                                        <svg className="absolute top-1/2 -translate-y-1/2 right-4 z-50" width="16" height="16"
                                            viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609" stroke="#111827"
                                                stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <label htmlFor="Offer" className="font-medium text-sm leading-6 text-gray-600 mb-1">Ratings</label>
                            <div className="relative w-full mb-2">
                                <div className="PB-range-slider-div">
                                    <input
                                        type="range"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setRangeValue(Number(e.target.value));
                                        }}
                                        min={1}
                                        max={5}
                                        value={rangeValue}
                                        className="PB-range-slider"
                                        id=""
                                    />

                                    <p className="PB-range-slidervalue">{rangeValue}</p>
                                </div>
                            </div>
                            <p className="font-medium text-sm leading-6 text-black mb-3">Discount</p>
                            <div className="box flex flex-col gap-2">
                                <div className="flex items-center">
                                    <input id="checkbox-default-1" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]" />
                                    <label htmlFor="checkbox-default-1" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">20% or more</label>
                                </div>
                                <div className="flex items-center">
                                    <input id="checkbox-default-2" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]" />
                                    <label htmlFor="checkbox-default-2" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">30% or more</label>
                                </div>
                                <div className="flex items-center">
                                    <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]" />
                                    <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">50% or more</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-10 px-4">
                        {children}
                    </div>
                </div>

            </div>
        </section>

    )
}
