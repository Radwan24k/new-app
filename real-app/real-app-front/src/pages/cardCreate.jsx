// import cardsService from "../services/cardsService";
// import { useState } from "react";
// import { useNavigate } from "react-router";
// import Joi from "joi";
// import { useFormik } from "formik";

// import PageHeader from "../components/common/pageHeader";
// import Input from "../components/common/input";

// function CardCreate() {
//   const [serverError, setServerError] = useState("");
//   const navigate = useNavigate();

//   const form = useFormik({
//     validateOnMount: true,
//     initialValues: {
//       bizName: "",
//       bizDescription: "",
//       bizAddress: "",
//       bizPhone: "",
//       bizImage: "",
//     },

//     validate(values) {
//       const schema = Joi.object({
//         bizName: Joi.string().min(2).max(255).required().label("Name"),
//         bizDescription: Joi.string()
//           .min(2)
//           .max(1024)
//           .required()
//           .label("Description"),
//         bizAddress: Joi.string().min(2).max(400).required().label("Address"),
//         bizPhone: Joi.string()
//           .min(9)
//           .max(10)
//           .required()
//           .regex(/^0[2-9]\d{7,8}$/)
//           .label("Phone"),
//         bizImage: Joi.string().min(11).max(1024).label("Image").allow(""),
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
//     async onSubmit(values) {
//       try {
//         const { bizImage, ...body } = values;

//         if (bizImage) {
//           body.bizImage = bizImage;
//         }

//         await cardsService.createCard(body);
//         navigate("/my-cards");
//       } catch (err) {
//         if (err.response?.status === 400) {
//           setServerError(err.response.data);
//         }
//       }
//     },
//   });

//   return (
//     <div className="container">
//       <PageHeader title="Create Card" description="Create Card" />

//       <form onSubmit={form.handleSubmit}>
//         {serverError && <div className="alert alert-danger">{serverError}</div>}

//         <Input
//           {...form.getFieldProps("bizName")}
//           type="text"
//           label="Name"
//           required
//           error={form.touched.bizName && form.errors.bizName}
//         />
//         <Input
//           {...form.getFieldProps("bizDescription")}
//           type="text"
//           label="Description"
//           required
//           error={form.touched.bizDescription && form.errors.bizDescription}
//         />
//         <Input
//           {...form.getFieldProps("bizAddress")}
//           type="text"
//           label="Address"
//           required
//           error={form.touched.bizAddress && form.errors.bizAddress}
//         />
//         <Input
//           {...form.getFieldProps("bizPhone")}
//           type="text"
//           label="Phone"
//           required
//           error={form.touched.bizPhone && form.errors.bizPhone}
//         />
//         <Input
//           {...form.getFieldProps("bizImage")}
//           type="text"
//           label="Image"
//           error={form.touched.bizImage && form.errors.bizImage}
//         />

//         <div className="my-2">
//           <button
//             type="submit"
//             disabled={!form.isValid}
//             className="btn btn-primary"
//           >
//             Create Card
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// export default CardCreate;

// import { useFormik } from "formik";
// import Joi from "joi";
// import { useState } from "react";
// import { useNavigate } from "react-router";
// import PageHeader from "../components/common/pageHeader";
// import Input from "../components/common/input";
// import cardsService from "../services/cardsService";

// function CardCreate() {
//   const [serverError, setServerError] = useState("");
//   const navigate = useNavigate();

//   const form = useFormik({
//     validateOnMount: true,
//     initialValues: {
//       title: "",
//       subtitle: "",
//       description: "",
//       phone: "",
//       email: "",
//       web: "",
//       image: { url: "", alt: "" },
//       address: {
//         state: "",
//         country: "",
//         city: "",
//         street: "",
//         houseNumber: "",
//         zip: "",
//       },
//     },

//     validate(values) {
//       const schema = Joi.object({
//         title: Joi.string().min(2).max(256).required().label("Title"),
//         subtitle: Joi.string().min(2).max(256).required().label("Subtitle"),
//         description: Joi.string()
//           .min(2)
//           .max(1024)
//           .required()
//           .label("Description"),
//         phone: Joi.string().min(9).max(11).required().label("Phone"),
//         email: Joi.string()
//           .min(5)
//           .required()
//           .email({ tlds: { allow: false } })
//           .label("Email"),
//         web: Joi.string().min(14).allow("").label("Website"),
//         image: Joi.object({
//           url: Joi.string().min(14).required().label("Image URL"),
//           alt: Joi.string().min(2).max(256).required().label("Image Alt"),
//         }),
//         address: Joi.object({
//           state: Joi.string().allow("").label("State"),
//           country: Joi.string().min(2).max(256).required().label("Country"),
//           city: Joi.string().min(2).max(256).required().label("City"),
//           street: Joi.string().min(2).max(256).required().label("Street"),
//           houseNumber: Joi.number().min(1).required().label("House Number"),
//           zip: Joi.number().allow("").label("Zip"),
//         }),
//       });

//       const { error } = schema.validate(values, { abortEarly: false });

//       if (!error) {
//         return null;
//       }

//       const errors = {};
//       for (const detail of error.details) {
//         errors[detail.path.join(".")] = detail.message;
//       }

//       return errors;
//     },

//     async onSubmit(values) {
//       try {
//         await cardsService.createCard(values); // Send the card data to the backend
//         navigate("/my-cards"); // Redirect to the My Cards page
//       } catch (err) {
//         if (err.response?.status === 400) {
//           setServerError(err.response.data); // Display server error
//         }
//       }
//     },
//   });

//   return (
//     <div className="container">
//       <PageHeader
//         title="Create Card"
//         description="Create a new business card"
//       />

//       <form onSubmit={form.handleSubmit}>
//         {serverError && <div className="alert alert-danger">{serverError}</div>}

//         <Input
//           {...form.getFieldProps("title")}
//           type="text"
//           label="Title"
//           required
//           error={form.touched.title && form.errors.title}
//         />
//         <Input
//           {...form.getFieldProps("subtitle")}
//           type="text"
//           label="Subtitle"
//           required
//           error={form.touched.subtitle && form.errors.subtitle}
//         />
//         <Input
//           {...form.getFieldProps("description")}
//           type="text"
//           label="Description"
//           required
//           error={form.touched.description && form.errors.description}
//         />
//         <Input
//           {...form.getFieldProps("phone")}
//           type="text"
//           label="Phone"
//           required
//           error={form.touched.phone && form.errors.phone}
//         />
//         <Input
//           {...form.getFieldProps("email")}
//           type="email"
//           label="Email"
//           required
//           error={form.touched.email && form.errors.email}
//         />
//         <Input
//           {...form.getFieldProps("web")}
//           type="text"
//           label="Website"
//           error={form.touched.web && form.errors.web}
//         />
//         <Input
//           {...form.getFieldProps("image.url")}
//           type="text"
//           label="Image URL"
//           required
//           error={form.touched.image?.url && form.errors["image.url"]}
//         />
//         <Input
//           {...form.getFieldProps("image.alt")}
//           type="text"
//           label="Image Alt"
//           required
//           error={form.touched.image?.alt && form.errors["image.alt"]}
//         />
//         <Input
//           {...form.getFieldProps("address.state")}
//           type="text"
//           label="State"
//           error={form.touched.address?.state && form.errors["address.state"]}
//         />
//         <Input
//           {...form.getFieldProps("address.country")}
//           type="text"
//           label="Country"
//           required
//           error={
//             form.touched.address?.country && form.errors["address.country"]
//           }
//         />
//         <Input
//           {...form.getFieldProps("address.city")}
//           type="text"
//           label="City"
//           required
//           error={form.touched.address?.city && form.errors["address.city"]}
//         />
//         <Input
//           {...form.getFieldProps("address.street")}
//           type="text"
//           label="Street"
//           required
//           error={form.touched.address?.street && form.errors["address.street"]}
//         />
//         <Input
//           {...form.getFieldProps("address.houseNumber")}
//           type="number"
//           label="House Number"
//           required
//           error={
//             form.touched.address?.houseNumber &&
//             form.errors["address.houseNumber"]
//           }
//         />
//         <Input
//           {...form.getFieldProps("address.zip")}
//           type="number"
//           label="Zip"
//           error={form.touched.address?.zip && form.errors["address.zip"]}
//         />

//         <div className="my-2">
//           <button
//             type="submit"
//             disabled={!form.isValid}
//             className="btn btn-primary"
//           >
//             Create Card
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default CardCreate;

import { useFormik } from "formik";
import Joi from "joi";
import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../components/common/pageHeader";
import Input from "../components/common/input";
import cardsService from "../services/cardsService";

function CardCreate() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      title: "",
      subtitle: "",
      description: "",
      phone: "",
      email: "",
      web: "",
      image: { url: "", alt: "" },
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
      },
    },

    validate(values) {
      const schema = Joi.object({
        title: Joi.string().min(2).max(256).required().label("Title"),
        subtitle: Joi.string().min(2).max(256).required().label("Subtitle"),
        description: Joi.string()
          .min(2)
          .max(1024)
          .required()
          .label("Description"),
        phone: Joi.string().min(9).max(11).required().label("Phone"),
        email: Joi.string()
          .min(5)
          .required()
          .email({ tlds: { allow: false } })
          .label("Email"),
        web: Joi.string().min(14).allow("").label("Website"),
        image: Joi.object({
          url: Joi.string().min(14).required().label("Image URL"),
          alt: Joi.string().min(2).max(256).required().label("Image Alt"),
        }),
        address: Joi.object({
          state: Joi.string().allow("").label("State"),
          country: Joi.string().min(2).max(256).required().label("Country"),
          city: Joi.string().min(2).max(256).required().label("City"),
          street: Joi.string().min(2).max(256).required().label("Street"),
          houseNumber: Joi.number().min(1).required().label("House Number"),
          zip: Joi.number().allow("").label("Zip"),
        }),
      });

      const { error } = schema.validate(values, { abortEarly: false });

      if (!error) {
        return null;
      }

      const errors = {};
      for (const detail of error.details) {
        errors[detail.path.join(".")] = detail.message;
      }

      return errors;
    },

    async onSubmit(values) {
      try {
        await cardsService.createCard(values); // Send the card data to the backend
        navigate("/my-cards"); // Redirect to the My Cards page
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data); // Display server error
        }
      }
    },
  });

  return (
    <div className="container">
      <PageHeader
        title="Create Card"
        description="Create a new business card"
      />

      <form onSubmit={form.handleSubmit}>
        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <Input
              {...form.getFieldProps("title")}
              type="text"
              label="Title"
              required
              error={form.touched.title && form.errors.title}
            />
            <Input
              {...form.getFieldProps("subtitle")}
              type="text"
              label="Subtitle"
              required
              error={form.touched.subtitle && form.errors.subtitle}
            />
            <Input
              {...form.getFieldProps("description")}
              type="text"
              label="Description"
              required
              error={form.touched.description && form.errors.description}
            />
            <Input
              {...form.getFieldProps("phone")}
              type="text"
              label="Phone"
              required
              error={form.touched.phone && form.errors.phone}
            />
            <Input
              {...form.getFieldProps("email")}
              type="email"
              label="Email"
              required
              error={form.touched.email && form.errors.email}
            />
            <Input
              {...form.getFieldProps("web")}
              type="text"
              label="Website"
              error={form.touched.web && form.errors.web}
            />
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <Input
              {...form.getFieldProps("image.url")}
              type="text"
              label="Image URL"
              required
              error={form.touched.image?.url && form.errors["image.url"]}
            />
            <Input
              {...form.getFieldProps("image.alt")}
              type="text"
              label="Image Alt"
              required
              error={form.touched.image?.alt && form.errors["image.alt"]}
            />
            <Input
              {...form.getFieldProps("address.state")}
              type="text"
              label="State"
              error={
                form.touched.address?.state && form.errors["address.state"]
              }
            />
            <Input
              {...form.getFieldProps("address.country")}
              type="text"
              label="Country"
              required
              error={
                form.touched.address?.country && form.errors["address.country"]
              }
            />
            <Input
              {...form.getFieldProps("address.city")}
              type="text"
              label="City"
              required
              error={form.touched.address?.city && form.errors["address.city"]}
            />
            <Input
              {...form.getFieldProps("address.street")}
              type="text"
              label="Street"
              required
              error={
                form.touched.address?.street && form.errors["address.street"]
              }
            />
            <Input
              {...form.getFieldProps("address.houseNumber")}
              type="number"
              label="House Number"
              required
              error={
                form.touched.address?.houseNumber &&
                form.errors["address.houseNumber"]
              }
            />
            <Input
              {...form.getFieldProps("address.zip")}
              type="number"
              label="Zip"
              error={form.touched.address?.zip && form.errors["address.zip"]}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="submit"
            disabled={!form.isValid}
            className="btn btn-primary"
          >
            Create Card
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardCreate;
