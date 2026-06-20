import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#e5e2e1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌧️</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#4edea3", marginBottom: "12px" }}>Something went wrong</h1>
          <p style={{ color: "rgba(187,202,191,0.7)", fontSize: "15px", marginBottom: "24px", maxWidth: "400px" }}>
            We hit an unexpected error. Please try reloading the app.
          </p>
          <button
            onClick={this.handleReset}
            style={{ padding: "14px 32px", background: "#4edea3", color: "#003824", fontSize: "15px", fontWeight: 700, border: "none", borderRadius: "12px", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;