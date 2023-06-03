/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

export const AvatarIcon: React.FC<{ who: string }> = ({ who }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error("objectがnull");
    }
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) {
      throw new Error("context is null or undefined!!!");
    }
    // https://sbfl.net/blog/2019/01/07/javascript-audio-spectrum/
    //const spectrum: number[] = [
    //230, 100, 140, 100, 230, 100, 140, 100, 230, 100, 140, 100, 230, 100, 140,
    //100, 230, 100, 140, 130, 230, 100, 140, 130,
    //];
    const spectrum = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * (230 - 50 + 1) + 50)
    );
    console.log(spectrum.length);
    // canvasの中心座標
    const center = {
      x: Math.round(canvas.width / 2),
      y: Math.round(canvas.height / 2),
    };

    // canvasの幅を均等に割り振る
    // 円なので360度（2π）を分割する
    const barRad = (2 * Math.PI) / spectrum.length;
    // 円の半径
    const innerRadius = 6;
    const outerRadius = 26;
    const diffRadius = outerRadius - innerRadius;
    // 前の描画を消す
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < spectrum.length; i++) {
      // 色相を回転
      //const barDegree = (barRad * i * 180) / Math.PI;
      //canvasContext.fillStyle = `hsl(${barDegree}, 80%, 60%)`;
      canvasContext.fillStyle = `rgba(0, 0, 0, 0.8)`;
      // バーの開始角度・終了角度を計算
      const startRad = barRad * i;
      const endRad = barRad * (i + 1);
      // バーの開始点・終了点を計算
      const startX = center.x + innerRadius * Math.cos(startRad);
      const startY = center.y + innerRadius * Math.sin(startRad);
      const endX = center.x + innerRadius * Math.cos(endRad);
      const endY = center.y + innerRadius * Math.sin(endRad);
      // 値からバーの長さを計算
      // 0.0から1.0までの値に変換する。最大255なので255で割ればいい
      const normalizedSpectrum = spectrum[i] / 350;
      const barRadius = normalizedSpectrum * diffRadius + innerRadius;
      // 描画開始
      canvasContext.beginPath();
      // まず円弧を描く
      canvasContext.arc(center.x, center.y, innerRadius, startRad, endRad);
      // 次にバーを描く
      // バーの半径から外円上の点を割り出し、
      // 内円から外円へ四角形を描く
      canvasContext.moveTo(startX, startY);
      canvasContext.lineTo(
        barRadius * Math.cos(startRad) + center.x,
        barRadius * Math.sin(startRad) + center.y
      );
      canvasContext.lineTo(
        barRadius * Math.cos(endRad) + center.x,
        barRadius * Math.sin(endRad) + center.y
      );
      canvasContext.lineTo(endX, endY);
      // 塗る
      canvasContext.fill();
    }
  }, []);

  return (
    <div
      className={`${styles.avatarIcon} ${
        who === "assistant"
          ? styles.avatarIconAssistant
          : styles.avatarIconHuman
      }`}
    >
      {who === "assistant" ? (
        <div className={styles.avatarIconAssistantIcon}>
          <div
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "rgba(250, 250, 250, 1)",
            }}
          >
            <canvas ref={canvasRef} width={30} height={30} />
          </div>
        </div>
      ) : (
        <img
          width={30}
          height={30}
          src="https://i.gyazo.com/8960181a3459473ada71a8718df8785b.png"
          alt="user icon"
        />
      )}
    </div>
  );
};
