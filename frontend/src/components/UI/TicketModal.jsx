import { React, Fragment, useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import LoadingButton from "./LoadingButton";
import { GoDownload } from "react-icons/go";
import { displayDate, displayTime, getCurrencyFormat } from "../../lib/utils";
import Axios from "../../lib/axiosInstance";
import { useAuth } from "../../lib/hooks/useAuth";

export default function TicketModal({ isOpen,handleDownloadTickets, closeHandler, ticket }) {
    const {
        title,
        poster,
        releaseDate,
        showTitle,
        showTime,
        noOfSeatsBook,
        bookingId,
        seatNo,
        amount,
        language
    } = ticket;
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    function closeModal() {
        closeHandler(false);
    }
    

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-[330px] transform overflow-hidden rounded-2xl py-7 px-3 bg-gray-100 text-left align-middle shadow-xl transition-all">
                                    <div className="relative rounded-lg text-sm bg-white shadow-xl">
                                        <div className="flex gap-2 p-3">
                                            <div className="w-1/3 max-h-[140px]">
                                                <img src={poster} alt={title} className="w-auto object-fill h-full rounded-md" />
                                            </div>
                                            <div className="w-2/3 flex flex-col gap-1 capitalize">
                                                <h5 className="text-xl uppercase font-semibold line-clamp-2">{title}</h5>
                                                <p>({language})</p>
                                                <p>{displayDate(releaseDate, "ddd, DD MMM")} | {displayTime(showTime)}</p>
                                                <p>{"kolkata,VR Mall"}</p>
                                            </div>
                                        </div>
                                        <div className="my-3 border-dashed border-2 border-gray-100 relative before:content-[''] before:absolute before:w-5 before:h-5 before:bg-gray-100 before:rounded-full before:top-1/2 before:left-[-10px] before:-translate-y-1/2 before:shadow-inner  after:content-[''] after:absolute after:w-5 after:h-5 after:bg-gray-100 after:rounded-full after:top-1/2 after:right-[-10px] after:-translate-y-1/2 after:shadow-inner" />
                                        <div className="p-3">
                                            <p className="text-center capitalize text-gray-600 font-semibold">{noOfSeatsBook} Ticket(s)</p>
                                            <p className="text-center uppercase text-lg font-semibold">{showTitle}</p>
                                            <p className="text-center capitalize font-semibold text-gray-600">{seatNo}</p>
                                            <p className="text-center uppercase text-lg font-semibold">Booking Id: <span className="tracking-wider">{bookingId}</span></p>
                                        </div>
                                        <div className="p-3 flex justify-between">
                                            <span>Total Amount:</span>
                                            <span>{getCurrencyFormat(amount)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-12 space-x-3 text-center">
                                        <LoadingButton
                                            text={"Download Ticket"}
                                            isLoading={loading}
                                            icon={<GoDownload size={15} />}
                                            className={`transition delay-150 border border-transparent bg-skin-base py-1 text-sm font-medium text-skin-inverted hover:bg-skin-base/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-base focus-visible:ring-offset-2`}
                                            onClick={() => handleDownloadTickets(ticket)}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
