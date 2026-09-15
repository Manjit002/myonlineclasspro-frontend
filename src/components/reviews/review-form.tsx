"use client";

import { useEffect, useRef, useState } from "react";
import {
  ALLOWED_IMAGE_EXT,
  ALLOWED_VIDEO_EXT,
  MAX_FILE_BYTES,
  MAX_IMAGES,
  MAX_VIDEOS,
  submitReview,
} from "@/services/review-service";

interface Preview {
  file: File;
  url: string;
}

const extOf = (f: File) => f.name.split(".").pop()?.toLowerCase() ?? "";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<Preview[]>([]);
  const [videos, setVideos] = useState<Preview[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Object URLs are a manual allocation — revoke them when the component
  // unmounts so previews don't leak for the life of the session.
  const live = useRef<string[]>([]);
  useEffect(
    () => () => {
      live.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  const addFiles = (fileList: FileList | null, kind: "image" | "video") => {
    if (!fileList) return;
    setError(null);
    const allowed = kind === "image" ? ALLOWED_IMAGE_EXT : ALLOWED_VIDEO_EXT;
    const cap = kind === "image" ? MAX_IMAGES : MAX_VIDEOS;
    const current = kind === "image" ? images : videos;
    const next: Preview[] = [];

    for (const file of Array.from(fileList)) {
      if (current.length + next.length >= cap) {
        setError(`You can attach up to ${cap} ${kind}s.`);
        break;
      }
      if (!allowed.includes(extOf(file))) {
        setError(`${file.name}: only ${allowed.join(", ")} allowed.`);
        continue;
      }
      // Warn before upload; the proxy remains the final authority.
      if (file.size > MAX_FILE_BYTES) {
        setError(`${file.name} is larger than 25 MB.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      live.current.push(url);
      next.push({ file, url });
    }
    if (next.length === 0) return;
    if (kind === "image") setImages((p) => [...p, ...next]);
    else setVideos((p) => [...p, ...next]);
  };

  const removeAt = (kind: "image" | "video", i: number) => {
    const setter = kind === "image" ? setImages : setVideos;
    setter((prev) => {
      const target = prev[i];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const reset = () => {
    [...images, ...videos].forEach((p) => URL.revokeObjectURL(p.url));
    setName("");
    setCountry("");
    setEmail("");
    setRating(0);
    setTitle("");
    setBody("");
    setImages([]);
    setVideos([]);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (rating < 1 || rating > 5) return setError("Please select a rating.");
    if (!title.trim()) return setError("Please enter a review title.");
    if (!body.trim()) return setError("Please write your review.");

    setBusy(true);
    const result = await submitReview({
      reviewerName: name,
      rating,
      title,
      review: body,
      email,
      country,
      images: images.map((p) => p.file),
      videos: videos.map((p) => p.file),
    });
    setBusy(false);

    if (result.ok) {
      reset();
      setDone(true);
    } else {
      setError(result.error);
    }
  }

  if (done) {
    return (
      <div className="rv-success" role="status">
        <p className="rv-success-icon" aria-hidden>
          ✓
        </p>
        <h3>Thank you!</h3>
        <p>
          Your review has been submitted and will appear here once our team
          approves it.
        </p>
        <button
          type="button"
          className="rv-more"
          onClick={() => setDone(false)}
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form className="rv-form" onSubmit={handleSubmit} noValidate>
      <div className="rv-form-row">
        <div className="rv-field">
          <label htmlFor="rv-name">Your Name *</label>
          <input
            id="rv-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className="rv-field">
          <label htmlFor="rv-country">Country (optional)</label>
          <input
            id="rv-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country-name"
          />
        </div>
      </div>

      <div className="rv-field">
        <label htmlFor="rv-email">Email (optional, not shown publicly)</label>
        <input
          id="rv-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <fieldset className="rv-field rv-rating-field">
        <legend>Your Rating *</legend>
        <div className="rv-star-pick" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={["rv-star-btn", (hover || rating) >= n && "on"]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div className="rv-field">
        <label htmlFor="rv-title">Review Title *</label>
        <input
          id="rv-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="rv-field">
        <label htmlFor="rv-body">Your Review *</label>
        <textarea
          id="rv-body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>

      <div className="rv-field">
        <span className="rv-upload-label">Add Photos or Video</span>
        <div className="rv-upload-row">
          <label className="rv-upload-btn">
            Add Photos ({images.length}/{MAX_IMAGES})
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                addFiles(e.target.files, "image");
                e.target.value = "";
              }}
            />
          </label>
          <label className="rv-upload-btn">
            Add Video ({videos.length}/{MAX_VIDEOS})
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => {
                addFiles(e.target.files, "video");
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {(images.length > 0 || videos.length > 0) && (
          <ul className="rv-previews">
            {images.map((p, i) => (
              <li key={p.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" />
                <button
                  type="button"
                  onClick={() => removeAt("image", i)}
                  aria-label={`Remove ${p.file.name}`}
                >
                  ×
                </button>
              </li>
            ))}
            {videos.map((p, i) => (
              <li key={p.url}>
                <video src={p.url} muted />
                <button
                  type="button"
                  onClick={() => removeAt("video", i)}
                  aria-label={`Remove ${p.file.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="rv-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="rv-submit" disabled={busy}>
        {busy ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
