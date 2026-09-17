import { TITLE_MAPPINGS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  webViewLink: string;
  uploadedAt: string;
  displayTitle?: string;
}

function updateURL(url: string) {
  return url.substring(0, url.lastIndexOf('/')) + '/' + 'preview';
}
const getDisplayTitle = (filename: string): string => {
  const lowerFilename = filename.toLowerCase();
  return TITLE_MAPPINGS[lowerFilename] || filename.replace('.pdf', '');
};
function convertToDownloadUrl(webViewLink: string): string {
  // Extract file ID from Google Drive URLs
  const match = webViewLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return webViewLink; // Return original if not a Google Drive URL
}

function transformGroupedData(
  data: Record<string, any[]>,
  folderOrder: string[]
) {
  return folderOrder.map((folderId) =>
    (data[folderId] || []).map((doc) => ({
      ...doc,
      displayTitle: getDisplayTitle(doc.name),
      webViewLink: updateURL(doc.webViewLink),
      path: convertToDownloadUrl(doc.webViewLink),
    }))
  );
}


const fetchDocuments = async (): Promise<Document[][]> => {
  const folderIds = [
    "16yvY-jnMOZ1hMGaMYk0oi86eBbCqCHR2", // Class PDFs
    "1BKiGBrrrBMegCBUV1RlpkWBTktNPt4GL"  // BOOKS
  ];

  const response = await axios.get('/api/research/documents');
  const transformed = transformGroupedData(response.data.data, folderIds);
  console.log('documents transformed successfully', transformed);
  return transformed;
};



export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 