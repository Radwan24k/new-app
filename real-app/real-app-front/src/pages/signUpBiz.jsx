// import { useState } from "react";
// import { useFormik } from "formik";
// import { Navigate, useNavigate } from "react-router";
// import Joi from "joi";

// import PageHeader from "../components/common/pageHeader";
// import Input from "../components/common/input";
// import { useAuth } from "../context/auth.context";

// function SignUpBiz() {
//   const [serverError, setServerError] = useState("");

//   const navigate = useNavigate();
//   const { user, createUser, login } = useAuth();

//   const { getFieldProps, handleSubmit, touched, errors, isValid } = useFormik({
//     validateOnMount: true,
//     initialValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//     validate(values) {
//       const schema = Joi.object({
//         name: Joi.string().min(2).max(255).required().label("Name"),
//         email: Joi.string()
//           .min(6)
//           .max(255)
//           .required()
//           .email({ tlds: false })
//           .label("Email"),
//         password: Joi.string().min(6).max(1024).required().label("Password"),
//       });

//       const { error } = schema.validate(values, { abortEarly: false });

//       if (!error) {
//         return null;
//       }

//       const errors = {};
//       for (const detail of error.details) {
//         errors[detail.path[0]] = detail.message;
//       }

//       return errors;
//     },
//     onSubmit: async (values) => {
//       try {
//         await createUser({
//           ...values,
//           biz: true,
//         });

//         await login({ email: values.email, password: values.password });

//         navigate("/create-card");
//       } catch (err) {
//         if (err.response?.status === 400) {
//           setServerError(err.response.data);
//         }
//       }
//     },
//   });

//   if (user) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div className="container">
//       <PageHeader title="Sign Up Biz" description="Sign up as a partner" />

//       <div className="row justify-content-center mt-4">
//         <div className="col-md-5">
//           <form onSubmit={handleSubmit} noValidate autoComplete="off">
//             {serverError && (
//               <div className="alert alert-danger">{serverError}</div>
//             )}

//             <Input
//               {...getFieldProps("name")}
//               error={touched.name && errors.name}
//               type="text"
//               label="Name"
//               placeholder="John Doe"
//               required
//             />
//             <Input
//               {...getFieldProps("email")}
//               error={touched.email && errors.email}
//               type="email"
//               label="Email"
//               placeholder="john@doe.com"
//               required
//             />
//             <Input
//               {...getFieldProps("password")}
//               error={touched.password && errors.password}
//               type="password"
//               label="Password"
//               required
//             />

//             <div className="my-2">
//               <button
//                 disabled={!isValid}
//                 type="submit"
//                 className="btn btn-primary"
//               >
//                 Sign Up Biz
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUpBiz;

import { useState } from "react";
import { useFormik } from "formik";
import { Navigate, useNavigate } from "react-router";
import Joi from "joi";

import PageHeader from "../components/common/pageHeader";
import Input from "../components/common/input";
import { useAuth } from "../context/auth.context";

function SignUpBiz() {
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { user, createUser, login } = useAuth();

  const { getFieldProps, handleSubmit, touched, errors, isValid, resetForm } =
    useFormik({
      validateOnMount: true,
      initialValues: {
        first: "",
        middle: "",
        last: "",
        email: "",
        phone: "",
        password: "",
        imageUrl: "",
        imageAlt: "",
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
      },
      validate(values) {
        const schema = Joi.object({
          first: Joi.string().min(2).max(255).required().label("First Name"),
          middle: Joi.string().min(0).max(255).allow("").label("Middle Name"),
          last: Joi.string().min(2).max(255).required().label("Last Name"),
          email: Joi.string()
            .min(6)
            .max(255)
            .required()
            .email({ tlds: false })
            .label("Email"),
          phone: Joi.string().min(9).max(15).required().label("Phone"),
          password: Joi.string()
            .min(9)
            .max(1024)
            .required()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%$^&*\-_()]).{9,}$/)
            .label("Password"),
          imageUrl: Joi.string().min(11).max(1024).allow("").label("Image URL"),
          imageAlt: Joi.string().min(2).max(256).allow("").label("Image Alt"),
          state: Joi.string().min(2).max(256).allow("").label("State"),
          country: Joi.string().min(2).max(256).required().label("Country"),
          city: Joi.string().min(2).max(256).required().label("City"),
          street: Joi.string().min(2).max(256).required().label("Street"),
          houseNumber: Joi.number().min(1).required().label("House Number"),
          zip: Joi.number().min(1).allow("").label("Zip"),
        });

        const { error } = schema.validate(values, { abortEarly: false });

        if (!error) {
          return null;
        }

        const errors = {};
        for (const detail of error.details) {
          errors[detail.path[0]] = detail.message;
        }

        return errors;
      },
      onSubmit: async (values) => {
        try {
          await createUser({
            name: {
              first: values.first,
              middle: values.middle,
              last: values.last,
            },
            email: values.email,
            password: values.password,
            phone: values.phone,
            image: {
              url: values.imageUrl,
              alt: values.imageAlt,
            },
            address: {
              state: values.state,
              country: values.country,
              city: values.city,
              street: values.street,
              houseNumber: values.houseNumber,
              zip: values.zip,
            },
            isBusiness: true, // Always true for business users
          });

          await login({ email: values.email, password: values.password });

          navigate("/create-card");
        } catch (err) {
          if (err.response?.status === 400) {
            setServerError(err.response.data);
          }
        }
      },
    });

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <PageHeader
        title="Sign Up Biz"
        description="Sign up as a business user"
      />

      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <Input
              {...getFieldProps("first")}
              error={touched.first && errors.first}
              type="text"
              label="First Name"
              placeholder="John"
              required
            />
            <Input
              {...getFieldProps("last")}
              error={touched.last && errors.last}
              type="text"
              label="Last Name"
              placeholder="Doe"
              required
            />
            <Input
              {...getFieldProps("email")}
              error={touched.email && errors.email}
              type="email"
              label="Email"
              placeholder="john@doe.com"
              required
            />
            <Input
              {...getFieldProps("imageUrl")}
              error={touched.imageUrl && errors.imageUrl}
              type="text"
              label="Image URL"
              placeholder="https://example.com/image.jpg"
            />
            <Input
              {...getFieldProps("state")}
              error={touched.state && errors.state}
              type="text"
              label="State"
              placeholder="California"
            />
            <Input
              {...getFieldProps("city")}
              error={touched.city && errors.city}
              type="text"
              label="City"
              placeholder="Los Angeles"
              required
            />
            <Input
              {...getFieldProps("houseNumber")}
              error={touched.houseNumber && errors.houseNumber}
              type="number"
              label="House Number"
              placeholder="123"
              required
            />
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <Input
              {...getFieldProps("middle")}
              error={touched.middle && errors.middle}
              type="text"
              label="Middle Name"
              placeholder="M"
            />
            <Input
              {...getFieldProps("phone")}
              error={touched.phone && errors.phone}
              type="text"
              label="Phone"
              placeholder="050-0000000"
              required
            />
            <Input
              {...getFieldProps("password")}
              error={touched.password && errors.password}
              type="password"
              label="Password"
              required
            />
            <Input
              {...getFieldProps("imageAlt")}
              error={touched.imageAlt && errors.imageAlt}
              type="text"
              label="Image Alt"
              placeholder="Image description"
            />
            <Input
              {...getFieldProps("country")}
              error={touched.country && errors.country}
              type="text"
              label="Country"
              placeholder="USA"
              required
            />
            <Input
              {...getFieldProps("street")}
              error={touched.street && errors.street}
              type="text"
              label="Street"
              placeholder="Main St"
              required
            />
            <Input
              {...getFieldProps("zip")}
              error={touched.zip && errors.zip}
              type="number"
              label="Zip"
              placeholder="90001"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-info" onClick={resetForm}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="btn btn-secondary"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpBiz;
