import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "32px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Crear Cuenta
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#6b7280",
            }}
          >
            Únete a Boardo para gestionar tus tareas
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
