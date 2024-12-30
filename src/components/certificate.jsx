// certificate.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import '../styles/certificate.css';

const Certificate = ({ onViewed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const localUserData = JSON.parse(sessionStorage.getItem("userData"));
  const userName = localUserData.name;
  const userEmail = localUserData.email;

  const fetchFirebaseData = async (userEmail) => {
    try {
      const userDocRef = doc(db, "passEntries", userEmail);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const fetchedUserData = userDoc.data();
        return fetchedUserData;
      } else {
        throw new Error("Requested userdata not found !");
      }
    } catch (error) {
      console.error("Error fetching userdata: ", error);
      throw error;
    }
  };

  const handleCertDownload = async () => {
    setIsLoading(true);

    try {
      const firebaseUserData = await fetchFirebaseData(userEmail);

      const requestBody = {
        username: userName,
        certificate_id: firebaseUserData.uuid,
        from_date: firebaseUserData.passDate,
        to_date: firebaseUserData.expiryDate,
      };

      const response = await fetch(`${import.meta.env.VITE_MATHIN_CERT_API_URL}/generate-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_MATHIN_CERT_API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate certificate. Please try again later !');
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `${firebaseUserData.uuid}_certificate.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 5000);

      alert('Your certificate has been successfully downloaded !');

      onViewed();
    } catch (error) {
      console.error('Error generating certificate: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="certificate-loader-container">
          <div className="certificate-loader"></div>
          <div>Hang tight! This might take a while...</div>
        </div>
      ) : (
        <button className="certificate-button" onClick={handleCertDownload}>
          <span>View Certificate</span>
          <img className="certificate-icon" src={`${import.meta.env.BASE_URL}icons/arrowRight.svg`} alt="arrowRightIcon" />
        </button>
      )}
    </>
  );
};

Certificate.propTypes = {
  onViewed: PropTypes.func.isRequired,
};

export default Certificate;