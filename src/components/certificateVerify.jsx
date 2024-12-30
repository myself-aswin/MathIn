// certificateVerify.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

import Loader from "./loader";
import Footer from "./footer";
import "../styles/certificateVerify.css";

const CertificateVerify = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("there");
  const [status, setStatus] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");

  const handleClose = () => {
    navigate("/", { replace: true });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const q = query(
          collection(db, "passEntries"),
          where("uuid", "==", certificateId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setStatus("invalid");
          return;
        }

        const docData = querySnapshot.docs[0].data();
        const expiryTimestamp = docData.expiryTimestamp.toMillis();
        const currentTimestamp = Date.now();

        if (!expiryTimestamp || expiryTimestamp < currentTimestamp) {
          setStatus("invalid");
          return;
        }

        setStatus("valid");
        setName(docData.name || "there");
        setExpiryDate(formatDate(expiryTimestamp));
      } catch (err) {
        console.error("Error verifying certificate: ", err);
        alert("Failed to verify certificate. Please try again !");
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateId]);

  if (loading) return <Loader />;

  return (
    <>
      <div className="certificate-verify-container">
        <div className="certificate-verify-subcontainer1">
          <div className="certificate-verify-main-title">
            <img
              src={`${import.meta.env.BASE_URL}icons/sparkle.svg`}
              alt="Sparkle Icon"
            />
            <h1>
              Math<span>In</span>
            </h1>
            <img
              src={`${import.meta.env.BASE_URL}icons/sparkle.svg`}
              alt="Sparkle Icon"
            />
          </div>

          <button
            className="certificate-verify-close-btn"
            onClick={handleClose}
          >
            <img
              src={`${import.meta.env.BASE_URL}icons/xMark.svg`}
              alt="Close Icon"
            />
          </button>
        </div>

        {status === "valid" && (
          <div className="certificate-verify-subcontainer2">
            <h1 className="certificate-verify-header">
              Certificate <span>- Verification</span>
            </h1>
            <h2 className="certificate-verify-subtitle1">
              Hello <span>{name} !</span>&nbsp;&nbsp;&nbsp;🎉
            </h2>
            <div className="certificate-verify-subtitle2 blink-animation">
              <img
                className="certificate-verify-icon"
                src={`${import.meta.env.BASE_URL}icons/circleTick.svg`}
                alt="Correct Icon"
              />
              This certificate is valid until<span>&nbsp;{expiryDate}</span>
            </div>
          </div>
        )}

        {status === "invalid" && (
          <div className="certificate-verify-subcontainer2">
            <h1 className="certificate-verify-header">
              Certificate <span>- Verification</span>
            </h1>
            <h2 className="certificate-verify-subtitle1">
              Hello <span>{name} !</span>&nbsp;&nbsp;&nbsp;🥺
            </h2>
            <div className="certificate-verify-subtitle2 blink-animation">
              <img
                className="certificate-verify-icon"
                src={`${import.meta.env.BASE_URL}icons/circleX.svg`}
                alt="Wrong Icon"
              />
              This certificate is Invalid or Expired
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CertificateVerify;