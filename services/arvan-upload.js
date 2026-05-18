export async function uploadFileToArvan(file) {
  const response = await fetch('/.netlify/functions/create-upload-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get upload URL')
  }

  const data = await response.json()

  const uploadResponse = await fetch(data.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error('Upload failed')
  }

  return {
    url: data.publicUrl,
    key: data.key,
  }
}
