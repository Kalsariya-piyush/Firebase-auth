import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Loader from "../components/loader/Loader";
import { useAuth } from "./api/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const SignIn = () => {
  const { signUp } = useAuth();
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const { currentUser, loading: isLoading } = useAuth();
  const [loader, setLoader] = useState(true);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("please enter password")
        .min(8, "Password is too short - should be 8 chars minimum."),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await signUp(values.email, values.password).then(async (res: any) => {
          if (res) {
            try {
              await setDoc(doc(collection(db, "users"), `${res.user.uid}`), {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                avtar: "",
                username: `${values.firstName} ${values.lastName}`,
              });
            } catch (e) {
              console.error("Error adding document: ", e);
            }
            router.push("/signin");
          }
        });
      } catch (error) {
        toast.error("faild signup please try again", {
          position: toast.POSITION.TOP_CENTER,
        });
        setIsLoading(false);
      }
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (currentUser && !isLoading) {
      router.push("/");
    }
    if (!currentUser && !isLoading) {
      setLoader(false);
    }
  }, [currentUser, isLoading, router]);

  return (
    <>
      {loader ? (
        <div className="w-full h-screen absolute top-0 left-0 bg-white z-50 flex justify-center items-center">
          <div className="w-16">
            <Loader color="#5651e5" width={100} />
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl w-11/12 sm:w-4/12 bg-white sm:min-w-[500px] m-auto mt-16 shadow-xl">
          <h2 className="border-b-2 mb-3 pb-2">Sign Up</h2>
          <form
            method="POST"
            encType="multipart/form-data"
            onSubmit={formik.handleSubmit}
          >
            <div className="grid   gap-4 w-full py-3">
              <div className="flex flex-col">
                <label className="uppercase text-sm py-2">First Name</label>
                <input
                  className="border rounded-lg p-3 focus:outline-none flex border-gray-300"
                  type="text"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <p className="text-red-700">{formik.errors.firstName}</p>
                ) : null}
              </div>
              <div className="flex flex-col">
                <label className="uppercase text-sm py-2">Last Name</label>
                <input
                  className="border rounded-lg p-3 focus:outline-none flex border-gray-300"
                  type="text"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <p className="text-red-700">{formik.errors.lastName}</p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col py-2">
              <label className="uppercase text-sm py-2">Email</label>
              <input
                className="border rounded-lg p-3 focus:outline-none flex border-gray-300"
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-700">{formik.errors.email}</p>
              ) : null}
            </div>
            <div className="flex flex-col py-2">
              <label className="uppercase text-sm py-2">Password</label>
              <input
                className="border rounded-lg p-3 focus:outline-none flex border-gray-300"
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-700">{formik.errors.password}</p>
              ) : null}
            </div>
            <button className="w-full p-4 max-h-14 text-gray-100 mt-4 flex justify-center items-center">
              <span>Sign Up</span> {loading && <Loader />}
            </button>
          </form>
          <Link href="/signin">
            <p className="mt-5 ">
              <span className="cursor-default">already have an acount ? </span>
              <span className="underline cursor-pointer">sign in</span>
            </p>
          </Link>
        </div>
      )}
    </>
  );
};
export default SignIn;
