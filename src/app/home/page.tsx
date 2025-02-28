// "use client";
// import { useEffect, useRef, useState } from "react";
//
// export default function Home() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null); // Ref to store the camera stream
//   const [faces, setFaces] = useState([]);
//
//   // Initialize webcam on mount
//   useEffect(() => {
//     let isMounted = true; // In case component unmounts early
//     async function setupCamera() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//           streamRef.current = stream; // Save stream for cleanup
//         }
//       } catch (err) {
//         console.error("Error accessing the camera:", err);
//       }
//     }
//     setupCamera();
//
//     // Cleanup function stops the camera stream on unmount
//     return () => {
//       // Stop the camera stream
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//       isMounted = false;
//     };
//   }, []);
//
//   // Capture and process frame every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       captureAndSendFrame();
//     }, 1000); // every 1 second
//     // Cleanup interval on unmount
//     return () => clearInterval(interval);
//   }, []);
//
//   const captureAndSendFrame = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;
//
//     const context = canvas.getContext("2d");
//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     // Draw current video frame onto canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//
//     // Convert canvas to blob and send to FastAPI
//     canvas.toBlob(async (blob) => {
//       if (!blob) return;
//       const formData = new FormData();
//       formData.append("file", blob, "frame.jpg");
//
//       try {
//         // Updated URL to match FastAPI endpoint
//         const response = await fetch("http://localhost:8000/recognize-face/", {
//           method: "POST",
//           body: formData,
//         });
//         const data = await response.json();
//         setFaces(data.faces);
//         // Redraw the frame and overlay detection results
//         drawDetections(context, data.faces);
//       } catch (err) {
//         console.error("Error sending frame to FastAPI:", err);
//       }
//     }, "image/jpeg");
//   };
//
//   const drawDetections = (context, faces) => {
//     // Clear previous drawings by redrawing the video frame
//     context.drawImage(
//       videoRef.current,
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height,
//     );
//     // Overlay each face detection
//     faces.forEach((face) => {
//       const loc = face.location;
//       context.beginPath();
//       context.lineWidth = 2;
//       context.strokeStyle = "red";
//       context.rect(
//         loc.left,
//         loc.top,
//         loc.right - loc.left,
//         loc.bottom - loc.top,
//       );
//       context.stroke();
//
//       context.fillStyle = "red";
//       context.font = "16px Arial";
//       context.fillText(
//         `${face.name} (${face.confidence}%)`,
//         loc.left,
//         loc.top > 20 ? loc.top - 5 : loc.top + 15,
//       );
//     });
//   };
//
//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>Face Recognition Demo</h1>
//       {/* Hidden video element for capturing webcam feed */}
//       <video ref={videoRef} style={{ display: "none" }} />
//       {/* Canvas for showing video frame and drawing overlays */}
//       <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
//     </div>
//   );
// }
// In page.tsx
export default function HomePage() {
  return <div>Welcome Home</div>;
}
