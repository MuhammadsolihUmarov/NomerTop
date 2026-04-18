import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <header style={{ marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "3rem", margin: "0 0 1rem 0" }}>NomerTop</h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>The Global Vehicle Identity Network</p>
      </header>

      <main>
        <section style={{ marginBottom: "4rem" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Securely register your vehicle license plate to receive anonymous, encrypted messages. 
            Search for other vehicles worldwide to alert owners of issues, parking problems, or emergencies.
          </p>
        </section>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
          <Link 
            href="/search" 
            style={{ padding: "1rem 2rem", background: "#10b981", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}
          >
            Search Fleet
          </Link>
          <Link 
            href="/dashboard" 
            style={{ padding: "1rem 2rem", background: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}
          >
            My Dashboard
          </Link>
          <Link 
            href="/login" 
            style={{ padding: "1rem 2rem", background: "#f3f4f6", color: "#374151", textDecoration: "none", borderRadius: "8px", fontWeight: "bold", border: "1px solid #d1d5db" }}
          >
            Login / Register
          </Link>
        </div>
      </main>

      <footer style={{ marginTop: "6rem", borderTop: "1px solid #eaeaea", paddingTop: "2rem", color: "#888", fontSize: "0.9rem" }}>
        <p>© 2026 NomerTop</p>
      </footer>
    </div>
  );
}
