const express = require("express");
const Coache = require("../models/Coache");
const CoachRequest = require("../models/CoachRequest");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken"); // You'll need this for auth

// Middleware to parse JSON
router.use(bodyParser.json());

/* ============================================================
   MIDDLEWARE: Verify JWT Token (for protected routes)
============================================================ */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.userId = decoded.id; // Store user ID in request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* ============================================================
   POST: Submit Coache Form
============================================================ */
router.post("/submit", async (req, res) => {
  const { name, email, phone, address, reason, skills, team, hoursPerWeek, availability } = req.body;

  if (!name || !email || !phone || !address || !reason || !skills || !team || !hoursPerWeek || !availability) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newCoache = new Coache({ 
      name, email, phone, address, reason, skills, team, hoursPerWeek, availability 
    });

    await newCoache.save();
    res.status(201).json({ message: "Coach form submitted successfully!" });

  } catch (error) {
    console.error("Error saving coach:", error);
    res.status(500).json({ error: "Failed to save coach data." });
  }
});

/* ============================================================
   GET: PUBLIC — Retrieve Safe Coache List (Frontend Display)
   (Does NOT return email, phone, address)
============================================================ */
router.get("/public", async (req, res) => {
  try {
    const coaches = await Coache.find()
      .sort({ createdAt: -1 })
      .select("name skills team reason availability hoursPerWeek createdAt"); 
      // only safe fields

    res.json(coaches);

  } catch (error) {
    console.error("Error fetching coaches:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

/* ============================================================
   GET: ADMIN — Retrieve All Coaches (Full Info)
============================================================ */
router.get("/coache", async (req, res) => {
  try {
    const coaches = await Coache.find().sort({ createdAt: -1 }); 
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

/* ============================================================
   DELETE: Remove a Coache by ID (Admin)
============================================================ */
router.delete("/coache/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Coache.findByIdAndDelete(id);
    res.json({ message: "Coach deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coach." });
  }
});

/* ============================================================
   POST: Send Request to a Coach (UPDATED - SAVES TO DATABASE)
   Protected Route - Requires Authentication
============================================================ */
router.post("/request/:id", verifyToken, async (req, res) => {
  try {
    const coachId = req.params.id;
    const { message, name, email, phone } = req.body;

    // Validate required fields
    if (!message || !name || !email) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    // Verify coach exists
    const coach = await Coache.findById(coachId);
    if (!coach) {
      return res.status(404).json({ error: "Coach not found" });
    }

    // Create new coach request
    const newRequest = new CoachRequest({
      user: req.userId, // from JWT token
      coach: coachId,
      message: message,
      requesterName: name,
      requesterEmail: email,
      requesterPhone: phone || ""
    });

    await newRequest.save();

    res.status(201).json({ 
      message: `Request sent successfully to ${coach.name}!`,
      request: newRequest 
    });

  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ error: "Failed to send request." });
  }
});

/* ============================================================
   GET: Get all requests for a specific coach (Admin/Coach View)
============================================================ */
router.get("/requests/coach/:coachId", verifyToken, async (req, res) => {
  try {
    const requests = await CoachRequest.find({ coach: req.params.coachId })
      .populate("user", "name email") // Get user details
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

/* ============================================================
   GET: Get all requests made by a user
============================================================ */
router.get("/requests/user", verifyToken, async (req, res) => {
  try {
    const requests = await CoachRequest.find({ user: req.userId })
      .populate("coach", "name team skills") // Get coach details
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

module.exports = router;