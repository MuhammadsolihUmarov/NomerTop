module.exports = {
  apps: [
    {
      name: "nomertop-frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "", // Leave empty so it calls same domain and gets picked up by Nginx
        INTERNAL_API_URL: "http://127.0.0.1:8000" // For Server Actions (SSR)
      }
    },
    {
      name: "nomertop-backend",
      script: "venv/Scripts/python.exe", // Use 'venv/bin/python' on Linux/Ubuntu
      args: "-m uvicorn main:app --host 127.0.0.1 --port 8000",
      cwd: "./backend",
      env: {
        DATABASE_URL: "sqlite:///./prod.db",
        SECRET_KEY: "replace-with-a-very-secure-random-key"
      }
    }
  ]
};
