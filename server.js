require("dotenv").config();

const express = require("express");
const cors = require("cors");

const servicesRoutes = require("./routes/services.routes");
const contactsRoutes = require("./routes/contacts.routes");
const adminRoutes = require("./routes/admin.routes");
const blogRoutes = require("./routes/blogs.routes");
const blogEnquiriesRoutes = require("./routes/blogEnquiries.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/services", servicesRoutes);
app.use("/contact", contactsRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/blogs", blogRoutes);
app.use("/blogs", blogRoutes);

// Blog Enquiries
app.use("/blog-enquiries", blogEnquiriesRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});