import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTotal } from '../store/cartSlice';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

export default function Invoice({ closeInvoice, paymentMode, xyz }) {
    const date = new Date(); // Current date
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const randomOrderNumber = Math.floor(Math.random() * 90) + 10; // Generate a random number between 10 and 99

    const [open, setOpen] = useState(true);
    const cart = useSelector(state => state.cart);
    const customer = useSelector(state => state.customer);
    const componentRef = useRef();
    const total = useSelector(selectTotal);
    const tax = (5.25 / 100) * total;
    const dispatch = useDispatch();
    const cancelButtonRef = useRef(null);

    const allEvents = async () => {
        handlePrint();
        await storeOrderTotal(); // Store the total amount in the backend
        setOpen(false);
        closeInvoice();
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const storeOrderTotal = async () => {
        try {
            const orderTotal = total + tax;
            // Send the total order amount to the server
            await axios.post('http://localhost:8000/api/orders', {
                customerName: customer[0]?.name,
                customerPhone: customer[0]?.phone,
                orderTotal: orderTotal,
            });
        } catch (error) {
            console.error('Error storing order total:', error);
        }
    };

    return (
        <Transition.Root show={xyz? xyz : false} as={Fragment} >
            <Dialog ref={componentRef} as="div" className="relative z-10" onClose={closeInvoice}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div>
                                        <h3 className='text-2xl font-semibold tracking-wider'>BillEase</h3>
                                        <small>A taste you'll remember.</small>
                                    </div>
                                    <div className='flex items-center justify-between '>
                                        <div className='text-xs'>
                                            <h6>Prime Hub</h6>
                                            <p>Rajpura</p>
                                            <p>Phone: +919999999</p>
                                        </div>
                                        <div className='text-xs'>
                                            <h6 className='flex'><p className='font-semibold'>DATE</p>: {formattedDate}</h6>
                                            <h6 className='flex'><p className='font-semibold'>INVOICE</p>: &nbsp; #{randomOrderNumber}</h6>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between pt-2'>
                                        <div className='text-xs'>
                                            <h6><p className='font-semibold'>BILL TO:</p></h6>
                                            <p className='flex'>Customer name: <p className='pl-10'>{customer[0]?.name}</p></p>
                                            <p className='flex'>Customer Phone: <p className='pl-8'>+91 {customer[0]?.phone}</p></p>
                                        </div>
                                        <div className='text-xs'>
                                            <h6 className='flex'><p className='font-semibold'>TIME</p>: 12:45 PM</h6>
                                            <h6 className='flex'><p className='font-semibold'>Order no</p>: {randomOrderNumber}</h6>
                                        </div>
                                    </div>
                                    <h6 className='text-xs font-bold text-center pt-3'>Welcome to BillEase</h6>
                                    <div className='mt-3 w-full'>
                                        <table style={{ fontSize: "11px" }} className='font-normal divide-x divide-y divide-gray-300'>
                                            <thead>
                                                <tr className='divide-x border-t border-gray-200 border-r border-l divide-gray-300'>
                                                    <th className='px-4 p-1'>Item</th>
                                                    <th className='px-4 p-1'>Quantity</th>
                                                    <th className='px-4 p-1'>RATE</th>
                                                    <th className='px-4 p-1'>AMOUNT(₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.map((curr, i) => (
                                                    <tr key={i} className='divide-x divide-gray-300 border-b border-gray-200'>
                                                        <td className='px-4 py-1'>{curr.title}</td>
                                                        <td className='text-center px-4 py-1'>{curr.quantity}</td>
                                                        <td className='text-center px-4 py-1'>{(curr.price) / (curr.quantity)}/-</td>
                                                        <td className='text-center px-4 py-1'>{curr.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='flex justify-between text-xs pt-4'>
                                        <div></div>
                                        <div className='pr-4'>
                                            <div className='flex space-x-5'>
                                                <p>SUBTOTAL:</p>
                                                <p> ₹{total}</p>
                                            </div>
                                            <div className='flex space-x-5'>
                                                <p>TAX RATE:</p>
                                                <p>5.25%</p>
                                            </div>
                                            <div className='flex space-x-12'>
                                                <p>TAX:</p>
                                                <p> ₹{tax.toFixed(2)}</p>
                                            </div>
                                            <div className='flex space-x-7'>
                                                <p>TOTAL:</p>
                                                <p> ₹{(total + tax).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between pr-7 pt-3'>
                                        <p></p>
                                        <p className='text-xs'>Status: <strong>Paid {paymentMode}</strong>. </p>
                                    </div>
                                </div>
                                <div className='flex flex-col pt-8 leading-snug'>
                                    <small>Please Contact for any queries related to Invoice.</small>
                                    <small className='font-medium'>THANK YOU FOR YOUR VISIT.</small>
                                </div>
                                <div className="mt-5 xs:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                        onClick={allEvents}
                                    >
                                        Print Invoice
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
