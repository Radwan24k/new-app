import { useFormik } from "formik";
import Joi from "joi";
import { useNavigate, Navigate } from "react-router-dom"; // Import Navigate
import { toast } from "react-toastify"; // Import toast

import PageHeader from "../components/common/pageHeader";
import Input from "../components/common/input";
// Import the specific function
import { createCard } from "../services/cardsService";
import { useAuth } from "../context/auth.context"; // Import useAuth

function CardCreate() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user info

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      title: "",
      subtitle: "",
      description: "",
      phone: "",
      email: "",
      web: "",
      // Use flat structure for easier Formik handling
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
        title: Joi.string().min(2).max(256).required().label("Title"),
        subtitle: Joi.string().min(2).max(256).required().label("Subtitle"),
        description: Joi.string()
          .min(2)
          .max(1024) // API spec
          .required()
          .label("Description"),
        phone: Joi.string()
          .min(9) // API spec
          .max(11) // API spec
          .required()
          .label("Phone"),
        email: Joi.string()
          .min(5) // API spec
          .required()
          .email({ tlds: { allow: false } })
          .label("Email"),
        web: Joi.string()
          .min(14) // API spec
          .uri() // Validate as URL
          .allow("")
          .label("Website"),
        // Use flat structure for validation
        imageUrl: Joi.string()
          .min(14) // API spec
          .uri() // Validate as URL
          .allow("") // Allow empty for non-required image
          .label("Image URL"),
        imageAlt: Joi.string().min(2).max(256).allow("").label("Image Alt"),
        state: Joi.string().min(2).max(256).allow("").label("State"), // API spec: min 2, allow empty
        country: Joi.string().min(2).max(256).required().label("Country"), // API spec: min 2
        city: Joi.string().min(2).max(256).required().label("City"), // API spec: min 2
        street: Joi.string().min(2).max(256).required().label("Street"), // API spec: min 2
        houseNumber: Joi.number()
          .min(1) // API spec says min 1
          .required()
          .label("House Number"),
        zip: Joi.number()
          .min(1) // Keep min 1
          .required() // API spec says required
          .label("Zip"),
      });

      const { error } = schema.validate(values, { abortEarly: false });

      if (!error) {
        return null;
      }

      const errors = {};
      for (const detail of error.details) {
        // Use path[0] for flat structure
        errors[detail.path[0]] = detail.message;
      }

      return errors;
    },

    async onSubmit(values) {
      try {
        // Structure the data as the API expects
        const cardData = {
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          phone: values.phone,
          email: values.email,
          web: values.web || undefined, // Send undefined if empty
          image: {
            url: values.imageUrl || "https://via.placeholder.com/300x200", // Default if empty
            alt: values.imageAlt || values.title, // Default if empty
          },
          address: {
            state: values.state || undefined, // Send undefined if empty
            country: values.country,
            city: values.city,
            street: values.street,
            houseNumber: values.houseNumber,
            zip: values.zip,
          },
        };
        const { data } = await createCard(cardData); // Use the imported function and get created card data
        toast.success(`Card "${data.title}" created successfully!`); // Success toast
        navigate("/my-cards"); // Redirect to the My Cards page
      } catch ({ response }) {
        // Destructure response
        if (response && response.status === 400) {
          toast.error(
            response.data || "Error creating card. Please check your input."
          ); // Error toast
        } else {
          toast.error("An unexpected error occurred while creating the card."); // Generic error toast
          console.error(response); // Log the error response for debugging
        }
      }
    },
  });

  // Redirect if user is not logged in or not a business user
  if (!user || !user.isBusiness) {
    return <Navigate to="/sign-in" replace />;
    // Or show a message: return <div>Access Denied: Only business users can create cards.</div>;
  }

  return (
    <div className="container">
      <PageHeader
        title="Create Card"
        description="Create a new business card"
      />

      <form onSubmit={form.handleSubmit} noValidate>
        {" "}
        {/* Added noValidate */}
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
              type="text" // Consider using textarea for longer descriptions
              label="Description"
              required
              error={form.touched.description && form.errors.description}
            />
            <Input
              {...form.getFieldProps("phone")}
              type="tel" // Use tel type for phone
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
              type="url" // Use url type for website
              label="Website"
              error={form.touched.web && form.errors.web}
            />
            <Input
              {...form.getFieldProps("imageUrl")}
              type="url" // Use url type
              label="Image URL"
              // Not required by API if default is provided
              error={form.touched.imageUrl && form.errors.imageUrl}
            />
            <Input
              {...form.getFieldProps("imageAlt")}
              type="text"
              label="Image Alt"
              // Not required by API if default is provided
              error={form.touched.imageAlt && form.errors.imageAlt}
            />
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <Input
              {...form.getFieldProps("state")}
              type="text"
              label="State"
              error={form.touched.state && form.errors.state}
            />
            <Input
              {...form.getFieldProps("country")}
              type="text"
              label="Country"
              required
              error={form.touched.country && form.errors.country}
            />
            <Input
              {...form.getFieldProps("city")}
              type="text"
              label="City"
              required
              error={form.touched.city && form.errors.city}
            />
            <Input
              {...form.getFieldProps("street")}
              type="text"
              label="Street"
              required
              error={form.touched.street && form.errors.street}
            />
            <Input
              {...form.getFieldProps("houseNumber")}
              type="number"
              label="House Number"
              required
              error={form.touched.houseNumber && form.errors.houseNumber}
            />
            <Input
              {...form.getFieldProps("zip")}
              type="number"
              label="Zip"
              required // API requires zip
              error={form.touched.zip && form.errors.zip}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)} // Go back
          >
            Cancel
          </button>
          <button
            type="reset" // Use reset type
            className="btn btn-danger"
            onClick={() => form.resetForm()}
          >
            Reset
          </button>
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
