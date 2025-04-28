import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom"; // Import Navigate
import Joi from "joi";
import { useFormik } from "formik";
import { toast } from "react-toastify"; // Import toast

import PageHeader from "../components/common/pageHeader";
import Input from "../components/common/input";
// Import specific functions
import { getCardById, updateCardById } from "../services/cardsService";
import { useAuth } from "../context/auth.context"; // Import useAuth

function CardUpdate() {
  const { id: cardId } = useParams(); // Get the card ID from the URL
  const { user } = useAuth(); // Get current user info
  // const [serverError, setServerError] = useState(""); // Remove serverError state
  const [loading, setLoading] = useState(true); // State for loading card data
  const [cardData, setCardData] = useState(null); // State to hold fetched card data
  const [hasPermissionError, setHasPermissionError] = useState(false); // Track permission error specifically
  const navigate = useNavigate();

  // Fetch card data on component mount
  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true); // Start loading
      setHasPermissionError(false); // Reset permission error
      try {
        const { data } = await getCardById(cardId);
        // Check permissions immediately after fetching
        if (!user || !(user.isAdmin || user._id === data.user_id)) {
          toast.error("You do not have permission to edit this card.");
          setHasPermissionError(true); // Set permission error flag
          setCardData(null); // Don't store data if no permission
        } else {
          setCardData(data);
        }
      } catch (err) {
        console.error("Error fetching card data:", err);
        if (err.response?.status === 404) {
          toast.error("Card not found.");
        } else {
          toast.error("Failed to load card data.");
        }
        setCardData(null); // Ensure no stale data on error
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [cardId, user]); // Rerun if cardId or user changes

  const form = useFormik({
    validateOnMount: false, // Don't validate initially, wait for data
    enableReinitialize: true, // Allow form to reinitialize with fetched data
    initialValues: {
      // Flat structure, initialized from cardData
      title: cardData?.title || "",
      subtitle: cardData?.subtitle || "",
      description: cardData?.description || "",
      phone: cardData?.phone || "",
      email: cardData?.email || "",
      web: cardData?.web || "",
      imageUrl: cardData?.image?.url || "",
      imageAlt: cardData?.image?.alt || "",
      state: cardData?.address?.state || "",
      country: cardData?.address?.country || "",
      city: cardData?.address?.city || "",
      street: cardData?.address?.street || "",
      houseNumber: cardData?.address?.houseNumber || "",
      zip: cardData?.address?.zip || "",
    },

    validate(values) {
      // Same validation schema as cardCreate
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
        web: Joi.string().min(14).uri().allow("").label("Website"),
        imageUrl: Joi.string().min(14).uri().allow("").label("Image URL"),
        imageAlt: Joi.string().min(2).max(256).allow("").label("Image Alt"),
        state: Joi.string().min(2).max(256).allow("").label("State"),
        country: Joi.string().min(2).max(256).required().label("Country"),
        city: Joi.string().min(2).max(256).required().label("City"),
        street: Joi.string().min(2).max(256).required().label("Street"),
        houseNumber: Joi.number().min(1).required().label("House Number"),
        zip: Joi.number().min(1).required().label("Zip"),
      });

      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return null;
      const errors = {};
      for (const detail of error.details) {
        errors[detail.path[0]] = detail.message;
      }
      return errors;
    },

    async onSubmit(values) {
      if (!cardData || hasPermissionError) return; // Prevent submission if no data or permission error
      try {
        // Structure data for API
        const updatedCardData = {
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          phone: values.phone,
          email: values.email,
          web: values.web || undefined,
          image: {
            url:
              values.imageUrl ||
              cardData.image?.url ||
              "https://via.placeholder.com/300x200", // Keep original or default if empty
            alt: values.imageAlt || cardData.image?.alt || values.title, // Keep original or default if empty
          },
          address: {
            state: values.state || undefined,
            country: values.country,
            city: values.city,
            street: values.street,
            houseNumber: values.houseNumber,
            zip: values.zip,
          },
        };
        const { data } = await updateCardById(cardId, updatedCardData);
        toast.success(`Card "${data.title}" updated successfully!`); // Success toast
        navigate("/my-cards");
      } catch ({ response }) {
        // Destructure response
        if (response && response.status === 400) {
          toast.error(
            response.data || "Error updating card. Please check your input."
          ); // Error toast
        } else if (response && response.status === 403) {
          toast.error("You are not authorized to edit this card."); // Forbidden error
          setHasPermissionError(true); // Set permission error flag again just in case
        } else if (response && response.status === 404) {
          toast.error("Card not found."); // Not found error
        } else {
          toast.error("An unexpected error occurred while updating the card."); // Generic error toast
          console.error(response); // Log the error response
        }
      }
    },
  });

  // No need for the second useEffect to setValues, enableReinitialize handles it

  // Handle loading state
  if (loading) {
    return <div>Loading card details...</div>;
  }

  // Handle case where card data failed to load or permission denied
  if (!cardData) {
    // Error toast was already shown in useEffect
    return (
      <div className="container text-center mt-4">
        Could not load card details or access denied.
      </div>
    );
  }

  // Redirect if user is not logged in (should be caught by protected route ideally)
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Permission already checked in useEffect, form is only rendered if cardData exists

  return (
    <div className="container">
      <PageHeader
        title="Update Card"
        description={`Update card: ${cardData.title}`}
      />

      {/* Form is rendered only if cardData is loaded and permission was granted */}
      <form onSubmit={form.handleSubmit} noValidate>
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
              type="tel"
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
              type="url"
              label="Website"
              error={form.touched.web && form.errors.web}
            />
            <Input
              {...form.getFieldProps("imageUrl")}
              type="url"
              label="Image URL"
              error={form.touched.imageUrl && form.errors.imageUrl}
            />
            <Input
              {...form.getFieldProps("imageAlt")}
              type="text"
              label="Image Alt"
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
              required
              error={form.touched.zip && form.errors.zip}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          {/* Reset button could reset to original fetched values, requires more logic */}
          {/* <button type="reset" className="btn btn-danger" onClick={() => form.resetForm()}>Reset Changes</button> */}
          <button
            type="submit"
            disabled={!form.isValid || !form.dirty}
            className="btn btn-primary"
          >
            Update Card
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardUpdate;
