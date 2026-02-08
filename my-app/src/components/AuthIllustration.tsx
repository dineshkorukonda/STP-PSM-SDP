"use client";

const LOGIN_IMAGE_URL =
  "https://cdni.iconscout.com/illustration/premium/thumb/login-illustration-svg-download-png-8333958.png";

export default function AuthIllustration() {
  return (
    <div className="relative flex h-full min-h-[200px] items-center justify-center overflow-hidden bg-primary-light/30 p-6 lg:min-h-0 lg:p-12">
      <img
        src={LOGIN_IMAGE_URL}
        alt=""
        className="h-auto w-full max-w-sm object-contain object-center lg:max-w-md"
        fetchPriority="high"
      />
    </div>
  );
}
