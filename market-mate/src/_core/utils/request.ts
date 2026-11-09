type DownloadHTMLLinkElement = HTMLLinkElement & {download?: string};

const sanitizeFilename = (filename: string) =>
  filename.replace(/[^a-z0-9 '!#$%&()+,\-.;=@_`~]/gim, '_').trim();

export const downloadFile = (blob: Blob, filename = 'download') => {
  if (!document) {
    return;
  }

  const a = document.createElement('a');
  const link = a as unknown as DownloadHTMLLinkElement;
  link.style.display = 'none';
  link.download = sanitizeFilename(filename);
  link.href = URL.createObjectURL(blob);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
