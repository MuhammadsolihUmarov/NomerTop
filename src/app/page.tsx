import Link from "next/link";
import { Search, ShieldAlert, MessageCircle, Car } from "lucide-react";

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fafafa", minHeight: "100vh", color: "#111" }}>
      {/* Navigation */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem 5%", alignItems: "center", borderBottom: "1px solid #eaeaea", backgroundColor: "white" }}>
        <div style={{ fontWeight: "900", fontSize: "1.5rem", letterSpacing: "-0.05em" }}>NomerTop</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login" style={{ padding: "0.5rem 1rem", fontWeight: "bold", color: "#666", textDecoration: "none" }}>Log In</Link>
          <Link href="/dashboard" style={{ padding: "0.5rem 1rem", fontWeight: "bold", backgroundColor: "#111", color: "white", borderRadius: "8px", textDecoration: "none" }}>Go to Fleet</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: "8rem 5%", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "4.5rem", fontWeight: "900", lineHeight: "1.1", marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
          Your License Plate is Now a <span style={{ color: "#2563eb" }}>Communication Hub.</span>
        </h1>
        <p style={{ fontSize: "1.35rem", color: "#555", marginBottom: "3rem", maxWidth: "800px", margin: "0 auto 3rem", lineHeight: "1.6" }}>
          The global network that turns vehicle license plates into anonymous, secure communication channels. Need to contact the owner of a parked car? Just scan the plate.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/search" style={{ padding: "1.25rem 2.5rem", backgroundColor: "#2563eb", color: "white", borderRadius: "12px", fontWeight: "bold", fontSize: "1.2rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Search a Vehicle <Search size={20} />
          </Link>
          <Link href="/dashboard/register-plate" style={{ padding: "1.25rem 2.5rem", backgroundColor: "white", color: "#111", border: "2px solid #eaeaea", borderRadius: "12px", fontWeight: "bold", fontSize: "1.2rem", textDecoration: "none" }}>
            Claim Your Plate
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section style={{ padding: "5rem 5%", backgroundColor: "white", borderTop: "1px solid #eaeaea" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", textAlign: "center", margin: "0 0 4rem 0" }}>Why use NomerTop?</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
            
            {/* Feature 1 */}
            <div style={{ padding: "2.5rem", border: "1px solid #eaeaea", borderRadius: "24px", backgroundColor: "#fafafa" }}>
              <div style={{ width: "60px", height: "60px", backgroundColor: "#dbeafe", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "#2563eb" }}>
                <ShieldAlert size={28} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Prevent Towing</h3>
              <p style={{ color: "#666", lineHeight: "1.7", fontSize: "1.1rem" }}>
                Blocking someone in? Left your lights on? Anyone can look up your license plate and send you a critical alert before a tow truck is called.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ padding: "2.5rem", border: "1px solid #eaeaea", borderRadius: "24px", backgroundColor: "#fafafa" }}>
              <div style={{ width: "60px", height: "60px", backgroundColor: "#dcfce7", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "#16a34a" }}>
                <MessageCircle size={28} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Anonymous & Secure</h3>
              <p style={{ color: "#666", lineHeight: "1.7", fontSize: "1.1rem" }}>
                We never reveal your phone number or identity. Messages are securely routed through our encrypted vault directly to your dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ padding: "2.5rem", border: "1px solid #eaeaea", borderRadius: "24px", backgroundColor: "#fafafa" }}>
              <div style={{ width: "60px", height: "60px", backgroundColor: "#f3e8ff", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "#9333ea" }}>
                <Car size={28} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Global Fleet Ready</h3>
              <p style={{ color: "#666", lineHeight: "1.7", fontSize: "1.1rem" }}>
                Manage multiple vehicles across borders. We natively support license plate formats for Uzbekistan, Russia, Kazakhstan, and more.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "6rem 5%", backgroundColor: "#111", color: "white", textAlign: "center" }}>
        <h2 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1.5rem" }}>Own Your Identity on the Road.</h2>
        <p style={{ fontSize: "1.25rem", color: "#999", maxWidth: "600px", margin: "0 auto 3rem", lineHeight: "1.6" }}>
          Registering takes 30 seconds. Verify your vehicle and never miss a critical street-side notification again.
        </p>
        <Link href="/login" style={{ padding: "1.25rem 3rem", backgroundColor: "white", color: "#111", borderRadius: "99px", fontWeight: "800", fontSize: "1.25rem", textDecoration: "none", display: "inline-block" }}>
          Start Now for Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "3rem 5%", textAlign: "center", borderTop: "1px solid #eaeaea", backgroundColor: "white" }}>
        <p style={{ color: "#888", fontWeight: "bold" }}>© 2026 NomerTop Global. All rights reserved.</p>
      </footer>
    </div>
  );
}
