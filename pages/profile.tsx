/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Loader from "../components/loader/Loader";
import { useAuth } from "./api/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { userProps } from "../types/type";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Link from "next/link";

const Profile = () => {
  const [loading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { currentUser, logout, loading: loader } = useAuth();
  const router = useRouter();
  const [currUser, setCurrUser] = useState<userProps>();

  useEffect(() => {
    onSnapshot(doc(db, "users", `${currentUser?.uid}`), (doc) => {
      setCurrUser(doc.data() as userProps);
    });
  }, [currentUser]);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setValues,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "users", `${currentUser.uid}`);
        await updateDoc(docRef, {
          firstName: values.firstName,
          lastName: values.lastName,
        });
        setIsLoading(false);
      } catch (error) {
        toast.error("faild signup please try again", {
          position: toast.POSITION.TOP_CENTER,
        });
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      firstName: currUser ? (currUser.firstName as string) : "",
      lastName: currUser ? (currUser.lastName as string) : "",
      avtar: currUser ? (currUser.avtar as string) : "",
      email: currUser ? (currUser.email as string) : "",
    }));
  }, [currUser, setValues]);

  const handleUpload = (e: any) => {
    const file = e;
    if (!file) return;
    const storageRef = ref(storage, `files/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploadLoading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        alert(error);
      },
      () => {
        setUploadLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const docRef = doc(db, "users", `${currentUser.uid}`);
          updateDoc(docRef, {
            avtar: downloadURL,
          }).then(() => {
            setUploadLoading(false);
          });
        });
      }
    );
  };

  const deleteImgHandler = () => {
    const docRef = doc(db, "users", `${currentUser.uid}`);
    updateDoc(docRef, {
      avtar: "",
    }).then(() => {
      toast.success("image is deleted successfully!!", {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  };

  return (
    <>
      {loader ? (
        <div className="w-full h-screen absolute top-0 left-0 bg-white z-50 flex justify-center items-center">
          <div className="w-16">
            <Loader color="#5651e5" width={100} />
          </div>
        </div>
      ) : (
        <div className="pt-20 min-h-[1000px] w-full">
          <div className="bg-[url(/assets/profilebg.jpg)] h-60 w-full bg-no-repeat bg-cover bg-center relative">
            <div className="absolute top-0 left-0 h-full w-full bg-black opacity-60"></div>
          </div>
          <div className="max-w-5xl m-auto">
            <div className="absolute top-1/3">
              <div className="shadow-lg rounded-full w-36 h-36">
                {currUser?.avtar ? (
                  <img
                    className="rounded-full w-full h-full bg-white group-hover:opacity-10"
                    src={currUser?.avtar}
                    alt="/"
                  />
                ) : (
                  <div className="rounded-full w-full h-full bg-white group-hover:opacity-10"></div>
                )}
                <ul className="mt-4">
                  <li className="hover:bg-gray-200 w-32 p-2 px-3 font-medium text-center mb-3 border border-gray-300 rounded-lg">
                    profile
                  </li>
                  <li
                    onClick={() => {
                      logout();
                      router.push("/signin");
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white text-center w-32 p-2 px-3 font-medium border border-gray-300 rounded-lg"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
            <div className="pl-60 max-w-xl mt-5">
              <div className="bg-themebg-100 p-10 w-[550px] absolute top-44 shadow-2xl rounded-2xl">
                <div className="flex justify-start items-center">
                  <div className="w-28 h-28 mr-7 mb-5">
                    {currUser?.avtar ? (
                      <img
                        className="rounded-full bg-white w-full h-full group-hover:opacity-10"
                        src={currUser?.avtar}
                        alt="/"
                      />
                    ) : (
                      <div className="rounded-full w-full h-full bg-white group-hover:opacity-10"></div>
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      disabled={uploadLoading}
                      className="relative disabled:cursor-not-allowed min-w-[200px] w-full min-h-[40px] focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      <label
                        htmlFor="img"
                        className="font-medium flex items-center justify-center w-full text-center cursor-pointer relative"
                      >
                        {!uploadLoading ? (
                          <span className="w-full">Upload Profile Picture</span>
                        ) : (
                          <span className="mx-16 w-full">
                            <Loader />
                          </span>
                        )}
                      </label>
                      <input
                        type="file"
                        id="img"
                        name="img"
                        accept="image/*"
                        disabled={uploadLoading}
                        onChange={(e: any) => {
                          handleUpload(e.target?.files[0]);
                        }}
                        className="absolute disabled:cursor-not-allowed top-0 w-full h-full left-0 opacity-0 cursor-pointer"
                      />
                    </button>
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      onClick={deleteImgHandler}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div>
                  <h2 className="text-xls border-b-2 border-gray-600 inline">
                    Personal details
                  </h2>
                  <form
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid gap-4 w-full py-3">
                      <div className="flex flex-col">
                        <label className="uppercase text-sm py-2">
                          First Name
                        </label>
                        <input
                          className="border-2 rounded-lg p-3 flex border-gray-300"
                          type="text"
                          name="firstName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                        />
                        {touched.firstName && errors.firstName ? (
                          <p className="text-red-700">{errors.firstName}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-col">
                        <label className="uppercase text-sm py-2">
                          Last Name
                        </label>
                        <input
                          className="border-2 rounded-lg p-3 flex border-gray-300"
                          type="text"
                          name="lastName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                        />
                        {touched.lastName && errors.lastName ? (
                          <p className="text-red-700">{errors.lastName}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col py-2">
                      <label className="uppercase text-sm py-2">Email</label>
                      <input
                        className="border-2 rounded-lg p-3 flex border-gray-300"
                        type="email"
                        name="email"
                        value={values.email}
                        disabled
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-auto px-3 py-2 float-right max-h-9 text-gray-100 mt-4 flex justify-center items-center shadow-md shadow-gray-400 rounded-xl uppercase bg-gradient-to-r from-basic-200 to-basic-100"
                    >
                      <span>Update</span> {loading && <Loader />}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
