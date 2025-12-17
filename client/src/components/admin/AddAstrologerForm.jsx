// src/components/admin/AddAstrologerForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import astrologerService from "../../services/astrologerService"; 

const AddAstrologerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Added error state for feedback
  
  // File state
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

    try {
      // 1. Construct FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("specialization", formData.specialization);
      data.append("experienceYears", formData.experienceYears);
      data.append("price", formData.price);

      // 2. Append the file with the exact key "profileImage" 
      // This MUST match upload.single("profileImage") in backend routes
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      // 3. Send to service
      await astrologerService.register(data);
      
      alert("Astrologer Added Successfully!");
      navigate("/admin/dashboard");
      
    } catch (err) {
      console.error("Submission failed", err);
      setError(err || "Failed to add astrologer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Astrologer</h2>
        <p className="text-gray-500 text-sm mt-1">Enter details to onboard a new expert.</p>
        {error && <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" name="name" required placeholder="Vikram Singh" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" name="email" required placeholder="email@example.com" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange} />
          </div>
        </div>

        {/* Phone & Specialization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" name="phone" required placeholder="+91 99999 99999" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <select name="specialization" required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              onChange={handleChange}>
              <option value="">Select Specialization</option>
              <option value="Vastu Shastra">Vastu Shastra</option>
              <option value="Vedic Astrology">Vedic Astrology</option>
              <option value="Numerology">Numerology</option>
              <option value="Tarot Reading">Tarot Reading</option>
            </select>
          </div>
        </div>

        {/* Experience & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
            <input type="number" name="experienceYears" required min="0" placeholder="5" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (per min)</label>
            <input type="number" name="price" required min="0" placeholder="50" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange} />
          </div>
        </div>

        {/* Image Upload */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
           <div className="flex items-center gap-6">
             <div className="shrink-0">
               {imagePreview ? (
                 <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-full border" />
               ) : (
                 <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border">
                   No Img
                 </div>
               )}
             </div>
             <input type="file" name="profileImage" accept="image/*" 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                onChange={handleImageChange}
              />
           </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-md transition-all 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? "Uploading..." : "Create Astrologer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAstrologerForm;