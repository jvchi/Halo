export async function apiRequest(path, { getToken, ...options } = {}) {
  const token = getToken ? await getToken() : null;
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status}).`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function uploadImage(file, { getToken, formSlug, kind }) {
  const endpoint =
    kind === "logo"
      ? "/api/uploads"
      : `/api/public/forms/${encodeURIComponent(formSlug)}/uploads`;
  const signed = await apiRequest(endpoint, {
    getToken: kind === "logo" ? getToken : undefined,
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      kind,
    }),
  });
  const upload = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: signed.headers,
    body: file,
  });
  if (!upload.ok) {
    const body = await upload.json().catch(() => ({}));
    throw new Error(body.error || "The image could not be uploaded.");
  }
  if (kind === "logo") {
    await apiRequest(
      `/api/uploads/${encodeURIComponent(signed.mediaId)}/complete?key=${encodeURIComponent(
        signed.storageKey
      )}`,
      { getToken, method: "POST" }
    );
  }
  return signed;
}

export async function submitPublicTestimonial(formSlug, fields, file) {
  let avatarStorageKey = null;
  if (file) {
    const upload = await uploadImage(file, {
      formSlug,
      kind: "avatar",
    });
    avatarStorageKey = upload.storageKey;
  }
  return apiRequest(
    `/api/public/forms/${encodeURIComponent(formSlug)}/submissions`,
    {
      method: "POST",
      body: JSON.stringify({
        ...fields,
        avatarStorageKey,
        honeypot: "",
      }),
    }
  );
}
