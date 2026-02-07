import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { createInternship } from "../../api/api";
import './addintership.css'
const AddInternship = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skillsRequired: "",
        duration: "",
        stipend: "",
        location: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...formData,
                skillsRequired: formData.skillsRequired.split(","), // convert string to array
            };

            let res = await createInternship(payload);
            console.log(res);;


            alert("Internship Created Successfully");

            navigate("/company/dashboard");

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-internship-container">
            <h2>Add Internship</h2>

            <form onSubmit={handleSubmit} className="internship-form">

                <input
                    type="text"
                    name="title"
                    placeholder="Internship Title"
                    required
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    required
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="skillsRequired"
                    placeholder="Skills (comma separated)"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="duration"
                    placeholder="Duration (eg. 3 Months)"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="stipend"
                    placeholder="Stipend"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Posting..." : "Post Internship"}
                </button>

            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AddInternship;
