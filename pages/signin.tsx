import { useFormik } from "formik";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Loader from "../components/loader/Loader";
import { useAuth } from "./api/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const SignUn = () => {
  const [loading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { currentUser, loading: isLoading, login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("please enter password")
        .min(8, "Password is too short - should be 8 chars minimum."),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      await login(values.email, values.password)
        .then((res: any) => {
          if (res) {
            router.push("/");
          }
        })
        .catch((error: any) => {
          if (error) {
            toast.error("wrong username or password please try again", {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
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
        <div className="p-8 rounded-xl w-11/12 sm:w-4/12 bg-white sm:min-w-[500px] m-auto mt-16 shadow-lg">
          <h2 className="border-b-2 mb-3 pb-2">Sign In</h2>
          <form
            method="POST"
            encType="multipart/form-data"
            onSubmit={formik.handleSubmit}
          >
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
          <Link href="/signup">
            <p className="mt-5">
              <span className="cursor-default">dont have a acount ? </span>
              <span className="underline cursor-pointer">sign up</span>
            </p>
          </Link>
        </div>
      )}
    </>
  );
};
export default SignUn;
