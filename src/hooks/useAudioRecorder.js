import { useState, useRef } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef(null);
  const timerId = useRef(null);
  const audioChunks = useRef([]);

  // 1. Start recording
  const startRecording = async () => {
    try {
      // Requesting microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);

      // Start the seconds countdown
      timerId.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to record voice notes.");
    }
  };

  // 2. Stop recording and switch to Base64
  const stopRecording = () => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) return;

      mediaRecorder.current.onstop = async () => {
        // Combining audio clips into a single file (Blob)
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });

        // Converting Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          resolve(base64Audio);
        };

        // Cleaning (turning off the microphone and stopping the counter)
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        clearInterval(timerId.current);
        setRecordingTime(0);
        setIsRecording(false);
      };

      mediaRecorder.current.stop();
    });
  };

  return { isRecording, recordingTime, startRecording, stopRecording };
};
