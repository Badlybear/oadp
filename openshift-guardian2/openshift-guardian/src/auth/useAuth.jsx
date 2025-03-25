// useAuth.jsx
export const verifyAuth = async () => {
  try {
    const res = await fetch("http://localhost:8000/me", {  
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("🛑 /me responded with status:", res.status);
      window.location.href = "http://localhost:8000/login"; 
      throw new Error("Not authenticated");
    }

    const data = await res.json();
    console.log("✅ User from /me:", data.user);
    return data.user;
  } catch (err) {
    console.error("Failed to verify auth:", err);
    window.location.href = "http://localhost:8000/login";  
    throw err;
  }
};