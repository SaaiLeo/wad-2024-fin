"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function Home() {

    const APIBASE = process.env.NEXT_PUBLIC_API_BASE;

    const { register, handleSubmit, reset } = useForm();
    const [customerList, setCustomerList] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const columns = [
        {
            field: "Action",
            headerName: "Action",
            width: 120,
            renderCell: (params) => {
              return (
                <div className="space-x-2">
                  <button
                    onClick={() => startEditMode(params.row)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
                  >
                    ✏️
                  </button>
                  <button
                    onClickCapture={() => deleteCustomer(params.row)}
                    className="bg-gray-300 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md"
                  >
                    🗑️
                  </button>
                </div>
              );
            },
          },
          { field: "memberNumber", headerName: "Member Number", width: 150 },
          { field: "name", headerName: "Name", width: 150,    renderCell: (params) => (
            <Link href={`/customer/${params.row.id}`} className="text-blue-600 hover:underline">
              {params.row.name}
            </Link>
          ),},
    ]

    async function fetchCustomer() {
        const data = await fetch(`${APIBASE}/customer`);
        const c = await data.json();
        const c2 = c.map((customer) => {
            return {
              ...customer,
              id: customer._id,
            };
          });
        setCustomerList(c2);
    }

    useEffect(() => {
        fetchCustomer();
    }, []);


    function handleCustomerFormSubmit(data) {
        if (editMode) {
          fetch(`${APIBASE}/customer`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(() => {
            fetchCustomer();
            stopEditMode();
          });

          return;
        }

        fetch(`${APIBASE}/customer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(() => {
            fetchCustomer();
            stopEditMode();
        });
        return;
    }

    function startEditMode(customer) {
        reset(customer);
        setEditMode(true);
    }

    function stopEditMode() {
        reset({
            name: "",
            dateOfBirth: "",
            memberNumber: "",
            interests: ""
        });
        setEditMode(false);
    }

    async function deleteCustomer(customer) {
        if (!confirm(`Deleting [${customer.name}]`)) return;

        const id = customer._id;
        await fetch(`${APIBASE}/customer/${id}`, {
            method: "DELETE",
        });
        fetchCustomer();
    }

    return (
        <main>
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <form onSubmit={handleSubmit(handleCustomerFormSubmit)} className="grid gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Customer Name:</label>
                        <input
                            name="name"
                            type="text"
                            {...register("name", { required: true })}
                            className="border border-gray-300 text-gray-700 rounded-md w-full px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Date if Birth:</label>
                        <input
                            name="dateOfBirth"
                            type="date"
                            {...register("dateOfBirth")}
                            className="border border-gray-300 text-gray-700 rounded-md w-full px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Member Number:</label>
                        <input
                            name="memberNumber"
                            type="number"
                            {...register("memberNumber")}
                            className="border border-gray-300 text-gray-700 rounded-md w-full px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Interests:</label>
                        <input
                            name="interests"
                            type="text"
                            {...register("interests")}
                            className="border border-gray-300 text-gray-700 rounded-md w-full px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="col-span-2 text-right">
                        {editMode ? (
                            <>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                />
                                <button
                                    onClick={() => stopEditMode()}
                                    className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <input
                                type="submit"
                                value="Create"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                            />
                        )}
                    </div>
                </form>
            </div>
            

            <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Customer List</h2>
          <DataGrid
            rows={customerList}
            columns={columns}
            // pageSize={5}
            className="text-gray-700"
            autoHeight
          />
        </div>
            {/* <div>
                <h1>Customer List</h1>
                {customerList.map((customer) => (
                    <div key={customer._id}>
                        <button onClick={() => deleteCustomer(customer)}>🗑️</button>
                        <button onClick={() => startEditMode(customer)}>✏️</button>
                        {customer.memberNumber} {customer.name}
                    </div>
                ))}
            </div> */}
        </main>
    )
}