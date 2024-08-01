import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";

/* eslint-disable @next/next/no-img-element */
const Users = () => {
  const [usersData, setUsersData] = useState<any>();
  const getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const res = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setUsersData(res);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col pt-28 max-w-5xl mx-auto">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      avtar
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      First Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Last Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.map((item: any, index: any) => (
                    <tr className="bg-gray-100 border-b" key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="text-sm text-gray-900 w-12 font-light px-6 py-4 whitespace-nowrap">
                        {item?.avtar ? (
                          <img
                            className="rounded-full w-full h-full bg-white group-hover:opacity-10"
                            src={item?.avtar}
                            alt="/"
                          />
                        ) : (
                          <div className="rounded-full w-12 h-12 bg-white group-hover:opacity-10"></div>
                        )}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.firstName}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.lastName}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
