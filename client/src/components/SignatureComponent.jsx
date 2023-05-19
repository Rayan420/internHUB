import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from '../services/axios';
import { useAuthHeader } from 'react-auth-kit';

const SignatureEditor = ({ initialSignature, coordinatorId, edit, onCancel }) => {
  const signatureCanvasRef = useRef(null);
  const [signatureData, setSignatureData] = useState(initialSignature);
  const [isCanvasSigned, setIsCanvasSigned] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Flag to track if the signature is being saved
  const authHeader = useAuthHeader();
  

  useEffect(() => {
    if (initialSignature) {
      setSignatureData(initialSignature);
    }
  }, [initialSignature]);
  console.log(initialSignature)


  const handleClear = () => {
    signatureCanvasRef.current.clear();
    setSignatureData(null);
    setIsCanvasSigned(false);
  };
  
        

  const handleSave = async () => {
    if (isCanvasSigned) {
      if (signatureCanvasRef.current.isEmpty()) {
        setSignatureData(null);
      } else {
        const trimmedCanvas = signatureCanvasRef.current.getTrimmedCanvas();
        const trimmedData = trimmedCanvas.toDataURL();
        setSignatureData(trimmedData);
        setIsSaving(true); // Start saving process, show loading spinner
        try {
          const response = await axios.post(
            '/coordinator/signature',
            {
              coordinatorId,
              signature: trimmedData,
            },
            {
              headers: {
                authorization: authHeader(),
              },
            }
          );
          console.log(response);

          setIsSaving(false); // Save complete, hide loading spinner
          onCancel(); // Exit editing mode
        } catch (error) {
          console.error('Error saving signature:', error);
          setIsSaving(false); // Save failed, hide loading spinner
        }
      }
    }
  };

  const handleCanvasEnd = () => {
    setIsCanvasSigned(true);
  };

  const handleCancel = () => {
    setSignatureData(initialSignature);
    onCancel();
  };
  if (isSaving) {
    return (
      <div className="signature-editor">
        <div className="settings-loading-spinner">
          <h3>Saving Your information</h3>
          <div className="settings-progress-bar">
            <div className="settings-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signature-editor">
      {edit && (
        <div className="signature-canvas">
          <SignatureCanvas
            ref={signatureCanvasRef}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
            defaultValue={initialSignature}
            onEnd={handleCanvasEnd}
          />
        </div>
      )}
      {edit && (
        <div className="signature-buttons">
          <button className="signature-clear-button" onClick={handleClear}>
            Clear
          </button>
          <button className="signature-save-button" onClick={handleSave}>
            Save
          </button>
          <button className="signature-cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default SignatureEditor;
