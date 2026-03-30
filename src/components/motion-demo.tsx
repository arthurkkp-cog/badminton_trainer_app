import React, { useEffect, useMemo, useState } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

function deriveSecondFrame(url: string) {
  if (
    url.includes("raw.githubusercontent.com/yuhonas/free-exercise-db") &&
    url.endsWith("/0.jpg")
  ) {
    return url.replace(/\/0\.jpg$/, "/1.jpg");
  }
  return undefined;
}

interface MotionDemoProps {
  imageUrl: string;
  videoUrl?: string;
  style: StyleProp<ImageStyle>;
  intervalMs?: number;
}

function isGif(url: string) {
  return url.toLowerCase().endsWith(".gif");
}

export function MotionDemo({ imageUrl, videoUrl, style, intervalMs = 700 }: MotionDemoProps) {
  const demoUrl = useMemo(() => {
    if (videoUrl && isGif(videoUrl)) {
      return videoUrl;
    }
    return imageUrl;
  }, [imageUrl, videoUrl]);
  const secondFrame = useMemo(() => deriveSecondFrame(demoUrl), [demoUrl]);
  const [showSecondFrame, setShowSecondFrame] = useState(false);

  useEffect(() => {
    setShowSecondFrame(false);
  }, [demoUrl]);

  useEffect(() => {
    if (!secondFrame) {
      return;
    }

    const timer = setInterval(() => {
      setShowSecondFrame((current) => !current);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, secondFrame]);

  return (
    <Image
      source={{ uri: showSecondFrame && secondFrame ? secondFrame : demoUrl }}
      style={style}
      resizeMode="cover"
    />
  );
}
