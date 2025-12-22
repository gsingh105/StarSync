import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import astrologerService from "../../services/astrologerService";
import { User, Mail, Phone, Star, Award, DollarSign, Upload, Image as ImageIcon, AlertCircle } from "lucide-react";

const AddAstrologerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Text fields state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experienceYears: "",
    price: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const loadingToast = toast.loading("Creating astrologer profile...");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("specialization", formData.specialization);
      data.append("experienceYears", formData.experienceYears);
      data.append("price", formData.price);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      await astrologerService.register(data);

      toast.success("Astrologer Added Successfully!", { id: loadingToast });
      window.location.reload(); // Simple reload to refresh list, or handle via parent state

    } catch (err) {
      console.error("Submission failed", err);
      setError(err.response?.data?.message || "Failed to add astrologer");
    } finally {
      setLoading(false);
    }
  };

  // Shared Input Styles
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";
  const inputContainerClass = "relative group";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all";

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">

      <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Onboard New Talent</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Add details to register a new astrologer to the platform.</p>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Full Name</label>
            <div className={inputContainerClass}>
              <User className={iconClass} />
              <input
                type="text"
                name="name"
                required
                placeholder="Vikram Singh"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <div className={inputContainerClass}>
              <Mail className={iconClass} />
              <input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Phone & Specialization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Phone Number</label>
            <div className={inputContainerClass}>
              <Phone className={iconClass} />
              <input
                type="tel"
                name="phone"
                required
                placeholder="+91 99999 99999"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Specialization</label>
            <div className={inputContainerClass}>
              <Star className={iconClass} />
              <select
                name="specialization"
                required
                className={`${inputClass} appearance-none cursor-pointer`}
                onChange={handleChange}
              >
                <option value="">Select Specialization</option>
                <option value="Vastu Shastra">Vastu Shastra</option>
                <option value="Vedic Astrology">Vedic Astrology</option>
                <option value="Numerology">Numerology</option>
                <option value="Tarot Reading">Tarot Reading</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Experience & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Experience (Years)</label>
            <div className={inputContainerClass}>
              <Award className={iconClass} />
              <input
                type="number"
                name="experienceYears"
                required
                min="0"
                placeholder="5"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Price (₹ per min)</label>
            <div className={inputContainerClass}>
              <DollarSign className={iconClass} />
              <input
                type="number"
                name="price"
                required
                min="0"
                placeholder="50"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className={labelClass}>Profile Image</label>
          <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group">
            <div className="text-center">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-full border-4 border-white dark:border-slate-800 shadow-lg" />
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white w-8 h-8" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <ImageIcon size={32} />
                  </div>
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <span className="relative cursor-pointer rounded-md font-medium text-amber-600 dark:text-amber-500 focus-within:outline-none hover:text-amber-500">
                      <span>Upload a file</span>
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Creating Profile..." : "Create Astrologer Profile"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddAstrologerForm;