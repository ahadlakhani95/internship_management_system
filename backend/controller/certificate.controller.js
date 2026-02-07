import Certificate from "../models/Certificate.model.js";
import Application from "../models/Application.model.js";

/**
 * @desc Generate certificate for selected student
 * @route POST /api/certificates
 * @access Company / Admin
 */
export const generateCertificate = async (req, res) => {
  try {
    const { applicationId, pdfUrl } = req.body;

    // Check application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only SELECTED students get certificates
    if (application.status !== "SELECTED") {
      return res.status(400).json({
        message: "Certificate can be generated only for SELECTED applications",
      });
    }

    // Prevent duplicate certificate
    const existing = await Certificate.findOne({ applicationId });
    if (existing) {
      return res.status(400).json({ message: "Certificate already generated" });
    }

    // Generate unique certificate number
    const certificateNumber = `CERT-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const certificate = await Certificate.create({
      applicationId,
      certificateNumber,
      pdfUrl,
    });

    res.status(201).json({
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get certificate by application ID
 * @route GET /api/certificates/application/:id
 * @access Student
 */
export const getCertificateByApplication = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      applicationId: req.params.id,
    }).populate({
      path: "applicationId",
      populate: {
        path: "internshipId",
        select: "title duration",
      },
    });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Verify certificate by certificate number
 * @route GET /api/certificates/verify/:certificateNumber
 * @access Public
 */
export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateNumber: req.params.certificateNumber,
      verified: true,
    }).populate({
      path: "applicationId",
      populate: {
        path: "studentId",
        select: "education skills",
      },
    });

    if (!certificate) {
      return res.status(404).json({ message: "Invalid certificate" });
    }

    res.json({
      message: "Certificate verified successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
