

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0d1117",
        color: "#ffffff",
        padding: "50px 10%",
        textAlign: "center",
        borderTop: "1px solid #30363d",
        marginTop: "50px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        {/* Column 1 */}
        <div style={{ flex: "1", minWidth: "200px", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#58a6ff" }}>
            About Us
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#c9d1d9" }}>
            We aim to provide the best tools, resources, and guidance for developers to
            enhance their skills. Join us and explore a world of opportunities!
          </p>
        </div>

        {/* Column 2 */}
        <div style={{ flex: "1", minWidth: "200px", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#58a6ff" }}>
            Quick Links
          </h2>
          <ul style={{ listStyle: "none", padding: 0, color: "#c9d1d9" }}>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>Home</li>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>Features</li>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>Pricing</li>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>Contact</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div style={{ flex: "1", minWidth: "200px", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#58a6ff" }}>
            Resources
          </h2>
          <ul style={{ listStyle: "none", padding: 0, color: "#c9d1d9" }}>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>Blog</li>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>Documentation</li>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>FAQs</li>
            <li style={{ marginBottom: "10px", fontSize: "14px" }}>API</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div style={{ flex: "1", minWidth: "200px", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#58a6ff" }}>
            Contact Us
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#c9d1d9" }}>
            Email: support@coolfooter.com
            <br />
            Phone: +123 456 7890
            <br />
            Address: 123 Dev Street, Code City, World
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ fontSize: "18px", color: "#58a6ff", marginBottom: "15px" }}>
          Follow Us
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#21262d",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "18px" }}>G</span>
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#21262d",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "18px" }}>L</span>
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#21262d",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "18px" }}>T</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        style={{
          borderTop: "1px solid #30363d",
          marginTop: "30px",
          paddingTop: "20px",
          fontSize: "14px",
          color: "#8b949e",
        }}
      >
        <p>© {new Date().getFullYear()} Cool Footer. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
